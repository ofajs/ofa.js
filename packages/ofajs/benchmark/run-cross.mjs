/**
 * 跨框架性能对比跑器：ofa.js 5.0 vs Vue 3.5 vs React 18。
 *
 * 用法：仓库根目录执行 `npm run bench:cross`
 *（首次先 `node packages/ofajs/benchmark/fetch-cross-vendor.mjs` 下载框架文件）。
 *
 * 方法学（见 .agents/skills/benchmark-methodology）：
 * - 三框架都占用全局，同页必冲突，按页面文件分框架；
 * - 每个场景独立开页（?only=），一轮内 ofajs→vue→react 紧挨着采集，
 *   机器热漂移对相邻采集对称生效；多轮取中位数；
 * - HTTP 缓存经 CDP 关闭，首屏场景（load1k）每页都是冷加载；
 * - 场景内自校验行数断言，框架刷新未落定会直接报错而不是测出假数字。
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const PORT = 3353; // 3348 playwright / 3349 drill / 3350 stanz / 3352 ofajs
const BASE_URL = `http://localhost:${PORT}`;
const ROUNDS = Number(process.env.CROSS_ROUNDS || 3);

const FRAMEWORKS = [
  { id: "legacy", file: "cross-legacy.html", label: "ofa 4.7" },
  { id: "ofajs", file: "cross-ofajs.html", label: "ofa.js" },
  { id: "vue", file: "cross-vue.html", label: "Vue" },
  { id: "react", file: "cross-react.html", label: "React" },
];

const SCENARIOS = [
  ["create1k", "建 1000 行 / create 1k rows"],
  ["replace1k", "整体替换 1000 行 / replace 1k rows"],
  ["update10", "每 10 行改标签 ×10 / update every 10th ×10"],
  ["swap20", "首尾交换 ×20 / swap first & last ×20"],
  ["remove100", "批量删 100 行 / remove 100 rows (batched)"],
  ["append1k", "追加 1000 行 / append 1k rows"],
  ["clear", "清空 2000 行 / clear 2k rows"],
];

// CJK 字符按 2 列计宽，保证终端表格对齐
const charWidth = (s) =>
  [...s].reduce((w, ch) => w + (ch.codePointAt(0) > 0xff ? 2 : 1), 0);
const padW = (s, n) => s + " ".repeat(Math.max(0, n - charWidth(s)));

const median = (arr) => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];
const fmt = (n) => Number(n).toLocaleString("en-US");

// ---- 起静态服务器 ----

const server = spawn(
  process.execPath,
  [join(ROOT, "scripts/static-server.mjs"), "."],
  { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" }
);

const waitReady = async () => {
  for (let i = 0; i < 50; i++) {
    try {
      const resp = await fetch(`${BASE_URL}/packages/ofajs/benchmark/cross-ofajs.html`);
      if (resp.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("static server not ready");
};

await waitReady();

// ---- 采集 ----

const collect = async (fw, scenarioId) => {
  // 每次采集独立页面：框架全局、JIT、GC 状态互不污染
  const page = await browser.newPage();
  page.on("pageerror", (error) => {
    throw new Error(`bench page crashed (${fw.id}/${scenarioId}): ${error.message}`);
  });

  // 关闭 HTTP 缓存：首屏场景每页都是冷加载，轮次间数字才可比
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });

  await page.goto(
    `${BASE_URL}/packages/ofajs/benchmark/${fw.file}?only=${scenarioId}`
  );
  await page.waitForFunction(
    "window.__benchDone === true || !!window.__benchError",
    null,
    { timeout: 180000 }
  );

  const err = await page.evaluate("window.__benchError");
  if (err) {
    throw new Error(`bench page failed (${fw.id}/${scenarioId}): ${err}`);
  }

  const results = await page.evaluate("window.__benchResults");
  await page.close();
  return results;
};

const browser = await chromium.launch();
const browserVersion = browser.version();

// scenarioId -> { ofajs: [times], vue: [times], react: [times] }
const samples = {};
const boot = { legacy: [], ofajs: [], vue: [], react: [] };

try {
  for (let r = 0; r < ROUNDS; r++) {
    for (const [id] of SCENARIOS) {
      // 三框架紧挨着各跑一遍：热漂移对相邻采集对称生效
      for (const fw of FRAMEWORKS) {
        const results = await collect(fw, id);
        const scenarioResult = results.find((e) => e.id === id);
        const bootResult = results.find((e) => e.id === "load1k");

        if (!scenarioResult || !bootResult) {
          throw new Error(`missing results (${fw.id}/${id})`);
        }

        samples[id] = samples[id] || {};
        samples[id][fw.id] = samples[id][fw.id] || [];
        samples[id][fw.id].push(scenarioResult.value);
        boot[fw.id].push(bootResult.value);
      }
    }
    console.error(`round ${r + 1}/${ROUNDS} done`);
  }
} finally {
  await browser.close();
  server.kill();
}

// ---- 汇总输出 ----

const versions = JSON.parse(
  readFileSync(join(ROOT, "packages/ofajs/benchmark/vendor/cross/versions.json"), "utf8")
);
const ofaVersion = JSON.parse(
  readFileSync(join(ROOT, "packages/ofajs/package.json"), "utf8")
).version;

const fileSize = (p) => {
  try {
    return readFileSync(join(ROOT, p));
  } catch {
    return null;
  }
};

const payload = (name, files) => {
  const bufs = files.map(fileSize).filter(Boolean);
  if (!bufs.length) return null;
  const raw = bufs.reduce((s, b) => s + b.length, 0);
  const gz = bufs.reduce((s, b) => s + gzipSync(b).length, 0);
  return { name, raw, gz };
};

const payloads = [
  payload(`ofa.js 4.7.7 (old)`, ["old/dist/ofa.min.js"]),
  payload(`ofa.js ${ofaVersion}`, ["dist/ofa.min.js"]),
  payload(`Vue ${versions.vue}`, ["packages/ofajs/benchmark/vendor/cross/vue.global.prod.js"]),
  payload(`React ${versions.react}`, [
    "packages/ofajs/benchmark/vendor/cross/react.production.min.js",
    "packages/ofajs/benchmark/vendor/cross/react-dom.production.min.js",
  ]),
];

const fwLabel = (fw) =>
  fw.id === "vue" ? `Vue ${versions.vue.split(".").slice(0, 2).join(".")}`
  : fw.id === "react" ? `React ${versions.react.split(".")[0]}`
  : fw.id === "legacy" ? "ofa 4.7"
  : `ofa.js ${ofaVersion.split(".").slice(0, 2).join(".")}`;

const med = (id, fwId) => median(samples[id]?.[fwId] ?? []);
const medBoot = (fwId) => median(boot[fwId] ?? []);
const range = (id, fwId) => {
  const a = samples[id]?.[fwId] ?? [];
  return a.length ? `${fmt(Math.min(...a))}~${fmt(Math.max(...a))}` : "-";
};
const rangeBoot = (fwId) => {
  const a = boot[fwId] ?? [];
  return a.length ? `${fmt(Math.min(...a))}~${fmt(Math.max(...a))}` : "-";
};

console.log(
  `\n跨框架性能对比 / cross-framework benchmark（chromium ${browserVersion}，` +
    `每场景独立页面，四框架交替 × ${ROUNDS} 轮取中位数，单位 ms，越小越好）\n`
);

// 载荷体积
console.log("运行时载荷 / runtime payload（min 后 UMD/ES 产物，本地 gzip）");
for (const p of payloads) {
  if (p) {
    console.log(
      `  ${padW(p.name, 22)}${padW((p.raw / 1024).toFixed(1) + " KB", 12)}gzip ${padW((p.gz / 1024).toFixed(1) + " KB", 12)}`
    );
  }
}
console.log("");

// 首屏行
const bootMeds = FRAMEWORKS.map((fw) => medBoot(fw.id) ?? Infinity);
const bootBest = Math.min(...bootMeds);
console.log(
  `${padW("首屏：加载 + 渲染 1000 行 / boot + render 1k", 52)}` +
    FRAMEWORKS.map((fw, i) =>
      padW(`${fwLabel(fw)} ${fmt(medBoot(fw.id))}`, 18)
    ).join("") +
    `最快 ${FRAMEWORKS[bootMeds.indexOf(bootBest)].id}`
);

// 场景行
console.log("-".repeat(112));
for (const [id, label] of SCENARIOS) {
  const meds = FRAMEWORKS.map((fw) => med(id, fw.id));
  const best = Math.min(...meds);
  const cells = FRAMEWORKS.map((fw, i) => {
    const v = meds[i];
    const slower = ((v - best) / best) * 100;
    const mark = v === best ? "*" : slower >= 3 ? `(+${slower.toFixed(0)}%)` : " ≈";
    return padW(`${fwLabel(fw)} ${fmt(v)}${mark}`, 18);
  }).join("");
  console.log(`${padW(label, 52)}${cells}`);
}
console.log("-".repeat(112));
console.log("（* 最快；(+n%) 相对最慢不超过的量化差距，<3% 记 ≈ 相当）\n");

// 样本区间：分配密集场景的样本带可能很宽，结论看中位数也要看区间（方法学 §2.5）
console.log("样本区间 / sample ranges（各轮页面中位数的 min~max）");
console.log(
  `${padW("场景", 52)}` +
    FRAMEWORKS.map((fw) => padW(fwLabel(fw), 20)).join("")
);
for (const [id, label] of [["load1k", "首屏 / boot"]].concat(SCENARIOS)) {
  const cells = FRAMEWORKS.map((fw) =>
    padW(id === "load1k" ? rangeBoot(fw.id) : range(id, fw.id), 20)
  ).join("");
  console.log(`${padW(label, 52)}${cells}`);
}

// ofa 4.7 → 5.0 专项提升
const legacyFw = FRAMEWORKS.find((fw) => fw.id === "legacy");
const newFw = FRAMEWORKS.find((fw) => fw.id === "ofajs");
const deltaLine = (label, oldV, newV) => {
  if (oldV == null || newV == null) return `${padW(label, 52)}-`;
  const delta = ((oldV - newV) / oldV) * 100;
  return (
    `${padW(label, 52)}` +
    `${padW(fmt(oldV), 14)}${padW(fmt(newV), 14)}${padW((delta >= 0 ? "+" : "") + delta.toFixed(1) + "%", 10)}`
  );
};
console.log("\nofa 4.7 → 5.0 提升 / legacy → current improvement（负数为回退）");
console.log(
  `${padW("场景", 52)}${padW("4.7.7", 14)}${padW(ofaVersion, 14)}${padW("提升", 10)}`
);
console.log(
  deltaLine(
    "首屏：加载 + 渲染 1000 行 / boot + render 1k",
    medBoot("legacy"),
    medBoot("ofajs")
  )
);
for (const [id, label] of SCENARIOS) {
  console.log(deltaLine(label, med(id, "legacy"), med(id, "ofajs")));
}
{
  const oldPl = payloads.find((p) => p && p.name.includes("4.7"));
  const newPl = payloads.find((p) => p && p.name === `ofa.js ${ofaVersion}`);
  if (oldPl && newPl) {
    const gzDelta = ((oldPl.gz - newPl.gz) / oldPl.gz) * 100;
    console.log(
      `${padW("运行时载荷 gzip / payload gzipped", 52)}${padW((oldPl.gz / 1024).toFixed(1) + " KB", 14)}${padW((newPl.gz / 1024).toFixed(1) + " KB", 14)}${padW((gzDelta >= 0 ? "+" : "") + gzDelta.toFixed(1) + "%", 10)}`
    );
  }
}
console.log(
  "\n注：结果受机器负载影响；单轮数字不下结论，看多轮中位数与区间（/ results are machine-dependent; trust medians with ranges, not single rounds）。\n"
);
