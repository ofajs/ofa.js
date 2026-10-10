# xhear 上下文说明（CONTEXT.md）

## 一、一句话定位

Web Components 库：把任意 DOM 元素包装成"数据即元素"的代理实例（xhear =
stanz 观察语义 + DOM 数组操作），并在此之上提供整套响应式模板渲染语法
（`{{}}`、`:prop`、`attr:`、`class:`、`on:`、`sync:`、`watch:`、`x-if`、
`x-fill`、`style` 内 `data()`），是 ofa.js 组件系统的底座。

## 二、技术栈

- 零依赖、source-only ESM（`src/*.mjs` 即发布产物，浏览器直接加载）；
- 数据层复用 `../stanz`（相对路径源码引入，不经 npm）；
- 测试：自检式页面（`test/statics/` + harness）+ playwright spec，无第二测试运行器。

## 三、目录结构

```
packages/xhear/
├── AGENTS.md              开发规则（扩展缝、渲染契约、事故案例）
├── CONTEXT.md             本文件
├── package.json           name: xhear, version: 8.0.0, exports ./src/base.mjs
├── src/
│   ├── base.mjs           入口：组装 $ 对象（stanz/register/render/fn/all/frag…）
│   ├── dollar.mjs         $ 函数本体 + $.extensions 容器
│   ├── main.mjs           Xhear 类（元素导航/text/html/get/set…）+ 能力组装
│   ├── accessor.mjs       xhear 代理 handler（数字键映射子元素，余下委托 stanz）
│   ├── array.mjs          LikeArray：子元素数组方法（搬动真实 DOM + 派发事件）
│   ├── event.mjs          on/off/one/emit + 模板事件绑定解析
│   ├── css.mjs            css 存取器（内联样式代理 + 计算样式兜底）
│   ├── form.mjs           表单元素核心支持（value/checked 接入数据观察）
│   ├── formdata.mjs       formData 可选插件（不在默认构建，按需 import）
│   ├── path.mjs           点路径 get/set（stanz 裁剪掉的能力，归属本包）
│   ├── public.mjs         字符串/DOM 工具（hyphenToUpperCase/searchEle…）
│   ├── error.mjs          XhearError + 本地错误码表（替代已废弃的 ofa-error）
│   ├── util.mjs           eleX/createXEle/revokeAll
│   ├── register.mjs       $.register 组件注册（attrs 反射/watch/生命周期）
│   └── render/
│       ├── expr.mjs       表达式编译（with(data) 注入作用域，$event 可用）
│       ├── compile.mjs    模板编译（binder 描述符 + markers 共享映射，见文件头注释）
│       ├── render.mjs     渲染编排 + renderExtends 钩子 + prop/attr/class/watch 动作
│       ├── condition.mjs  x-if / x-else-if / x-else 条件链
│       ├── fill.mjs       x-fill 列表渲染（fill-key 对账 + $data/$index/$host）
│       ├── sync.mjs       sync: 双向同步动作
│       └── fake-node.mjs  FakeNode 注释区间容器 + replace-temp 兼容层
└── test/
    ├── statics/           15 个自检页（harness.mjs 零依赖渲染检查项）
    └── xhear.spec.js      断言每页 N/N 通过（含每页 total 契约）
```

## 四、对外 API 契约

| API | 说明 |
|---|---|
| `$(expr)` | 字符串选择器或 HTML/对象/Node → Xhear 实例（幂等，同一元素单例） |
| `$.register(opts)` | 注册组件：tag/temp/data/attrs/proto/watch/created/ready/attached/detached |
| `$.stanz` / `$.Stanz` | 转发自 stanz 包 |
| `$.render` / `$.convert` | 渲染与编译底层（上层框架复用） |
| `$.fn` | Xhear.prototype（注册冲突校验、扩展用） |
| `$.all` / `$.frag` / `$.nextTick` / `$.extensions` | 辅助能力 |
| `$ele.get/set("a.b.c")` | 点路径寻值/赋值 |
| `$ele.on/one/off/emit` | 事件；emit 的 `data` 挂到 `event.data` |
| `$ele.push/splice/reverse…` | 子元素当数组操作（真实搬动 DOM + 派发 array 事件） |
| `$ele.attr/text/html/css/data/…` | DOM 读写助手 |

### 模板语法表

| 语法 | 语义 |
|---|---|
| `{{expr}}` | 文本插值（纯文本，不解析 HTML；支持跨行、`&&` 等完整表达式） |
| `:prop="expr"` | 组件数据属性绑定（dash-case 转驼峰；对象值建立数据引用） |
| `attr:name="expr"` | HTML 属性；`true→""`、`false/null/undefined→移除` |
| `class:name="expr"` | 类名开关 |
| `on:event="handler"` | 方法名（从渲染数据查找）或内联表达式（`$event` 可用） |
| `one:event="handler"` | 单次事件 |
| `sync:prop="data.path"` | 元素属性 ↔ 渲染数据 双向同步（对象值禁止） |
| `watch:prop="data.path"` | 元素自身 prop → 渲染数据路径 单向拷贝 |
| `data(expr)`（style 内） | 样式值监视重渲染，`@media` 内可用；同一表达式可多处出现（如 min-width 与 width 同式），刷新逐处替换 |
| `<x-if :value>` / `<x-else-if>` / `<x-else>` | 条件链；`rendered`/`clear` 事件 |
| `<x-fill :value name fill-key>` | 列表渲染；项内 `$data`/`$index`/`$host`/`$parent`/`$ele` |
| `<template name>` | 命名模板（编译期摘除，供 x-fill 引用） |
| `<template is="replace-temp">` | table/select 等解析受限位置的模板落位方案 |

