# 快速上手

本节将介绍如何快速开始使用 ofa.js。在后续的教程中，我们将省略 index.html 入口文件的创建步骤，仅展示页面模块文件的代码。您可以直接基于模板进行开发。

## 准备基础文件

要快速上手 ofa.js，只需创建一个**页面模块**并搭配入口 HTML 即可，所需的核心文件如下：

- `index.html`: 应用程序的入口文件，负责加载 ofa.js 框架并引入页面模块
- `demo-page.html`: 页面模块文件，定义页面的具体内容、样式和数据逻辑

### index.html (应用入口)

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

该文件的主要作用是：
- 引入 ofa.js 框架
- 使用 `<o-page>` 组件加载并渲染页面模块

### demo-page.html (页面模块)

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

该文件定义了一个简单的页面组件，包含：
- `<template page>` 标签，定义页面模块
- CSS 样式（使用 Shadow DOM 的 `:host` 选择器）
- 数据绑定表达式 `{{val}}`
- JavaScript 逻辑，返回包含初始数据的对象


## 在线演示

以下是在线编辑器中的实时示例，您可以直接修改代码并查看效果：

<o-playground name="在线演示" style="--editor-height: 500px">
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

我们通过组件内部的 `<style>` 标签来定义样式，这些内部样式仅作用于组件内部，具有良好的封装性，不会影响页面中的其他元素。

其中 `:host` 选择器用于定义组件宿主元素的样式，这里我们将组件设置为块级元素，并添加红色边框和 10px 的内边距。

通过 `{{key}}` 表达式，可以将组件数据中对应的值渲染到页面上。

现在您已经成功创建了第一个 ofa.js 应用！接下来，让我们深入了解 ofa.js 的模板渲染语法及其高级特性。