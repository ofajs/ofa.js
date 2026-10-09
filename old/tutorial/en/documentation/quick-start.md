# Quick Start

This section will introduce how to quickly get started with ofa.js. In subsequent tutorials, we will omit the step of creating the index.html entry file and only show the code of the page module files. You can directly develop based on the template.

## Prepare Basic Files

To quickly get started with ofa.js, just create a **page module** and pair it with an entry HTML. The core files needed are as follows:

- `index.html`: The entry file of the application, responsible for loading the ofa.js framework and importing the page module
- `demo-page.html`: The page module file, defining the specific content, styles, and data logic of the page

### index.html (Application Entry)

```html
<!-- index.html -->
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

The main purpose of this file is:- Import the ofa.js framework
- Use the `<o-page>` component to load and render page modules

### demo-page.html (page module)

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

This file defines a simple page component, including:- `<template page>` tag, defines a page module
- CSS styles (using the `:host` selector of Shadow DOM)
- Data binding expression `{{val}}`
- JavaScript logic, returns an object containing initial data


## Online Demo

The following is a live example in the online editor, you can directly modify the code and see the effect:

<o-playground name="Online Demo" style="--editor-height: 500px">
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

We define styles through the `<style>` tag inside the component; these internal styles only affect the component itself, offering good encapsulation and leaving other elements on the page unaffected.

The `:host` selector is used to define styles for the component's host element; here we set the component to be a block-level element and add a red border along with 10px of padding.

Through the `{{key}}` expression, you can render the corresponding value in the component data to the page.

Now you have successfully created your first ofa.js application! Next, let's delve into the template rendering syntax of ofa.js and its advanced features.