# 插槽

插槽是组件中用于接收外部内容的占位符。通过使用插槽，你可以创建可复用的组件，同时允许使用组件的人自定义组件内部的内容。

## 默认插槽

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp>
    <div>Hello, OFAJS!</div>
  </demo-comp>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 8px;
    }
  </style>插槽内容：
  <br />
  <span style="color: red;">
    <slot></slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

### 插槽默认内容

当父组件没有提供插槽内容时，`<slot></slot>` 内部的元素将作为默认内容显示。

```html
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 8px;
      margin-bottom: 10px;
    }
  </style>插槽内容：
  <span style="color: red;">
    <slot>
      <div>这是默认内容</div>
    </slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

## 命名插槽

当组件需要多个插槽位置时，可以使用命名插槽来区分不同的插槽。通过 `<slot name="xxx">` 定义具名插槽，在使用时通过 `slot="xxx"` 属性指定内容放入哪个插槽。

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp>
    <div>Hello, OFAJS!</div>
    <div slot="footer">Footer Content</div>
  </demo-comp>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 8px;
    }
  </style>插槽内容：
  <br />
  <span style="color: red;">
    <slot></slot>
  </span>
  <br />
  <span style="color: blue;">
    <slot name="footer"></slot>
  </span>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
      };
    };
  </script>
</template>
```

## 多层级插槽传递

插槽内容可以跨越多层组件进行传递。当父组件向子组件传递插槽内容后，子组件可以继续将这个插槽内容传递给自己的子组件，实现插槽的多层透传。

## 关键要点

- **默认插槽**：使用 `<slot></slot>` 定义默认插槽
- **默认内容**：`<slot>` 内部的内容作为默认显示
- **命名插槽**：使用 `<slot name="xxx">` 定义具名插槽
- **插槽指定**：使用 `slot="xxx"` 属性指定内容放入哪个插槽
- **多层传递**：支持插槽内容跨越多层组件传递
