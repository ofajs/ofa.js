# Script Introduction

ofa.js supports direct import via script tag. Simply add the following code in the `<head>` or `<body>` section of the HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Basic Usage

After introducing the script, ofa.js creates a `$` variable in the global scope, through which all core functionalities are provided. You can access various methods and properties of ofa.js through this object. The following tutorials will detail its specific usage.

## Debug Mode

During development, you can enable debug mode by adding the `#debug` parameter to the script URL:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Debug mode enables source-map functionality, allowing you to view and debug the original source code of files directly in the browser’s developer tools, greatly boosting development efficiency.

## ESM Modules

ofa.js also supports importing via ESM modules. You can use the `import` statement in your project to bring in ofa.js:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

When using ESM modules, you can directly use the `$` variable in your code without accessing it through the global scope.