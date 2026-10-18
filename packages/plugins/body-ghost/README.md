# ofa-body-ghost（body-ghost 插件）

ofa.js 的可选插件：把模板内容"传送"到 `body` 末尾渲染——真实 DOM 挂在
`document.body` 下的 `body-ghost-mapping` 影子载体里，原位置只留一个不占
布局的壳。**事件冒泡仍沿原始文档位置向上**（parentNode 伪装），适合弹窗、
全局浮层等需要脱离父级 `overflow` 裁剪或层叠上下文的内容。引用才生效，
不进 ofa.js 默认构建。

## 引入方式

| 场景 | 方式 |
|------|------|
| dist 经典脚本（配 dist ofa.js） | `<script src="dist/ofa.min.js"></script>` `<script src="dist/body-ghost.min.js"></script>` |
| dist ESM / CDN | `import ".../packages/plugins/body-ghost/dist/body-ghost.min.mjs"` |
| monorepo / npm 源码 | `import ".../plugins/body-ghost/body-ghost.mjs"` |

> 必须在 ofa.js 之后加载：插件挂接页面已加载的全局 `$`，缺失时直接抛错。

## 用法

```html
<ghost-wrap></ghost-wrap>

<script type="module">
  import "ofa.js";
  import "ofa-body-ghost";

  $.register({
    tag: "ghost-wrap",
    temp: `
    <div id="wrap-box">
      <body-ghost>
        <!-- 这段内容真实渲染在 body 末尾，点击事件仍冒泡到 ghost-wrap -->
        <button on:click="count++">浮层按钮</button>
      </body-ghost>
      <span>{{count}}</span>
    </div>`,
    data: { count: 0 },
  });
</script>
```

- 宿主元素隐藏（`display:none`），内容在 `body-ghost-mapping` 的
  shadowRoot 内渲染（mapping 本体 `display:contents`）；
- `body-ghost` 元素从文档移除时，mapping 载体一并清理；
- 内部搬动带 `__internal` 标记，不会误触发 attached/detached。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/body-ghost.html` 覆盖：mapping 挂载、内容传送、事件冒泡、
移除清理。
