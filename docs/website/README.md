# ofa.js 官网

`docs/website/` 是 ofa.js 的静态官网。页面本身用 ofa.js 编写，运行时不需要
打包或任何第三方运行时；多语言、多页面内容由 `npm run build:website` 做
纯文件组装。

官网基础 UI 采用 **Material Design 3**（蓝色主色、24px 大圆角、
M3 状态层与 Motion easing），默认深色，顶部可切换白天 / 黑夜 / 跟随系统。形状、阴影和动效走 `site.css` / `shell.css`
里的 `--md-sys-shape-*` / `--md-sys-elevation-*` / `--md-sys-motion-*` 变量；
**颜色全部来自 Senti-UI 的颜色体系**：`templates/*.html` 在 `<head>` 引入
`st-boot.js`（senti-ui 颜色初始化，首帧同步注入 `--md-sys-color-*`，
默认种子色 `#0061A4`），官网自身不再手写任何颜色 token。首次访问默认
`st-theme-mode=dark`，用户可在顶部切换为白天、黑夜或跟随系统；切换结果
持久化到 `localStorage`。

官网采用「共享外壳 + 分语言内容」结构：

- 顶部/底部与文档侧栏通过嵌套路由 layout 常驻（`layout.html`），
  主题样式、启动器放在 `docs/website/` 的共享目录；
- 每个语言的页面放在 `docs/origin/<locale>/`，只包含页面结构与文案；
- `npm run build:website` 把 `docs/origin/<locale>/` 组装到
  `docs/website/<locale>/`，路径一一对应；
- 生成页面使用 **scsr**：每份 HTML 既是可直接访问的真实文档，也是 scsr
  收编的页面模块源文件。

## 目录结构

```
docs/
├── origin/                          语言源文件（翻译/编辑入口）
│   └── cn/
│       ├── index.html               首页页面模块（结构 + 文案）
│       ├── site.json                文案、导航/页脚/文档标签、页面元信息
│       ├── docs/                    文档（24 页）
│       │   ├── index.html           文档总览
│       │   ├── getting-started.html 安装与引入
│       │   ├── component.html       组件与页面
│       │   ├── template.html        模板语法
│       │   ├── routing.html         应用与路由
│       │   ├── api.html             $.fn 与包装对象
│       │   └── ...                  其余章节见 site.json 的 docs.nav
│       ├── api/                     API 参考（11 页）
│       │   ├── index.html           分组总览
│       │   ├── instance.html        实例基础
│       │   ├── traverse.html        选择与遍历
│       │   ├── structure.html       结构操作
│       │   ├── props.html           内容、属性与样式
│       │   ├── events.html          事件
│       │   ├── reactive.html        数据与侦听
│       │   ├── context.html         上下文通信
│       │   ├── global.html          全局 $ 静态成员
│       │   ├── extend.html          扩展实例
│       │   └── app.html             o-app 与 o-page
│       └── tutorial/                交互式教程（21 页）
│           ├── index.html           教程总览
│           └── lesson-1..20.html    二十节可编辑示例课
└── website/                         共享资源 + 构建产物
    ├── index.html                   构建生成的根语言选择页
    ├── boot.js                      共享启动器：ofa.js → scsr
    ├── app.mjs                      共享 o-app 配置（不声明 home）
    ├── sw.js                        NoneOS Core Service Worker（/$ 虚拟容器）
    ├── assets/favicon.svg
    ├── assets/logo.svg
    ├── components/
    │   ├── site-shell.html            顶部/底部/背景外壳
    │   ├── docs-layout.html           文章正文 + 右侧本页目录
    │   ├── code-editor.html          通用 VSCode 风格编辑器（行号/高亮/折叠）
    │   ├── playground.html            案例预览：编辑器 + 虚拟容器 iframe
    │   └── demo-counter.html          首页响应式计数器组件
    ├── content/
    │   ├── page-runtime.mjs           首页/文档/API 共享运行时
    │   ├── highlight.mjs              文档代码高亮（零依赖 tokenizer）
    │   ├── playground-runtime.mjs     教程案例默认代码与虚拟页面入口
    │   └── api-examples.mjs           API 各页的可运行示例
    ├── styles/
    │   ├── site.css                   首页与通用设计系统
    │   ├── shell.css                  导航/页脚/背景样式
    │   ├── docs.css                   文档文章排版
    │   └── loading.css                首屏/路由 loading 共享样式
    ├── templates/
    │   ├── locale-page.html         单页 SCSR 文档模板
    │   ├── layout-page.html         嵌套路由 layout（header/footer + 文档目录 + slot）
    │   └── root-index.html          根语言选择页模板
    └── cn/                          构建产物，勿手改
        ├── layout.html              嵌套路由 layout（header/footer + 文档目录）
        ├── index.html
        ├── site.json
        ├── docs/                    构建产物（24 页）
        │   ├── index.html
        │   ├── getting-started.html
        │   ├── component.html
        │   ├── template.html
        │   └── ...
        ├── api/                     构建产物（11 页）
        │   ├── index.html
        │   └── instance.html ... app.html
        ├── search-index.json        构建生成的站内搜索索引
        └── tutorial/                构建产物（21 页）
            ├── index.html
            └── lesson-1.html ... lesson-20.html
```

