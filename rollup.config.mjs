import { readFileSync } from "node:fs";
import terser from "@rollup/plugin-terser";

// 打包白名单（见根 AGENTS.md 选型禁令的例外记录，其余包保持
// source-only ESM 不打包）：
// - ofajs 主包 → 根 dist/（框架本体的经典入口，UMD 全局名 $）
// - router / scsr 桥接包 → 各自包内 dist/（自包含，npm 发布物与
//   产物同包；源码挂接全局 $，无框架导入，UMD 全局名 ofaRouter/ofaScsr）
// - plugins/formdata 插件 → 插件子包内 dist/（同桥接原则挂全局 $，
//   把 formData 注册到 $.fn，纯副作用无导出）
// - plugins/inject-host 插件 → 插件子包内 dist/（同上，纯副作用注册
//   inject-host 元素，无导出）
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
  {
    name: "plugins/formdata", // 仅用于定位 package.json（读版本/作者信息）
    input: "packages/plugins/formdata/formdata.mjs",
    outDir: "packages/plugins/formdata/dist",
    file: "formdata",
    umdName: "ofaFormData", // 仅占位：纯副作用无导出，不会真正挂全局
    exports: "none",
  },
  {
    name: "plugins/inject-host", // 仅用于定位 package.json
    input: "packages/plugins/inject-host/inject-host.mjs",
    outDir: "packages/plugins/inject-host/dist",
    file: "inject-host",
    umdName: "ofaInjectHost",
    exports: "none",
  },
  {
    name: "plugins/body-ghost", // 仅用于定位 package.json
    input: "packages/plugins/body-ghost/body-ghost.mjs",
    outDir: "packages/plugins/body-ghost/dist",
    file: "body-ghost",
    umdName: "ofaBodyGhost",
    exports: "none",
  },
  {
    name: "plugins/global-link", // 仅用于定位 package.json
    input: "packages/plugins/global-link/global-link.mjs",
    outDir: "packages/plugins/global-link/dist",
    file: "global-link",
    umdName: "ofaGlobalLink",
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
