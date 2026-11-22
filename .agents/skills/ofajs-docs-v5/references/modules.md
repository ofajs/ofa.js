# 页面与组件模块

ofa.js 的代码组织单元是 **HTML 文件模块**：`<template page>`（页面）或
`<template component>`（组件）承载模板与逻辑，浏览器直接加载运行，
无构建步骤。

## 页面模块

```html
<template page>
  <style>
    :host { display: block; }
  </style>
  <div>{{message}}</div>
  <script>
    export default async ({ query }) => {
      return {
        data: { message: "Hello" },
        proto: { handleClick() {} },
      };
    };
  </script>
</template>
```

- `<style>`、模板内容、`<script>` 都写在 template 内部；**script 必须在
  template 内部**（转译只提取模板内的 script，放在外部会被静默丢弃）
- 页面加载入口（入口 HTML 或其他页面内）：`<o-page src="./page.html"></o-page>`

## 组件模块

```html
<template component>
  <style>
    :host { display: inline-block; }
  </style>
  <div><slot></slot> {{currentValue}}</div>
  <script>
    export default {
      tag: "my-counter",           // 必须：组件标签名
      attrs: { initialValue: 0 },  // 外部标量属性（可 reflected 到 HTML attribute）
      data: { currentValue: 0 },   // 内部响应式数据
      watch: {
        initialValue(val) { this.currentValue = val; },
      },
      proto: {
        increment() { this.currentValue++; this.emitChange(); },
        emitChange() { this.emit("change", { data: { value: this.currentValue } }); },
      },
      ready() { this.currentValue = this.initialValue; },
    };
  </script>
</template>
```

- `tag` 必须声明（未声明时按文件名 dash-case 推断）；使用时标签名必须与
  tag 一致
- 组件模板里 `:host` 选中组件容器；组件样式天然作用域隔离
- 同名 tag 重复注册（不同文件地址）会直接报错

## 组件引用

| 方式 | 语法 | 特点 |
|------|------|------|
| 异步引用 | `<l-m src="./comp.html"></l-m>`（放页面模板顶部） | 非阻塞，推荐 |
| 同步引用 | `export default async ({ load }) => { await load("./comp.html"); return {...} }` | 阻塞到注册完成，保证首帧可用 |

## 模块函数入参

`export default async (arg) => {...}` 的 `arg`：

| 参数 | 页面 | 组件 | 说明 |
|------|:---:|:---:|------|
| `load` | ✅ | ✅ | 加载其他模块（与 l-m 等效）；`await load("./x.html")` 同步注册 |
| `url` | ✅ | ✅ | 当前模块文件地址 |
| `query` | ✅ | ❌ | 页面地址的查询参数对象（`?id=1` → `query.id`） |

## 返回属性总览

| 属性 | 页面 | 组件 | 说明 |
|------|:---:|:---:|------|
| `tag` | ❌ | ✅ 必须 | 组件标签名 |
| `data` | ✅ | ✅ | 响应式数据（对象，不是函数） |
| `attrs` | ❌ | ✅ | 外部标量属性（反映到 HTML attribute） |
| `proto` | ✅ | ✅ | 方法与计算属性（getter/setter） |
| `watch` | ✅ | ✅ | 侦听器 |
| `ready/attached/detached/loaded` | ✅ | ✅ | 生命周期 |
| `routerChange` | ✅ 仅父页面 | ❌ | 子页切换时触发（嵌套路由高亮常用） |

**attrs vs data**：attrs 放简单标量（字符串/数字，值会反映到 HTML
attribute，可供 `attr:xxx` CSS 选择器使用）；数组、对象等复杂数据放 data
（`:prop` 传给 attrs 会序列化成字符串丢类型）。**两者 key 不可重复**。

**proto/data 禁止使用内置保留名**：`back` / `goto` / `replace` /
`src` / `pageAnime` / `pageIsReady` 以及 `$.fn` 上的通用方法名（`on` /
`emit` / `$` / `text` / `html` / `css` / `data` 等）——data 字段冲突直接
throw，proto 方法重名报注册错误，整页渲染失败。详见
[pitfalls.md](./pitfalls.md) 保留名一节。

