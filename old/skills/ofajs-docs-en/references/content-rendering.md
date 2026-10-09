# Template Rendering - Content Rendering

ofa.js provides a powerful template rendering engine with rich template syntax to help developers build applications quickly. Let's start with the most commonly used text rendering.

## Page Data Binding

In ofa.js, each page has a `data` object where you can define variables needed in the page. When the page starts rendering, it automatically binds the data in the `data` object to the template, and then uses the `{{variableName}}` syntax in the template to render the corresponding variable value.

## Text Rendering

Text rendering is the most basic rendering method. You can use the `{{variableName}}` syntax in the template to display the value of the corresponding variable in the `data` object.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
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

## Rendering HTML Content

By adding the `:html` directive to an element, you can parse and safely insert HTML strings from the corresponding variable into the element, easily achieving dynamic rendering of rich text or embedding external HTML fragments.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p :html="val"></p>
  <script>
    export default async () => {
      return {
        data: {
          val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
        },
      };
    };
  </script>
</template>
```

## Key Points

- **Data Object**: Each page has a `data` object for storing variables
- **Text Binding**: Use `{{variableName}}` syntax to render text content
- **HTML Rendering**: Use `:html` directive to render HTML strings
- **Auto Binding**: Data is automatically bound to template when page renders
