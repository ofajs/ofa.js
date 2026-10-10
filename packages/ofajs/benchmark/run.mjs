/**
 * 新旧 ofa.js 性能对比跑器。
 *
 * 用法：仓库根目录执行 `npm run bench:ofajs`。
 * 方法学：新旧两版都设置 window.$/globalThis.ofa 并注册 o-* 元素，
 * 同页必冲突，与 drill/xhear 一样按 ?v=old|new 分页；每个场景单独
 * 开页（?only=），新旧紧挨着采集，机器热漂移对相邻 A/B 对称生效。
 */
import { spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const PORT = 3352;
const BASE_URL = `http://localhost:${PORT}`;
const ROUNDS = 2; // 每场景新旧各采集次数，结果取中位数

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
      const resp = await fetch(`${BASE_URL}/packages/ofajs/benchmark/bench.html`);
      if (resp.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("static server not ready");
};

await waitReady();

// ---- 采集 ----

const collect = async (v, scenarioId) => {
  // 每次采集独立页面：元素注册表、JIT、GC 状态互不污染
  const page = await browser.newPage();
  page.on("pageerror", (error) => {
    throw new Error(`bench page crashed (${v}/${scenarioId}): ${error.message}`);
  });
  await page.goto(
    `${BASE_URL}/packages/ofajs/benchmark/bench.html?v=${v}&only=${scenarioId}`
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

const scenarioIds = [
  "ofill-build",
  "ofill-update",
  "oif-toggle",
  "drawurl",
  "fixrelate",
  "context",
];

try {
  for (let r = 0; r < ROUNDS; r++) {
    for (const id of scenarioIds) {
      // 新旧紧挨着各跑一遍：热漂移对相邻 A/B 对称生效
      const oldResult = await collect("old", id);
      const newResult = await collect("new", id);
      samples[id] = samples[id] || { old: [], new: [] };
      samples[id].old.push(oldResult.value);
      samples[id].new.push(newResult.value);
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
  ["ofill-build", "500 项 o-fill 初建 ×20 / build 500-item o-fill ×20", "ms"],
  ["ofill-update", "300 项 o-fill 批量追加 50（单次对账）/ append 50 of 300, one diff", "ms"],
  ["oif-toggle", "o-if 条件切换循环 ×40 / o-if toggle cycles ×40", "ms"],
  ["drawurl", "组件 HTML 转译 ×30 / component HTML transpile ×30", "ops"],
  ["fixrelate", "HTML 相对资源修正 ×200 / fixRelatePathContent ×200", "ops"],
  ["context", "provider 广播 30 consumer ×20 / broadcast to 30 consumers ×20", "ms"],
];

console.log(`\nofa.js 新旧版本性能对比 / benchmark（chromium ${browserVersion}，每场景独立页面，新旧交替 × ${ROUNDS} 轮取中位数）\n`);

const rows = [];
const verdicts = { better: 0, worse: 0, tie: 0 };

for (const [id, label, unit] of SCENARIOS) {
  const o = medOld(id);
  const n = medNew(id);
  if (o == null || n == null) continue;

  // ops 越大越好；ms 越小越好
  const delta = unit === "ops" ? ((n - o) / o) * 100 : ((o - n) / o) * 100;

  // 低于 2ms 的耗时样本低于计时分辨率（settle 定时器开销占主导），判相当
  const tooSmall = unit === "ms" && o < 2 && n < 2;
  const verdict = tooSmall ? "相当 ≈" : delta > 3 ? "新版 ↑" : delta < -3 ? "旧版 ↑" : "相当 ≈";
  if (verdict === "新版 ↑") verdicts.better++;
  else if (verdict === "旧版 ↑") verdicts.worse++;
  else verdicts.tie++;

  rows.push(
    `${padW(label, 62)}${padW(fmt(unit === "ops" ? Math.round(o) : o), 12)}${padW(fmt(unit === "ops" ? Math.round(n) : n), 12)}${padW((delta >= 0 ? "+" : "") + delta.toFixed(1) + "%", 9)}${verdict}`
  );
}

// 源码体积：只比 ofa 包自身（旧版的 xhear/stanz/drill 依赖不计入两边）
const legacySize = dirBytes(join(ROOT, "packages/ofajs/benchmark/vendor/legacy/packages/ofa"));
const nextSize = dirBytes(join(ROOT, "packages/ofajs/src"));
const sizeDelta = ((legacySize - nextSize) / legacySize) * 100;
rows.push(
  `${padW("ofa 包源码体积 / package source size", 62)}${padW((legacySize / 1024).toFixed(1) + " KB", 12)}${padW((nextSize / 1024).toFixed(1) + " KB", 12)}${padW((sizeDelta >= 0 ? "+" : "") + sizeDelta.toFixed(1) + "%", 9)}${sizeDelta > 3 ? "新版 ↓" : "旧版 ↓"}`
);

console.log(
  `${padW("场景 / scenario", 62)}${padW("旧版 4.7.x", 12)}${padW("新版 5.0", 12)}${padW("新版提升", 9)}结论`
);
console.log("-".repeat(110));
console.log(rows.join("\n"));
console.log("-".repeat(110));
console.log(
  `结论 / verdict：新版更好 ×${verdicts.better}，旧版更好 ×${verdicts.worse}，相当 ×${verdicts.tie}（±3% 内或低于 2ms 分辨率视为相当）`
);
console.log("注：结果受机器负载影响，多次运行取稳定趋势 / results are machine-dependent, trust stable trends only.\n");
