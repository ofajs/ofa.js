# Non-explicit Components

ofa.js has two built-in implicit components:

* Conditional rendering components: `x-if`、`x-else-if`、`x-else`
* Fill component: `x-fill`

The functions of these two components are respectively the same as those of the `o-if` and `o-fill` components, but they themselves are not rendered to the DOM; instead, their internal elements are directly rendered to the corresponding area.

for example:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- The style is not red, because the o-if component itself exists in the DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- The style is red, because the x-if component does not render to the DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Non-explicit Component" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Selects first-level .item elements in red */
            color:red;
        }
        /* Need to select .item elements inside the o-if component */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- Not red because the o-if component itself exists in the DOM -->
                <div class="item">Will not appear in red</div>
            </o-if>
            <x-if :value="true">
                <!-- Red because the x-if component is not rendered into the DOM -->
                <div class="item">Appears in red</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if Conditional Rendering Component

`x-if` has exactly the same functionality as [o-if](./conditional-rendering.md), used to decide whether to render content based on the truthiness of a conditional expression. The difference is that `x-if` itself does not exist as a DOM element; its inner content will be directly rendered into the parent container.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Welcome back, user!</p>
    </x-if>
</div>
```

`x-if` can also be used together with `x-else-if` and `x-else`:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Admin Panel</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>User Center</p>
    </x-else-if>
    <x-else>
        <p>Please log in</p>
    </x-else>
</div>
```

## x-fill fill component

`x-fill` has exactly the same functionality as [o-fill](./list-rendering.md), used to render array data into multiple DOM elements. Similar to `x-if`, `x-fill` itself will not be rendered into the DOM; its internal template will be directly rendered into the parent container.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Example of using named templates:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Performance Notes

In addition to functional differences, the rendering performance of non-explicit components will be **much worse** than that of explicit components (`o-if`, `o-fill`). This is because non-explicit components are not actually rendered into the DOM, requiring additional simulated rendering logic to handle the positioning and updating of internal elements.

In addition, non-explicit components may introduce subtle bugs: since they do not actually enter the DOM, operations that depend on DOM structure (such as event binding, style calculation, or third-party library queries) may fail or behave unexpectedly.

Therefore, it is recommended to **prioritize explicit components** (`o-if`, `o-else-if`, `o-else`, `o-fill`), and only use non-explicit components in specific scenarios.

## Use Cases

Although non-explicit components have poor performance, they may be used in the following scenarios:

1. **Avoid extra DOM levels**: When you don’t want `o-if` or `o-fill` elements to become part of the DOM structure  
2. **Style inheritance**: When you need inner elements to inherit the parent container’s styles directly, without interference from intermediate component elements  
3. **CSS selector constraints**: When you must use parent-child selectors (e.g., `.container > .item`) for precise styling but don’t want an extra wrapper element in between