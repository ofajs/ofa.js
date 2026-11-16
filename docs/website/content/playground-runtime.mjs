/**
 * 文档案例预览的默认代码与虚拟页面入口。
 * 独立成模块，避免把 <template> / <script> 字符串嵌在组件 HTML 里。
 */

export const SPACE = "ofa-docs-playground";

export const OFA_CDN =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";

export const STORAGE_KEY = "ofa-docs-playground-code";

export const DEFAULT_CODE = `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    button {
      margin-top: 8px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h1>Hello, {{name}}</h1>
  <p>这是一个运行在 NoneOS 虚拟容器里的 ofa.js 页面。</p>
  <button on:click="count++">点了 {{count}} 次</button>

  <script>
    export default async () => ({
      data: {
        name: "ofa.js",
        count: 0,
      },
    });
  </script>
</template>`;

export const buildIndex = (version) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 案例预览</title>
    <script type="module" src="${OFA_CDN}"><\/script>
    <style>
      html, body { margin: 0; min-height: 100%; }
      o-page { display: block; }
    </style>
  </head>
  <body>
    <o-page src="./page.html?v=${version}"></o-page>
  </body>
</html>`;
