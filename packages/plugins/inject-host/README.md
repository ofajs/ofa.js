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

- `<inject-host>` 内放 `<link rel="stylesheet">` 或 `<style>`，内容会被
  提升到宿主根（shadow 内则进 shadowRoot，顶层则进 document.head）；
- 相同内容按 hash 去重共享一份；元素移除时自动回收；
- `style` 内**不要用 `data()`**（会抛错）；`link` 的 rel 只接受
  `stylesheet`（会自动转成 `host` 记录来源）；
- ⚠️ 注入的样式作用于宿主所在作用域，**务必用具体选择器**（完整组件
  标签路径），避免污染其他组件。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/` 下的 `inject-host.html` 覆盖：光 DOM 生效、head 收编去重、
style 文本实时变更、link href 切换与移除恢复。
