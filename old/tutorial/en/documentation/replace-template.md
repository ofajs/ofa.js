# replace-temp Component

When we attempt to render a list inside special elements such as select or table, the browser may automatically remove the `<x-fill>` component, causing the list rendering to fail. In this case, the replace-temp approach can be used to resolve the issue.

The usage method is: set `is="replace-temp"` on the `<template>` tag, and place it inside an element that the browser will automatically correct.

<o-playground name="replace-temp component" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

