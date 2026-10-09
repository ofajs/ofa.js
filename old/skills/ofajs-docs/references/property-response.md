# 属性响应

在前面的属性绑定中我们介绍了简单的属性响应机制，即如何将组件的属性值渲染到文本展示上。

ofa.js 不仅支持对基本属性值的响应，还支持对多层嵌套对象内部属性值的响应式渲染。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p style="color: blue;">count: {{count}}</p>
  <p style="color: green;">count2: {{obj.count2}}</p>
  <button on:click="handleAddCount">增加</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 20,
          obj: {
            count2: 100,
          },
        },
        proto:{
          handleAddCount(){
            this.count++;
            this.obj.count2++;
          }
        },
      };
    };
  </script>
</template>
```

## 响应式数据

所有绑定到 ofa.js 实例对象上的数据都会自动转换为响应式数据。响应式数据仅支持字符串、数字、布尔值、数组、对象等基本数据类型。对于函数、类实例等复杂数据类型，则需要作为**非响应式属性**进行存储，这些属性的变化不会触发组件的重新渲染。

## 非响应式数据

有时我们需要存储一些不需要响应式更新的数据，例如 Promise 实例、正则表达式对象或其他复杂对象，这时就需要使用非响应式属性。这些属性的变化不会触发组件的重新渲染，适用于存储不需要视图联动的数据。

非响应式属性的命名通常在属性名前添加下划线 `_` 作为前缀，以示与响应式属性的区分。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p style="color: blue;">count: {{count}}</p>
  <p style="color: green;">count2: {{_count2}}</p>
  <button on:click="count++">Blue increases</button>
  <button on:click="_count2++">Green increments</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 20,
          _count2: 100,
        },
      };
    };
  </script>
</template>
```

在点击`Green increments`按钮时，虽然 `_count2` 的数值实际上已经增加了，但由于它是非响应式属性，不会触发视图更新，因此界面上的显示并未改变。当点击`Blue increases`按钮时，由于 `count` 是响应式属性，会触发整个组件的重新渲染，这时才会同步更新Green的显示内容。

非响应式的对象数据，性能会比响应式的对象数据性能更好，因为非响应式数据不会触发组件的重新渲染。

## 关键要点

- **响应式数据**：自动转换，支持基本数据类型（字符串、数字、布尔值、数组、对象）
- **嵌套对象**：支持多层嵌套对象的响应式渲染
- **非响应式属性**：使用 `_` 前缀命名，适用于复杂数据类型
- **性能优化**：非响应式数据性能更好，不会触发重新渲染
- **视图联动**：只有响应式属性变化才会触发视图更新
