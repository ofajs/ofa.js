# 嵌套页面/路由

在 ofa.js 中，嵌套页面（也称为嵌套路由）是一种强大的功能，允许你创建具有父子层级关系的页面结构。父页面作为一个布局容器，通过 `<slot>` 插槽来渲染子页面的内容。

## 基本概念

- **父页面（Layout）**：作为布局容器的页面，包含了导航栏、侧边栏等公共 UI 元素
- **子页面**：具体的业务页面内容，会被渲染到父页面的 `<slot>` 插槽位置

## 父页面的写法

父页面需要使用 `<slot></slot>` 标签来为子页面预留渲染位置。

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <div class="content">
    <slot></slot>
  </div>
</template>
```

## 子页面的写法

子页面通过导出 `parent` 属性来指定父页面路径。

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
    export const parent = 'layout.html'; // ⚠️ 关键代码

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

## 父页面的路由监听

父页面可以通过 `routerChange` 生命周期钩子来监听路由变化，这在你需要根据当前路由更新导航状态时非常有用。

```html
<template page>
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## 注意事项

- `parent` 属性值可以是相对路径（如 `./layout.html`）或绝对路径（如 `/pages/layout.html`）
- 父页面必须包含 `<slot></slot>` 标签，否则子页面内容将无法显示
- 父页面的样式会继承到子页面，子页面也可以定义自己的样式
- 使用 `routerChange` 钩子可以监听路由变化，实现导航高亮等功能

## 多级嵌套

父页面也可以拥有自己的父页面，形成多级嵌套结构。

```html
<!-- 子页面 -->
<template page>
  <p>子页面内容</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- 父页面 -->
<template page>
  <div class="layout">
    <nav>导航栏</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## 关键要点

- **父页面**：使用 `<slot>` 为子页面预留渲染位置
- **子页面**：通过 `export const parent` 指定父页面路径
- **routerChange 钩子**：监听路由变化，更新导航状态
- **多级嵌套**：支持多层级嵌套结构
- **路径格式**：支持相对路径和绝对路径
