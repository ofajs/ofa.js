# ofa.js 官网首页

`docs/website/` 是 ofa.js 的静态官网首页。页面本身用 ofa.js 编写，
没有任何构建步骤，也不依赖第三方运行时。

## 本地预览

在仓库根目录启动静态服务器：

```bash
npm run server
```

然后访问：

```
http://localhost:3348/docs/website/
```

不要直接双击 `index.html` 打开——页面模块与 `o-page` 的加载需要 HTTP
环境，`file://` 会被浏览器的模块 CORS 策略拦截。

## 目录结构

```
docs/website/
├── index.html                  入口：加载 ofa.js，挂载 o-page
├── page.html                   首页页面模块（结构、样式、交互）
├── components/
│   └── demo-counter.html       首页中复用的响应式计数器组件
└── assets/
    └── favicon.svg             站点图标
```

## 框架加载策略

`index.html` 中的模块脚本按顺序尝试：

1. `../../dist/ofa.min.mjs`（仓库内构建产物，本地预览无需联网）
2. `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs`

两者都失败时会显示错误提示。部署到没有 `dist/` 的目录时会自动使用 CDN。

## 修改指引

- 页面内容与样式都在 `page.html` 的 `<template page>` 内；脚本必须放在
  `template` 内部。
- 设计变量集中在 `page.html` 顶部的 `:host` 中（颜色、圆角、最大宽度等）。
- 演示区待办列表的数据与逻辑在 `page.html` 底部的 `<script>` 中。
- 计数器组件在 `components/demo-counter.html`，通过页面顶部的
  `<l-m src="./components/demo-counter.html">` 注册。
- 页面包含滚动渐入动画；如不希望启用，可在操作系统中开启
  “减少动态效果”，样式会自动降级。

## 版本与链接

- 展示版本号：`v5.0.2`（与根 `package.json` 一致）
- 官方文档：https://ofajs.com/cn/index.html
- 源码仓库：https://github.com/ofajs/ofa.js
