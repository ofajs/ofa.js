# 模板渲染 - 内容渲染

ofa.js 提供了强大的模板渲染引擎，包含丰富的模板语法，能够帮助开发者快速构建应用。首先我们从最常用的文本渲染开始介绍。

## 页面数据绑定

在 ofa.js 中，每个页面都有一个 `data` 对象，你可以在其中定义需要在页面中使用的变量。当页面开始渲染时，会自动将 `data` 对象中的数据与模板进行绑定，然后在模板中使用 `{{变量名}}` 的语法来渲染对应变量的值。

## 文本渲染

文本渲染是最基础的渲染方式，你可以在模板中使用 `{{变量名}}` 语法来显示 `data` 对象中相应变量的值。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

## 渲染 HTML 内容

通过为元素添加 `:html` 指令，可将对应变量中的 HTML 字符串解析并安全地插入元素内部，轻松实现富文本动态渲染或外部 HTML 片段的嵌入。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p :html="val"></p>
  <script>
    export default async () => {
      return {
        data: {
          val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
        },
      };
    };
  </script>
</template>
```

## `<code>` / `<pre>` 等元素内 `{{}}` 不解析（重要）

`{{变量名}}` 只在**普通元素的文本节点**中生效。**`<code>`、`<pre>`（以及 `<script>`、`<style>`、`<textarea>`）等元素内的内容被当作"原样代码/文本"，`{{}}` 不会被解析**，会原样显示成字面字符串。

❌ **错误写法**（`<code>` 内 `{{$data.code}}` 显示为字面文本）：

```html
<o-fill :value="rows">
  <div class="td"><code>{{$data.code}}</code></div>
</o-fill>
```

✅ **正确写法**（改用普通元素 + 样式模拟等宽字体）：

```html
<o-fill :value="rows">
  <div class="td"><span class="mono">{{$data.code}}</span></div>
</o-fill>
```

```css
.mono {
  font-family: Menlo, Consolas, monospace;
  font-size: 13px;
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 4px;
}
```

- 踩坑特征：页面其余 `{{}}` 都正常渲染，唯独 `<code>`/`<pre>` 内的值显示为 `{{xxx}}` 字面、控制台无报错
- 排查口诀：凡是"代码/预格式化/脚本/样式"语义的标签，动态值一律换普通元素（`span`/`div`）或用 `:html` 注入

## 关键要点

- **数据对象**：每个页面都有 `data` 对象用于存储变量
- **文本绑定**：使用 `{{变量名}}` 语法渲染文本内容
- **HTML 渲染**：使用 `:html` 指令渲染 HTML 字符串
- **自动绑定**：页面渲染时自动将 data 与模板绑定
