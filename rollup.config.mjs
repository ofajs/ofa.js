import { readFileSync } from "node:fs";
import terser from "@rollup/plugin-terser";

// 只打包 ofajs 主包（drill/stanz/xhear 保持 source-only ESM，见根 AGENTS.md
// 选型禁令——此配置经用户确认引入，属唯一例外）
const pkg = JSON.parse(
  readFileSync(new URL("./packages/ofajs/package.json", import.meta.url)),
);

const banner = `//! ${pkg.name} - v${pkg.version} ${pkg.repository.url} (c) ${pkg.startyear}-${new Date().getFullYear()} ${pkg.author.name}`;

export default [
  {
    input: "packages/ofajs/src/main.mjs",
    output: [
      {
        file: "dist/ofa.mjs",
        format: "es",
        exports: "named",
        banner,
      },
      {
        file: "dist/ofa.js",
        format: "umd",
        name: "$",
        exports: "named",
        banner,
      },
    ],
  },
  {
    input: "packages/ofajs/src/main.mjs",
    output: [
      {
        file: "dist/ofa.min.mjs",
        format: "es",
        exports: "named",
        banner,
        sourcemap: true,
      },
      {
        file: "dist/ofa.min.js",
        format: "umd",
        name: "$",
        exports: "named",
        banner,
        sourcemap: true,
      },
    ],
    plugins: [terser()],
  },
];
