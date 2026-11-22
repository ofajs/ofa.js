# 非显式组件

ofa.js 内置包含两种非显式组件：

* 条件渲染组件：`x-if`、`x-else-if`、`x-else`
* 填充组件：`x-fill`

这两种组件的功能分别与 `o-if` 和 `o-fill` 组件相同，但它们本身不会真实渲染到 DOM 中，而是将其内部元素直接渲染到对应的区域。

例如：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 样式不为红色，因为 o-if 组件本身存在于 DOM 中 -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 样式为红色，因为 x-if 组件不会渲染到 DOM 中 -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="非显式组件" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 选择子一级 .item 元素为红色 */
            color:red;
        }
        /* 需要选择 o-if 组件内部的 .item 元素 */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- 样式不为红色，因为 o-if 组件本身存在于 DOM 中 -->
                <div class="item">不会显示为红色</div>
            </o-if>
            <x-if :value="true">
                <!-- 样式为红色，因为 x-if 组件不会渲染到 DOM 中 -->
                <div class="item">显示为红色</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if 条件渲染组件

`x-if` 与 [o-if](./conditional-rendering.md) 的功能完全相同，用于根据条件表达式的真假值决定是否渲染内容。区别在于 `x-if` 本身不会作为 DOM 元素存在，其内部内容会直接渲染到父级容器中。

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>欢迎回来，用户！</p>
    </x-if>
</div>
```

`x-if` 也可以配合 `x-else-if` 和 `x-else` 使用：

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>管理员面板</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>用户中心</p>
    </x-else-if>
    <x-else>
        <p>请登录</p>
    </x-else>
</div>
```

## x-fill 填充组件

`x-fill` 与 [o-fill](./list-rendering.md) 的功能完全相同，用于将数组数据渲染为多个 DOM 元素。与 `x-if` 类似，`x-fill` 本身不会渲染到 DOM 中，其内部模板会直接渲染到父级容器。

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

使用命名模板的示例：

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## 性能说明

除了功能上的区别外，非显式组件的渲染性能会比显式组件（`o-if`、`o-fill`）**差很多**。这是因为非显式组件不会真实渲染到 DOM 中，需要额外的模拟渲染逻辑来处理内部元素的定位和更新。

此外，非显式组件可能引发一些难以察觉的 bug：由于它们不会真正进入 DOM，依赖 DOM 结构的操作（如事件绑定、样式计算或第三方库查询）可能失效或表现异常。

因此，建议**优先使用显式组件**（`o-if`、`o-else-if`、`o-else`、`o-fill`），仅在特定场景下使用非显式组件。

## 使用场景

虽然非显式组件性能较差，但在以下场景中可能会用到：

1. **避免额外的 DOM 层级**：当你不想让 `o-if` 或 `o-fill` 元素成为 DOM 结构的一部分时
2. **样式继承**：当你需要让内部元素直接继承父容器的样式，而不受中间组件元素的影响时
3. **CSS 选择器限制**：当你需要使用父级直接子选择器（如 `.container > .item`）来精确控制样式，但不希望中间有额外的包装元素时