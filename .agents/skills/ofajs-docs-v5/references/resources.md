# 版本与资源地址

## 两条线

| 线 | 位置 | 版本 | 结构 |
|----|------|------|------|
| v4 主线 | `main` 分支 / npm `ofa.js` | 4.7.x | 源码 `packages/ofa/`；router/scsr 在根 `libs/`；产物在根 `dist/` |
| v5（本文档） | `v5` 分支 | 5.0.0 | monorepo：`packages/{ofajs,router,scsr,drill,stanz,xhear}`；router/scsr 在各自 `packages/<pkg>/dist/` |

控制台 `$.version` 直接判断项目版本（v4.7.x / "5.0.0"）。

## CDN 地址

```html
<!-- ofa.js ESM（推荐）—— v5 分支 -->
<script
  src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
  type="module"
></script>

<!-- ofa.js 经典 script（UMD，全局 $） -->
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js"></script>

<!-- o-router / scsr 桥接包（v5）——必须在 ofa.js 之后加载 -->
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs" type="module"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/scsr/dist/scsr.min.mjs" type="module"></script>
```

v4 主线把 `@refs/heads/v5` 去掉（回退默认分支），并把
`packages/{router,scsr}/dist/` 换成 `libs/{router,scsr}/dist/`。

### 为什么 v5 必须写 `@refs/heads/v5`

jsdelivr 的 `@` 后**先按 semver/tag 解析**再回退分支；分支名 `v5` 形似版本号，
`@v5` 会因找不到同名 tag 而 404。需要固定可复现版本时用 commit hash
（`@5e39afa/...`）。

> jsdelivr 的 404 不一定代表文件不存在：分支刚推送后可能返回缓存的 404。
> 先用 GitHub/raw 确认文件在分支上，再给 URL 加 `?v=1` 触发回源；不要因为
> 一次 404 就改回 v4 路径。raw 地址 MIME 不保证是 JS，不要用于模块脚本。

## dist 产物（v5）

| 产物 | 位置 | 说明 |
|------|------|------|
| ofa.js 本体 | 根 `dist/`：`ofa.mjs` / `ofa.js`(UMD 全局 `$`) / 各 min + map | `npm run build` 生成，不手改 |
| router | `packages/router/dist/router.*` | UMD 全局名 `ofaRouter`；副作用模块（注册元素 + 挂扩展点），无导出 |
| scsr | `packages/scsr/dist/scsr.*` | UMD 全局名 `ofaScsr`（构建时已打入同步内核） |

桥接包源码**挂接全局 `$`**（不 import 框架源码），与 dist ofa.js 并存时
复用同一份框架实例——因此必须在 ofa.js 之后加载：router 缺失运行时直接
抛错（`ofa.js must be loaded before router`），scsr 告警退出。

## 加载顺序

```html
<!-- 浏览器直接可用：CDN 全路径（import 顺序即加载顺序） -->
<script type="module">
  import "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";
</script>

<!-- 经典脚本：书写顺序 -->
<script src=".../dist/ofa.min.js"></script>
<script src=".../packages/router/dist/router.min.js"></script>
```

npm + 打包器场景的包名是 `ofa.js` / `router` / `scsr`（`import "ofa.js"` +
`import "router"`）；裸说明符在浏览器需要 import map 或打包器，纯 CDN 页面
一律写全路径。

## monorepo 源码引用（本仓开发）

```html
<script type="module">
  import "../../../ofajs/src/main.mjs";     // 相对层级按页面深度调整
  import "../../router/src/router.mjs";     // 桥接包源码（挂全局 $）
</script>
```

- 正源：`packages/ofajs/src/`（行为以此为准）；路由相关见
  `packages/router/CONTEXT.md`、`packages/scsr/CONTEXT.md`
- 本地预览：仓库根 `npm run server` → `http://localhost:3348`
- 测试：根 `npm test`（三浏览器）；产物重建：根 `npm run build`

## 调试模式

URL 带 `#debug` 时 ofa.js 开启调试（转译模块生成 sourcemap，报错行号映射
回源 HTML）：

```html
<script src=".../dist/ofa.min.mjs#debug" type="module"></script>
```