> 注意：`docs/origin/<locale>/*.html` 是页面模块源文件（`template[page]`），
> `docs/website/<locale>/*.html` 是构建后的完整 SCSR 文档。两者路径同名、
> 职责不同，不要直接互换。

品牌标识统一使用 `docs/website/assets/logo.svg`（ofa.js 官方红黄标志），
`favicon.svg` 由同一图形生成；header、footer 与根语言页都引用该文件，
不要再手绘替代图标。

## 构建

```bash
npm run build:website
```

脚本只使用 Node 内置模块：

1. 扫描 `docs/origin/*/site.json`，校验 `meta.lang/language/title/description`；
2. 把语言目录复制到 `docs/website/<locale>/`（保留资源与目录结构）；
3. 遍历所有 HTML 页面模块，读取 `<template page>` 内部内容；
4. 把源文件里的 `{{SITE}}`（共享资源根）与 `{{LOCALE}}`（语言目录根）
   替换成当前页面深度对应的路径；
5. 读取 `site.pages[相对路径]`（首页回退到 `meta`）得到该页 title/description，
   用 `templates/locale-page.html` 生成完整 SCSR 文档，写回同路径；
6. 为每个语言生成 `layout.html`：所有内容页通过
   `export const parent = "…/layout.html"` 挂到这个父页的 `<slot>` 下；
7. 生成根语言选择页；
8. 读取 `docs/website/.locales.json` 清理已删除语言的旧产物。

路径映射是一对一的：

```text
docs/origin/cn/index.html              → docs/website/cn/index.html
docs/origin/cn/docs/getting-started.html → docs/website/cn/docs/getting-started.html
docs/origin/cn/site.json               → docs/website/cn/site.json
```

构建是幂等的，可重复执行。`docs/website/cn/` 全部是生成物，不要直接修改；
公共的 loading 外观、导航、主题、搜索都放在 `styles/`、`components/`、
`templates/` 中，改一处后重新构建即可，不要逐个编辑生成页。

## 页面元信息

`site.json` 里的 `pages` 保存非首页页面的 SEO 信息，key 是相对语言目录的
路径：

```json
{
  "pages": {
    "docs/index.html": {
      "title": "ofa.js 文档",
      "description": "..."
    },
    "docs/getting-started.html": {
      "title": "安装与引入 — ofa.js 文档",
      "description": "..."
    }
  }
}
```

新增页面时同步补一条 `pages` 记录；否则构建会报错并指出缺少哪个文件的
元信息。

## 本地预览

在仓库根目录启动静态服务器：

```bash
npm run server
```

- 根语言选择页：http://localhost:3348/docs/website/
- 中文首页：http://localhost:3348/docs/website/cn/
- 文档：http://localhost:3348/docs/website/cn/docs/

