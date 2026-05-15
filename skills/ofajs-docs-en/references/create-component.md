# Creating Components

In ofa.js, components are the core mechanism for implementing page reuse and modularization. A component is essentially a custom Web Component that creates reusable UI elements by defining templates, styles, and logic.

## Basic Component Structure

Unlike page modules, component modules use the `component` attribute on the `<template>` element and declare a `tag` attribute to specify the component tag name.

Where the component needs to be used, load the component module asynchronously through the `l-m` tag, and the system will automatically complete registration; then the component can be used directly like a regular HTML tag.

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp></demo-comp>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS Component Example",
        },
      };
    };
  </script>
</template>
```

## Core Component Concepts

### tag - Component Tag Name

`tag` is the component's tag name and **must be consistent with the component's usage tag name**. For example, if your component's `tag` is defined as `"demo-comp"`, then when using it in HTML, you must write `<demo-comp></demo-comp>`.

Since components are essentially Web Components, **component tag names must contain a hyphen `-`**. This is a requirement of the Web Component specification to ensure no conflict with native HTML element tag names. For example, `demo-comp`, `my-button`, `user-card` are all valid tag names, while `democomp`, `button`, `card` without hyphens are invalid.

### Component Module Reference

Component modules are imported through the `l-m` tag, which automatically registers the component. This is similar to using the `script` tag to import scripts, but `l-m` is specifically for loading and registering component modules.

> Note: The `l-m` reference tag is an **async reference**, suitable for loading components on demand during page load.

## Synchronous Component Reference

In some scenarios, you may need to load components synchronously (for example, to ensure the component is registered before use). In this case, you can use the `load` method with the `await` keyword to achieve synchronous reference.

In both component modules and page modules, a `load` function is automatically injected for developers to synchronously load required resources.

```html
<!-- demo.html -->
<template>
  <o-page src="page1.html"></o-page>
</template>
```

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <div>
    <demo-comp></demo-comp>
  </div>
  <script>
    // eslint-disable-next-line
    export default async ({ load }) => {
      await load("./demo-comp.html");
      return {
        data: {},
        proto: {},
      };
    };
  </script>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS Component Example",
        },
      };
    };
  </script>
</template>
```

## Async Reference vs Synchronous Reference

| Reference Method | Keyword | Features |
|---------|-------|------|
| Async reference | `l-m` tag | Non-blocking loading, suitable for on-demand component loading |
| Synchronous reference | `load` method with `await` keyword | Blocking loading, ensures component is registered before use |

Both `l-m` tag reference and `load` method can load component modules. Generally, it's recommended to use the `l-m` tag for async component reference to achieve non-blocking loading and on-demand loading.

## Key Points

- **Component Definition**: Use `<template component>` to define components, must declare `tag` attribute
- **Component Reference**: Use `l-m` tag to asynchronously load component modules
- **Synchronous Loading**: Use `load` method with `await` to achieve synchronous loading
- **Tag Name Consistency**: The `tag` attribute must be consistent with the tag name used
- **Async First**: Recommended to use async reference for non-blocking loading and on-demand loading
