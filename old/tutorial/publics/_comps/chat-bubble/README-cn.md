# chat-bubble

聊天气泡组件，用于显示聊天消息，支持头像和内容自定义。

## 前置条件

本组件依赖 [ofa.js](https://github.com/ofajs/ofa.js)，请先在页面中引入 ofa.js：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 使用方法

### 1. 引入组件

```html
<l-m src="https://ofajs.com/publics/_comps/chat-bubble/chat-bubble.html"></l-m>
```

### 2. 基本用法

```html
<chat-bubble>
  <img src="avatar.png" slot="avatar" alt="用户名" />
  这是消息内容
</chat-bubble>
```

## 插槽说明

| 插槽名 | 说明 |
|--------|------|
| `avatar` | 头像图片，会自动应用圆形样式 |
| 默认插槽 | 消息内容 |

## 示例

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>chat-bubble</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://ofajs.com/publics/_comps/chat-bubble/chat-bubble.html"></l-m>
    <div style="text-align: center; padding: 100px">
      <chat-bubble>
        <img src="https://ofajs.com/publics/sources/webpack.svg" slot="avatar" alt="webpack" />
        你好，我是 webpack。
      </chat-bubble>
    </div>
  </body>
</html>
```

## 特性

- 自动圆形头像显示
- 气泡样式带阴影效果
- 支持头像和内容插槽
