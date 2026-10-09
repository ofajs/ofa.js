# replace-temp 组件

当我们尝试在 select 或 table 等特殊元素内进行列表渲染时，浏览器可能会自动移除 `<x-fill>` 组件，导致列表渲染失败。此时可以使用 replace-temp 的方式来解决这个问题。

使用方法是：在 `<template>` 标签上设置 `is="replace-temp"`，并将其放在浏览器会自动修正的元素内部。

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

## 使用场景

`replace-temp` 组件主要用于解决以下问题：

1. **在 `<select>` 元素内使用列表渲染**：浏览器会自动修正 `<select>` 内的非 `<option>` 元素
2. **在 `<table>` 元素内使用列表渲染**：浏览器会自动修正 `<table>` 内的非表格相关元素
3. **其他浏览器会自动修正结构的场景**

## 工作原理

当浏览器遇到 `<template is="replace-temp">` 时，ofa.js 会：
1. 保留模板内容不被浏览器自动修正
2. 在渲染时将模板内容替换到正确的位置
3. 确保列表渲染等功能正常工作
