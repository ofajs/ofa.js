# 领悟属性绑定

在之前的内容中，已经初步介绍了[属性绑定](./property-binding.md)的基本使用方法。之前的案例是用来绑定浏览器原生元素（如 `textarea`）的 `value` 属性，本节将深入探讨属性绑定的本质——它实际上是绑定到组件实例化后的 JavaScript 属性，而非 HTML 属性。

## 组件属性绑定机制

在 ofa.js 中，当我们在父组件中使用 `:toProp="fromProp"` 语法时，我们是在设置子组件实例的 JavaScript 属性，而不是设置 HTML 属性。这与直接设置 HTML 属性（如 `attr:toKey="fromKey"`）有重要区别。

以下示例展示了如何通过属性绑定向自定义组件传递数据：

<o-playground name="领悟属性绑定" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在这个例子中：
- 父组件中的 `val` 数据被绑定到子组件 `<demo-comp>` 的 `fullName` 属性
- 使用 `:full-name="val"` 语法将父组件的 `val` 值传递给子组件的 `fullName` 属性
- 子组件接收到该值后，在模板中通过 `{{fullName}}` 显示

## 属性绑定 vs 特征属性继承

需要注意的是，属性绑定（`:`）与特征属性继承（`attr:`）有以下关键差异：

### 属性绑定 (`:`)
- 绑定到组件实例的 JavaScript 属性
- 传递的数据保持原始类型（字符串、数字、布尔值等）
- 在组件内部可直接访问和修改，甚至不需要组件内部提前定义 `data`

### 特征属性继承 (`attr:`)
- 设置 HTML 属性
- 所有值都会转换为字符串
- 主要用于向底层 DOM 元素传递属性
- 需要特殊处理才能解析复杂数据
- 必须提前在组件内部定义 `attrs` 才能接收属性值

语法对比：
```html
<!-- 属性绑定：传递 JavaScript 值，保持数据类型 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- 属性继承：设置 HTML 属性，所有值转为字符串 -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- 实际传入字符串 "42" -->
```

## 案例对比差异

<o-playground name="案例对比差异" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
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
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

其中 `vone` 是组件实例的属性，`vtwo` 是 HTML 的 attribute 属性，attribute 属性的值会被 `[vtwo]` 选择器选中并应用样式，而 `vone` 是组件实例的属性，不会被 `[vone]` 选择器选中。

## 双向数据绑定

实例化后的组件，同样还支持双向数据绑定，使用 `sync:toProp="fromProp"` 语法。双向绑定允许父组件和子组件之间的数据同步，当任一侧的数据发生变化时，另一侧也会相应更新。

> 与 Angular 和 Vue 不同，ofa.js 无需为组件添加特殊配置或额外操作，即可原生支持双向数据绑定语法。

### 双向绑定示例

以下示例展示了如何在父组件和子组件之间建立双向数据绑定：

<o-playground name="双向绑定示例" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">父组件中的值: {{val}}</h3>
      <p>通过输入框修改父组件的值：</p>
      <input type="text" sync:value="val" placeholder="在输入框中输入文本...">
      <p>通过子组件修改父组件的值：</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>子组件显示的值: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="在子组件输入框中输入...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在这个例子中：
- 父组件的 `val` 和子组件的 `fullName` 通过 `sync:full-name="val"` 实现双向绑定
- 当在父组件的输入框中输入内容时，子组件会立即显示新值
- 当在子组件的输入框中输入内容时，父组件也会立即更新显示

### 双向绑定与普通属性绑定的区别

| 特性 | 普通属性绑定 (`:`) | 双向绑定 (`sync:`) |
|------|-------------------|-------------------|
| 数据流向 | 单向：父 → 子 | 双向：父 ↔ 子 |
| 语法 | `:prop="value"` | `sync:prop="value"` |
| 子组件修改 | 不影响父组件 | 影响父组件 |
| 适用场景 | 父组件向子组件传递配置 | 需要父子组件同步数据 |

### 注意事项

1. **性能考虑**：双向绑定会在数据变化时触发重新渲染，应谨慎使用在复杂场景中
2. **数据流控制**：过多的双向绑定可能导致数据流难以追踪，建议合理设计组件间的通信方式
3. **组件兼容性**：不是所有组件都适合使用双向绑定，需要考虑组件的设计目的