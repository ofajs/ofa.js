# ofajs 上下文说明（CONTEXT.md）

## 一、一句话定位

ofa.js 框架本体（npm 名 `ofa.js`）：在 xhear 之上补齐应用层能力——组件/
页面模块系统（组件即 HTML 文件，浏览器直接运行无构建）、o-page/o-app
路由（嵌套路由、前进后退、页面动画）、o-if/o-fill 模板语法、上下文通
信、o-link、inject-host、match-var。

## 二、技术栈

- 零运行时依赖；xhear/drill/stanz 以相对路径源码引入（monorepo 内部）；
- source-only ESM，`src/*.mjs` 即发布产物；
- 测试：自检式页面（harness）+ playwright spec，共 5 页 29 检查项 × 3 浏览器。

## 三、目录结构

```
packages/ofajs/
├── AGENTS.md              开发规则（协作契约、文件约定、测试规则）
├── CONTEXT.md             本文件
├── package.json           name: ofa.js, version: 5.0.0, exports ./src/main.mjs
├── src/
│   ├── main.mjs           入口：装配 $（$.version/debugMode/COMP/PAGE/window.$/globalThis.ofa）
│   ├── public.mjs         resolvePath、fixRelate(PathContent)、getPagesData（页面继承链）、createPage
│   ├── error.mjs          本地错误码表（复用 xhear 的 XhearError，替代 ofa-error）
│   ├── draw-template.mjs  HTML→data URI 模块转译器（行号对齐 sourcemap、import 重写、VLQ）
│   ├── comp.mjs           组件中间件（template[component] → 注册自定义元素，tag 由文件名推断）
│   ├── page.mjs           PAGE 中间件 + o-page（src 加载、页面继承、_renderDefault、dispatchLoad）
│   ├── app.mjs            o-app（home、goto/replace/back/forward、嵌套路由、pageAnime、access）
│   ├── extend.mjs         $.fn：app 定位、PATH 组件地址、attr 相对资源解析
│   ├── link.mjs           render 钩子（olink 修正）+ initLink（olink 点击 → app.goto）
│   ├── inject-host.mjs    shadow 内 link/style 收编到宿主根（hash 去重、移除回收）
│   ├── context.mjs        o-provider / o-consumer / o-root-provider + $.fn.getProvider
│   ├── match-var.mjs      CSS 属性条件样式（container style query + 降级轮询）
│   └── （o-if/o-else-if/o-else/o-fill 已下沉 xhear v9，由 base.mjs 的 import 链供给）
└── test/
    ├── statics/           5 个自检页 + harness + fixtures/（组件/页面样例文件）
    └── ofajs.spec.js      断言各页 N/N 通过
```

## 四、对外 API 契约

| API | 说明 |
|---|---|
| `ofa.version` / `ofa.debugMode` | 版本（5.0.0）与调试模式（URL `#debug` 开启 sourcemap） |
| `$.register(opts)` | 转发 xhear；组件通常经文件模块自动注册 |
| `$.COMP` / `$.PAGE` | 组件/页面模块的 type 标记（Symbol） |
| `$.getRootProvider(name)` | 取应用级 root provider |
| `$.fn.PATH` | 元素所属组件/页面的文件地址（相对资源解析基准） |
| `$.fn.app` / `$.fn.getProvider(name)` | 沿 composedPath 定位 o-app / provider |
| `$.fn.attr` | 包装版：组件内相对 href/src 基于 PATH 解析 |
| 组件文件 | `<template component>` + 内嵌 `<script>export default {...}</script>`；tag 由文件名推断 |
| 页面文件 | `<template page>` + 内嵌 script（可 `export const parent/title`） |
| `o-page` | `src` 加载页面模块；`pageIsReady`；页面继承（parent 链包裹） |
| `o-app` | `src` 加载应用配置（home/allowForward/access/fail/pageAnime）；goto/replace/back/forward |
| `o-if` / `o-else-if` / `o-else` | light DOM 条件渲染（链式，内容按需编译） |
| `o-fill` | light DOM 列表渲染（name/fill-key/$data/$index/$host） |
| `o-provider` / `o-consumer` / `o-root-provider` | 上下文数据广播（跨 shadow，composedPath 查找） |
| `inject-host` | shadow 内 link/style 收编到宿主根 |
| `match-var` | 属性条件样式（container style query 优先，降级轮询） |
| `$.extensions.link` | 更高层框架的自定义链接处理器扩展点（默认未设） |

### 页面/组件文件约定

- `<script>` 必须在 `<template component|page>` **内部**（drawUrl 只取
  模板内的脚本）；
