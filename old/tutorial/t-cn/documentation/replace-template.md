# replace-temp 組件



當我們嘗試在 select 或 table 等特殊元素內進行列錶渲染時，瀏覽器可能會自動移除 `<x-fill>` 組件，導緻列錶渲染失敗。此時可以使用 replace-temp 的方式來解決這個問題。

使用方法是：在 `<template>` 標籤上設置 `is="replace-temp"`，並將其放在瀏覽器會自動脩正的元素內部。

<o-playground name="replace-temp 組件" style="--editor-height: 500px">
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

