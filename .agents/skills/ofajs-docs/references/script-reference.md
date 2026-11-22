# 脚本引入

ofa.js 支持通过 script 标签直接引入使用，无需 Node.js 或构建步骤。在 HTML 的
`<head>` 或 `<body>` 中添加：

```html
<!-- v5 分支（当前技能对应的版本） -->
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
  type="module"
></script>
```

> ⚠️ **版本线**：v5 尚未合并到 `main`、也未发布 npm。不加 `@refs/heads/v5` 的
> 短地址（`.../dist/ofa.min.mjs`）拿到的是 **v4.7.x**。两条线的完整地址表、
> 为什么 `@v5` 会 404，见 [版本与资源地址](./version-resources.md)。

## v4 主线（npm latest / `main` 分支）

```html
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs"
  type="module"
></script>
```

## 基本使用

引入脚本后，ofa.js 会在全局作用域创建 `$` 变量（同时挂 `globalThis.ofa`），所有
核心功能都通过该对象提供。可通过 `$.version` 确认实际加载到的版本。

## 调试模式

在脚本 URL 后添加 `#debug` 参数启用调试模式（开启 sourcemap）：

```html
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs#debug"
  type="module"
></script>
```

调试模式使浏览器开发者工具能直接查看和调试框架原始源码。

## ESM 模块

```javascript
import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";
```

ESM 方式下同样可直接使用 `$`。

## 经典 script（UMD）

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js"></script>
```

UMD 产物暴露全局 `$` / `globalThis.ofa` / `exports.Stanz`，适合不写 `type="module"`
的页面，以及需要与 router / scsr 的 UMD 产物按顺序拼接的场景。

## 路由 / 同构渲染桥接包

router（`o-router`）与 scsr 是独立包，**必须在 ofa.js 之后加载**：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.js"></script>
```

| 包 | v5 地址 | v4 地址 |
|----|---------|---------|
| o-router | `...@refs/heads/v5/packages/router/dist/router.min.mjs` | `.../libs/router/dist/router.min.mjs` |
| scsr | `...@refs/heads/v5/packages/scsr/dist/scsr.min.mjs` | `.../libs/scsr/dist/scsr.min.mjs` |

## 关键要点

- **引入方式**：`<script type="module">`（ESM）或经典 `<script>`（UMD）
- **全局变量**：自动创建 `$` 全局变量，并挂 `globalThis.ofa`
- **调试模式**：URL 后加 `#debug` 开启 sourcemap
- **版本线**：v5 用 `@refs/heads/v5` 前缀；`@v5` 会被 jsdelivr 当版本号而 404
- **加载顺序**：router / scsr 必须在 ofa.js 之后