- 组件 tag 缺省由文件名推断（`myComp.html` → `my-comp`）；
- 页面 `export const parent` 声明继承链，app 嵌套路由据此保留公共父页。

### 生命周期与事件

- 组件：created → （shadow 渲染）→ ready → loaded（l-m/link 就绪后）；
- 页面：attached/detached/page-loaded/pageIsReady；父页 `routerChange`
  仅在嵌套路由公共段触发；o-app 派发 `router-change` DOM 事件。

## 五、与旧版（old/packages/ofa，4.7.7）的差异

1. **ofa-error 移除**：错误码表本地化（src/error.mjs，复用 xhear 的
   XhearError）。
2. **app 的 lm 依赖显式化**：旧版 app.mjs 依赖 `window.lm` 全局（被禁的
   隐式耦合），现显式 `import lm from drill`。
3. **o-if/o-fill 适配新渲染管线**：xhear 重构后无 xtext/x-bind-data，
   o-if/o-fill 改为**按需编译 + 全局缓存**（compiledContents Map），
   经 `render({ template })` 走描述符快路径；标记节点为
   `<!--xt:...-->` 注释（innerHTML 包裹可存活）。
4. **xhear 编译步骤顺序调整**：afterConvert 钩子在 `__xt` 构建**之前**
   调用（wrapTemp 的结构变换必须先于路径构建）——这是 xhear 侧为 ofa
   的接缝做的配套调整。
5. waitPageReaded 优先复用页面自身的 `_rendered` Promise（旧版纯轮询）。
6. 其余行为（路由、页面继承、上下文、inject-host、match-var、
   draw-template 转译与 sourcemap）与旧版保持一致。

## 六、运行方式

- 测试：仓库根 `npm test`（playwright 自动起停 3348 静态服务器）；
- 手动预览：根 `npm run server` → `http://localhost:3348/packages/ofajs/test/statics/<页面>.html`；
- 测试 fixtures：`test/statics/fixtures/`（组件/页面/应用配置样例，
  script 必须在 template 内部）；
- **构建**：仓库根 `npm run build`（rollup，配置在根 `rollup.config.mjs`，
  用户 2026-10-10 确认的唯一打包例外）→ 根 `dist/` 四产物：
  `ofa.mjs`（ES）/ `ofa.js`（UMD，name "$"）/ `ofa.min.mjs` / `ofa.min.js`
  （min 版带 terser sourcemap）。产物暴露 `window.$`、`globalThis.ofa`、
  `exports.Stanz`，与旧版 dist 契约一致；**产物不手改，只由 build 生成**。
  冒烟页 `test/statics/dist-host.html` 以经典 script 引 `dist/ofa.js`，
  断言全局暴露、经典脚本注册组件渲染、包内 drill 完整加载 fixtures 组件。
- benchmark：`npm run bench:ofajs`（端口 3352，自动起停）。新旧分页
  A/B（两版都设 window.\$/globalThis.ofa 且注册 o-\* 元素，同页必冲突），
  场景：o-fill 初建/对账、o-if 切换、drawUrl 转译、fixRelate 修正、
  provider 广播。结论（chromium 156）：o-fill 批量对账 +63%、初建 +29%、
  转译 +6%，其余持平，零回退——对账/初建的领先主要继承自 xhear 新管线
  （createItem 描述符快路径），ofa 层自身的对账算法与旧版一致。
