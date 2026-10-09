# anchor-dialog

[简体中文](./README-cn.md)

Anchor dialog component that displays a dialog with custom content when clicking on specific elements.

## Prerequisites

This component depends on [ofa.js](https://github.com/ofajs/ofa.js). Please include ofa.js in your page first:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Usage

### 1. Import Component

```html
<l-m src="https://ofajs.com/publics/_comps/anchor-dialog/anchor-dialog.html"></l-m>
```

### 2. Basic Usage

```html
<button id="myButton">Click Me</button>

<anchor-dialog>
  <article for="#myButton" style="width: 80vw">
    <h2>Title</h2>
    <p>This is the dialog content.</p>
  </article>
</anchor-dialog>
```

## Properties

### article Element Attributes

| Attribute | Description |
|-----------|-------------|
| `for` | CSS selector specifying the element that triggers the dialog |
| `style` | Optional, sets the dialog styles (e.g., width) |

## Example

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
          <h2>Hello, I am webpack.</h2>
          <p>I am descriptive text.</p>
        </article>
      </anchor-dialog>
    </div>
  </body>
</html>
```

## Features

- Click on mask layer to close dialog
- Support custom dialog styles
- Smooth transition animations
