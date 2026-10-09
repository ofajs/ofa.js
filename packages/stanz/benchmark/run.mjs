/**
 * 新旧 stanz 性能对比跑器。
 *
 * 用法：仓库根目录执行 `npm run bench:stanz`。
 * 方法学：stanz 无全局副作用，新旧两版在同一页面共存，每个场景内
 * A/B 交替采集——机器热漂移对两版对称生效，不存在先后采集偏差。
 * 跑器访问两个独立页面取中位数，进一步压低单页噪声。
 */
import { spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const PORT = 3350;
const BASE_URL = `http://localhost:${PORT}`;
const ROUNDS = 2; // 独立页面采集次数，结果取中位数

const dirBytes = (dir) =>
  readdirSync(dir, { recursive: true }).reduce((sum, name) => {
    try {
      const info = statSync(join(dir, name));
      return info.isFile() ? sum + info.size : sum;
    } catch {
      return sum;
    }
  }, 0);

// CJK 字符按 2 列计宽，保证终端表格对齐
const charWidth = (s) =>
  [...s].reduce((w, ch) => w + (ch.codePointAt(0) > 0xff ? 2 : 1), 0);
const padW = (s, n) => s + " ".repeat(Math.max(0, n - charWidth(s)));

const median = (arr) => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];

// ---- 起静态服务器 ----

const server = spawn(
  process.execPath,
  [join(ROOT, "scripts/static-server.mjs"), "."],
  { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" }
);

const waitReady = async () => {
  for (let i = 0; i < 50; i++) {
    try {
      const resp = await fetch(`${BASE_URL}/packages/stanz/benchmark/bench.html`);
      if (resp.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("static server not ready");
};

await waitReady();

// ---- 采集 ----

const collect = async (scenarioId) => {
  const page = await browser.newPage();
  // 页面脚本崩溃时立即报错，避免干等超时
  page.on("pageerror", (error) => {
    throw new Error(`bench page crashed: ${error.message}`);
  });
  // 每个场景独立页面：短生命周期页面的 JIT/GC 漂移远小于长页面
  await page.goto(
    `${BASE_URL}/packages/stanz/benchmark/bench.html?only=${scenarioId}`
  );
  await page.waitForFunction("window.__benchDone === true", null, {
    timeout: 300000,
  });
  const results = await page.evaluate("window.__benchResults");
  await page.close();
  return results[0];
};

const browser = await chromium.launch();
const browserVersion = browser.version();

// scenarioId -> { old: [times], new: [times] }
const samples = {};

try {
  const scenarioIds = [
    "create",
    "set",
    "set-watched",
    "bubble",
    "push",
    "splice",
    "tojson",
  ];

  for (let r = 0; r < ROUNDS; r++) {
    for (const id of scenarioIds) {
      const result = await collect(id);
      samples[id] = samples[id] || { old: [], new: [] };
      samples[id].old.push(result.oldValue);
      samples[id].new.push(result.newValue);
    }
    console.error(`round ${r + 1}/${ROUNDS} done`);
  }
} finally {
  await browser.close();
  server.kill();
}

// ---- 汇总输出 ----

const medOld = (id) => median(samples[id]?.old ?? []);
const medNew = (id) => median(samples[id]?.new ?? []);

const fmt = (n) => Number(n).toLocaleString("en-US");

const SCENARIOS = [
  ["create", "创建宽对象实例 ×500 / create wide instances ×500"],
  ["set", "无监听赋值 ×50k / set without watchers ×50k"],
  ["set-watched", "带监听赋值 ×20k / set with a watcher ×20k"],
  ["bubble", "10 层深冒泡赋值 ×10k / 10-level deep bubbling set ×10k"],
  ["push", "数组 push 普通对象 ×800 / array push of plain objects ×800"],
  ["splice", "包装千项并中部 splice ×200 / wrap 1k items then mid-splice ×200"],
  ["tojson", "深层树 toJSON ×2k / deep tree toJSON ×2k"],
];

console.log(`\nstanz 新旧版本性能对比 / benchmark（chromium ${browserVersion}，每场景独立页面 + 页内 A/B × ${ROUNDS} 轮取中位数）\n`);

const rows = [];
const verdicts = { better: 0, worse: 0, tie: 0 };

for (const [id, label] of SCENARIOS) {
  const o = medOld(id);
  const n = medNew(id);
  if (!o || !n) continue;

  // ops/s 越大越好
  const delta = ((n - o) / o) * 100;
  const verdict = delta > 3 ? "新版 ↑" : delta < -3 ? "旧版 ↑" : "相当 ≈";
  if (verdict === "新版 ↑") verdicts.better++;
  else if (verdict === "旧版 ↑") verdicts.worse++;
  else verdicts.tie++;

  rows.push(
    `${padW(label, 56)}${padW(fmt(o), 14)}${padW(fmt(n), 14)}${padW((delta >= 0 ? "+" : "") + delta.toFixed(1) + "%", 9)}${verdict}`
  );
}

// 源码体积（运行时模块，含旧版的 ofa-error 依赖）
const legacySize = dirBytes(join(ROOT, "packages/stanz/benchmark/vendor/legacy"));
const nextSize = dirBytes(join(ROOT, "packages/stanz/src"));
const sizeDelta = ((legacySize - nextSize) / legacySize) * 100;
rows.push(
  `${padW("源码体积 / runtime source size", 56)}${padW((legacySize / 1024).toFixed(1) + " KB", 14)}${padW((nextSize / 1024).toFixed(1) + " KB", 14)}${padW((sizeDelta >= 0 ? "+" : "") + sizeDelta.toFixed(1) + "%", 9)}${sizeDelta > 3 ? "新版 ↓" : "旧版 ↓"}`
);

console.log(
  `${padW("场景 / scenario", 56)}${padW("旧版 8.2.x", 14)}${padW("新版 9.0", 14)}${padW("新版提升", 9)}结论`
);
console.log("-".repeat(104));
console.log(rows.join("\n"));
console.log("-".repeat(104));
console.log(
  `结论 / verdict：新版更好 ×${verdicts.better}，旧版更好 ×${verdicts.worse}，相当 ×${verdicts.tie}（±3% 内视为相当）`
);
console.log("注：结果受机器负载影响，多次运行取稳定趋势 / results are machine-dependent, trust stable trends only.\n");
