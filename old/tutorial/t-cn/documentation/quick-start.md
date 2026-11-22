# 快速上手



本節將介紹如何快速開始使用 ofa.js。在後續的敎程中，我們將省略 index.html 入口文件的創建步驟，僅展示頁面模塊文件的代碼。您可以直接基於模闆進行開發。

## 準備基礎文件



要快速上手 ofa.js，隻需創建一個**頁面模塊**並搭配入口 HTML 卽可，所需的覈心文件如下：

- `index.html`: 應用程序的入口文件，負責加載 ofa.js 框架並引入頁面模塊
- `demo-page.html`: 頁面模塊文件，定義頁面的具體內容、樣式和數據邏輯

### index.html (應用入口)



```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 示例</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

該文件的主要作用是：
- 引入 ofa.js 框架
- 使用 `<o-page>` 組件加載並渲染頁面模塊

### demo-page.html (頁面模塊)



```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

該文件定義瞭一個簡單的頁面組件，包含：
- `<template page>` 標籤，定義頁面模塊
- CSS 樣式（使用 Shadow DOM 的 `:host` 選擇器）
- 數據綁定錶達式 `{{val}}`
- JavaScript 邏輯，返迴包含初始數據的對象


## 在綫演示



以下是在綫編輯器中的實時示例，您可以直接脩改代碼並査看效菓：

<o-playground name="在綫演示" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

我們通過組件內部的 `<style>` 標籤來定義樣式，這些內部樣式僅作用於組件內部，具有良好的封裝性，不會影響頁面中的其他元素。

其中 `:host` 選擇器用於定義組件宿主元素的樣式，這裏我們將組件設置爲塊級元素，並添加紅色邊框和 10px 的內邊距。

通過 `{{key}}` 錶達式，可以將組件數據中對應的值渲染到頁面上。

現在您已經成功創建瞭第一個 ofa.js 應用！接下來，讓我們深入瞭解 ofa.js 的模闆渲染語法及其高級特性。