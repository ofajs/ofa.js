# ofa-global-link（global-link 插件）

ofa.js 的可选插件：`<o-global-link href="./global.css">` 把一份样式表注入
**其后挂载组件**的 shadow 内——shadow DOM 隔离了页面级样式，这个插件让
"全局组件样式"成为可能（组件内 link 引入的样式天然隔离，页面级 link 进不了
shadow）。引用才生效，不进 ofa.js 默认构建。

## 引入方式

| 场景 | 方式 |
|------|------|
| dist 经典脚本（配 dist ofa.js） | `<script src="dist/ofa.min.js"></script>` `<script src="dist/global-link.min.js"></script>` |
| dist ESM / CDN | `import ".../packages/plugins/global-link/dist/global-link.min.mjs"` |
| monorepo / npm 源码 | `import ".../plugins/global-link/global-link.mjs"` |

> 必须在 ofa.js 之后加载：插件挂接页面已加载的全局 `$`，缺失时直接抛错。

## 用法

```html
<body>
  <!-- 必须写在其他组件之前：只有初始化之后才挂载的组件会拿到样式 -->
  <o-global-link href="./global.css"></o-global-link>

  <styled-a></styled-a>
</body>
```

行为语义（忠实于实现，`afterAttached` 注入，无回溯）：

- **只影响其后挂载的组件**：组件挂载时把当时份额内的样式 link 注入其
  shadow；`o-global-link` 初始化前已在文档中的组件**不会**回溯注入；
- `href` 变更只更新份额表：**之后**挂载的组件拿到新样式；已注入组件的
  shadow 副本**不会**随之切换，也不会被回收；
- `o-global-link` 自身移除后，**之后**挂载的组件不再注入；已注入的副本
  保留；
- 组件卸载后再挂载，按当时份额重新注入（`o-global-link` 仍在文档时）。

需要"运行中整体换肤"时，应换用组件内可控的样式方案（如 `public.css`
按组件引入后自行切换），本插件不做已注入副本的回收。

## ⚠️ 使用需谨慎

与全局变量一样会**污染全局样式作用域**，只建议在这些场景使用：

- 存量项目迁移；
- 私有项目；
- 临时兜底（混乱代码的应急方案）。

**推荐替代**：新建 `public.css`，在每个组件模块里用 `link` 引入——效果
相同且不污染全局。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/global-link.html` 覆盖：shadow 注入生效、href 切换只影响
其后挂载的组件、移除后新组件不再被注入（已有组件不受影响）。
