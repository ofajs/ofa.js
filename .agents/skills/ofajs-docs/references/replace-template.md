# replace-temp 组件

在 `<select>`、`<table>` 等特殊元素内部进行列表渲染时，浏览器的 HTML
解析器会把非白名单元素（包括 `<o-fill>` 这类自定义元素）"修正"到错误
的位置（foster parenting），导致列表渲染失败。`replace-temp` 就是解决
这个问题的写法——**v5 仍然必需**：`<template>` 在解析器表格白名单内，
其内容能原样通过解析，ofa.js 在**编译期自动解包**（内容原位展开、
包装元素移除），无需任何手动处理。

## 使用方法

在 `<template>` 标签上设置 `is="replace-temp"`，放在浏览器会自动修正
结构的元素内部：

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
            <o-fill :value="items">
                <option>{{$data}}</option>
            </o-fill>
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

1. **在 `<select>` 元素内使用列表渲染**：解析器会把 `<select>` 内的非
   `<option>` 元素修正掉，上例写法可正常渲染
2. **在 `<table>`/`<tbody>` 内使用列表渲染**：见下一节的表格行专用写法
3. **其他解析器会自动修正结构的场景**

## 表格行的专用写法（重要）

`<option>` 可以内联在 `<o-fill>` 里，但 **`<tr>` 不行**：`<tr>` 只在
`<template>` 根层级被解析器放行，包在 `<o-fill>` 内部仍会被丢弃。表格
行的正确写法是 **replace-temp + 命名模板引用**——行内容写在顶层命名
模板里（根层级放行 tr），`<o-fill>` 用 `name` 引用它：

```html
<template page>
  <table class="table">
    <thead>
      <tr><th>列名称</th><th>列说明</th></tr>
    </thead>
    <tbody>
      <template is="replace-temp">
        <o-fill :value="$data.Columns" name="tableDetail"></o-fill>
      </template>
    </tbody>
  </table>

  <!-- 行内容写在顶层命名模板里：根层级的 tr 不会被解析器丢弃 -->
  <template name="tableDetail">
    <tr class="col-row">
      <td>{{$data.DbColumnName}}</td>
      <td>{{$data.ColumnDescription}}</td>
    </tr>
  </template>
</template>
```

命名模板内的行模板支持 `$data`（行数据）、`$host`（宿主组件）、
`$index`（索引），与内联写法一致。

## 工作原理

ofa.js 编译模板时会自动完成解包（`unwrapReplaceTemps`）：

1. 解析阶段：`<template is="replace-temp">` 凭借 template 的白名单
   身份，让内部内容原样通过解析器（不被 foster parenting 修正）
2. 编译阶段：ofa.js 把 replace-temp 的内容原位展开、包装元素移除，
   后续渲染与普通写法完全一致
3. 全程纯 DOM 移动，无序列化往返

因此 replace-temp 只是**静态模板的书写技巧**——用 JS 动态创建 DOM 时
（`document.createElement` + `append`）不受解析器限制，无需此写法。
