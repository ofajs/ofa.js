import { readFileSync } from "node:fs";
import terser from "@rollup/plugin-terser";

// 打包白名单（见根 AGENTS.md 选型禁令的例外记录，其余包保持
// source-only ESM 不打包）：
// - ofajs 主包 → 根 dist/（框架本体的经典入口，UMD 全局名 $）
// - router / scsr 桥接包 → 各自包内 dist/（自包含，npm 发布物与
//   产物同包；源码挂接全局 $，无框架导入，UMD 全局名 ofaRouter/ofaScsr）
const TARGETS = [
  {
    name: "ofajs",
    input: "packages/ofajs/src/main.mjs",
    outDir: "dist",
    file: "ofa",
    umdName: "$",
    exports: "named",
  },
  {
    name: "router",
    input: "packages/router/src/router.mjs",
    outDir: "packages/router/dist",
    file: "router",
    umdName: "ofaRouter",
    // router / scsr 是副作用模块（注册元素 + 挂扩展点），无导出
    exports: "none",
  },
  {
    name: "scsr",
    input: "packages/scsr/src/scsr.mjs",
    outDir: "packages/scsr/dist",
    file: "scsr",
    umdName: "ofaScsr",
    exports: "none",
  },
];

export default TARGETS.map(({ name, input, outDir, file, umdName, exports }) => {
  const pkg = JSON.parse(
    readFileSync(new URL(`./packages/${name}/package.json`, import.meta.url)),
  );

  const banner = `//! ${pkg.name} - v${pkg.version} ${pkg.repository.url} (c) ${pkg.startyear}-${new Date().getFullYear()} ${pkg.author.name}`;

  return [
    {
      input,
      output: [
        {
          file: `${outDir}/${file}.mjs`,
          format: "es",
          exports,
          banner,
        },
        {
          file: `${outDir}/${file}.js`,
          format: "umd",
          name: umdName,
          exports,
          banner,
        },
      ],
    },
    {
      input,
      output: [
        {
          file: `${outDir}/${file}.min.mjs`,
          format: "es",
          exports,
          banner,
          sourcemap: true,
        },
        {
          file: `${outDir}/${file}.min.js`,
          format: "umd",
          name: umdName,
          exports,
          banner,
          sourcemap: true,
        },
      ],
      plugins: [terser()],
    },
  ];
}).flat();
