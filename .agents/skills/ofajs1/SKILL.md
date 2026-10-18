---
name: ofajs1
description: ofa.js 框架知识库（精简版）。当用户询问 ofa.js 的使用方法、组件开发、页面模块、路由配置、状态管理，或要构建无需 Node.js/Webpack 的 Web 应用时使用。
version: 5.0.0.2
---

# ofa.js 速查（v5）

这个入口只放「做决策必需」的内容：版本地址、最小可用代码、语法总表、高频错误。
完整语法、API、长尾踩坑都在 `references/`，按需查阅，不在这里重复。

> 本目录（`ofajs1`）是 `ofajs-docs` 的精简重构版；确认无误后可替换原技能，
> 替换时把 frontmatter 的 `name` 改回 `ofajs-docs`。

## 0. 版本与资源（先确认）

| 线 | 位置 | 版本 | 资源前缀 |
|----|------|------|----------|
| v4 主线 | `main` / npm `ofa.js` | 4.7.7（npm latest 4.7.0） | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js` |
| v5 | `v5` 分支（未合并 main、未发 npm） | 5.0.0 | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5` |

本技能按 **v5** 编写。可直接复制的地址：

| 资源 | v5 | v4 |
|------|----|----|
| ofa.js ESM | `...@refs/heads/v5/dist/ofa.min.mjs` | `.../dist/ofa.min.mjs` |
| ofa.js UMD | `...@refs/heads/v5/dist/ofa.min.js` | `.../dist/ofa.min.js` |
| o-router | `...@refs/heads/v5/packages/router/dist/router.min.mjs` | `.../libs/router/dist/router.min.mjs` |
| scsr | `...@refs/heads/v5/packages/scsr/dist/scsr.min.mjs` | `.../libs/scsr/dist/scsr.min.mjs` |

两个硬性注意：

1. **不要写 `@v5`**：jsdelivr 会按 tag 解析而 404，必须写 `@refs/heads/v5`。
2. **`libs/` 与 `packages/` 不可混用**：v5 的 router/scsr 已迁入 `packages/`，v4
   才在 `libs/`。router/scsr **必须在 ofa.js 之后加载**。

版本线细节、jsdelivr 缓存 404、monorepo 源码引用、合并后的迁移步骤见
[resources.md](./references/resources.md)。

## 1. 最小可用

```html
<!-- index.html -->
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./page.html?name=ofa"></o-page>
  </body>
</html>
```

```html
<!-- page.html：页面模块 -->
<template page>
  <style>
    :host { display: block; }
  </style>
  <h1>{{title}}</h1>
  <button on:click="sayHi">你好</button>
  <script>
    export default async ({ query }) => ({
      data: { title: query.name || "ofa.js" },
      proto: {
        sayHi() {
          this.title = "Hello ofa.js";
        },
      },
    });
  </script>
</template>
```

```html
<!-- my-comp.html：组件模块（tag 默认由文件名推断：my-comp） -->
<template component>
  <span>{{value}}</span>
  <script>
    export default async () => ({
      tag: "my-comp",
      attrs: { value: "默认值" }, // 标量放 attrs
      data: {},                  // 对象/数组放 data
      proto: {},
    });
  </script>
</template>
```

## 2. 模块结构（必须记住）

- `<script>` **必须在 `<template page|component>` 内部**；页面模块无需 `tag`，
  组件模块需要 `tag`（可缺省，由文件名推断，推荐显式写）。
- 返回对象字段：`tag`（组件）、`data`、`attrs`、`proto`、`watch`、
  `ready/attached/detached/loaded`、`routerChange`；页面还可 `export const parent`
  （嵌套路由）与 `export const title`。
- 生命周期顺序：`ready` → `attached` → `loaded`（`detached` 在移除时）。
- 嵌入页面用 `<o-page src="./x.html">`；微应用用 `<o-app src="./app-config.js">`，
  **不要**让 `<o-app>` 直接加载页面模块。
- 选中元素用 `$("#id")`，得到的是 ofa.js 包装对象；原生属性/方法一律走 `.ele`
  （`$("o-app").current.ele.shadowRoot`）。

## 3. 模板语法总表

