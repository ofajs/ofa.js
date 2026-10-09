# Quick Start

This section will introduce how to quickly get started with ofa.js. In subsequent tutorials, we will omit the index.html entry file creation step and only show page module file code. You can develop directly based on templates.

## Prepare Basic Files

To quickly get started with ofa.js, you only need to create a **page module** paired with an entry HTML. The required core files are as follows:

- `index.html`: The application's entry file, responsible for loading the ofa.js framework and importing the page module
- `demo-page.html`: The page module file, defining the page's specific content, styles, and data logic

### index.html (Application Entry)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Example</title>
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

The main purpose of this file is:
- Import the ofa.js framework
- Use the `<o-page>` component to load and render the page module

### demo-page.html (Page Module)

```html
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

This file defines a simple page component, including:
- `<template page>` tag, defining the page module
- CSS styles (using Shadow DOM's `:host` selector)
- Data binding expression `{{val}}`
- JavaScript logic, returning an object containing initial data

## Style Encapsulation

We define styles through the `<style>` tag inside the component. These internal styles only act within the component, have good encapsulation, and won't affect other elements on the page.

The `:host` selector is used to define styles for the component's host element. Here we set the component as a block-level element and add a red border and 10px padding.

## Data Binding

Through the `{{key}}` expression, you can render the corresponding value from component data onto the page.

## Key Points

- **Entry File**: index.html is responsible for importing the framework and loading the page module
- **Page Module**: Use `<template page>` to define page components
- **Style Isolation**: Component internal styles use Shadow DOM, won't affect external
- **`:host` Selector**: Defines styles for the component's host element
- **Data Binding**: Use `{{key}}` expression to bind data