## 插槽

```html
<!-- 组件内 -->
<slot></slot>                 <!-- 默认插槽 -->
<slot name="age"></slot>      <!-- 命名插槽 -->

<!-- 使用方 -->
<my-comp>
  <span>默认内容</span>
  <span slot="age">25</span>
</my-comp>
```

插槽支持默认内容（slot 标签内写兜底内容）与多层级传递。

## 自定义事件

```javascript
// 组件/页面内触发
this.emit("change", { data: { value: 1 } });

// 需要穿出 Shadow DOM 让宿主监听时（内嵌 o-page 上抛场景必须两者都带）
this.emit("form-save", { data: {...}, bubbles: true, composed: true });
```

```html
<!-- 使用方监听 -->
<my-counter on:change="handleChange"></my-counter>
```

- `event.data` 取自定义数据；`bubbles` 默认 true，`composed` 默认 false
- 事件名用小写短横线（`data-changed`）

## replace-temp（select/table 内列表的专用写法）

浏览器解析器会把 `<select>`/`<table>` 内的非白名单元素"修正"掉，
`<o-fill>` 直接写在里面会渲染失败。`<template is="replace-temp">` 凭借
template 的白名单身份让内容原样通过解析，ofa.js 编译期自动解包（v5 仍必需）：

```html
<select>
  <template is="replace-temp">
    <o-fill :value="items">
      <option>{{$data}}</option>
    </o-fill>
  </template>
</select>
```

**表格行**有更严的限制——`<tr>` 只在 template 根层级被放行，必须用
replace-temp + 命名模板引用：

```html
<tbody>
  <template is="replace-temp">
    <o-fill :value="$data.columns" name="table-row"></o-fill>
  </template>
</tbody>
<!-- 行内容写在顶层命名模板里（根层级的 tr 不会被解析器丢弃） -->
<template name="table-row">
  <tr><td>{{$data.name}}</td><td>{{$data.desc}}</td></tr>
</template>
```

纯 JS 动态创建 DOM（createElement + append）不受解析器限制，无需此写法。

## inject-host（注入宿主样式 · 可选插件）

slot 分发内容的深层元素无法用组件内样式直接命中（`::slotted()` 只及第一层），
`<inject-host>` 把组件内的 style 提升到宿主作用域。它是 `packages/plugins/inject-host/`
下的**可选插件**，需显式引入（dist 经典脚本加载 `inject-host.min.js`，或
源码 `import ".../plugins/inject-host/inject-host.mjs"`），且须在 ofa.js
之后加载：

```html
<template component>
  <style>
    /* 第一层优先用 ::slotted(user-list-item) */
  </style>
  <inject-host>
    <style>
      user-list user-list-item .item-name { color: red; } /* 完整路径防污染 */
    </style>
  </inject-host>
  <slot></slot>
</template>
```

务必用具体选择器（完整组件标签路径），通用类名会污染其他组件；频繁更新
场景慎用（触发宿主样式重注入）。

## match-var（样式查询）

按 CSS 变量值切换组件内部样式，适合主题等**纯样式上下文**（无需 JS）：

```html
<!-- 组件内：变量匹配到哪组，哪组样式生效 -->
<match-var theme="dark">
  <style>.content { background: #333; color: white; }</style>
</match-var>
<match-var theme="dark" size="large">  <!-- 多条件同时匹配 -->
  <style>:host { padding: 20px; }</style>
</match-var>
```

```html
<!-- 外部：把 data 值写进 CSS 变量 -->
<style>.container { --theme: data(currentTheme); }</style>
```

- 属性名对应 CSS 变量名（不含 `--`）；支持原生 `@container style()` 的
  浏览器自动生效，否则轮询检测；Firefox 下变量变化后需手动 `$.checkMatch()`
