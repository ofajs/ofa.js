# Non-Explicit Components

ofa.js has two built-in non-explicit components:

* Conditional rendering components: `x-if`, `x-else-if`, `x-else`
* Fill component: `x-fill`

These two components have the same functionality as `o-if` and `o-fill` components respectively, but they themselves are not actually rendered into the DOM, instead directly rendering their internal elements to the corresponding area.

For example:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- Style is not red, because o-if component itself exists in DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- Style is red, because x-if component won't render to DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

```html
<template page>
    <style>
    :host {
        display: block;
        border: 1px solid red;
        padding: 10px;
    }
    .container > .item {
        /* Select child-level .item elements as red */
        color:red;
    }
    /* Need to select .item elements inside o-if component */
    /* .container > o-if > .item {
        color:green;
    } */
    </style>
    <div class="container">
        <o-if :value="true">
            <!-- Style is not red, because o-if component itself exists in DOM -->
            <div class="item">Will not display as red</div>
        </o-if>
        <x-if :value="true">
            <!-- Style is red, because x-if component won't render to DOM -->
            <div class="item">Displays as red</div>
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
```

## x-if Conditional Rendering Component

`x-if` has exactly the same functionality as [o-if](./conditional-rendering.md), used to decide whether to render content based on the truthiness of a conditional expression. The difference is that `x-if` itself doesn't exist as a DOM element, its internal content is directly rendered into the parent container.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Welcome back, user!</p>
    </x-if>
</div>
```

`x-if` can also be used with `x-else-if` and `x-else`:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Admin Panel</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>User Center</p>
    </x-else-if>
    <x-else>
        <p>Please Login</p>
    </x-else>
</div>
```

## x-fill Fill Component

`x-fill` has exactly the same functionality as [o-fill](./list-rendering.md), used to render array data as multiple DOM elements. Similar to `x-if`, `x-fill` itself won't render into the DOM, its internal template is directly rendered into the parent container.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Example using named templates:

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

Besides functional differences, non-explicit components have **much worse** rendering performance than explicit components (`o-if`, `o-fill`). This is because non-explicit components don't actually render into the DOM, requiring additional simulation rendering logic to handle internal element positioning and updates.

Additionally, non-explicit components may cause some hard-to-detect bugs: since they don't actually enter the DOM, operations that depend on DOM structure (like event binding, style calculation, or third-party library queries) may fail or behave unexpectedly.

Therefore, it's recommended to **prioritize using explicit components** (`o-if`, `o-else-if`, `o-else`, `o-fill`), only using non-explicit components in specific scenarios.

## Use Cases

Although non-explicit components have poorer performance, they may be used in the following scenarios:

1. **Avoid Extra DOM Levels**: When you don't want `o-if` or `o-fill` elements to become part of the DOM structure
2. **Style Inheritance**: When you need internal elements to directly inherit parent container styles without being affected by intermediate component elements
3. **CSS Selector Limitations**: When you need to use parent direct child selectors (like `.container > .item`) to precisely control styles, but don't want extra wrapper elements in between
