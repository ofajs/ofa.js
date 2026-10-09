# 传递特征属性

在 ofa.js 中，[特征属性（Attribute）](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes)是组件间传递数据最常用的方式之一。只需在组件的 `attrs` 对象中声明所需属性，即可在使用组件时将外部数据传入组件内部。

## 基本用法

### 定义接收属性

在使用组件之前，需要先在组件的 `attrs` 对象中声明需要接收的属性。属性可以设置默认值。

<o-playground name="基本用法示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA 组件示例"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS 使用案例"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 重要规则

1. **类型限制**：传递的 attribute 值必须是字符串，其他类型会被自动转换为字符串。

2. **命名转换**：由于 HTML 属性不区分大小写，传递包含大写字母的属性时，需要使用 `-` 分割命名（kebab-case 格式）。
   - 例如：`fullName` → `full-name`

3. **必须定义**：如果组件未在 `attrs` 对象中定义对应属性，则无法接收该 attribute。设置的值为默认值，如果不想要默认值则设置为 `null`。

<o-playground name="重要规则示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="张三" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "默认名称",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 模板语法传递 Attribute

在组件的模板中，可以使用 `attr:toKey="fromKey"` 语法，将当前组件的 `fromKey` 数据传递到子组件的 `toKey` 属性上。

<o-playground name="属性传递示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
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
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 多层级传递

可以通过多层嵌套组件逐层传递 attribute。

如果组件需要依赖其他组件，需要在组件中引入其他组件的模块。

<o-playground name="多层级传递示例" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="顶层数据"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>外层组件接收: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>内层组件接收: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
