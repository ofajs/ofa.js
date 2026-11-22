# Injecting host styles

In Web Components, due to the limitations of the `slot` element, it is not possible to directly set styles for multi-level elements within the slot. To solve this problem, ofa.js provides the `<inject-host>` component, which allows injecting styles from within the component into the host element, thereby enabling style control over multi-level elements in the slot content.

> Note: It is recommended to use the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selector to style slot content first. Only use the `<inject-host>` component when the selector cannot meet the requirements.

## Basic Usage

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Set styles for direct child level elements */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* You can also set styles for multi-level nesting */
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

## Case

The following example demonstrates how to use `<inject-host>` to style nested elements within a slot. We create two components: a `user-list` component as the list container, and a `user-list-item` component as the list item. Through `<inject-host>`, we can style the `user-list-item` and its internal elements in the `user-list` component.

<o-playground name="Inject Host Styles" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
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
  </code>
  <code path="user-list-item.html">
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
  </code>
</o-playground>

You can see in the output:- The background color of the `user-list-item` component is aqua (set via the `<inject-host>` of the `user-list` component)  
- The text color of the name is red (set via the `<inject-host>` of the `user-list` component, styling `user-list-item .item-name`)

## How It Works

`<inject-host>` component will inject the content of the `<style>` tag it contains into the component's host element. In this way, the injected style rules can penetrate the component boundary and affect elements inside the slot.

In this way, you can:- Set styles for elements at any depth within slot content  
- Use a full selector path to ensure styles apply only to the target element  
- Maintain component style encapsulation while enabling flexible style piercing

## Notes

⚠️ **Style contamination risk**: Since injected styles act on the scope where the host element is located, they may affect elements within other components. When using, be sure to follow the following principles:

1. **Use specific selectors**: Try to use complete component tag paths, avoid overly broad selectors
2. **Add namespace prefixes**: Add unique prefixes to your style classes to reduce the possibility of conflicts with other components
3. **Avoid using generic tag selectors**: Try to use class names or attribute selectors instead of tag selectors
4. **Rethink component design**: Consider whether you can avoid using `<inject-host>` by optimizing component design. For example, using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selector on child components is often more elegant.

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
        .content {  <!-- Prone to conflict with other components -->
            color: red;
        }
    </style>
</inject-host>
```

### Performance Tips

Since `<inject-host>` triggers re-injection of host styles, which may cause component re-layout or re-rendering, use it with caution in frequently updated scenarios.  
If you only need to style the first-level elements within the slot, give priority to the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) pseudo-class selector, which can avoid the extra rendering overhead caused by penetration injection, thereby achieving better performance.