# chat-bubble

[简体中文](./README-cn.md)

Chat bubble component for displaying chat messages with customizable avatar and content.

## Prerequisites

This component depends on [ofa.js](https://github.com/ofajs/ofa.js). Please include ofa.js in your page first:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Usage

### 1. Import Component

```html
<l-m src="https://ofajs.com/publics/_comps/chat-bubble/chat-bubble.html"></l-m>
```

### 2. Basic Usage

```html
<chat-bubble>
  <img src="avatar.png" slot="avatar" alt="username" />
  This is the message content
</chat-bubble>
```

## Slots

| Slot Name | Description |
|-----------|-------------|
| `avatar` | Avatar image, automatically applies circular styling |
| Default slot | Message content |

## Example

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
        Hello, I am webpack.
      </chat-bubble>
    </div>
  </body>
</html>
```

## Features

- Automatic circular avatar display
- Bubble style with shadow effect
- Support for avatar and content slots
