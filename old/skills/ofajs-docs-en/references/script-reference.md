# Script Import

ofa.js supports direct import via script tag. Just add the following code to the `<head>` or `<body>` section of your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Basic Usage

After importing the script, ofa.js creates a `$` variable in the global scope, and all core functionality is provided through this object. You can access various methods and properties of ofa.js through this object. Subsequent tutorials will introduce its specific usage in detail.

## Debug Mode

During development, you can enable debug mode by adding a `#debug` parameter after the script URL:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Debug mode enables source map functionality, allowing you to view and debug the original source code directly in browser developer tools, greatly improving development efficiency.

## ESM Module

ofa.js also supports import via ESM module. You can use the `import` statement in your project to import ofa.js:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

When using ESM module, you can directly use the `$` variable in your code without accessing it through the global scope.

## Key Points

- **Import Method**: Import via `<script>` tag with type `module`
- **Global Variable**: Automatically creates `$` global variable after import
- **Debug Mode**: Add `#debug` parameter after URL to enable source map
- **ESM Support**: Supports ES Module import method
