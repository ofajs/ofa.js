# ofa.js 官网

`docs/website/` 是 ofa.js 的静态官网。页面本身用 ofa.js 编写，运行时不需要
打包或任何第三方运行时；多语言内容由 `npm run build:website` 做纯文件组装。

官网采用「共享外壳 + 分语言内容」结构：

- 顶部导航、底部、背景、主题样式、启动器放在 `docs/website/` 的共享目录；
- 每个语言的中间内容放在 `docs/origin/<locale>/`，只包含文案与页面逻辑；
- `npm run build:website` 把 `docs/origin/<locale>/` 组装到
  `docs/website/<locale>/`，并生成根语言选择页；
- 生成的语言首页使用 **scsr**：每个 `index.html` 既是可直接访问的真实
  文档，也是 scsr 收编的页面模块源文件。

## 目录结构

```
docs/
├── origin/                       语言源文件（翻译/编辑入口）
│   └── cn/
│       ├── index.html            页面模块源文件（结构 + 文案）
│       └── site.json             文案、导航/页脚标签、SEO 元信息
└── website/                      共享资源 + 构建产物
    ├── index.html                构建生成的根语言选择页
    ├── boot.js                   共享启动器：ofa.js → scsr
    ├── app.mjs                   共享 o-app 配置（不声明 home）
    ├── assets/favicon.svg
    ├── components/
    │   ├── site-shell.html       顶部/底部/背景外壳（所有语言共用）
    │   └── demo-counter.html     首页复用的响应式计数器组件
    ├── content/
    │   └── page-runtime.mjs      中间内容交互逻辑（所有语言共用）
    ├── styles/
    │   ├── site.css              中间内容的设计系统与响应式样式
    │   └── shell.css             导航/页脚/背景样式
    ├── templates/
    │   ├── locale-index.html     各语言入口 index.html 模板
    │   └── root-index.html       根语言选择页模板
    └── cn/                       构建产物，勿手改
        ├── index.html            SCSR 文档 + 页面模块
        └── site.json
```

> 注意：`docs/origin/<locale>/index.html` 是页面模块源文件（`template[page]`），
> `docs/website/<locale>/index.html` 是构建后的完整 SCSR 文档。两者同名，
> 内容职责不同，不要直接互换。

## 构建

```bash
npm run build:website
```

脚本只使用 Node 内置模块：

1. 扫描 `docs/origin/*/site.json`，校验 `meta.lang/language/title/description`；
2. 复制该语言目录到 `docs/website/<locale>/`（`site.json` 及该语言的额外
   静态资源）；
3. 读取源 `index.html` 的 `<template page>` 内部内容，把 `../../website/`
   前缀改写为 `../`；
4. 把内容内联进 SCSR 模板，生成 `docs/website/<locale>/index.html`；
5. 用 `docs/website/templates/root-index.html` 生成根语言选择页；
6. 读取 `docs/website/.locales.json` 清理已删除语言的旧产物。

源 `origin/<locale>/index.html` 是页面模块（`template[page]`），构建时会被
覆盖成完整 SCSR 文档；最终只保留一份 `index.html`，访问、刷新、直接粘贴
地址都能还原当前页面。

构建是幂等的，可重复执行。`docs/website/cn/` 全部是生成物，不要直接修改。

## 本地预览

在仓库根目录启动静态服务器：

```bash
npm run server
```

- 根语言选择页：http://localhost:3348/docs/website/
- 中文首页：http://localhost:3348/docs/website/cn/

不要直接双击 `index.html` 打开——SCSR 页面、`o-page` 与 `site.json` 的加载
需要 HTTP 环境，`file://` 会被浏览器模块 CORS 策略拦截。

## 新增 / 翻译语言

以英语为例：

1. 复制 `docs/origin/cn/` 为 `docs/origin/en/`；
2. 翻译 `index.html` 中的正文，只改文字，保留标签、`id`、`class`、指令；
3. 翻译 `site.json` 中的 `meta`（`lang`、`language`、`title`、
   `description`、`noscript`）、`shell`（导航/页脚标签）、`demo` 与
   `toast` 文案；
4. 可选的 `meta.order` 控制语言在根选择页中的排序（数字越小越靠前）；
5. 执行 `npm run build:website`。

构建会自动生成 `docs/website/en/`，并把根语言选择页更新为两种语言。
删除 `docs/origin/en/` 后重新构建，旧的 `docs/website/en/` 会被清理。

### 翻译时不要动的内容

- `<template page>`、`<site-shell>`、`<l-m>`、`<link>`、`<script>` 等结构；
- `index.html` 底部 `<script>` 里的 `createLandingPage` 引入与 `export default`；
- `template page` 与 `o-app` 的包装由构建脚本完成，源页面不要自己包 `<o-app>`；
- `site-shell` 上以 `attr:` 开头的绑定（它们把 `site.json` 的标签传给共享外壳）；
- 页面里的 `id`（`top`、`features`、`demo`、`start`、`ecosystem`）；
- `on:click`、`sync:`、`class:`、`attr:` 等 ofa.js 指令；
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

- 每个语言目录的 `index.html` 是一个完整文档：
  `<o-app src="../app.mjs"><template page>…</template></o-app>`；
- `app.mjs` **不声明 home**：当前 URL 的 HTML 就是首页，由 scsr 收编为
  `<o-page src>`；
- scsr 接管后会移除内联 `<template page>`（服务端返回的同一份 HTML 不受
  影响，转译页面模块时仍读取它），地址保持真实路径；
- 站点目前只有一个首页；后续增加文档页时，每个真实路径各生成一份同结构
  HTML，站内跳转用 `olink` 或 `goto()`，刷新/分享都可直达。

## 首屏展示的接入方式

首页 Hero 与结尾 CTA 以「CDN · v5 / ESM」卡片展示 v5 的 mjs 地址，点击复制
按钮即可把完整地址写入剪贴板：

```
https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs
```

Quick Start 第一步展示完整的 `<script type="module">` 引用。页面不再提供
npm 安装命令，CDN 地址是主要使用方式。

## 共享外壳与内容的关系

- `components/site-shell.html` 是自定义组件，内部通过 `<slot>` 接收各语言
  页面传入的 `<main>`；因此导航、页脚、背景只维护一份。
- 导航文案通过 `site.json → site.shell` 以 `attr:` 绑定传入，组件本身只保留
  英文兜底值。
- `styles/site.css` 通过页面内的 `<link>` 加载到页面 shadow；`styles/shell.css`
  由 `site-shell` 自己加载。两者共享 `:host` 上的主题变量。
- 外壳的导航跳转与移动端菜单由 `site-shell` 自己处理，中间内容页面不需要
  再维护 `jump` / `menuOpen` 逻辑。
- 待办演示、复制、滚动渐入等交互由 `content/page-runtime.mjs` 提供，各语言
  页面只通过 `createLandingPage` 引入，不重复维护脚本逻辑。
