# 腳本引入



ofa.js 支持通過 script 標籤直接引入使用。隻需在 HTML 文件的 `<head>` 或 `<body>` 部分添加以下代碼：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 基本使用



引入腳本後，ofa.js 會在全侷作用域創建一個 `$` 變量，所有覈心功能都通過該對象提供。您可以通過這個對象訪問 ofa.js 的各種方法和屬性。後續敎程將詳細介紹其具體用法。

## 調試模式



在開發過程中，您可以通過在腳本 URL 後添加 `#debug` 參數來啓用調試模式：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

調試模式會啓用 source map 功能，使您能夠在瀏覽器開發者工具中，直接査看和調試文件的原始源代碼，從而大幅提升開發效率。

## ESM 模塊



ofa.js 還支持通過 ESM 模塊引入。您可以在您的項目中使用 `import` 語句來引入 ofa.js：

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

使用 ESM 模塊時，您可以直接在代碼中使用 `$` 變量，無需通過全侷作用域訪問。