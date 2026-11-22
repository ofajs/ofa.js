# Injecting Host Styles

In Web Components, due to the limitations of `slot`, you cannot directly set styles for multi-level elements inside slots. To solve this problem, ofa.js provides the `<inject-host>` component, allowing you to inject styles into the host element from within a component, thereby achieving style control for multi-level elements inside slot content.

> Note: It's recommended to prioritize using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selector to set styles for slot content. Only use the `<inject-host>` component when requirements cannot be met.

## Basic Usage

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Set styles for direct child elements */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* Can also set styles for multi-level nested elements */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Example

The following example shows how to use `<inject-host>` to set styles for nested elements inside slots. We create two components: `user-list` component as a list container, and `user-list-item` component as list items. Through `<inject-host>`, we can set styles for `user-list-item` and its internal elements in the `user-list` component.

```html
<!-- index.html -->
<l-m src="./user-list.html"></l-m>
<l-m src="./user-list-item.html"></l-m>
<user-list>
  <user-list-item>
    <span>John</span>
    <span slot="age">25</span>
  </user-list-item>
  <user-list-item>
    <span class="item-name">Jane</span>
    <span slot="age">30</span>
  </user-list-item>
</user-list>
```

```html
<!-- user-list.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid gray;
      padding: 10px;
    }
  </style>
  <inject-host>
    <style>
      user-list user-list-item {
        background-color: blue;
        display: block;
        padding: 10px;
        margin: 5px 0;
      }
      user-list user-list-item .item-name {
        color: red;
        font-weight: bold;
      }
    </style>
  </inject-host>
  <slot></slot>
  <script>
    export default async () => {
      return {
        tag: "user-list",
      };
    };
  </script>
</template>
```

```html
<!-- user-list-item.html -->
<template component>
  <style>
    :host {
      display: block;
    }
  </style>
  <slot></slot>
  <div class="item-age">
    Age: <slot name="age"></slot>
  </div>
  <script>
    export default async () => {
      return {
        tag: "user-list-item",
      };
    };
  </script>
</template>
```

In the running result, you can see:
- `user-list-item` component's background color is aqua (set through `user-list` component's `<inject-host>`)
- Name text color is red (set through `user-list` component's `<inject-host>` setting `user-list-item .item-name` style)

## How It Works

The `<inject-host>` component injects the content of `<style>` tags inside it into the component's host element. This way, injected style rules can penetrate component boundaries and act on elements inside slots.

Through this approach, you can:
- Set styles for elements at any depth inside slot content
- Use complete selector paths to ensure styles only act on target elements
- Maintain component style encapsulation while achieving flexible style penetration

## Notes

⚠️ **Style Pollution Risk**: Since injected styles act on the scope where the host element is located, they may affect elements inside other components. When using, be sure to follow these principles:

1. **Use Specific Selectors**: Try to use complete component tag paths, avoid using overly broad selectors
2. **Add Namespace Prefixes**: Add unique prefixes to your style classes to reduce the possibility of conflicts with other components
3. **Avoid Using Generic Tag Selectors**: Try to use class names or attribute selectors instead of tag selectors
4. **Reflect on Component Design**: Consider whether you can avoid using `<inject-host>` by optimizing component design. For example, using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selector on child components is often more elegant.

```html
<!-- Recommended ✅: Use specific selectors -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- Not Recommended ❌: Use overly generic selectors -->
<inject-host>
    <style>
        .content {  /* Easy to conflict with other components */
            color: red;
        }
    </style>
</inject-host>
```

### Performance Tip

Since `<inject-host>` triggers host style re-injection, which may cause component reflow or repaint, please use cautiously in frequently updated scenarios.
If you only need to set styles for first-level elements inside slots, prioritize using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) pseudo-class selector, which can avoid additional rendering overhead from penetration injection and achieve better performance.
