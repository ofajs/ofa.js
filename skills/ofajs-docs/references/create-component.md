# 创建组件

在 ofa.js 中，组件是实现页面复用和模块化的核心机制。组件本质上是一个自定义的 Web Component，通过定义模板、样式和逻辑，可以创建可复用的 UI 元素。

## 组件的基本结构

与页面模块不同，组件模块的 `<template>` 元素改用 `component` 属性，并声明 `tag` 属性指定组件标签名。

在需要使用组件的位置，通过 `l-m` 标签异步加载组件模块，系统会自动完成注册；随后即可像普通 HTML 标签一样直接使用该组件。

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp></demo-comp>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS 组件示例",
        },
      };
    };
  </script>
</template>
```

## 组件核心概念

### tag - 组件标签名

`tag` 是组件的标签名，**必须和组件的使用标签名一致**。例如，如果你的组件 `tag` 定义为 `"demo-comp"`，那么在 HTML 中使用时就必须写 `<demo-comp></demo-comp>`。

由于组件本质上是 Web Component，因此**组件标签名必须包含连字符 `-`**。这是 Web Component 规范的要求，以确保与原生 HTML 元素的标签名不冲突。例如 `demo-comp`、`my-button`、`user-card` 等都是有效的标签名，而 `democomp`、`button`、`card` 等没有连字符的标签名是无效的。

### 组件模块引用

通过 `l-m` 标签引入组件模块，组件模块会自动注册组件。这类似于使用 `script` 标签引入脚本，但 `l-m` 专门用于组件模块的加载和注册。

> 注意：`l-m` 引用标签是**异步引用**，适合在页面加载时按需加载组件。

## 同步引用组件

在某些场景下，你可能需要同步加载组件（例如确保组件在使用前已经注册完成）。这时可以使用 `load` 方法搭配 `await` 关键字来实现同步引用。

在组件模块和页面模块中，都会自动注入 `load` 函数，供开发者同步加载所需资源。

```html
<!-- demo.html -->
<template>
  <o-page src="page1.html"></o-page>
</template>
```

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <div>
    <demo-comp></demo-comp>
  </div>
  <script>
    // eslint-disable-next-line
    export default async ({ load }) => {
      await load("./demo-comp.html");
      return {
        data: {},
        proto: {},
      };
    };
  </script>
</template>
```

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async ({ load }) => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS 组件示例",
        },
      };
    };
  </script>
</template>
```

## 异步引用 vs 同步引用

| 引用方式 | 关键词 | 特点 |
|---------|-------|------|
| 异步引用 | `l-m` 标签 | 非阻塞加载，适合按需加载组件 |
| 同步引用 | `load` 方法搭配 `await` 关键字 | 阻塞加载，确保组件在使用前已注册 |

`l-m` 标签引用和 `load` 方法都可以加载组件模块，普遍情况建议使用 `l-m` 标签异步引用组件，以实现非阻塞加载和按需加载。

## 关键要点

- **组件定义**：使用 `<template component>` 定义组件，必须声明 `tag` 属性
- **组件引用**：使用 `l-m` 标签异步加载组件模块
- **同步加载**：使用 `load` 方法搭配 `await` 实现同步加载
- **标签名一致性**：`tag` 属性必须与使用时的标签名一致
- **异步优先**：建议使用异步引用实现非阻塞加载和按需加载
