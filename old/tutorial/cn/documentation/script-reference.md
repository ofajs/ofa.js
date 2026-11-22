# 脚本引入

ofa.js 支持通过 script 标签直接引入使用。只需在 HTML 文件的 `<head>` 或 `<body>` 部分添加以下代码：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 基本使用

引入脚本后，ofa.js 会在全局作用域创建一个 `$` 变量，所有核心功能都通过该对象提供。您可以通过这个对象访问 ofa.js 的各种方法和属性。后续教程将详细介绍其具体用法。

## 调试模式

在开发过程中，您可以通过在脚本 URL 后添加 `#debug` 参数来启用调试模式：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

调试模式会启用 source map 功能，使您能够在浏览器开发者工具中，直接查看和调试文件的原始源代码，从而大幅提升开发效率。

## ESM 模块

ofa.js 还支持通过 ESM 模块引入。您可以在您的项目中使用 `import` 语句来引入 ofa.js：

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

使用 ESM 模块时，您可以直接在代码中使用 `$` 变量，无需通过全局作用域访问。