# ofa-body-ghost（body-ghost 插件）

ofa.js 的可选插件：把模板内容"传送"到 `body` 末尾渲染——真实 DOM 挂在
`document.body` 下的 `body-ghost-mapping` 影子载体里，原位置只留一个不占
布局的壳。**框架绑定随元素走**（`on:click`、`{{data}}` 仍用原组件的数据
作用域，交互照常），原生事件则沿**真实位置**（body 末尾载体 → body）向上
冒泡。适合弹窗、全局浮层等需要脱离父级 `overflow` 裁剪或层叠上下文的
内容。引用才生效，不进 ofa.js 默认构建。

## 引入方式

| 场景 | 方式 |
|------|------|
| dist 经典脚本（配 dist ofa.js） | `<script src="dist/ofa.min.js"></script>` `<script src="dist/body-ghost.min.js"></script>` |
| dist ESM / CDN | `import ".../packages/plugins/body-ghost/dist/body-ghost.min.mjs"` |
| monorepo / npm 源码 | `import ".../plugins/body-ghost/body-ghost.mjs"` |

> 必须在 ofa.js 之后加载：插件挂接页面已加载的全局 `$`，缺失时直接抛错。

## 用法

组件模块 `ghost-wrap.html`（`<template component>` 文件，供 `l-m` 引用）：

```html
<template component>
  <div id="wrap-box">
    <body-ghost>
      <!-- 这段内容真实渲染在 body 末尾；on:click 仍绑定在
           ghost-wrap 的数据作用域上，点击照常计数 -->
      <button on:click="count++">浮层按钮</button>
    </body-ghost>
    <span>{{count}}</span>
  </div>
  <script>
    export default {
      data: { count: 0 },
    };
  </script>
</template>
```

使用页（已引入 ofa.js 与本插件）：

```html
<body>
  <ghost-wrap></ghost-wrap>
  <l-m src="./ghost-wrap.html"></l-m>
</body>
```

- 宿主元素隐藏（`display:none`），内容在 `body-ghost-mapping` 的
  shadowRoot 内渲染（mapping 本体 `display:contents`）；
- 框架事件绑定（`on:click` 等）的监听器直接挂在传送的元素上，数据作用域
  随元素走——在 body 末尾照常触发，不依赖事件冒泡路径；
- 原生事件沿真实 DOM 位置冒泡：载体在 body 下，**body 级委托监听能收到**，
  原位置的祖先监听**收不到**；
- `body-ghost` 元素从文档移除时，mapping 载体一并清理；
- 内部搬动带 `__internal` 标记，不会误触发 attached/detached。

> 源码里的 `parentNode` 伪装（shadowRoot 的 `parentNode` 指向原位置父级）
> 只服务**显式读取该属性**的代码路径（如框架的部分父链查询），不改变原生
> 事件传播路径。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/body-ghost.html` 覆盖：mapping 挂载、内容传送、原作用域
交互与 body 冒泡、移除清理。
