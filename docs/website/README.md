# ofa.js 官网

`docs/website/` 是 ofa.js 的静态官网。页面本身用 ofa.js 编写，运行时不需要
打包或任何第三方运行时；多语言、多页面内容由 `npm run build:website` 做
纯文件组装。

官网采用「共享外壳 + 分语言内容」结构：

- 顶部导航、底部、背景、教程侧栏、主题样式、启动器放在 `docs/website/`
  的共享目录；
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
│       ├── site.json                文案、导航/页脚/教程标签、页面元信息
│       └── tutorial/
│           ├── index.html           教程首页
│           ├── usage.html           如何使用 ofa.js（引用 script）
│           └── template.html        使用模板渲染
└── website/                         共享资源 + 构建产物
    ├── index.html                   构建生成的根语言选择页
    ├── boot.js                      共享启动器：ofa.js → scsr
    ├── app.mjs                      共享 o-app 配置（不声明 home）
    ├── assets/favicon.svg
    ├── components/
    │   ├── site-shell.html          顶部/底部/背景外壳
    │   ├── tutorial-layout.html     教程侧栏 + 文档内容布局
    │   └── demo-counter.html        首页响应式计数器组件
    ├── content/
    │   └── page-runtime.mjs         首页/教程页共享运行时
    ├── styles/
    │   ├── site.css                 首页与通用设计系统
    │   ├── shell.css                导航/页脚/背景样式
    │   └── tutorial.css             教程文章排版
    ├── templates/
    │   ├── locale-page.html         单页 SCSR 文档模板
    │   └── root-index.html          根语言选择页模板
    └── cn/                          构建产物，勿手改
        ├── index.html
        ├── site.json
        └── tutorial/
            ├── index.html
            ├── usage.html
            └── template.html
```

> 注意：`docs/origin/<locale>/*.html` 是页面模块源文件（`template[page]`），
> `docs/website/<locale>/*.html` 是构建后的完整 SCSR 文档。两者路径同名、
> 职责不同，不要直接互换。

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
6. 生成根语言选择页；
7. 读取 `docs/website/.locales.json` 清理已删除语言的旧产物。

路径映射是一对一的：

```text
docs/origin/cn/index.html              → docs/website/cn/index.html
docs/origin/cn/tutorial/usage.html     → docs/website/cn/tutorial/usage.html
docs/origin/cn/site.json               → docs/website/cn/site.json
```

构建是幂等的，可重复执行。`docs/website/cn/` 全部是生成物，不要直接修改。

## 页面元信息

`site.json` 里的 `pages` 保存非首页页面的 SEO 信息，key 是相对语言目录的
路径：

```json
{
  "pages": {
    "tutorial/index.html": {
      "title": "ofa.js 教程",
      "description": "..."
    },
    "tutorial/usage.html": {
      "title": "如何使用 ofa.js（引用 script） — ofa.js 教程",
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
- 教程：http://localhost:3348/docs/website/cn/tutorial/

不要直接双击 `index.html` 打开——SCSR 页面、`o-page` 与 `site.json` 的加载
需要 HTTP 环境，`file://` 会被浏览器模块 CORS 策略拦截。

## 新增 / 翻译语言

以英语为例：

1. 复制 `docs/origin/cn/` 为 `docs/origin/en/`；
2. 翻译所有 HTML 页面（首页与 `tutorial/` 下的文章），只改文字，保留标签、
   `id`、`class`、指令与 `{{SITE}}` / `{{LOCALE}}` 占位符；
3. 翻译 `site.json` 的 `meta`、`shell`、`tutorial`、`pages`、`demo` 与
   `toast` 文案，并把 `meta.lang` 改为 `en`、`meta.language` 改为 `English`；
4. 可选的 `meta.order` 控制语言在根选择页中的排序（数字越小越靠前）；
5. 执行 `npm run build:website`。

构建会生成 `docs/website/en/`，并把根语言选择页更新为两种语言。
删除 `docs/origin/en/` 后重新构建，旧的 `docs/website/en/` 会被清理。

### 翻译时不要动的内容

- `<template page>`、`<site-shell>`、`<tutorial-layout>`、`<l-m>`、`<link>`、
  `<script>` 等结构；
- 页面底部 `<script>` 里的 `createLandingPage` / `createTutorialPage`
  引入、`sitePath` 与 `export default`；
- `{{SITE}}` / `{{LOCALE}}` 占位符；
- `site-shell` / `tutorial-layout` 上以 `attr:` 开头的绑定；
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
- 当前站点有首页 + 教程三页，共四份真实路径 HTML，站内跳转不会整页刷新。

## 教程模式

- `components/tutorial-layout.html` 提供左侧文章列表 + 右侧内容插槽；
- `styles/tutorial.css` 提供文章排版、代码块、提示块与教程首页卡片样式；
- 教程入口 `/cn/tutorial/` 由 `origin/cn/tutorial/index.html` 生成；
- 两篇文章分别是 `usage.html`（引用 script）与 `template.html`（模板渲染）；
- 导航栏的「教程」项指向教程入口；侧栏在文章之间用真实路径跳转。

新增文章：

1. 在 `docs/origin/<locale>/tutorial/` 复制一篇文章页面模块，改标题与正文；
2. 在 `site.json` 的 `pages` 里补该路径的 title/description；
3. 在 `site.json` 的 `tutorial.articles` 加标签；
4. 在 `tutorial-layout.html` 的侧栏加一项，并在 `tutorial/index.html`
   加一张入口卡片（如需要）；
5. 重新执行 `npm run build:website`。

## 首屏展示的接入方式

首页 Hero 与结尾 CTA 以「CDN · v5 / ESM」卡片展示 v5 的 mjs 地址，点击复制
按钮即可把完整地址写入剪贴板：

```
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs
```

Quick Start 第一步展示完整的 `<script type="module">` 引用。页面不再提供
npm 安装命令，CDN 地址是主要使用方式。

## 共享外壳与内容的关系

- `components/site-shell.html` 内部通过 `<slot>` 接收各语言页面的内容；
  导航、页脚、背景只维护一份。
- 导航与页脚文案通过 `site.json → site.shell` 以 `attr:` 绑定传入。
- `styles/site.css` 通过页面内 `<link>` 加载到页面 shadow；`styles/shell.css`
  由外壳组件自己加载；教程页额外加载 `styles/tutorial.css`。
- 导航的首页、教程、语言入口等 URL 由页面运行时按当前页面地址计算成绝对
  地址后传入组件，避免组件内相对路径以组件文件为基准解析。
- 待办演示、复制、滚动渐入等交互由 `content/page-runtime.mjs` 提供；教程页
  复用其中的 `createTutorialPage`。
