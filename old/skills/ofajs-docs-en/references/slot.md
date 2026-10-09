# Slot

Slots are an important mechanism in ofa.js for content distribution. Through slots, parent components can pass content to specified positions inside child components, achieving flexible component composition.

## Basic Usage

### Default Slot

Use the `<slot>` tag to define a default slot position. Content placed in the component will be rendered at the slot position:

```html
<!-- my-card.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid #ddd;
      padding: 16px;
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
  </style>
  
  <div class="header">
    <slot name="header">Default Header</slot>
  </div>
  <div class="content">
    <slot>Default Content</slot>
  </div>
  
  <script>
    export default {
      tag: "my-card"
    };
  </script>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./my-card.html"></l-m>
  
  <my-card>
    <span slot="header">Custom Header</span>
    <p>Custom content text</p>
  </my-card>
</template>
```

### Named Slots

Use the `name` attribute to define named slots, and the `slot` attribute to specify the target slot:

```html
<!-- user-card.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid #ddd;
      padding: 16px;
    }
    .avatar {
      float: left;
      margin-right: 16px;
    }
    .info {
      overflow: hidden;
    }
    .name {
      font-size: 18px;
      font-weight: bold;
    }
    .description {
      color: #666;
      margin-top: 8px;
    }
  </style>
  
  <div class="avatar">
    <slot name="avatar">
      <div style="width: 60px; height: 60px; background: #ddd; border-radius: 50%;"></div>
    </slot>
  </div>
  <div class="info">
    <div class="name">
      <slot name="name">Unknown User</slot>
    </div>
    <div class="description">
      <slot name="description">No description</slot>
    </div>
  </div>
  
  <script>
    export default {
      tag: "user-card"
    };
  </script>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./user-card.html"></l-m>
  
  <user-card>
    <img slot="avatar" src="avatar.jpg" style="width: 60px; height: 60px; border-radius: 50%;" />
    <span slot="name">John Doe</span>
    <p slot="description">Frontend Developer, loves coding and design.</p>
  </user-card>
</template>
```

## Default Content

You can provide default content inside the `<slot>` tag. When no content is passed, the default content is displayed:

```html
<template component>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <div class="card">
    <slot>
      <p>Default content</p>
      <p>Will be displayed when no content is passed</p>
    </slot>
  </div>
  
  <script>
    export default {
      tag: "default-slot-demo"
    };
  </script>
</template>
```

## Slot Styling

### ::slotted Selector

Use the `::slotted()` selector to style slotted content:

```html
<template component>
  <style>
    :host {
      display: block;
    }
    /* Style slotted content */
    ::slotted(.highlight) {
      background-color: yellow;
    }
    ::slotted(p) {
      margin: 8px 0;
    }
  </style>
  
  <slot></slot>
  
  <script>
    export default {
      tag: "styled-slot"
    };
  </script>
</template>
```

### inject-host Component

For complex slot styling needs, you can use the `<inject-host>` component to inject styles:

```html
<template component>
  <inject-host>
    <style>
      parent-component child-component {
        background-color: blue;
      }
    </style>
  </inject-host>
  
  <slot></slot>
  
  <script>
    export default {
      tag: "complex-styled-slot"
    };
  </script>
</template>
```

## Slot and Data Binding

Slotted content can use the parent component's data:

```html
<template page>
  <l-m src="./my-card.html"></l-m>
  
  <my-card>
    <span slot="header">{{title}}</span>
    <p>{{content}}</p>
  </my-card>
  
  <script>
    export default async () => {
      return {
        data: {
          title: "Dynamic Title",
          content: "Dynamic content from data"
        }
      };
    };
  </script>
</template>
```

## Key Points

- **Default Slot**: Use `<slot>` to define default slot position
- **Named Slots**: Use `name` attribute and `slot` attribute to match
- **Default Content**: Content inside `<slot>` tag is default content
- **::slotted Selector**: Style slotted content
- **inject-host Component**: Complex slot styling solution
- **Data Binding**: Slotted content can use parent component data