### 渲染管线（编译一次、实例化万次）

```
register: temp 字符串 → compile 纯 DOM 编译一次
          产出 __xt 绑定描述符（路径化 + 预编译共享表达式函数）
实例期  ：content.cloneNode(true)（零解析）+ 按路径直取节点（零扫描）
          + 表达式经 call 注入实例上下文（零重编译）
        → always 动作登记为任务，watchTick 防抖批量重跑（增量更新）
        → binding-rendered 握手 → x-if/x-fill init（条件模板经 xt-src
          注册表取回编译原件，实例克隆不携带 JS 属性）
销毁  ：revokeAll 沿 __revokes 撤销全部副作用（watch/事件/任务/数据引用）
```

注意三条 DOM 规则（重构时踩过）：`template.append()` 走光子层不进
content（moveChildren 两端归一化）；`cloneNode` 不复制 `__xt` 这类
JS 属性（跨实例引用走 xt-src 注册表）；xhear 代理的 target 是 Xhear
实例对象而非 DOM 元素（`_` 前缀状态经代理写，DOM 裸赋值互不可见）。

`x-bind-data`/`xtext` 物理形态已从编译产物移除，仅 render 的兼容回退
路径仍能处理旧形态输入。

## 五、与旧仓（old/packages/xhear、GitHub Xhear）的差异

1. **ofa-error 移除**：旧版运行时在线 fetch 错误文案（失败的设计）；
   现为 `src/error.mjs` 本地错误码表 + XhearError（含 code、cause）。
2. **formData 拆为插件**：`this.shadow.formData()` → `import { formData }
   from ".../formdata.mjs"; formData(this.shadow)`，不再挂原型。
3. **点路径 get/set 移入 xhear**：stanz 9 裁掉了原生 get/set，xhear 的
   `$ele.get/set` 与渲染层（sync/watch 动作）统一走 `src/path.mjs`。
4. **渲染管线完全重写（2026-10-10）**：编译期产出 binder 描述符 +
   预编译共享表达式函数；实例期 cloneNode + 路径直取。旧版每实例每绑定
   `new Function`、innerHTML 重解析、JSON.parse 的开销全部消除
   （基准：实例创建 +69%、fill 初建 +40%，见 bench:xhear）。
   旧版的 `{{a && b}}` 必炸（innerHTML 序列化转义）与 code 在条件内容
   里丢失两个隐性 bug 在纯 DOM 编译下天然免疫；x-bind-data/xtext 不再
   是编译产物，render 保留兼容回退路径处理旧形态输入。
5. **stanz 侧配套修复**（详见 stanz 包 CONTEXT.md/AGENTS.md）：
   Watchers 的 Array species 回归；`_bubbleOwners` 冒泡钩子恢复"事件沿
   DOM 树上浮"的旧语义。

## 六、运行方式

- 测试：仓库根 `npm test`（playwright 自动起停 3348 静态服务器）；
- 手动预览：根目录 `npm run server` → 打开
  `http://localhost:3348/packages/xhear/test/statics/<页面>.html`；
- benchmark：根目录 `npm run bench:xhear`（端口 3351，自动起停）。
  新旧两版都注册 x-if/x-fill 等自定义元素，**同页必冲突**，与 drill 一样
  按 `?v=old|new` 分页；同时每个场景单独开页（`?only=<id>`）并让新旧
  紧挨着采集。场景覆盖：注册编译、实例创建渲染、文本绑定批量刷新、
  fill 初建、fill 批删对账、fill-key 反转对账、条件切换。
  **注意**：fill 删除/重排场景的大幅领先主要继承自 stanz 9 的数组优化
  （旧 stanz splice 是 O(n) 备份差分），xhear 自身的对账算法与旧版基本
  一致；源码体积行含中文注释与 formdata 插件模块，不代表运行时体积。

## 七、用例覆盖表（历史 cases → 现页面检查项）