| 语法 | 用途 | 示例 |
|------|------|------|
| `{{expr}}` | 文本插值（**只能放在标签之间**） | `<span>{{name}}</span>` |
| `:prop="expr"` | 单向属性绑定 | `<input :value="name">` |
| `sync:prop="expr"` | 双向绑定（仅标量，对象禁止） | `<input sync:value="name">` |
| `attr:name="expr"` | HTML 属性绑定（bool 属性也走这里） | `<button attr:disabled="busy">` |
| `class:name="bool"` | 条件类名 | `<div class:active="isOn">` |
| `:style.prop="expr"` | 单个样式属性 | `<div :style.width="w + 'px'">` |
| `on:event="handler"` | 事件（方法名或表达式） | `<button on:click="save">` |
| `:html="expr"` | 渲染 HTML 字符串 | `<div :html="rich"></div>` |
| `<o-if :value>` / `<o-else-if>` / `<o-else>` | 条件渲染 | `<o-if :value="show">…</o-if>` |
| `<o-fill :value fill-key>` | 列表渲染 | `<o-fill :value="rows" fill-key="id">…</o-fill>` |
| `<template name="t">` | 命名模板（配合 o-fill） | `<o-fill name="t">` |
| `<template is="replace-temp">` | table/select 内落位 | 见 `templates-render.md` 的表格写法 |
| `data(expr)` | style 内响应式取值 | `width: data(w);` |
| `$data/$index/$host/$parent/$ele` | o-fill 项内作用域 | `{{$host.fmt($data)}}` |
| `<slot>` / `<o-provider>` / `<o-consumer>` | 插槽 / 上下文 | 见 `components.md`、`state.md` |

规则：**属性值里不解析 `{{}}`**；所有指令值都是 **JS 表达式**（字符串要加引号，
裸文案会当标识符求值而报错）。`x-if`/`x-fill` 在 v5 已移除，一律用 `o-` 系。

## 4. 高频错误速查（症状 → 正确做法）

| ❌ 常见写法 | ✅ 正确写法 | 说明 |
|------------|------------|------|
| `computed: { x() {} }` | `proto: { get x() {} }` | 计算属性用 getter |
| `this.$route.query.id` | 页面模块参数 `({ query })` | 只有 query 传参 |
| `v-if` / `v-for` / `@click` / `v-model` | `o-if` / `o-fill` / `on:click` / `sync:` | 不要套 Vue 语法 |
| `methods` / `data()` 函数 / `props` | `proto` / `data: {}` 对象 / `attrs`+`data` | 字段含义见 §2 |
| `attrs` 与 `data` 同名 key | 保持唯一 | 重名会出错 |
| o-fill 内 `{{item.x}}` | `{{$data.x}}` | 也可用 `$index/$host/$parent/$ele` |
| `title="{{name}}"` / `:title="name"` | `attr:title="name"` | 属性值不解析 `{{}}` |
| `attr:title="点这里选择"`（静态文案） | `title="点这里选择"` | attr: 的值是表达式，裸文案会 ReferenceError |
| `:disabled="busy"` | `attr:disabled="busy"` | 布尔属性存在即生效，`:prop` 的 false 会变 `"false"` |
| `:class="item.type"` | `attr:type="type"`（o-fill 内用 `$data.type`） | 数据属性用 attr: + 属性选择器 |
| `<o-page :src="id ? A : B">` 运行中改 src | 调子页面方法传参；或外层 `o-if` 重建 | `o-page.src` 初始化后不可变 |
| `proto: { $fmt() {} }` | `proto: { fmt() {} }` | `$` 是内置变量前缀 |
| 自定义 `back` / `goto` / `replace` / `src` 等 | 换业务语义命名（`backToInput`） | 与内置保留名冲突会导致注册失败 |
| 模板引用未在 data/attrs 声明的变量 | 先声明并给默认值 | 不是 undefined，而是 ReferenceError 中断渲染 |
| getter 里读异步数据 | data 字段 + 异步回调赋值 | getter 在 ready 前就会求值 |
| `{{$data.a && $data.b ? …}}`（o-fill 内） | 抽成 `$host.method($data)` 或改三元/`===` | `&&` 会导致整个 o-fill 不渲染 |
| 顶层元素用 `$host.x()` | 直接 `x()`；属性绑定直接用 data 字段 | `$host` 只在 o-fill 项内注入 |
| hash 链接 `#./pages/x.html` | `#/pages/x.html` | `#` 后直接 `/` |
| `<o-app src="./page.html">` | `<o-page src="./page.html">` | o-app 只接 app-config |
| table 内直接写 `<o-fill><tr>` | `replace-temp` + 顶层命名模板 | 浏览器会丢弃包装内的 tr/td |
| `$("o-app").current.shadowRoot` | `$("o-app").current.ele.shadowRoot` | 包装对象的原生属性走 `.ele` |
| `<script>` 写在 `<template>` 外 | 移进模板内 | 否则模块不生效 |
| `x-if` / `x-fill` | `o-if` / `o-fill` | v5 已移除 x- 系 |
| 改页面文件后刷新无效 | 用 `?t=xx#/pages/x.html` 整页强刷 | 模块缓存 + HTTP 缓存（见 pitfalls） |

