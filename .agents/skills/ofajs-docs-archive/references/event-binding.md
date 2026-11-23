# 事件绑定

在 ofa.js 中，事件绑定是实现用户交互的重要机制。你可以通过多种方式为元素绑定事件处理器，从而响应用户的操作。

## 从 proto 绑定事件

这是推荐的事件绑定方式，适用于复杂的事件处理逻辑。将事件处理函数定义在 `proto` 对象中，可以更好地组织代码逻辑，并且便于维护和复用。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="clickMe">Click Me - {{count}}</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 1,
        },
        proto:{
          clickMe(){
            this.count++;
          }
        }
      };
    };
  </script>
</template>
```

## 直接运行函数

对于简单的操作（如计数器增加、状态切换等），可以直接在事件属性中编写简短的表达式。这种方式简洁明了，适合处理简单逻辑。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="count++">Click Me - {{count}}</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 1,
        }
      };
    };
  </script>
</template>
```

## 支持的事件类型

ofa.js 支持所有标准 DOM 事件，包括但不限于：

- 鼠标事件：`click`、`dblclick`、`mousedown`、`mouseup`、`mouseover`、`mouseout` 等
- 键盘事件：`keydown`、`keyup`、`keypress` 等
- 表单事件：`submit`、`change`、`input`、`focus`、`blur` 等
- 触摸事件：`touchstart`、`touchmove`、`touchend` 等

ofa.js 支持的事件类型与原生 DOM 事件完全一致，更多细节可参考 [MDN 事件文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)。

## 传递参数到事件处理器

你也可以向事件处理器传递参数：

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
  <button on:click="addNumber(10)">Add 10 - Current: {{count}}</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
        },
        proto: {
          addNumber(num) {
            this.count += num;
          }
        }
      };
    };
  </script>
</template>
```

## 访问事件对象

在事件处理器中，你可以通过 `event` 参数访问原生事件对象：

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .container {
      width: 300px;
      height: 200px;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  <div class="container" on:click="handleClick">点击任意位置查看坐标</div>
  <p>X: {{x}}, Y: {{y}}</p>
  <script>
    export default async () => {
      return {
        data: {
          x: 0,
          y: 0,
        },
        proto: {
          handleClick(event) {
            this.x = event.clientX;
            this.y = event.clientY;
          }
        }
      };
    };
  </script>
</template>
```

你也可以在表达式中使用 `$event` 参数访问原生事件对象，例如获取鼠标点击坐标：

```html
<div class="container" on:click="handleClick($event)">点击任意位置查看坐标</div>
```

## 监听自定义事件

除了监听原生 DOM 事件，你还可以轻松监听组件发出的自定义事件：

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

## 关键要点

- **事件绑定语法**：使用 `on:事件名="处理函数"` 绑定事件
- **proto 方式**：推荐在 `proto` 对象中定义事件处理函数
- **直接表达式**：简单操作可直接在事件属性中编写表达式
- **参数传递**：支持向事件处理器传递参数
- **事件对象**：通过 `event` 参数或 `$event` 变量访问原生事件对象
- **自定义事件**：支持监听组件发出的自定义事件
