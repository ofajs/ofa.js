# Component Module

Component modules are the core building blocks in ofa.js for creating reusable UI components. Through component modules, you can encapsulate HTML, CSS, and JavaScript into independent custom elements.

## Basic Structure

Component modules use the `<template component>` tag to define components. The following is the basic structure of a component module:

```html
<template component>
  <style>
    /* Component styles */
  </style>
  
  <!-- Component template content -->
  
  <script>
    export default {
      tag: "component-name",
      data: {},
      proto: {},
      // Other configuration options
    };
  </script>
</template>
```

## Component Definition Options

### tag (Required)

Defines the component's tag name, must follow Web Components naming conventions (contain a hyphen).

```javascript
{
  tag: "my-component"
}
```

### data

Defines the component's internal reactive data.

```javascript
{
  data: {
    count: 0,
    message: "Hello"
  }
}
```

### attrs

Defines properties that the component can receive from outside.

```javascript
{
  attrs: {
    title: "",
    disabled: false
  }
}
```

### proto

Defines the component's methods and computed properties.

```javascript
{
  proto: {
    increment() {
      this.count++;
    },
    get doubleCount() {
      return this.count * 2;
    }
  }
}
```

### watch

Defines data watchers, executes callback functions when data changes.

```javascript
{
  watch: {
    count(newValue, { watchers }) {
      console.log(`count changed to ${newValue}`);
    }
  }
}
```

### Lifecycle Hooks

Define lifecycle hook functions.

```javascript
{
  ready() {
    // Component ready
  },
  attached() {
    // Component mounted to DOM
  },
  detached() {
    // Component removed from DOM
  }
}
```

## Complete Example

```html
<template component>
  <style>
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .content {
      color: #666;
    }
    button {
      margin-top: 8px;
      padding: 4px 12px;
    }
  </style>
  
  <div class="header">{{title}}</div>
  <div class="content">
    <slot></slot>
  </div>
  <div>Count: {{count}}</div>
  <button on:click="increment">+1</button>
  
  <script>
    export default {
      tag: "my-card",
      attrs: {
        title: "Default Title"
      },
      data: {
        count: 0
      },
      proto: {
        increment() {
          this.count++;
        }
      },
      ready() {
        console.log("Component ready");
      }
    };
  </script>
</template>
```

## Using Components

After defining a component, you need to import it using the `<l-m>` tag before using it:

```html
<template page>
  <l-m src="./my-card.html"></l-m>
  
  <my-card title="Welcome">
    <p>This is the card content</p>
  </my-card>
</template>
```

## Key Points

- **template component**: Component module definition tag
- **tag**: Component tag name (required)
- **data**: Internal reactive data
- **attrs**: External properties
- **proto**: Methods and computed properties
- **watch**: Data watchers
- **Lifecycle Hooks**: ready, attached, detached
- **l-m Tag**: Import component module
