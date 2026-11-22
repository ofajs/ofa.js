# Slots

Slots are placeholders in components used to receive external content. By using slots, you can create reusable components while allowing component users to customize the content inside the component.

## Default Slot

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp>
    <div>Hello, OFAJS!</div>
  </demo-comp>
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
  </style>Slot content:
  <br />
  <span style="color: red;">
    <slot></slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

### Slot Default Content

When the parent component doesn't provide slot content, the elements inside `<slot></slot>` will be displayed as default content.

```html
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 8px;
      margin-bottom: 10px;
    }
  </style>Slot content:
  <span style="color: red;">
    <slot>
      <div>This is default content</div>
    </slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

## Named Slots

When a component needs multiple slot positions, you can use named slots to distinguish different slots. Define named slots through `<slot name="xxx">`, and when using, specify which slot the content should go into through the `slot="xxx"` attribute.

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp>
    <div>Hello, OFAJS!</div>
    <div slot="footer">Footer Content</div>
  </demo-comp>
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
  </style>Slot content:
  <br />
  <span style="color: red;">
    <slot></slot>
  </span>
  <br />
  <span style="color: blue;">
    <slot name="footer"></slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

## Multi-Level Slot Passing

Slot content can be passed across multiple levels of components. When a parent component passes slot content to a child component, the child component can continue to pass this slot content to its own child components, achieving multi-level slot forwarding.

## Key Points

- **Default Slot**: Use `<slot></slot>` to define default slot
- **Default Content**: Content inside `<slot>` serves as default display
- **Named Slots**: Use `<slot name="xxx">` to define named slots
- **Slot Specification**: Use `slot="xxx"` attribute to specify which slot content goes into
- **Multi-Level Passing**: Supports slot content passing across multiple levels of components
