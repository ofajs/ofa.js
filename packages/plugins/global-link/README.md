# ofa-global-link（global-link 插件）

ofa.js 的可选插件：`<o-global-link href="./global.css">` 把一份样式表注入
**所有组件**的 shadow 内——shadow DOM 隔离了页面级样式，这个插件让"全局
组件样式"成为可能（组件内 link 引入的样式天然隔离，页面级 link 进不了
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

- `href` 变更会实时切换全部组件的样式（旧份额自动移除）；
- 组件卸载/换页不影响份额，`o-global-link` 自身移除时份额清空。

## ⚠️ 使用需谨慎

与全局变量一样会**污染全局样式作用域**，只建议在这些场景使用：

- 存量项目迁移；
- 私有项目；
- 临时兜底（混乱代码的应急方案）。

**推荐替代**：新建 `public.css`，在每个组件模块里用 `link` 引入——效果
相同且不污染全局。

## 测试

仓库根执行：`npm run test:plugins`（或全量 `npm test`）。
`test/statics/global-link.html` 覆盖：shadow 注入生效、href 实时切换、
移除后样式恢复。
