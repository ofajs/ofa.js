# 模板渲染

ofa.js 提供了强大的模板渲染引擎，包含丰富的模板语法，能够帮助开发者快速构建应用。首先我们从最常用的文本渲染开始介绍。

## 页面数据绑定

在 ofa.js 中，每个页面都有一个 `data` 对象，你可以在其中定义需要在页面中使用的变量。当页面开始渲染时，会自动将 `data` 对象中的数据与模板进行绑定，然后在模板中使用 `{{变量名}}` 的语法来渲染对应变量的值。

## 文本渲染

文本渲染是最基础的渲染方式，你可以在模板中使用 `{{变量名}}` 语法来显示 `data` 对象中相应变量的值。

<o-playground name="文本渲染示例" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

## 渲染 HTML 内容

通过为元素添加 `:html` 指令，可将对应变量中的 HTML 字符串解析并安全地插入元素内部，轻松实现富文本动态渲染或外部 HTML 片段的嵌入。

<o-playground name="渲染 HTML 内容示例" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>