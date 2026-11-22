/**
 * 下载跨框架基准（run-cross.mjs）所需的第三方框架生产版文件。
 *
 * vendor/cross/ 不进仓库（见 .gitignore），克隆后先执行本脚本：
 *   node packages/ofajs/benchmark/fetch-cross-vendor.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "vendor/cross");

// 版本钉死保证可比性可复现：React 19 起不再提供 UMD 构建，故用 18.3.1
const FILES = [
  {
    url: "https://unpkg.com/vue@3.5.43/dist/vue.global.prod.js",
    file: "vue.global.prod.js",
  },
  {
    url: "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
    file: "react.production.min.js",
  },
  {
    url: "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
    file: "react-dom.production.min.js",
  },
];

mkdirSync(OUT, { recursive: true });

writeFileSync(
  join(OUT, "versions.json"),
  JSON.stringify(
    { vue: "3.5.43", react: "18.3.1", reactDom: "18.3.1" },
    null,
    2,
  ),
);

for (const { url, file } of FILES) {
  const dest = join(OUT, file);

  if (existsSync(dest)) {
    console.log(`已存在，跳过 / exists, skip: ${file}`);
    continue;
  }

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`下载失败 / download failed: ${url} → ${resp.status}`);
  }

  const body = Buffer.from(await resp.arrayBuffer());
  writeFileSync(dest, body);
  console.log(`${file}: ${(body.length / 1024).toFixed(1)} KB`);
}

console.log("vendor/cross 就绪 / vendor ready");