如果只想预览官网构建产物，可以直接以 `docs/website` 为服务根目录：

```bash
npm run server:website
```

- 根语言选择页：http://localhost:3348/
- 中文首页：http://localhost:3348/cn/
- 文档：http://localhost:3348/cn/docs/

两个脚本默认都用 3348 端口，同时只能启动一个；需要并存时用
`PORT=4000 npm run server:website` 指定其他端口。

不要直接双击 `index.html` 打开——SCSR 页面、`o-page` 与 `site.json` 的加载
需要 HTTP 环境，`file://` 会被浏览器模块 CORS 策略拦截。

## 新增 / 翻译语言

以英语为例：

1. 复制 `docs/origin/cn/` 为 `docs/origin/en/`；
2. 翻译所有 HTML 页面（首页与 `docs/` 下的文章），只改文字，保留标签、
   `id`、`class`、指令与 `{{SITE}}` / `{{LOCALE}}` 占位符；
3. 翻译 `site.json` 的 `meta`、`shell`、`docs`、`pages`、`demo` 与
   `toast` 文案，并把 `meta.lang` 改为 `en`、`meta.language` 改为 `English`；
4. 可选的 `meta.order` 控制语言在根选择页中的排序（数字越小越靠前）；
5. 执行 `npm run build:website`。

构建会生成 `docs/website/en/`，并把根语言选择页更新为两种语言。
删除 `docs/origin/en/` 后重新构建，旧的 `docs/website/en/` 会被清理。

### 翻译时不要动的内容

- `<template page>`、`<site-shell>`、`<docs-layout>`、`<l-m>`、`<link>`、
  `<script>` 等结构；
- 页面底部 `<script>` 里的 `createLandingPage` / `createDocsPage`
  引入、`sitePath` 与 `export default`；
- `{{SITE}}` / `{{LOCALE}}` 占位符；
- `site-shell` / `docs-layout` 上以 `attr:` 开头的绑定；
- 页面里的 `id`（`top`、`features`、`demo`、`start`、`ecosystem`）；
- `on:click`、`olink`、`sync:`、`class:`、`attr:` 等 ofa.js 指令；
- 代码示例中的 `<`、`>`（必须保持 `&lt;` / `&gt;` 转义）。

正文之外的可视文案都在 `site.json`，不要在各组件里硬编码翻译。

## 框架加载策略

`docs/website/boot.js` 先加载 ofa.js，再加载 scsr，两者都是
**CDN 优先、本地产物兜底**：

1. CDN：`.../v5/dist/ofa.min.mjs`、`.../v5/packages/scsr/dist/scsr.min.mjs`
2. 本地：`../../dist/ofa.min.mjs`、`../../packages/scsr/dist/scsr.min.mjs`

这样部署时不用上传框架源码或 dist，所有路径也不会先产生本地 404；
断网开发时仍可回退仓库构建产物。两者都失败时会显示错误提示。
`docs/website/boot.js` 与 `app.mjs` 被所有语言入口共用。

## SCSR 约定

- 每个生成页面都是完整文档：
  `<o-app src="…/app.mjs"><template page>…</template></o-app>`；
- `app.mjs` **不声明 home**：当前 URL 的 HTML 就是页面，由 scsr 收编为
  `<o-page src>`；
- scsr 接管后会移除内联 `<template page>`（服务器上的同一份 HTML 不受影响），
  地址保持真实路径；
- 站内跳转用 `olink` 或 `goto()`，刷新、分享、直接粘贴地址都能直达；
- 当前站点有首页 1 页 + 文档 24 页 + API 11 页 + 教程 21 页，共 57 份内容页 HTML，另有共享的
  `layout.html`；站内跳转不会整页刷新；
- `layout.html` 常驻 header/footer；进入文档路由时再展开左侧文档目录
  （同一 layout 的 docs 区域），文章页与文档首页只负责 slot 内容；
- 切换文档文章时 layout 不销毁，只有文章子页参与过渡；首页与文档之间
  切换也不重建 layout；
