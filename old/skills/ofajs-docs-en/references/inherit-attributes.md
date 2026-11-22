# Passing Attributes

In ofa.js, attributes are one of the most common ways to pass data between components. Simply declare the required properties in the component's `attrs` object to pass external data into the component when using it.

## Basic Usage

### Defining Receiving Properties

Before using a component, you need to declare the properties to be received in the component's `attrs` object. Properties can have default values.

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp first="OFA" full-name="OFA Component Example"></demo-comp>
  <br>
  <demo-comp first="NoneOS" full-name="NoneOS Use Case"></demo-comp>
</template>
```

```html
<!-- demo-comp.html -->
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
```

### Important Rules

1. **Type Restriction**: Passed attribute values must be strings, other types will be automatically converted to strings.

2. **Naming Conversion**: Since HTML attributes are case-insensitive, when passing properties containing uppercase letters, you need to use `-` separated naming (kebab-case format).
   - For example: `fullName` → `full-name`

3. **Must Define**: If the component doesn't define the corresponding property in the `attrs` object, it cannot receive that attribute. The set value is the default value; if you don't want a default value, set it to `null`.

## Template Syntax Passing Attributes

In component templates, you can use the `attr:toKey="fromKey"` syntax to pass the current component's `fromKey` data to the child component's `toKey` property.

```html
<!-- page1.html -->
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
```

## Multi-Level Passing

Attributes can be passed layer by layer through multi-level nested components. If a component depends on other components, you need to import other component modules in the component.

## Key Points

- **attrs Object**: Declare properties to be received in the component
- **Type Restriction**: Passed values must be strings
- **Naming Conversion**: Use kebab-case format (`fullName` → `full-name`)
- **Default Values**: Set to `null` if you don't want a default value
- **Template Syntax**: Use `attr:toKey="fromKey"` to pass data
- **Multi-Level Passing**: Supports multi-level nested component layer-by-layer passing
