# router（o-router · hash 路由桥）

## 一、定位

o-app（packages/ofajs）的 **hash 路由桥**：把应用路由同步到浏览器
history（URL 形如 `#/path?query`，跨域源记为 `#origin/path?query`），
接管浏览器前进/后退，使 o-app 页面可刷新、直达、分享，无需服务器
rewrite。版本号跟随 ofa.js 主包（当前 5.0.0）。

## 二、结构

```
packages/router/
├── src/
│   ├── router.mjs     o-router 元素 + $.extensions.link（olink href 改写 hash 形式）+ 首次 hash 进入处理
│   └── sync.mjs       同步内核：RC 事件 ↔ history 双向对账（无标志位设计，见下）
├── dist/              rollup 产物（ES + UMD + min，根 npm run build 生成，不手改）
└── test/              router-demo/ 为 o-app + o-router 综合使用案例（见其 README）；
                        statics/ 为 spec 页面（含 dist-host.html 产物冒烟）；router.spec.js 为流程断言
```

## 三、用法

```html
<!-- 源码用法（monorepo / 本地直接引） -->
<o-router fix-body>
  <o-app src="app-config.mjs"></o-app>
</o-router>
<script type="module">
  import "ofajs";
  import "router"; // 挂接页面已加载的全局 $，须在 ofa.js 之后加载
</script>

<!-- 经典用法（dist 产物，经典脚本即可） -->
<script src="dist/ofa.min.js"></script>
<script src="dist/router.min.js"></script>
```

- `fix-body`：为 html/body 追加满尺寸重置样式（watch 响应式，移除属性即撤销）；
- 首次进入带 hash：等应用就绪后——目标即当前页则跳过，否则 replace
  过去（避免与配置 home 的挂载竞态造成同页双渲染）；
- 应用就绪后为初始条目补建 routerMode 状态（replaceState 不新增历史），
  此后前进/后退的每个条目都有完整状态可供对账；
- `$.extensions.link`：o-link 的 href 改写为 `origin/pathname#path`
  形式（o-app 的链接处理器读取该扩展点）。

## 四、同步内核（sync.mjs）设计要点

- **回波抑制不用标志位**：RC 处理器发现 location.href 已是目标 hash
  地址时直接跳过写入（popstate 驱动的导航到达时 URL 必然已一致）。
  唯一例外是 back——hash 片段与全址对比恒不等，改用 **delta 回波
  守卫**（popstate 分支记录预期 delta，RC back 消费；同 src no-op
  由 driveNav 的 finally 复位，不会卡死后续导航）；
- **等深不同栈**（replaceState 类导航的前后移动）：按条目保存的路由栈
  恢复（`app.routers = hisRouters`，setter 负责渲染）；
- **ignore 条目跳过**：带 `state.ignore` 标记的条目直接忽略，不驱动
  应用（宿主可为「只承载 URL 变化」的条目写此标记，scsr spec 有契约
  用例）；
- **应用未就绪忽略 popstate**：与 home 挂载竞态会造成双重渲染
  （旧 first-render 竞态案例，本包 spec 有 hash 直达 + reload 用例防守）；
- reload 后 `history.state` 仍在：同步恢复路由栈，app 挂载配置 home
  时据 `_settedRouters` 跳过。

## 五、踩坑

- **桥接包不 import 框架源码**：src 挂接页面已加载的全局 `$`
  （window.$ / globalThis.ofa），`isSafariBrowser`、随机 id 等小工具
  直接内联——否则与 dist ofa.js 并存时会拉起第二份 xhear/stanz 实例
  （组件重复注册、状态分裂）。代价是须在 ofa.js 之后加载（缺失时
  router 抛错、scsr 告警退出）；
- **测试页不引入 harness**（hash 页面上 harness 有偶发不执行的干扰，
  旧仓同款设计）；驱动/读取应用直接 `$("o-app")` 取全局单例（元素内
  则用 `this.app`），不向 window 暴露实例变量。

## 六、运行方式

- 测试：仓库根 `npx playwright test packages/router`（或根 `npm test`）；
- 产物：根 `npm run build` 生成 `dist/`（ES + UMD + min，UMD 全局名
  ofaRouter），`statics/dist-host.html` 为经典用法冒烟页；
- 手动预览：根 `npm run server` → `http://localhost:3348/packages/router/test/statics/router.html`。
