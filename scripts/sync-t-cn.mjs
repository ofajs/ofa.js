#!/usr/bin/env node
/**
 * 从 docs/origin/cn 生成 docs/origin/t-cn。
 *
 * 只做字符/词语转换，不做 AI 翻译；转换使用 opencc-js（OpenCC 的 JS 实现）。
 * build:website 会先调用这里，确保繁体源文件始终跟简体源文件同步。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as OpenCC from "opencc-js";
import {
  DEFAULT_CODE,
  LESSONS,
} from "../docs/website/content/playground-runtime.mjs";
import { API_EXAMPLES } from "../docs/website/content/api-examples.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "docs", "origin", "cn");
const targetDir = path.join(root, "docs", "origin", "t-cn");
const converter = OpenCC.Converter({ from: "cn", to: "tw" });

const convertValue = (value) => {
  if (typeof value === "string") return converter(value);
  if (Array.isArray(value)) return value.map(convertValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, convertValue(item)]),
    );
  }
  return value;
};

const writeDataModule = (relativePath, exportName, value) => {
  const targetPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(
    targetPath,
    `// 由 scripts/sync-t-cn.mjs 生成，请勿手改。\n` +
      `export const ${exportName} = ${JSON.stringify(convertValue(value), null, 2)};\n`,
  );
};

const convertFile = (relativePath) => {
  const sourcePath = path.join(sourceDir, relativePath);
  const targetPath = path.join(targetDir, relativePath);
  const source = fs.readFileSync(sourcePath, "utf8");
  let output = converter(source);

  if (relativePath === "site.json") {
    const site = JSON.parse(output);
    site.meta.lang = "zh-Hant";
    site.meta.language = "繁體中文";
    site.meta.order = 15;
    output = JSON.stringify(site, null, 2) + "\n";
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, output);
};

export const syncTraditionalChinese = () => {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  const walk = (relativeDir = "") => {
    for (const entry of fs.readdirSync(path.join(sourceDir, relativeDir), {
      withFileTypes: true,
    })) {
      const relativePath = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) walk(relativePath);
      else if (entry.isFile()) convertFile(relativePath);
    }
  };

  walk();

  writeDataModule(
    "docs/website/content/playground-runtime-t-cn.mjs",
    "DEFAULT_CODE_TCN",
    DEFAULT_CODE,
  );
  // The module above only holds the default example; append LESSONS_TCN.
  fs.appendFileSync(
    path.join(root, "docs/website/content/playground-runtime-t-cn.mjs"),
    `export const LESSONS_TCN = ${JSON.stringify(convertValue(LESSONS), null, 2)};\n`,
  );
  writeDataModule(
    "docs/website/content/api-examples-t-cn.mjs",
    "API_EXAMPLES_TCN",
    API_EXAMPLES,
  );

  console.log("[sync:t-cn] docs/origin/cn → docs/origin/t-cn");
  console.log("[sync:t-cn] 已生成 playground / API 繁体示例");
};

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  syncTraditionalChinese();
}
