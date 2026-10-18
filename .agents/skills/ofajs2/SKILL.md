---
name: ofajs2
description: ofa.js 框架使用文档（v5 修订版）。当用户询问 ofa.js 的使用方法、组件开发、页面模块、路由配置、状态管理，或想要构建无需 Node.js/Webpack 的 Web 应用时使用。
version: 5.0.0
---

# ofa.js 文档知识库（v5）

正源是本仓 `packages/ofajs`（连同 `packages/router`、`packages/scsr` 两个桥接包）；
本技能是使用方文档，**与源码行为不一致时以 `packages/` 源为准**并同步修订本文。

## 使用规范

1. 代码示例一律按本文档语法生成；与既有知识冲突时以本文档为准
2. 不要套用 Vue/React/Angular 习惯；ofa.js 无需 Node.js/Webpack/构建
3. 资源地址先看下方速查表；细节与 monorepo 源码引用见
   [resources.md](./references/resources.md)
4. 需要完整可运行的文件骨架时，以 [examples.md](./references/examples.md)
   的四个示例为基准模板；更大的综合案例在仓库内
   `packages/router/test/router-demo/`（o-app + o-router）与
   `packages/scsr/test/scsr-demo/`（scsr 真实路径）

## 资源速查

| 资源 | 地址（v5 分支，jsdelivr） |
|------|--------------------------|
| ofa.js ESM（推荐） | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs` |
| ofa.js UMD（经典 script） | `https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.js` |
| o-router | `...@refs/heads/v5/packages/router/dist/router.min.mjs`（UMD 为 `.min.js`，全局名 `ofaRouter`） |
| scsr | `...@refs/heads/v5/packages/scsr/dist/scsr.min.mjs`（UMD 为 `.min.js`，全局名 `ofaScsr`） |

- v5 必须写 `@refs/heads/v5`（`@v5` 会被 jsdelivr 当 tag 解析 → 404）；
- router / scsr 是桥接包，**必须在 ofa.js 之后加载**（挂接页面已加载的全局 `$`）；
- v4 主线（npm 4.7.x，`libs/` 目录）对照表见 [resources.md](./references/resources.md)。

## 高频错误速查

| ❌ 错误 | ✅ 正确 | 要点 |
|---------|---------|------|
| `computed: { double() {} }` | `proto: { get double() {} }` | 计算属性用 getter；依赖异步数据时改用 data 字段异步赋值 |
| `v-if` / `v-for` / `v-model` / `@click` | `<o-if :value>` / `<o-fill :value>` / `sync:` / `on:` | v5 只有 o- 系写法，`x-if`/`x-fill` 已移除 |
| `:class="{active: x}"` | `class:active="x"` | 类名开关用 `class:` |
| 属性值里写 `{{...}}` | `attr:href="url"` / `:style.width="w + '%'"` | `{{}}` 只在元素文本内容生效，属性值一律用指令 |
| `:disabled="loading"`（disabled/checked 等布尔属性） | `attr:disabled="loading"` | `:prop` 会渲染出 `disabled="false"` 属性仍存在；`attr:` 对 false 直接移除属性 |
| `props:` / `methods:` / `data()` | `attrs:` / `proto:` / `data: {}` | attrs 放标量、data 放数组/对象；两者 key 不可重复 |
| o-fill 内写 `{{item.name}}` | `{{$data.name}}` | o-fill 项内只能用 `$data` / `$index` / `$host` / `$parent` / `$ele` |
| 根级写 `on:click="$host.fn()"` | `on:click="fn()"` | `$host`/`$data` 只存在于 o-fill 的 item 作用域 |
| `proto: { back() {} }` 等内置保留名 | 换业务语义命名（如 `backToInput`） | `back/goto/replace/src/pageAnime/pageIsReady` 及 `$.fn` 方法名被占用，重名注册直接报错 |
| `this.$route.query.id` | `export default async ({ query }) =>` | query 走模块函数入参 |
| `<o-app src="./page.html">` | `<o-page src="./page.html">` / `<o-app src="app-config.js">` | o-app 只加载应用配置；嵌页面用 o-page |
| 初始化后再给 `<o-page>` 赋 `src`（含 `:src`） | 运行时调用子页面方法传参 | o-page 的 src 初始化后不可变，再赋值直接抛错 |
| `<script>` 放在 `<template>` 外 | script 放 template 内部 | 转译只提取 template[page|component] 内的 script |
| `$("#form").formData()` | `import { formData } from "xhear/src/formdata.mjs"` 后 `formData($ele)` | v5 中 formData 是可选插件（不在 dist），不是实例方法 |
| 模板引用了 data/attrs 未声明的键 | 所有被引用键先声明并给默认值 | 初始化求值直接 ReferenceError，整页渲染中断 |

完整报错对照与排查口诀见 [pitfalls.md](./references/pitfalls.md)。

## 决策树

```
模块类型
├─ 可复用 UI 片段 → 组件模块 <template component>（必须有 tag）
├─ 页面/子页面 → 页面模块 <template page>
│   └─ 单页过重（列表+弹窗表单混在一起）→ 拆子页面：<o-page> 常驻内嵌，
│      方法调用下发参数、emit(bubbles+composed) 上抛结果
└─ 表格行/select 内列表 → replace-temp + 命名模板（解析器白名单限制）

