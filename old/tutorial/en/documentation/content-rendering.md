# Template Rendering

ofa.js provides a powerful template rendering engine with rich template syntax, which can help developers quickly build applications. First, let's start with the most commonly used text rendering.

## Page Data Binding

In ofa.js, each page has a `data` object, in which you can define variables that need to be used on the page. When the page starts rendering, the data in the `data` object is automatically bound to the template, and then the syntax `{{variable name}}` is used in the template to render the value of the corresponding variable.

## Text Rendering

Text rendering is the most basic form of rendering; you can use the `{{variableName}}` syntax in templates to display the value of the corresponding variable in the `data` object.

<o-playground name="Text Rendering Example" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

## Rendering HTML Content

By adding the `:html` directive to an element, the HTML string in the corresponding variable is parsed and safely inserted inside the element, enabling effortless dynamic rich-text rendering or embedding of external HTML fragments.

<o-playground name="Render HTML Content Example" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