- 跨框架基准：`npm run bench:cross`（端口 3353，自动起停；首次先
  `node packages/ofajs/benchmark/fetch-cross-vendor.mjs` 下载框架文件到
  `vendor/cross/`，该目录不进仓库）。ofa.js（dist/ofa.min.js）vs
  Vue 3.5（vue.global.prod.js）vs React 18.3（UMD，19 起无 UMD），
  页面 `cross-ofajs|vue|react.html` 的行 DOM 结构与场景逻辑逐字一致，
  差异只在框架引导与数据操作惯用写法（o-fill fill-key / v-for :key /
  key+useState 不可变更新）；分场景独立页，一轮内三框架紧挨着采集，
  CDP 关 HTTP 缓存保证首屏冷加载，场景内行数断言自校验落定。
  2026-10 优化前基线（chromium 156，3 轮中位数）：列表运行时操作全面
  落后——交换 3020ms、追加 247ms、替换 128ms、部分更新 ×10 423ms
  （Vue/React 个位数到几十）。根因：① 任何深层 item 变更冒泡命中
  `hasModified("value")` → 整表 refreshView；② 逐位对账 indexOf + 每次
  移动后全量重算 keyVals，O(n²) 且单次交换级联 ~n/2 次 DOM 移动。

  2026-10 优化后（fill 结构判定 + LIS 对账 + 轻量行上下文 + $index
  条件写 + 撤销整批化 + 绑定级依赖过滤 + stanz 发射热路径，同机同法
  3 轮中位数）：交换 3020→120ms（反超 React 的 227，仍落后 Vue 99）、
  部分更新 ×10 421→93ms（Vue/React 约 48-51，已入同一量级）、整体
  替换 128→41ms、批量删 100 行 53→20ms（反超 Vue 的 33）、清空 2000
  行 35→16ms、追加 1000 行 247→39ms；建 1000 行 38→34ms、首屏 69ms
  变化不大（差在模块图执行与元素注册，与列表对账无关）。与 Vue/React
  仍落后的：建表/追加（约 6 倍，卡在每行 clone+绑定装配的底价）、
  部分更新（约 2 倍）、清空（Vue 4ms 的纯卸载仍最快）；交换与批量删
  已反超 Vue 或 React。依赖过滤后实测：批量卸载只占清空耗时约 25%、
  闭包瘦身可省约 1-2ms/千行——继续优化的收益已低于复杂度成本，建表
  装配路径的再压缩需要更深层编译期方案，暂封顶。

## 七、用例覆盖表（自检页 → 覆盖点）

| 自检页 | 覆盖点 |
|---|---|
| comp.html | 组件文件加载注册（tag 推断）、temp 数据绑定、proto 方法、loaded 钩子、PATH 相对资源解析、同名 tag 重复注册报错；**old cases 移植**：模块加载暴露全局 \$、import 与注释/字符串/正则混排转译、压缩单行组件、副作用 import、仅注释空模板（不挂 shadow）、第三方覆盖 window.\$ 后组件仍工作 |
| if-fill.html | o-if/o-else-if/o-else 链切换；o-fill 初建（\$data/\$index/\$host）、项内 o-if、push/splice 增删、fill-key 对账复用、清空；**old cases 移植**：空构造与深克隆零崩溃（#258）、o-if 嵌套链（else 包 if）、o-fill 在 o-if 内、o-fill 嵌套 o-fill、\`_\$parent\`/\$parent/\$host、递归命名模板、空对象/数组文本渲染（{} 与 []） |
| app.html | 配置加载 + home 自动挂载（appIsReady）、goto、back、router-change 事件、olink 点击路由、forward（allowForward）、页面继承（parent 包裹）；**old cases 移植**：watchUntil 等 appIsReady、.mjs 页面模块（PAGE 类型 + 外置 temp）、页面相对 img 改写（直写/条件/命名模板三处）、动态 attr:href 的 olink 读实时地址（fix-link）、离场旧页尺寸锁定（resetOldPage） |
| context.html | provider 数据广播（attributes → 数据）、更新广播、dispatch 定向事件、作用域隔离、root provider 应用级提供 |
| misc.html | inject-host 收编（光 DOM 生效 + head 去重）、match-var 样式收集；**old cases 移植**：style 内 data() 响应式（含 @media 同式多处替换）、条件注入样式的 data() |
| dist-host.html | dist 构建产物冒烟：经典 script 引 UMD 包、全局 \$/ofa 暴露与版本号、经典脚本注册组件渲染、包内 drill 完整加载组件（l-m → drawUrl → 注册） |

old/test/cases 27 个疑难案例的归口（2026-10 移植）：
render-src → app.html（olink 相对地址由既有 olink 用例覆盖）；
import-comment / import-module / mini-import → comp.html；
empty-temp / sub-empty-data-type / parent-in-fill / fill-in-temp /
o-if-clone / oif-hybird-ofill → comp.html 与 if-fill.html；
relate-img / relate-page / fix-link / old-page-size / app-is-ready → app.html；
style-data / container-style → misc.html（match-var 多层槽穿透由既有
match-var 用例覆盖主干）；forward / o-if / o-fill / context / inject-host
迁移期已覆盖。no-conflict 与 table-fill-case 为空/手动页：no-conflict 的
本质（组件运行时不依赖 window.\$）已入 comp.html，table-fill-case 为空目录。
其中 empty-temp 旧 spec 的 shadowRoot 断言与 o-if-clone 旧 spec 的
"克隆保留子元素"断言与新旧实现实际行为都不符（旧 spec 本身跑不起来，
querySelector 落不到 shadow 内），移植时按真实契约改写。alias /
alias-page 两个案例不移植：@ 别名体系是用户明确决策删除的（两次确认，
见 drill CONTEXT 踩坑第 3 条），页面用完整相对/绝对路径即可。

