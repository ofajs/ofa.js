# ofa-inject-host（inject-host 插件）

ofa.js 的可选插件：把 shadow 内 `<inject-host>` 包裹的 `<link>`/`<style>`
**收编到宿主根节点**（hash 去重共享、移除自动回收），用于设置插槽内多层级
元素的样式。引用才生效，不进 ofa.js 默认构建。

> 建议优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted)
> 设置第一层插槽样式；只有需要多层级穿透时才用本插件。

## 引入方式

| 场景 | 方式 |
|------|------|
| dist 经典脚本（配 dist ofa.js） | `<script src="dist/ofa.min.js"></script>` `<script src="dist/inject-host.min.js"></script>` |
| dist ESM / CDN | `import ".../packages/plugins/inject-host/dist/inject-host.min.mjs"` |
| monorepo / npm 源码 | `import ".../plugins/inject-host/inject-host.mjs"` |

> 必须在 ofa.js 之后加载：插件挂接页面已加载的全局 `$`，缺失时直接抛错。

## 用法

典型场景是**组件用在 o-page 页面模块里**：`user-list` 的样式要命中内层
`user-list-item` 插槽里的内容。原生方案做不到——组件自身 shadow 的样式
出不了自己的作用域，`::slotted()` 只能改子级别一层；`<inject-host>` 则把
样式直接收编进 o-page 的 shadow，页面作用域内多层选择器全部可命中。

组件模块 `user-list.html`（外层组件，供 `l-m` 引用）：

```html
<template component>
  <style>
    /* 第一层插槽优先用 ::slotted(user-list-item) */
  </style>
  <inject-host>
    <style>
      user-list user-list-item { background-color: blue; }
      user-list user-list-item .item-name { color: red; font-weight: bold; }
    </style>
  </inject-host>
  <slot></slot>
</template>
```

组件模块 `user-list-item.html`（内层组件，自带 shadow 的普通组件）：

```html
<template component>
  <style>
    :host { display: block; padding: 4px 8px; border: 1px solid #ccc; }
  </style>
  <slot></slot>
</template>
```

页面模块 `user-list-page.html`（`<template page>`，双组件嵌套使用）：

```html
<template page>
  <l-m src="./user-list.html"></l-m>
  <l-m src="./user-list-item.html"></l-m>
  <user-list>
    <user-list-item>
      <span class="item-name">Yao</span>
    </user-list-item>
  </user-list>
</template>
```

使用页（已引入 ofa.js 与本插件）——收编样式塞进 o-page 的 shadowRoot，
`.item-name` 虽渲染在内层组件的 shadow 槽内仍被命中：

```html
<body>
  <o-app>
    <o-page src="./user-list-page.html"></o-page>
  </o-app>
</body>
```

- `<inject-host>` 内放 `<link rel="stylesheet">` 或 `<style>`，内容会被
  提升到**宿主的根节点**：宿主组件直接用在页面里时进 `document.head`
  （全局生效）；宿主组件嵌在其他组件 shadow 内时（如页面模块的 o-page），
  进该外层 shadowRoot；
- 相同内容按 hash 去重共享一份；元素移除时自动回收；
- `style` 内**不要用 `data()`**（会抛错）；`link` 的 rel 只接受
  `stylesheet`（会自动转成 `host` 记录来源）；
- ⚠️ 提升后的样式作用于宿主根对应的作用域（组件直接用在页面里时即全局
  文档），**务必用具体选择器**（完整组件标签路径），避免污染其他组件。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/` 下的 `inject-host.html` 覆盖：光 DOM 生效、head 收编去重、
双重组件嵌于 o-page（样式收编进页面 shadow，多层选择器命中内层组件槽内
内容）、style 文本实时变更、link href 切换与移除恢复。
