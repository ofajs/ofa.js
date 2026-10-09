# replace-temp コンポーネント

私たちが select や table などの特殊な要素内でリストレンダリングを試みると、ブラウザが自動的に `<x-fill>` コンポーネントを削除し、リストレンダリングが失敗する可能性があります。この場合は replace-temp 方式を使用してこの問題を解決できます。

使用方法は、`<template>` タグに `is="replace-temp"` を設定し、ブラウザが自動的に修正する要素の内部に配置することです。

<o-playground name="replace-temp コンポーネント" style="--editor-height: 500px">
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

