# replace-temp Component

When we try to perform list rendering inside special elements like select or table, the browser may automatically remove the `<x-fill>` component, causing list rendering to fail. In this case, you can use the replace-temp method to solve this problem.

The usage method is: set `is="replace-temp"` on the `<template>` tag, and place it inside elements that the browser will automatically correct.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <div>
    <select>
        <template is="replace-temp">
            <x-fill :value="items">
                <option>{{$data}}</option>
            </x-fill>
        </template>
    </select>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          items: ["A", "B", "C"],
        },
      };
    };
  </script>
</template>
```

## Use Cases

The `replace-temp` component is mainly used to solve the following problems:

1. **Using list rendering inside `<select>` elements**: The browser will automatically correct non-`<option>` elements inside `<select>`
2. **Using list rendering inside `<table>` elements**: The browser will automatically correct non-table-related elements inside `<table>`
3. **Other scenarios where the browser automatically corrects structure**

## Working Principle

When the browser encounters `<template is="replace-temp">`, ofa.js will:
1. Preserve the template content from being automatically corrected by the browser
2. Replace the template content to the correct position during rendering
3. Ensure list rendering and other functions work properly