数据管理
├─ 跨多层组件 → o-provider / o-consumer（样式类上下文用 match-var）
├─ 跨页面/全局 → $.stanz() 共享状态（attached 挂载、detached 清引用）
└─ 组件内部 → data

渲染
├─ 列表 → <o-fill :value>；列表项有唯一字段时始终加 fill-key="id"
│   ├─ 简单结构 → 内容直接写在 o-fill 内（用 $data）
│   └─ 复用/复杂 → 顶层 <template name> + <o-fill name="...">
├─ 条件 → <o-if :value> / <o-else-if> / <o-else>（必须连续）
└─ 频繁显隐 → class: 切换；低频显隐 → o-if

路由
├─ hash 路由（无需服务器）→ <o-router fix-body> 包 <o-app src="app-config.js">
├─ 真实路径/SEO → scsr（每路径一份同名 HTML，template[page] 内联 o-app）
└─ 嵌套布局 → 父页 <slot>，子页 export const parent = "./layout.html"
```

## 文档索引

| 文档 | 内容 |
|------|------|
| [syntax.md](./references/syntax.md) | 模板指令全表与语义：{{}}/:prop/sync:/attr:/class:/:style./data()、事件绑定、o-if、o-fill 与作用域、计算属性、侦听器、生命周期 |
| [modules.md](./references/modules.md) | 页面/组件模块结构、模块函数入参（load/url/query）、返回属性总览、attrs vs data、组件引用（l-m/load）、插槽、自定义事件、replace-temp、inject-host、match-var |
| [app-routing.md](./references/app-routing.md) | o-app 应用配置（home/pageAnime/loading/fail/proto/ready/allowForward）、导航 API 与 router-change、o-router、嵌套路由、单页拆分内嵌子页面模式、scsr 真实路径路由 |
| [state.md](./references/state.md) | `$.stanz()` 状态管理（挂载/清理约定）、o-provider/o-consumer/o-root-provider、getProvider/dispatch |
| [api.md](./references/api.md) | `$` 包装对象全参考：获取/实例化、树导航、子元素操作、text/html/attr/css/classList/data、on/one/emit/off、o-app/o-page 成员、stanz 数据特征、extend、formData 插件 |
| [pitfalls.md](./references/pitfalls.md) | 报错对照全集与排查口诀：ReferenceError/SyntaxError/TypeError 三类渲染崩溃、保留名冲突、布尔属性、包装对象与 .ele 边界、hash URL 格式、模块缓存 |
| [examples.md](./references/examples.md) | 四个完整可运行示例（文件内容完整给出）：最小应用、自定义组件、待办清单（列表+双向绑定）、路由应用 |
| [resources.md](./references/resources.md) | 版本线对照（v5 分支 / v4 npm）、CDN 地址与 `@refs/heads/v5` 原因、dist 产物、monorepo 源码引用、加载顺序 |