- 站点 layout 通过 `routerChange` 更新 `docsMode`、文档高亮和滚动位置；
  布局模式在 `data` 初始化时就按 `location.pathname` 推导一次（不能只等
  `attached`），否则首帧会以 `no-nav` 整行铺开、随后才跳进左侧目录列；
  `site-shell` 监听 `router-change` 同步「文档」高亮与移动菜单状态。

## 文档模式

- 站点 layout 的文档区域使用 Senti-UI 的 `st-list` /
  `st-list-item` 做左侧目录：分组自带折叠动画，当前文章用蓝色文字 +
  下划线标记；该目录在文档页之间常驻；
- 首页与内容页的按钮类 UI 同样使用 Senti-UI：`st-button` /
  `st-icon-button`（hero CTA、复制按钮、待办演示、CTA 区、
  `demo-counter` 计数按钮）。页面与组件各自通过 CDN `l-m` 引入
  `senti-ui/packages/button/button.html` 与 `button/icon-button.html`；
  颜色沿用站点自有的 `--md-sys-color-*` token（CSS 变量沿 shadow 边界
  继承），外观微调（尺寸/圆角）仍写在 `site.css` / `shell.css` 里，不新增
  构建步骤；
- 首页代码窗口（hero、bento 卡片、Quick Start 三步）使用 Senti-UI 的
  `st-code`（`frame` 模式：圆点 / 文件名 / 内置复制），通过 CDN `l-m`
  引入 `senti-ui@main/packages/code/code.html`（`packages/code` 尚未进
  正式发布版本，需锁定 `@main`）。注意坑：代码样例里的 `{{name}}`
  必须作为字符串放进 `page-runtime.mjs` 并用 `:code` 绑定——写在
  `<textarea>` / 文本节点里会被 ofa 模板引擎当插值编译吞掉
  （`<pre>`/`<code>` 文本节点是例外，ofa 不编译，但 st-code 不走这条路）；
- `components/docs-layout.html` 只负责文章正文 + 右侧「本页内容」；
- 文档采用 MDN 式三栏：260px 目录 + 800px 正文 + 220px「本页内容」，
  不再用卡片包裹正文；
- 站点 layout 通过 CDN `l-m` 引入 `senti-ui/packages/list/list.html`，
  不增加构建步骤；
- `styles/docs.css` 提供 MDN 式文章排版：40px h1、32px h2、
  16px body、M3 代码块与文档首页列表；侧栏通过 `--st-list-item-height`
  等变量压缩为 32px 行高；
- `content/highlight.mjs` 用零依赖 tokenizer 给文档里的
  `pre code` 上色（HTML 标签 / JS 关键字 / 字符串 / 注释 / 数字 /
  `{{}}` 表达式），不引入第三方高亮库；
- 文档页切换时由 layout 的 `docsMode` 驱动 `site-shell` 的 `variant`：
  自动隐藏顶部 CTA，保留文档导航；
- 文档入口 `/cn/docs/` 由 `origin/cn/docs/index.html` 生成；
- 文档按「开始使用 / 组件与页面 / 模板语法 / 数据与状态 / 应用与路由 / 参考」
  六组组织，完整清单在 `site.json` 的 `docs.nav`；
- 导航栏的「文档」项指向文档入口；侧栏在文档页之间用真实路径跳转。
- 顶部导航还有「API」，进入 `/cn/api/`；API 页面同样挂到 `layout.html`，
  通过路径里的 `/api/` 切换 API 侧栏。

新增文章：

1. 在 `docs/origin/<locale>/docs/` 复制一篇文章页面模块，改标题与正文，
   并保留 `export const parent = "{{LOCALE}}/layout.html";`（挂到站点 layout）；
2. 在 `site.json` 的 `pages` 里补该路径的 title/description；
3. 在 `site.json` 的 `docs.nav` 对应分组里加标签，并在
   `templates/layout-page.html` 的左侧目录加一项；
4. 在 `docs/index.html` 视需要加入口；
5. 重新执行 `npm run build:website`。

## 站内搜索

