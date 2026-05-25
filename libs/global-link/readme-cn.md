# global link

一个可以让所有组件共享样式的工具。

## 如何使用？

在 `ofa.js` 后引用 `global-link` 组件，通过 global-link 引用样式文件，即可让所有组件加载该样式文件。

```html
...
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.23/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.23/libs/global-link/dist/global-link.min.js"></script>
...

<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
```

## 适用场景

⚠️ **谨慎使用**：`global-link` 会污染全局样式作用域，就像全局变量一样。仅在以下场景中使用：

- 老旧项目迁移
- 私有项目
- 屎山代码、垃圾项目（临时救火）

**建议**：在新项目或可控项目中，优先使用组件化的样式方案。

**替代方案**：可以创建一个 `public.css` 文件，然后在你的每个组件模块中分别引入（`link` 标签），这样就能达到你想要的效果，同时避免污染全局样式。

## 注意事项

必须优先使用 o-global-link 标签进行初始化，只有初始化完成后，后续的组件才会生效全局样式。