# o-app + scsr 使用案例

o-app（应用容器与路由）+ scsr（Symphony Client-Server Rendering，
`packages/scsr`）的完整使用案例：**每个页面都是一份真实 HTML 文档**，
scsr 在浏览器端把当前 URL 收编为应用内页面，站内跳转走 o-app 路由。
地址是真实路径（`/packages/scsr/test/scsr-demo/pages/xxx.html?id=N`），
刷新、直达、分享链接都无需服务器 rewrite——这是与 o-router（hash 地址）
的本质区别。

## 运行

```bash
npm run server   # http://localhost:3348
```

打开 <http://localhost:3348/packages/scsr/test/scsr-demo/>（或直接访问
任意子页面，如 `pages/detail.html?id=42`——每个 URL 都能独立打开）。

## 目录与演示点

| 文件 | 演示点 |
|---|---|
| `index.html` | **SCSR 契约载体**：完整文档 + `template[page]` 内联在 `o-app` 里；goto / olink / 锚点 / 404 各入口；页内锚点不参与路由且后退可对账 |
| `app.mjs` | 应用配置：`pageAnime`（方向推入动画）、`fail`（加载失败页）；**不声明 home**（SCSR 约定：首页就是当前 URL 的页面） |
| `demo.css` | 每个页面都是独立文档，共享视觉靠真实样式表（`:root` 变量穿透 shadow） |
| `pages/layout.html` | **共享布局父页**：顶栏导航 + slot；同前缀导航时布局页不销毁，`routerChange` 生命周期驱动导航高亮 |
| `pages/list.html` | `o-fill` 渲染列表；卡片 `olink + attr:href` 拼 query——scsr 无 hash 改写，href 就是文档相对路径 |
| `pages/detail.html` | **query 读取**：`default` 写成函数，入参 `query` 即真实路径上的查询参数；带参直达/刷新均还原 |
| `pages/parent.html` + `child-a/b.html` | **嵌套路由（三层链）**：布局 → 父页 → 子页；子页互换时父页与布局层都不销毁（计数保留）；子页切换用 seg-switch 分段开关，`routerChange` 同步高亮（浏览器前进/后退也跟手） |
| `components/seg-switch.html` | **自定义组件案例**：`<template component>` 声明 `tag`/`data`，`o-fill` 渲染选项、`emit("change")` 上抛选中；父页 `await load()` 注册后以 `:value` / `on:change` 使用（与 router-demo 同款组件） |
| `pages/profile.mjs` | **.mjs 页面模块**：`type = $.PAGE` + temp + default 读 query。仅应用内可达——刷新这类 URL 得到的是源码，"每个 URL 都是文档"只覆盖 HTML 页面 |

## 核心写法速查

```html
<!-- 每个页面都是一个完整 HTML 文档：template[page] 内联在 o-app 里 -->
<link rel="stylesheet" href="../demo.css" />
<o-app src="../app.mjs">
  <template page>
    <h1>页面内容</h1>
    <a olink href="./other.html">声明导航（真实相对路径）</a>
  </template>
</o-app>
<script type="module">
  import "ofajs";   // 注册 o-app/o-page/olink 等
  import "scsr";    // URL 收编 + 历史同步（真实路径）
</script>
```

```js
// 应用配置：不声明 home（首页 = 当前 URL），可配 pageAnime / fail
export const pageAnime = { current: {...}, next: {...}, previous: {...} };
export const fail = ({ src }) => `...404 内容...`;
```

```js
// 页面间跳转：地址是真实路径，文档不重载
this.goto("./detail.html?id=1");
this.back();                       // 浏览器历史一并回退（scsr 接管）

// 页面模块读 query（default 函数形式）
export default ({ query }) => ({ data: { id: query.id } });
```

## 选 scsr 还是 o-router？

- **o-router**（`packages/router/test/router-demo`）：地址是 `#/path`
  hash 形式，零服务器要求，适合纯静态托管且不在乎地址形态的场景；
- **scsr**（本案例）：地址是真实路径，每个 URL 都是可直接访问的文档，
  适合 SEO / 分享 / 渐进增强——代价是每个可直达路径都要有一份同名
  HTML 文件（内联 `template[page]`），且 `.mjs` 页面仅限应用内到达。

两者共用同一个同步内核（`packages/router/src/sync.mjs`），o-app 的
路由 API、olink、嵌套路由、动画行为完全一致。