| 旧仓 test/cases | 现覆盖 |
|---|---|
| 230810/x-if-bug | combo-render · x-if 首次渲染只输出一份 |
| 230816/fill-in-if、if-in-fill-temp | combo-render · if-in-fill（fill 嵌在 x-if 内 + 项内条件） |
| 230816/if-in-fill | combo-render · fill-in-if（项内条件 + 递归命名模板） |
| 230816/if-in-if | combo-render · if-in-if（双层条件链） |
| 230904/replace-temp | combo-form · select 内 replace-temp 与条件选项 |
| 230928/fill-link | syntax-fill · 字符串项渲染 |
| 240819/fill-custom | combo-render · fill :html 渲染自定义组件不循环 |
| 241009/fill-table | combo-render · fill-table（tbody 内嵌套列表） |
| 241030-condition-error | combo-render · 兄弟元素间的独立条件链 |
| code | syntax-text · code 标签内容不被编译；syntax-template · 条件内容里的 code 受保护 |
| condition-event | syntax-if · rendered/clear 事件计数 |
| fill-index | syntax-fill · splice 删除后 $index 自动修正 |
| fill-key | syntax-fill-key（4 项：同 key 替换/原位修改/反转重排均复用 DOM） |
| formdata-in-if | combo-form · formData 随条件显隐增减键 / 跟随 fill 项增删 / 编辑回写 |
| loop-set-attr-bug | combo-form · attrs 数据变化不引发循环 |
| memory-recovery demo1/2 | memory · 挂载建立引用 / 宿主 detached 级联释放 |
| memory-recovery demo3 | memory · fill 移除项释放该项引用 / 清空 fill 释放全部 |
| memory-recovery demo6 | memory · sync 反复编辑不累积 owner |
| memory-recovery demo4/5 | memory 各项组合覆盖（条件 + fill + 组件嵌套的 owner 语义） |
| render-multiline-expr | syntax-text · 跨行表达式 |
| render-one | syntax-event · one: 只触发一次 |
| repeat-render-text | syntax-text · 更新复用文本节点 |
| set-data-before-init | combo-form · 注册前设置的数据保留 |
| style-data | syntax-style（4 项） |
| sync-uppercase | syntax-sync-watch · sync dash 属性名转驼峰 |
| watch-multi | register · watch 多键任一命中即触发 |
| 旧 statics：array/base-methods/event/fake-node/attr/sync/svg/template-watch/component-attached-detached/xhear-sub-object | dom-array、syntax-event/-bind/-sync-watch/-style、svg、register、memory 各页 + stanz 包测试 |

## 八、踩坑

### `&&` 表达式与 code 保护：纯 DOM 编译天然免疫（旧版同病，已消灭）

旧版 convert 靠 `innerHTML` 序列化 + 正则做 `{{}}` 替换，两个坑：
`&` 被转义成 `&amp;` 导致 `{{a && b}}` 编译必炸；code/条件内容回填依赖
querySelectorAll（不进入 template 的 content）导致内容丢失。新编译全程
纯 DOM：文本节点按 `{{}}` 拆成空标记节点（表达式原文直存，无实体问题），
code 保护用元素引用表回填（无需回查）。**教训：模板处理宁可全程 DOM
操作，不要在序列化字符串上做正则替换——序列化是有损转换。**

### moveChildren/append 对 template 元素走光子层

**症状**：`template.append(node)` 后 `template.content` 仍为空，节点去了
模板的光子层（不渲染）。

**根因**：`append`/`firstChild`/`childNodes` 对 HTMLTemplateElement 操作
的是光子层；content 是独立文档片段，常规 API 不自动路由。

**正确姿势**：跨模板搬运用 `compile.mjs` 的 `moveChildren`（两端归一化：
源/目标是 template 时落到 content）。cloneNode 会复制 content 但不复制
`__xt` 这类 JS 属性——跨实例引用用 `xt-src` 属性 + `xtRegistry` 注册表。

### 断言子组件内容必须穿透 shadow

**症状**：`$shadow.all("my-child").map(e => e.text)` 全是空串，但页面明明渲染了。

**根因**：`.text` 读光 DOM textContent；组件内容在自身 shadowRoot 里，
外部 querySelectorAll 也不穿透。

**正确姿势**：`child.shadow.$(...)` 逐层取。本项目 15 个自检页的辅助
函数都遵守这一点，新页面照抄即可。

### watchTick 是防抖异步的，断言前必须等

**症状**：数据改完立刻断言文本，偶发读到旧值；页面上"检查项随机失败"。

**根因**：渲染任务经 `watchTick`（debounce）批量重跑，赋值语句返回时
DOM 还没刷新。

**正确姿势**：一律 `await waitFor(() => 取值() === 期望)` 先等到位再断言；
禁止 `setTimeout(300)` 式定时等待（根 AGENTS.md 测试规则）。

### style 内重复 data() 表达式只替换了第一处

**症状**：同一表达式在样式中出现两次（如
`@media (min-width: data(w + "px")) { #a { width: data(w + "px"); } }`），
刷新后 `min-width` 更新、`width` 仍是最初求值文本，样式静默失配。

**根因**：旧版（渲染期回退路径）与新版样式 binder 都把匹配结果放进
`Set` 去重，再用 `String.replace(dataExpr, value)` 回写——`replace` 对
字符串参数只替换第一处，去重后第二次出现永远不被替换。旧用例恰好没有
写出"同式两处"的写法，所以从未暴露。

**正确姿势**：回写用 `replaceAll`（compile/render 两处 renderStyle 已改）；
misc.html 的 style-data 用例覆盖此形状（@media 条件 + 同式 width）。
