#!/usr/bin/env node
/**
 * 官网构建：docs/origin/<locale> → docs/website/<locale>
 *
 * - 每个语言目录提供 index.html（页面模块源文件）与 site.json（文案/元信息）；
 * - 顶部、底部、背景、样式与启动器全部复用 docs/website 下的共享资源；
 * - 本脚本把页面模块内联进 SCSR 文档，生成同名 index.html 与根语言选择页；
 * - 不引入任何第三方依赖。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originRoot = path.join(root, "docs", "origin");
const websiteRoot = path.join(root, "docs", "website");
const templateRoot = path.join(websiteRoot, "templates");
const manifestPath = path.join(websiteRoot, ".locales.json");

const RESERVED = new Set([
  "assets",
  "components",
  "content",
  "styles",
  "templates",
  "index.html",
  "boot.js",
  "app.mjs",
]);

const fail = (message) => {
  console.error(`\n[build:website] ${message}\n`);
  process.exit(1);
};

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`无法读取 JSON：${path.relative(root, file)}\n${error.message}`);
  }
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const fill = (template, values) =>
  template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      fail(`模板占位符缺少值：${key}`);
    }
    return values[key];
  });

if (!fs.existsSync(originRoot)) {
  fail(`找不到语言源目录：${path.relative(root, originRoot)}`);
}

const localeDirs = fs
  .readdirSync(originRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(originRoot, name, "site.json")));

if (!localeDirs.length) {
  fail("docs/origin 下没有任何语言目录（需要 site.json）");
}

const locales = localeDirs.map((name) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(name) || RESERVED.has(name)) {
    fail(`非法语言目录名：${name}`);
  }

  const dir = path.join(originRoot, name);
  const meta = readJson(path.join(dir, "site.json"));
  const data = meta.meta || {};

  for (const key of ["lang", "language", "title", "description"]) {
    if (!data[key] || typeof data[key] !== "string") {
      fail(`docs/origin/${name}/site.json 缺少 meta.${key}`);
    }
  }

  if (!fs.existsSync(path.join(dir, "index.html"))) {
    fail(`docs/origin/${name} 缺少 index.html`);
  }

  return {
    name,
    dir,
    meta: data,
    site: meta,
    order: Number.isFinite(data.order) ? data.order : 100,
  };
});

locales.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

const localeIndexTemplate = fs.readFileSync(
  path.join(templateRoot, "locale-index.html"),
  "utf8",
);
const rootIndexTemplate = fs.readFileSync(
  path.join(templateRoot, "root-index.html"),
  "utf8",
);

// 上一次构建的语言目录清单，用于清理已删除的翻译
let previousLocales = [];
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    previousLocales = Array.isArray(manifest.locales) ? manifest.locales : [];
  } catch (error) {
    console.warn(
      `[build:website] 忽略损坏的清单 ${path.relative(root, manifestPath)}：${error.message}`,
    );
    previousLocales = [];
  }
}

const localeNames = new Set(locales.map((locale) => locale.name));

for (const oldName of previousLocales) {
  if (localeNames.has(oldName)) continue;
  if (!/^[a-zA-Z0-9_-]+$/.test(oldName) || RESERVED.has(oldName)) continue;

  const oldDir = path.resolve(websiteRoot, oldName);
  if (!oldDir.startsWith(websiteRoot + path.sep)) continue;

  fs.rmSync(oldDir, { recursive: true, force: true });
  console.log(`[build:website] 移除过期语言目录：${oldName}`);
}

for (const locale of locales) {
  const { name, dir, meta } = locale;
  const outDir = path.resolve(websiteRoot, name);

  if (!outDir.startsWith(websiteRoot + path.sep)) {
    fail(`输出路径越界：${outDir}`);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.cpSync(dir, outDir, { recursive: true });

  // 源文件相对 docs/origin/<locale> 写成 ../../website/...，这样在仓库里
  // 直接预览 origin 也能命中共享资源；构建产物改写为 ../...，使
  // docs/website 无论作为站点根还是 docs 的子目录部署都能正确解析。
  // 源 index.html 是页面模块（template[page]），构建时覆盖为完整 SCSR 文档。
  const pagePath = path.join(outDir, "index.html");
  const pageSource = fs.readFileSync(pagePath, "utf8");
  const openMatch = pageSource.match(/<template\s+page\s*>/);
  const closeIndex = pageSource.lastIndexOf("</template>");
  if (!openMatch || closeIndex <= openMatch.index) {
    fail(`docs/origin/${name}/index.html 缺少完整的 <template page>`);
  }

  // SCSR：页面内容直接内联进 index.html 的 template[page]，当前 HTML
  // 既是可访问文档，也是 scsr 收编的页面模块源文件。
  const pageContent = pageSource
    .slice(openMatch.index + openMatch[0].length, closeIndex)
    .replaceAll("../../website/", "../");

  const index = fill(localeIndexTemplate, {
    LANG: escapeHtml(meta.lang),
    TITLE: escapeHtml(meta.title),
    DESCRIPTION: escapeHtml(meta.description),
    NOSCRIPT: escapeHtml(meta.noscript || "This page requires JavaScript."),
    PAGE_CONTENT: pageContent,
  });

  // 用完整 SCSR 文档覆盖拷贝过来的页面模块源文件。
  fs.writeFileSync(pagePath, index);

  console.log(
    `[build:website] ${name}: docs/origin/${name}/index.html → docs/website/${name}/index.html（SCSR）`,
  );
}

const langCards = locales
  .map((locale) => {
    const { name, meta } = locale;
    return `        <a class="lang-card" href="./${name}/" hreflang="${escapeHtml(meta.lang)}">
          <span class="lang-mark">${escapeHtml(name)}</span>
          <span class="lang-main">
            <span class="lang-native">${escapeHtml(meta.language)}</span>
            <span class="lang-title">${escapeHtml(meta.title)}</span>
          </span>
          <span class="lang-arrow" aria-hidden="true">→</span>
        </a>`;
  })
  .join("\n");

const rootIndex = fill(rootIndexTemplate, { LANG_CARDS: langCards });
fs.writeFileSync(path.join(websiteRoot, "index.html"), rootIndex);

fs.writeFileSync(
  manifestPath,
  JSON.stringify({ locales: locales.map((locale) => locale.name) }, null, 2) + "\n",
);

console.log(
  `[build:website] 根语言页 → docs/website/index.html（${locales.length} 种语言）`,
);
console.log(`[build:website] 完成：${locales.map((locale) => locale.name).join(", ")}`);
