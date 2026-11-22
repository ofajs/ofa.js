# replace-temp 组件

当我们尝试在 select 或 table 等特殊元素内进行列表渲染时，浏览器可能会自动移除 `<x-fill>` 组件，导致列表渲染失败。此时可以使用 replace-temp 的方式来解决这个问题。

使用方法是：在 `<template>` 标签上设置 `is="replace-temp"`，并将其放在浏览器会自动修正的元素内部。

<o-playground name="replace-temp 组件" style="--editor-height: 500px">
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