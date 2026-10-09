# Nested Pages/Routes

In ofa.js, nested pages (also called nested routes) is a powerful feature that allows you to create page structures with parent-child hierarchical relationships. The parent page acts as a layout container, rendering child page content through `<slot>` slots.

## Basic Concepts

- **Parent Page (Layout)**: A page that serves as a layout container, containing common UI elements like navigation bars, sidebars, etc.
- **Child Page**: Specific business page content that will be rendered at the `<slot>` position of the parent page

## Parent Page Writing

The parent page needs to use the `<slot></slot>` tag to reserve a rendering position for child pages.

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <div class="content">
    <slot></slot>
  </div>
</template>
```

## Child Page Writing

Child pages specify the parent page path by exporting the `parent` property.

```html
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
    export const parent = 'layout.html'; // ⚠️ Key code

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

## Parent Page Route Listening

Parent pages can listen to route changes through the `routerChange` lifecycle hook, which is very useful when you need to update navigation state based on the current route.

```html
<template page>
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## Notes

- The `parent` property value can be a relative path (like `./layout.html`) or an absolute path (like `/pages/layout.html`)
- The parent page must contain a `<slot></slot>` tag, otherwise child page content will not display
- Parent page styles will be inherited by child pages, and child pages can also define their own styles
- Using the `routerChange` hook can listen to route changes to implement features like navigation highlighting

## Multi-Level Nesting

Parent pages can also have their own parent pages, forming multi-level nested structures.

```html
<!-- Child page -->
<template page>
  <p>Child page content</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- Parent page -->
<template page>
  <div class="layout">
    <nav>Navigation Bar</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## Key Points

- **Parent Page**: Use `<slot>` to reserve rendering position for child pages
- **Child Page**: Specify parent page path through `export const parent`
- **routerChange Hook**: Listen to route changes, update navigation state
- **Multi-Level Nesting**: Supports multi-level nested structures
- **Path Format**: Supports relative paths and absolute paths