每条错误的原因、最小复现与排查口诀见 [pitfalls.md](./references/pitfalls.md)。

## 5. 决策树（精简）

```text
需要复用 UI？            → 组件模块（<template component> + tag）
否则                    → 页面模块（<template page>）

数据要共享吗？          → 跨多层：o-provider/o-consumer
                         → 同层：sync: / :
                         → 局部：data

要渲染列表/条件？        → o-fill（有唯一字段就加 fill-key）/ o-if

需要多页面？            → o-app + o-router（#/path，零服务器）
                         → 要真实 URL / SEO：scsr（每路径一份 HTML）

单页面业务过重？         → 拆子 page：<o-page> 常驻 + 方法下发 + 事件上抛
                         （bubbles: true, composed: true）

标量还是复杂值？         → 标量 attrs（会反射到 HTML 属性）
                         → 对象/数组 data（:prop 传值，避免序列化丢类型）
```

## 6. 参考索引

| 文档 | 什么时候看 |
|------|-----------|
| [resources.md](./references/resources.md) | 版本线、CDN 地址、npm/monorepo、本地命令、部署 |
| [quick-start.md](./references/quick-start.md) | 从零跑通第一个页面 |
| [components.md](./references/components.md) | 组件写法、模块返回字段、生命周期、attrs 继承、自定义事件、插槽 |
| [templates-basic.md](./references/templates-basic.md) | 内容渲染、属性/双向绑定、事件、类与样式、`data()` |
| [templates-render.md](./references/templates-render.md) | 条件渲染、列表渲染、非显式组件、replace-temp/表格 |
| [state.md](./references/state.md) | `$.stanz`、计算属性、watch、provider/consumer 上下文 |
| [routing.md](./references/routing.md) | o-router、嵌套路由、app-config、微应用、SSR/SCSR |
| [styling.md](./references/styling.md) | inject-host 注入宿主样式、match-var 样式查询 |
| [pitfalls.md](./references/pitfalls.md) | 行为不符合预期时的症状 → 根因 → 修法 |
| [api.md](./references/api.md) | `$()` 实例方法、元素操作、o-app API 全表 |
| [patterns.md](./references/patterns.md) | 表单、列表操作、组件通信、页面拆分、性能与实用片段 |

可运行示例（`assets/`，均指向 v5 分支资源）：

| 案例 | 入口 |
|------|------|
| 计数器（数据/事件/计算属性） | [01-start/demo.html](./assets/01-start/demo.html) |
| 开关组件（组件/属性/插槽） | [02-switch/demo.html](./assets/02-switch/demo.html) |
| 待办列表（持久化/o-fill） | [03-todolist/demo.html](./assets/03-todolist/demo.html) |
| 文件编辑器（provider/嵌套组件） | [04-filelist/demo.html](./assets/04-filelist/demo.html) |
| SPA 路由（o-router/o-app） | [05-routing/demo.html](./assets/05-routing/demo.html) |
| SCSR 同构渲染 | [06-scsr/home.html](./assets/06-scsr/home.html) |
| Shadow DOM / API | [07-api/demo.html](./assets/07-api/demo.html) |

## 7. 交付前自检

- 页面模块的 `<script>` 在 `<template>` 内；组件有 `tag`。
- 模板里每个变量都能在 `data`/`attrs` 找到声明。
- 动态属性用 `attr:`/`:prop`，布尔属性用 `attr:`，没有在属性值里写 `{{}}`。
- 列表项用 `$data`，根级没有误用 `$host`；o-fill 里没有 `{{…&&…}}`。
- 控制台无 `Error evaluating ... expression`、无 `x-if/x-fill deprecated`。
- 实际加载版本正确：`console.log($.version)`。
