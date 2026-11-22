# scsr（Symphony Client-Server Rendering）

## 一、定位

让**真实 HTML 文件的站点**获得 o-app 的 SPA 路由能力：服务器（或纯静态
主机）直接投递完整 HTML——页面内容内联在 `<o-app>` 的
`<template page>` 里；本包在 window load 后把当前 URL 收编为应用内的
`<o-page src>`（同一份 HTML 经 ofa.js 的 template[page] 转译管线变成
页面模块），再复用 o-router 的同步内核
（`packages/router/src/sync.mjs`）把应用路由同步到浏览器历史。

与 o-router 的分工：o-router 用 `#/path` 哈希地址，零服务器要求；
scsr 用**真实路径**，每个 URL 都是可直接访问、分享、被爬虫抓取的页面，
但要求「每个路径都有一份同名 HTML」。版本号跟随 ofa.js 主包（5.0.0）。

## 二、结构

```
packages/scsr/
├── src/
│   └── scsr.mjs      全部逻辑：URL 收编 + 历史同步接线（副作用模块，页面直接 <script type="module"> 引入）
├── dist/             rollup 产物（ES + UMD + min，UMD 全局名 ofaScsr；根 npm run build 生成，不手改）
└── test/
    ├── scsr.spec.js          流程断言（纯页面 + spec，无自检 harness）
    ├── statics/              测试页面（本身即 SCSR 契约的载体）
    │   ├── scsr01~03.html    三个相互跳转的页面（01 带 t-btn 组件与页内锚点，02 读 query，03 声明 parent）
    │   ├── subs/scsr0301.html  子目录页面（深层路径可达性）
    │   ├── parent.html       03 的父页（继承链包裹渲染）
    │   ├── comps/btn/t-btn.html  template[component] 组件（l-m 加载）
    │   ├── dist-host.html    dist 产物冒烟页（经典脚本 dist ofa + dist scsr）
    │   ├── app.mjs           应用配置（仅 pageAnime，不声明 home）
    │   └── public.css        满尺寸样式
    └── scsr-demo/            综合使用案例（多 HTML 文件迷你应用，见其 README）：
        index/layout/list/detail/profile.mjs/parent/child-a/b + demo.css + app.mjs
        + components/seg-switch.html（分段开关组件，父页 await load 注册）
        （共享布局父页、方向推入动画、fail 页、锚点演示、目录形式直开归一化）
```

## 三、用法

```html
<!-- 源码用法（monorepo / 本地直接引，页面即 SCSR 契约的载体） -->
<o-app src="./app.mjs">
  <template page>
    <!-- 首屏静态内容（SEO/无 JS 可见）；scsr 接管后由 o-page 从当前 URL 重载渲染 -->
    <h1>首页内容</h1>
    <button on:click="goto('./page2.html')">下一页</button>
  </template>
</o-app>
<script type="module">
  import "ofajs";            // 注册 o-app/o-page 等
  import "scsr";             // 本包：URL 收编 + 历史同步
</script>

<!-- 经典用法（dist 产物，经典脚本即可） -->
<script src="dist/ofa.min.js"></script>
<script src="dist/scsr.min.js"></script>
```

- 应用配置**不声明 home**：首页就是当前 URL 的 o-page；
- 页面跳转用 o-app 的 goto/replace/back（或页面内 this.goto），地址
  同步为真实路径 `location.pathname + search`（`getStateUrl` 钩子）；
- **页面标题自动同步**：page-loaded 时若页面模块导出 `title`（HTML 文件
  转译页取自 `<title>`，.mjs 页取自 `export const title`）则写入
  `document.title`。**只跟随当前页（栈顶）**：嵌套路由父页（如共享
  布局页）若也导出 title 且晚于子页加载完成，不得覆盖用户正在看的
  页面标题（scsr-demo 的 layout 场景）；
- **目录形式直开**：首页以 `/` 结尾的目录地址直开时，收编的 src 就是
  目录本身（服务器补 index.html，转译照常）；页面层做导航高亮等
  src 匹配时需自行归一化（见 scsr-demo layout 的 syncActive）。

