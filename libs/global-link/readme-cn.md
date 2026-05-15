# global link

一个可以让所有组件共享样式的工具。

## 如何使用？

在 `ofa.js` 后引用 `global-link` 组件，通过 global-link 引用样式文件，即可让所有组件加载该样式文件。

```html
...
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/dist/ofa.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/libs/global-link/dist/global-link.min.js"></script>
...

<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
```

## 注意事项

必须优先使用 o-global-link 标签进行初始化，只有初始化完成后，后续的组件才会生效全局样式。