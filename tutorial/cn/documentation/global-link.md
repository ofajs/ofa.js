# global-link 组件

`global-link` 是一个可以让所有组件共享样式的工具组件。

## 基本用法

在 `ofa.js` 后引用 `global-link` 组件，通过 `global-link` 引用样式文件，即可让所有组件加载该样式文件。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>global-link 示例</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## 适用场景

⚠️ **警告**：`global-link` 会污染全局样式作用域，就像全局变量一样。

**新项目绝对不要使用这个组件！** 如果你在新项目中使用了 `global-link`，那说明你的项目架构设计有问题，这是一个垃圾项目的标志。

仅在以下场景中使用：

- 老旧项目迁移（临时方案）
- 屎山代码、垃圾项目（临时救火）

## 替代方案

可以创建一个 `public.css` 文件，然后在你的每个组件模块中分别引入（使用 `link` 标签），这样就能达到你想要的效果，同时避免污染全局样式。

```html
<!-- 在组件模块中 -->
<link rel="stylesheet" href="./public.css">
```

## 注意事项

必须优先使用 `o-global-link` 标签进行初始化，只有初始化完成后，后续的组件才会生效全局样式。