## 四、设计要点

- **SCSR 契约**：页面本体一律由 o-page 从 URL 加载，接管时移除 o-app
  内联的 template[page]（服务端返回的同一份文件不受影响，转译页面
  模块时仍读取它）；
- **首次进入**（历史无 routerMode 状态）：push
  `<o-page src="pathname+search">`；reload/前后进恢复的进入自带状态，
  由内核直接还原路由栈（`app.routers = history.state.routers`，app
  挂载配置时据 `_settedRouters` 跳过 home）；
- **初始条目补建状态**（与 o-router 同款）：应用就绪
  （`watchUntil(!!app.appIsReady)`，appIsReady 是数字 1，判断用 `!!`）
  后 replaceState 写入 `{routerMode, routers}`——此后每个应用条目都有
  完整状态可供 popstate 对账；
- **锚点条目对账**：实测三引擎的页内锚点导航**都会**触发 popstate
  （state 为 null）+ hashchange。popstate 落在「无状态且带 hash」的
  条目上时 `fixStateUrl` 返回 false 跳过（只定位），并置 maybeHash
  放行随后的 hashchange——由它给该条目**补写当前路由栈快照**
  （replaceState 到 hash-only URL）。此后后退/前进跨过锚点条目按深度
  差正常对账，应用不脱钩。maybeHash 只在 popstate → hashchange 的一个
  任务窗口内为真（hashchange 排队早于 setTimeout 复位），内核真正
  处理过的前后进 popstate 不会置位，其 hashchange 回波不会误盖快照；
- **不写 ignore 标记**：旧版在 hashchange 时写 `ignore:1`，但锚点条目
  恰在前进/后退链上，ignore 会让内核跳过对账 → 应用与 URL 脱钩
  （旧版真实存在的缺陷）。快照方案下锚点条目参与 diff，无此问题。
  内核的 `state.ignore` 跳过守卫保留，供宿主标注「只承载 URL 变化」
  的条目（spec 有直接构造 ignore 条目的契约用例）。

## 五、踩坑

- **桥接包不 import 框架源码**：src 挂接页面已加载的全局 `$`
  （window.$ / globalThis.ofa），避免与 dist ofa.js 并存时拉起第二份
  xhear/stanz 实例；须在 ofa.js 之后加载（缺失时告警退出）。唯一的
  跨包源码导入是 `../../router/src/sync.mjs` 同步内核（src →
  packages/scsr → packages，写错层级会 404 且模块链整体静默失败；
  dist 产物已在构建时把它打进去）；
- **页面文件里 template[page] 必须内联在 o-app 里**：html 转译中间件
  靠 `/<template +page *>/` 识别页面模块；组件同理需要
  `<template component>` 包裹（漏写则 l-m 加载后不注册、页面静默缺块）；
- **进出动画期新旧页短暂共存**：spec 在每段前进/后退之间必须等
  `document.querySelectorAll("o-page")` 数量收敛再驱动下一段，否则
  locator 命中两个同名元素报 strict violation（与旧页移除竞态）；
- **hash 条目状态不会被浏览器克隆**：不要依赖「锚点新条目继承上一
  条目 state」的假设（chromium 实测 popstate 携带 null state），
  一律由 hashchange 显式补写快照。

## 六、运行方式

- 测试：仓库根 `npx playwright test packages/scsr`（或根 `npm test`、
  `npm run test:scsr`）；
- 产物：根 `npm run build` 生成 `dist/`（ES + UMD + min，UMD 全局名
  ofaScsr），`statics/dist-host.html` 为经典用法冒烟页；
- 手动预览测试页：根 `npm run server` →
  `http://localhost:3348/packages/scsr/test/statics/scsr01.html`；
- 综合案例：根 `npm run server` →
  `http://localhost:3348/packages/scsr/test/scsr-demo/`
  （任意子页面均可直接访问，见 scsr-demo/README.md）。
