/**
 * 新旧 drill 性能对比跑器。
 *
 * 用法：仓库根目录执行 `npm run bench`。
 * 方法学：新旧两版交替采集 ROUNDS 轮（消除机器漂移带来的先后偏差），
 * 每个场景取各轮中位数再对比；热路径样本按批量执行摊薄亚毫秒噪声。
 */
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const PORT = 3349;
const BASE_URL = `http://localhost:${PORT}`;
const ROUNDS = 3; // 交替采集轮数

// 加载夹具不进仓库：测试前动态生成 100 个微型模块，跑完即删
const FIXTURES_DIR = join(ROOT, "packages/drill/benchmark/fixtures");

const generateFixtures = () => {
  rmSync(FIXTURES_DIR, { recursive: true, force: true }); // 清掉上次异常中断的残留
  mkdirSync(FIXTURES_DIR, { recursive: true });

  // A 组给串行/元素场景，B 组给并发场景，保证各自冷启动互不污染
  for (const set of ["A", "B"]) {
    for (let i = 0; i < 50; i++) {
      const name = `mod${set}${String(i).padStart(2, "0")}`;
      writeFileSync(
        join(FIXTURES_DIR, `${name}.mjs`),
        `export const id = "${name}";\n`
      );
    }
  }
};

const removeFixtures = () => rmSync(FIXTURES_DIR, { recursive: true, force: true });

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

generateFixtures();

const server = spawn(
  process.execPath,
  [join(ROOT, "scripts/static-server.mjs"), "."],
  { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" }
);

const waitReady = async () => {
  for (let i = 0; i < 50; i++) {
    try {
      const resp = await fetch(`${BASE_URL}/packages/drill/benchmark/bench.html`);
      if (resp.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("static server not ready");
};

await waitReady();

// ---- 交替采集 ----

const collect = async (v) => {
  // 每轮用独立页面：模块注册表互不污染，冷启动公平
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/packages/drill/benchmark/bench.html?v=${v}`);
  await page.waitForFunction("window.__benchDone === true", null, {
    timeout: 180000,
  });
  const results = await page.evaluate("window.__benchResults");
  await page.close();
  return results;
};

const browser = await chromium.launch();
const browserVersion = browser.version();

const rounds = { old: [], new: [] };

try {
  for (let r = 0; r < ROUNDS; r++) {
    // 每轮先旧后新，两版经历完全相同的机器状态序列
    rounds.old.push(await collect("old"));
    rounds.new.push(await collect("new"));
    console.error(`round ${r + 1}/${ROUNDS} done`);
  }
} finally {
  await browser.close();
  server.kill();
  removeFixtures();
}

// ---- 汇总输出 ----

const byId = (set, id) => set.find((r) => r.id === id);
const medValue = (v, id) => {
  const values = rounds[v].map((set) => byId(set, id)?.value).filter((x) => x != null);
  return median(values);
};

const fmt = (n) => Number(n).toLocaleString("en-US");

const TIME_IDS = [
  ["serial-cold", "串行加载 50 模块 · 冷 / serial 50 modules, cold"],
  ["serial-warm", "串行加载 50 模块 · 热 / serial 50 modules, warm"],
  ["parallel-cold", "并发加载 50 模块 · 冷 / parallel 50 modules, cold"],
  ["parallel-warm", "并发加载 50 模块 · 热 / parallel 50 modules, warm"],
  ["json-cached-cold", "缓存 json ×500 · 冷 / cached json ×500, cold"],
  ["json-cached-warm", "缓存 json ×500 · 热 / cached json ×500, warm"],
  ["elements-cold", "100 个 l-m 元素 · 冷 / 100 l-m elements, cold"],
  ["elements-warm", "100 个 l-m 元素 · 热 / 100 l-m elements, warm"],
];
const SPEED_IDS = [
  ["path", "path() 解析 ×20k / path resolution ×20k"],
  ["chain", "中间件链 3 层 ×5k / middleware chain ×5k"],
];

console.log(`\ndrill 新旧版本性能对比 / benchmark（chromium ${browserVersion}，${ROUNDS} 轮取中位数）\n`);

const rows = [];
const verdicts = { better: 0, worse: 0, tie: 0 };

const printRow = (id, label, unit, kind) => {
  const o = medValue("old", id);
  const n = medValue("new", id);
  if (o == null || n == null) return;

  // speed：ops/s 越大越好；time：ms 越小越好
  const delta =
    kind === "speed" ? ((n - o) / o) * 100 : ((o - n) / o) * 100;

  // 亚毫秒级样本低于测量分辨率，直接视为相当
  const tooSmall = kind === "time" && o < 2 && n < 2;
  const verdict = tooSmall ? "相当 ≈" : delta > 3 ? "新版 ↑" : delta < -3 ? "旧版 ↑" : "相当 ≈";
  if (verdict === "新版 ↑") verdicts.better++;
  else if (verdict === "旧版 ↑") verdicts.worse++;
  else verdicts.tie++;

  rows.push(
    `${padW(label, 56)}${padW(fmt(o), 12)}${padW(fmt(n), 12)}${padW((delta >= 0 ? "+" : "") + delta.toFixed(1) + "%", 9)}${verdict}`
  );
};

TIME_IDS.forEach(([id, label]) => printRow(id, label, "ms", "time"));
SPEED_IDS.forEach(([id, label]) => printRow(id, label, "ops/s", "speed"));

// 源码体积（运行时模块，含旧版的 ofa-error 依赖）
const legacySize = dirBytes(join(ROOT, "packages/drill/benchmark/vendor/legacy"));
const nextSize = dirBytes(join(ROOT, "packages/drill/src"));
const sizeDelta = ((legacySize - nextSize) / legacySize) * 100;
rows.push(
  `${padW("源码体积 / runtime source size", 56)}${padW((legacySize / 1024).toFixed(1) + " KB", 12)}${padW((nextSize / 1024).toFixed(1) + " KB", 12)}${padW((sizeDelta >= 0 ? "+" : "") + sizeDelta.toFixed(1) + "%", 9)}${sizeDelta > 3 ? "新版 ↓" : "旧版 ↓"}`
);

console.log(
  `${padW("场景 / scenario", 56)}${padW("旧版 5.3.x", 12)}${padW("新版 6.0", 12)}${padW("新版提升", 9)}结论`
);
console.log("-".repeat(100));
console.log(rows.join("\n"));
console.log("-".repeat(100));
console.log(
  `结论 / verdict：新版更好 ×${verdicts.better}，旧版更好 ×${verdicts.worse}，相当 ×${verdicts.tie}（±3% 内或低于 2ms 分辨率视为相当）`
);
console.log("注：结果受机器负载影响，多次运行取稳定趋势 / results are machine-dependent, trust stable trends only.\n");
