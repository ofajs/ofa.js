# Passing Feature Attributes

In ofa.js, [attributes](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes) are one of the most common ways to pass data between components. Simply declare the required attributes in the component's `attrs` object, and external data can be passed into the component when using it.

## Basic Usage

### Define Receiving Attributes

Before using a component, you need to declare the properties to be received in the component's `attrs` object. Properties can have default values.

<o-playground name="Basic Usage Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA Component Example"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS Use Case"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Important Rules

1. **Type Restriction**: The passed attribute value must be a string; other types will be automatically converted to strings.

2. **Naming Convention**: Since HTML attributes are case-insensitive, when passing attributes containing uppercase letters, you need to use a `-` separated naming (kebab-case format).
   - For example: `fullName` → `full-name`

3. **Must Be Defined**: If the component does not define the corresponding attribute in the `attrs` object, it cannot receive that attribute. The set value is the default value; if you do not want a default value, set it to `null`.

<o-playground name="Important Rules Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="Zhang San" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "Default Name",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Template Syntax Passing Attributes

In the component's template, you can use the `attr:toKey="fromKey"` syntax to pass the `fromKey` data of the current component to the `toKey` attribute of the child component.

<o-playground name="Attribute Passing Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
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
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Multi-level Propagation

Attributes can be passed layer by layer through multi-layer nested components.

If a component needs to depend on other components, it must import the modules of those other components within the component.

<o-playground name="Multi-level Passing Example" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Top-level data"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>Outer component received: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>Inner component received: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