- `scripts/build-website.mjs` 在构建每个语言时，会把所有页面的标题、描述、
  `h2/h3` 标题和正文提取成 `docs/website/<locale>/search-index.json`；
- 顶部导航的搜索框（`site-shell`）在首次聚焦/输入时加载该索引，
  在本地做模糊匹配，结果按标题、标题层级、描述、正文依次加权；
- 结果显示页面标题、类型（文档 / 教程 / API / 首页）和匹配片段，
  点击用应用路由跳转；支持方向键和 Enter，移动端点击搜索图标展开；
- 跳转 URL 带 `?search=...`，目标页由 `createLayoutPage` 在内容渲染后
  高亮所有匹配文本（优先 CSS Custom Highlight，降级为 `mark`），
  必要时滚动到第一个匹配处；
- 搜索完全静态，不需要后端；新增页面重新执行 `npm run build:website`
  即可刷新索引。搜索文案在 `site.json` 的 `shell.search` 中维护。

## 主题模式

顶部导航右侧的主题按钮提供「白天模式 / 黑夜模式 / 跟随系统」三项，
状态写入 `localStorage["st-theme-mode"]`（`light` / `dark` / `auto`）：

- `light` / `dark` 在 `<html>` 上挂 `st-light` / `st-dark`；
- `auto` 不挂类，交给 senti-ui 的 `prefers-color-scheme` 媒体查询；
- 首次访问仍默认深色，用户选择后会持久化；
- `st-boot.js` 在首帧前同步恢复模式，避免刷新时闪色；
- 首屏与路由 loading 的颜色、进度条、字标都使用主题 token，
  白天模式下不会出现深色遮罩；
- 文案在 `site.json` 的 `shell.theme` 中维护。

## API 模式

- 顶部导航「API」指向 `/cn/api/`，与「教程」「文档」并列；
- API 页挂到 `layout.html`，`apiMode` 控制左侧 API 分组目录；
- 每个 API 页顶部都有 `docs-playground`，示例来自
  `content/api-examples.mjs`（按 `example` 名索引），改代码后
  Ctrl/⌘+S 或「运行代码」即可看效果；
- API 总览第一个示例使用 `entry: "raw"`：直接编辑一份普通
  `index.html`（body 里的目标元素 + `script type="module"`），
  不经过 page 模块，专门演示非模板方式下像 jQuery 一样用全局 `$` 操作 body；
- API 页使用 `docs-layout layout="wide"`，不显示右侧「本页内容」，
  内容与编辑器撑满内容列；
- 新增 API 页：在 `origin/<locale>/api/` 加页面模块、在
  `site.json.pages` 补元信息、在 `layout-page.html` 的 API 侧栏加项，
  再在 `api-examples.mjs` 里补 `example` 示例。

## 首屏加载

`templates/locale-page.html` 在 body 最前面输出 `#site-loading` 遮罩：
慢网络下先显示居中的旋转指示器和「正在加载页面…」，避免直接看到空白。
`boot.js` 加载完 ofa.js / scsr 后等待 `o-app.appIsReady`，首个页面渲染完成才
淡出并移除遮罩；30 秒兜底。JS 禁用时通过 `<noscript>` 隐藏遮罩。

站内路由切换时，`app.mjs` 的 `loading` 返回固定在顶部的 3px 进度条，
不遮挡当前页面；它延迟 120ms 才显现，快网络下不会闪烁，慢网络下会一直
流动到新页面数据加载完成。

## 首屏展示的接入方式

首页 Hero 与结尾 CTA 以「CDN · v5 / ESM」卡片展示 v5 的 mjs 地址，点击复制
按钮即可把完整地址写入剪贴板：

```
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs
```

Quick Start 第一步展示完整的 `<script type="module">` 引用。页面不再提供
npm 安装命令，CDN 地址是主要使用方式。

## 教程模式

- 顶部导航「教程」指向 `/cn/tutorial/`，与「文档」并列；
- 教程页同样挂到 `layout.html`，layout 通过路径里的
  `/tutorial/` 切换出教程侧栏；
