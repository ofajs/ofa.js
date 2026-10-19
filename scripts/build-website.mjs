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

const walkFiles = (dir, base = "") => {
  const result = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      result.push(...walkFiles(path.join(dir, entry.name), rel));
    } else if (entry.isFile()) {
      result.push(rel);
    }
  }

  return result;
};

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

const localePageTemplate = fs.readFileSync(
  path.join(templateRoot, "locale-page.html"),
  "utf8",
);
const rootIndexTemplate = fs.readFileSync(
  path.join(templateRoot, "root-index.html"),
  "utf8",
);
const layoutPageTemplate = fs.readFileSync(
  path.join(templateRoot, "layout-page.html"),
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
  const { name, dir, meta, site } = locale;
  const outDir = path.resolve(websiteRoot, name);

  if (!outDir.startsWith(websiteRoot + path.sep)) {
    fail(`输出路径越界：${outDir}`);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.cpSync(dir, outDir, { recursive: true });

  const pages = site.pages || {};
  let pageCount = 0;

  for (const rel of walkFiles(dir)) {
    if (!/\.html?$/i.test(rel)) continue;

    const sourcePath = path.join(dir, rel);
    const pageSource = fs.readFileSync(sourcePath, "utf8");

    if (!/<template\s+page\s*>/.test(pageSource)) {
      if (rel === "index.html") {
        fail(`docs/origin/${name}/index.html 缺少 <template page>`);
      }
      continue;
    }

    const openMatch = pageSource.match(/<template\s+page\s*>/);
    const closeIndex = pageSource.lastIndexOf("</template>");
    if (!openMatch || closeIndex <= openMatch.index) {
      fail(`docs/origin/${name}/${rel} 缺少完整的 <template page>`);
    }

    const pageMeta = pages[rel] || (rel === "index.html" ? meta : null);
    if (!pageMeta) {
      fail(
        `docs/origin/${name}/site.json 缺少 pages["${rel}"]（需要 title/description）`,
      );
    }

    const title = pageMeta.title || meta.title;
    const description = pageMeta.description || meta.description;

    if (!title || !description) {
      fail(`docs/origin/${name}/site.json 中 ${rel} 的 title/description 为空`);
    }

    // 页面所在目录到 docs/website 根目录的相对前缀：
    //   index.html           -> ..
    //   tutorial/usage.html   -> ../..
    const dirRel = path.posix.dirname(rel);
    const depth = dirRel === "." ? 0 : dirRel.split("/").length;
    const sitePrefix = "../".repeat(depth + 1).replace(/\/$/, "");
    const localePrefix =
      depth === 0 ? "." : "../".repeat(depth).replace(/\/$/, "");

    // 源页面统一用 {{SITE}} 指向共享资源，这里替换成当前页面深度对应的前缀。
    const pageContent = pageSource
      .slice(openMatch.index + openMatch[0].length, closeIndex)
      .replaceAll("{{SITE}}", sitePrefix)
      .replaceAll("{{LOCALE}}", localePrefix);

    const output = fill(localePageTemplate, {
      LANG: escapeHtml(meta.lang),
      TITLE: escapeHtml(title),
      DESCRIPTION: escapeHtml(description),
      NOSCRIPT: escapeHtml(meta.noscript || "This page requires JavaScript."),
      SITE: sitePrefix,
      LOCALE: localePrefix,
      PAGE_CONTENT: pageContent,
    });

    const outputPath = path.join(outDir, ...rel.split("/"));
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);
    pageCount += 1;
  }

  if (!pageCount) {
    fail(`docs/origin/${name} 没有可构建的页面`);
  }

  // 每个语言生成一份嵌套路由 layout：子页通过 export const parent 挂入，
  // header/footer 只创建一次并跨页面保留。
  const layoutContent = layoutPageTemplate
    .replaceAll("{{SITE}}", "..")
    .replaceAll("{{LOCALE}}", ".");

  const layoutOutput = fill(localePageTemplate, {
    LANG: escapeHtml(meta.lang),
    TITLE: escapeHtml(meta.title),
    DESCRIPTION: escapeHtml(meta.description),
    NOSCRIPT: escapeHtml(meta.noscript || "This page requires JavaScript."),
    SITE: "..",
    LOCALE: ".",
    PAGE_CONTENT: layoutContent,
  });

  fs.writeFileSync(path.join(outDir, "layout.html"), layoutOutput);

  console.log(
    `[build:website] ${name}: ${pageCount} 个 SCSR 页面 + layout → docs/website/${name}/`,
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
