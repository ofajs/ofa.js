# anchor-dialog

锚点对话框组件，点击特定元素时弹出对话框显示自定义内容。

## 前置条件

本组件依赖 [ofa.js](https://github.com/ofajs/ofa.js)，请先在页面中引入 ofa.js：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 使用方法

### 1. 引入组件

```html
<l-m src="https://ofajs.com/publics/_comps/anchor-dialog/anchor-dialog.html"></l-m>
```

### 2. 基本用法

```html
<button id="myButton">点击我</button>

<anchor-dialog>
  <article for="#myButton" style="width: 80vw">
    <h2>标题</h2>
    <p>这是对话框的内容。</p>
  </article>
</anchor-dialog>
```

## 属性说明

### article 元素属性

| 属性 | 说明 |
|------|------|
| `for` | CSS 选择器，指定触发对话框的元素 |
| `style` | 可选，设置对话框的样式（如宽度） |

## 示例

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>anchor-dialog</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://ofajs.com/publics/_comps/anchor-dialog/anchor-dialog.html"></l-m>
    <div style="text-align: center; padding: 100px">
      <button id="haha">Click Me</button>
      <anchor-dialog>
        <article for="#haha" style="width: 80vw">
          <h2>你好，我是webpack。</h2>
          <p>我是描述性文字。</p>
        </article>
      </anchor-dialog>
    </div>
  </body>
</html>
```

## 特性

- 点击遮罩层关闭对话框
- 支持自定义对话框样式
- 平滑的过渡动画效果