- 课程页复用 `docs-playground`，通过 `lesson` 属性选择默认代码；
  一课可以包含多个文件（页面 / 组件 / store / 路由配置），用编辑器标签页切换，
  并分别用 `localStorage` 保存每一课的文件修改；
- 教程页使用 `docs-layout layout="wide"`：隐藏右侧「本页内容」，
  把正文与 playground 撑满内容列；编辑器和预览之间可拖动分隔条调整宽度；
- 教程内容：总览 + 20 节课，按「入门 / 交互与状态 / 组件 / 应用与实战」
  四组组织，左侧目录同步分组。

## 案例预览（NoneOS 虚拟容器）

`/cn/docs/playground.html` 提供一个在线演练场，完全运行在浏览器本地：

1. `components/playground.html` 首次打开时注册站点根路径的 `sw.js`
   （内容只有一行 `importScripts("https://core.noneos.com/sw/dist.js")`）；
2. 编辑器直接通过 `navigator.storage.getDirectory()` 打开 OPFS 的
   `ofa-docs-playground` 空间；
3. 编辑器当前课的所有文件（`page.html`、组件、`app.mjs` 等）写入虚拟
   目录；页面课生成 `<o-page>` 入口，应用课生成 `<o-app>` 入口；
4. iframe 加载 `/$ofa-docs-playground/index.html`，Service Worker 把
   `/$...` 路径映射到 OPFS 文件；
5. 每个课程的文件内容保存在 `localStorage`，刷新后保留；「重置」恢复本课示例。

编辑器拆成通用组件 `components/code-editor.html`，`docs-playground` 只负责
多文件标签、虚拟容器和预览。`code-editor` 对外提供 `value` 属性与
`change` / `cursor` / `run` 事件，可以脱离 playground 单独复用。

编辑器支持文件标签页、行号、HTML/JS/CSS 语法高亮、`Tab` 缩进、回车自动
缩进；`Ctrl/Cmd + S` 或 `Ctrl/Cmd + Enter` 运行；编辑器和预览之间的分隔条
可拖动调整宽度。点击行号左侧的三角可折叠 HTML 标签块；折叠状态是只读视图，仍会显示
开始标签和对应的闭合标签，点击 `▸` 或「展开全部并编辑」恢复。它用 textarea + 高亮层叠加实现，
不引入第三方编辑器依赖。

`code-editor` 的 `fold` 属性接收逗号分隔的标签名（如 `fold="style"`），
载入文件时自动折叠这些标签块；`docs-playground` 用 `fold-styles="true"`
透传该能力。教程默认开启（第 4 课「样式与 class」例外，方便直接看样式），
折叠后点行号左侧 `▸` 展开单个区块，或点「展开全部并编辑」进入编辑。

预览栏的「新标签打开」会直接打开当前虚拟页面
`/$ofa-docs-playground/index.html?v=...`，由 Service Worker 继续提供
OPFS 文件。

注意：

- Service Worker 必须注册在站点根路径，**docs 需要部署在域名根路径**；
  本地请用 `npm run server:website`（以 `docs/website` 为根）预览；
- 预览 iframe 通过 CDN 加载 ofa.js，离线时只有演练场不可用，不影响文档正文；
- 没有后端参与，文件只存在于当前浏览器的 OPFS 中。

## 共享外壳与内容的关系

- `components/site-shell.html` 内部通过 `<slot>` 接收各语言页面的内容；
  导航、页脚、背景只维护一份。
- 导航与页脚文案通过 `site.json → site.shell` 以 `attr:` 绑定传入。
- `styles/site.css` 通过页面内 `<link>` 加载到页面 shadow；`styles/shell.css`
  由外壳组件自己加载；文档页额外加载 `styles/docs.css`。
- 导航的首页、文档、语言入口等 URL 由页面运行时按当前页面地址计算成绝对
  地址后传入组件，避免组件内相对路径以组件文件为基准解析。
- 待办演示、复制、滚动渐入等交互由 `content/page-runtime.mjs` 提供；文档页
  复用其中的 `createDocsPage`。
