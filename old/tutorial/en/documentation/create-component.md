# Create Component

In ofa.js, components are the core mechanism for achieving page reuse and modularity. A component is essentially a custom Web Component; by defining its template, styles, and logic, you can create reusable UI elements.

## Component Basic Structure

Unlike page modules, component modules replace the `<template>` element's `page` attribute with a `component` attribute and declare a `tag` attribute to specify the component's tag name.

At the location where the component is needed, asynchronously load the component module via the `l-m` tag, and the system will automatically complete the registration; the component can then be used directly like a regular HTML tag.

<o-playground name="Component Basic Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
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
  </code>
</o-playground>

## Core Component Concepts

### tag - Component Tag Name

`tag` is the component's tag name and **must match the tag name used for the component**. For example, if your component's `tag` is defined as `"demo-comp"`, you must use `<demo-comp></demo-comp>` in the HTML.

Since components are essentially Web Components, **component tag names must contain a hyphen `-`**. This is a requirement of the Web Component specification to ensure they do not conflict with the tag names of native HTML elements. For example, `demo-comp`, `my-button`, `user-card`, etc. are valid tag names, while `democomp`, `button`, `card`, etc. without a hyphen are invalid.

### Component Module Reference

Introduce component modules through the `l-m` tag, and the component modules will automatically register the components. This is similar to using the `script` tag to introduce scripts, but `l-m` is specifically used for loading and registering component modules.

> Note: The `l-m` reference tag is an **asynchronous reference**, suitable for loading components on demand when the page loads.

## Sync Reference Component

In some scenarios, you may need to synchronously load components (e.g., to ensure that components are registered before use). In this case, you can use the `load` method with the `await` keyword to achieve synchronous reference.

In both component modules and page modules, the `load` function is automatically injected for developers to synchronously load the required resources.

<o-playground name="Synchronous Reference Component Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
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
  </code>
  <code path="demo-comp.html">
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
  </code>
</o-playground>

## Asynchronous Reference vs Synchronous Reference

| Citation Method | Keyword | Feature |
|-----------------|---------|---------|
| Asynchronous Citation | `l-m` tag | Non-blocking loading, suitable for on-demand component loading |
| Synchronous Citation | `load` method with `await` keyword | Blocking loading, ensures component is registered before use |`l-m` tag reference and `load` method can both load component modules. In general, it is recommended to use the `l-m` tag for asynchronous component loading to achieve non-blocking and on-demand loading.