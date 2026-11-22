#!/usr/bin/env node
/**
 * 版本统一 bump 脚本。
 *
 * 版本约定：根与 packages 下各包各自维护独立的 semver 版本线
 * （ofa 系 5.0.0 / xhear 9.0.0 / stanz 9.0.0 / drill 6.0.0），
 * bump 时同一档位（major/minor/patch）作用在每条线上，家族相对关系不变；
 * 显式版本号则为全仓 lockstep（所有包对齐到同一版本，用于统一发布）。
 *
 * 覆盖范围：
 * 1. 根 package.json 与全部 packages 下各包 package.json 的 version 字段；
 * 2. 各包 src 下引用了自身旧版本号的源码（如 ofajs 的 "ofa.js@5.0.0" 运行时串）；
 * 3. package-lock.json（经 npm install --package-lock-only 同步）。
 *
 * 用法：
 *   npm run bump -- patch            # 全部包 patch +1
 *   npm run bump -- minor            # 全部包 minor +1
 *   npm run bump -- major            # 全部包 major +1
 *   npm run bump -- 6.0.0            # 全部包对齐到指定版本（lockstep）
 *   npm run bump -- patch --dry      # 只打印计划，不写文件
 *
 * bump 之后记得：npm run build（刷新 dist 产物 banner）→ npm test。
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execSync } from "node:child_process";

const PKGS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../packages");

// ---- 参数 ----
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const level = args.find((a) => !a.startsWith("--"));

if (!level || (!/^(major|minor|patch)$/.test(level) && !/^\d+\.\d+\.\d+$/.test(level))) {
  console.error("用法：npm run bump -- <major|minor|patch|x.y.z> [--dry]");
  process.exit(1);
}
const lockstep = /^\d/.test(level); // 显式版本号 = 全包对齐同一版本

// ---- semver 工具 ----
const parse = (ver) => {
  const m = String(ver).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:$)/);
  if (!m) {
    throw new Error(`无法解析版本号：${ver}`);
  }
  return { major: +m[1], minor: +m[2], patch: +m[3] };
};

const bumpVersion = (ver) => {
  if (lockstep) {
    return level; // 显式版本号：所有包对齐
  }
  const { major, minor, patch } = parse(ver);
  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

// ---- 收集包 ----
const isPackage = (name) =>
  !name.startsWith(".") &&
  statSync(path.join(PKGS_DIR, name)).isDirectory() &&
  exists(path.join(PKGS_DIR, name, "package.json"));

function exists(p) {
  try {
    return statSync(p) !== undefined;
  } catch {
    return false;
  }
}

const packages = readdirSync(PKGS_DIR).filter(isPackage).sort();

// ---- 计算新版本 ----
const plan = [];
for (const name of packages) {
  const pkgPath = path.join(PKGS_DIR, name, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const from = pkg.version;
  const to = bumpVersion(from);
  plan.push({ name, pkgPath, from, to });
}

// 根也参与同档位 bump（lockstep 模式下同样对齐）
const rootPkgPath = path.join(PKGS_DIR, "..", "package.json");
const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"));
const rootFrom = rootPkg.version;
const rootTo = bumpVersion(rootFrom);

// ---- 打印计划 ----
console.log(`bump 目标：${dry ? "（dry-run，不写入）" : ""}`);
console.log(`  root            ${rootFrom} -> ${rootTo}`);
for (const { name, from, to } of plan) {
  console.log(`  ${name.padEnd(16)} ${from} -> ${to}`);
}

if (dry) {
  console.log("\ndry-run 结束。去掉 --dry 执行写入。");
  process.exit(0);
}

// ---- 写 package.json ----
const writeJson = (p, obj) =>
  writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");

rootPkg.version = rootTo;
writeJson(rootPkgPath, rootPkg);

const changedSrc = [];

for (const { name, pkgPath, from, to } of plan) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.version = to;
  writeJson(pkgPath, pkg);

  // 各包 src/ 中引用自身旧版本号的源码（如 ofajs 的 "ofa.js@5.0.0"）
  const srcDir = path.join(PKGS_DIR, name, "src");
  changedSrc.push(
    ...walkSrc(srcDir)
      .filter((f) => {
        const content = readFileSync(f, "utf8");
        return content.includes(from);
      })
      .map((f) => {
        const content = readFileSync(f, "utf8");
        writeFileSync(f, content.split(from).join(to));
        return f;
      })
      .map((f) => `  ${path.relative(PKGS_DIR, f)}（${from} -> ${to}）`),
  );
}

// ---- 同步 lockfile（npm workspaces 会把各包版本写进 package-lock.json）----
try {
  execSync("npm install --package-lock-only --ignore-scripts", {
    cwd: path.join(PKGS_DIR, ".."),
    stdio: "inherit",
  });
} catch (err) {
  console.warn("\n⚠️ package-lock.json 同步失败，请手动执行：npm install --package-lock-only");
}

// ---- 汇总 ----
console.log("\n完成。");
if (changedSrc.length) {
  console.log("同步的源码版本串：");
  console.log(changedSrc.join("\n"));
}
console.log("\n后续步骤：");
console.log("  1. npm run build   # 刷新 dist 产物里的版本 banner");
console.log("  2. npm test        # 全量回归");
console.log("  3. 核对各包 CONTEXT.md 里的「当前 x.y.z」快照表述");

// ---- 工具 ----
function walkSrc(dir) {
  if (!exists(dir)) {
    return [];
  }

  const files = [];

  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      files.push(...walkSrc(p));
    } else if (/\.(mjs|js)$/.test(name)) {
      files.push(p);
    }
  }

  return files;
}