## 八、踩坑

### tr/td 无法内联进任何包装元素（平台铁律，select/table 的正确姿势）

**症状**：`<table><tbody><template is="replace-temp"><o-fill><tr>...</tr></o-fill>
</template></tbody></table>` 渲染后行消失，只剩 `{{}}` 渲染出的裸文本。

**根因**：HTML 解析器的 body 规则会在任何包装元素（o-fill/o-if/div/自定义元素）
内直接丢弃 tr/td，只把文本提升到包装元素里——replace-temp 的 template.content
也救不了（"in template" 模式只在 template 根层级放行表格系标签）。这是平台约束，
React/Vue 同样绕不过。

**正确姿势**：
- **表格行**：tr 声明在顶层命名模板，o-fill 经 replace-temp 引用——
  `<tbody><template is="replace-temp"><o-fill :value="rows" name="row"></o-fill>
  </template></tbody>` + `<template name="row"><tr>...</tr></template>`（与旧版
  fill-table 用例同构，x-fill → o-fill 即可）；
- **select**：option 是 body 合法内容，`replace-temp + o-fill` 内联 option 即可
  （实测 option 收集与中间包装元素兼容，chromium/webkit/firefox 均验证）；
- **条件行**：tr 无法内联进 o-if，惯用法 `o-fill :value="show ? rows : []"`；
  条件单元格（td 内 o-if）无限制。

用例钉在 if-fill.html 的 demo-replace 组件（3 项检查）。

### wrapTemp 禁止 innerHTML 往返（防御性约定）

`wrapTemp` 曾用 `e.innerHTML = "<template inner-code>" + e.innerHTML` 包裹内容。
innerHTML 的解析受上下文元素影响，凡未来出现"内容在原位置合法、在 o-if/o-fill
上下文不合法"的标签都会被静默丢弃。已改为 moveChildren 纯 DOM 搬运（moveChildren
已从 xhear compile.mjs 导出）；新增结构变换一律走纯 DOM，不做序列化往返。

### render 的 catch 块不得引用 try 作用域变量

快速路径绑定循环的 catch 曾引用 try 内声明的 `key`——若错误发生在声明之前，
catch 自身的 ReferenceError 会掩盖真实错误（排查 replace-temp 问题时当场发生）。
catch 内一律使用循环变量（`item.key`）或外层作用域变量。


### `<script>` 写在 template 外会被静默丢弃

**症状**：组件/页面文件加载成功、temp 渲染了静态内容，但 data/proto/
loaded 全部缺失，无任何报错。

**根因**：drawUrl 只从 `template[component|page]` **内部**取 `<script>`；
写在模板外的脚本不在 targetTemp 子树内，`targetTemp.$("script")` 返回
null，生成的模块只有 temp/type 两个导出。

**正确姿势**：script 放在 template 内部（官方文档形态）。测试 fixtures
最容易踩——写完后核对生成的模块是否含 `export default`。

### 嵌套条件/列表内层指令静默失活（递归编译剥属性）

**症状**：o-if 内 o-fill、fill 项内再嵌 o-if 的场景，内层指令（`:value`
等）失效、元素裸渲染。

**根因**：o-if 的 origin 字符串天然包含 o-fill 的 `<template inner-code>`
包装；getCompiledContent 再解析时，compile 的递归编译把字符串里自带的
inner-code 模板也编译了，extractDirectives 把属性剥进无人消费的描述符。

**正确姿势**：递归编译用 `template:not([inner-code])` 跳过内容保护层
（xhear compile.mjs 已修，详见 xhear CONTEXT 踩坑）。

### x- 系元素已移除（v5 起统一 o- 语法）

x-if/x-else-if/x-else/x-fill 不再注册；模板中出现会在控制台报弃用错
（编译期扫描 + stub 元素升级两条检测路径，见 xhear deprecated.mjs）。
o-if/o-fill 的实现已下沉 xhear（xhear v9），ofajs 不再有 if.mjs/fill.mjs。

### o-consumer 的 light children 不参与编译

**症状**：consumer 的 light 子元素里写 `{{xxx}}` 不随 provider 数据更新。

**根因**：consumer 的 light children 是页面原始 DOM，不经任何编译；
provider 数据镜像在 consumer 元素的**数据属性**上。

**正确姿势**：断言/使用 consumer 数据用 `ofa(consumer).color`；要在视
图里展示时，把 consumer 数据绑定到宿主编译范围内的指令上（如
consumer 元素的 `:attr` 绑定）。
