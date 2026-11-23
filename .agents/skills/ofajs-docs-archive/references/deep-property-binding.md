# 领悟属性绑定

在之前的内容中，已经初步介绍了属性绑定的基本使用方法。之前的案例是用来绑定浏览器原生元素的 `value` 属性，本节将深入探讨属性绑定的本质——它实际上是绑定到组件实例化后的 JavaScript 属性，而非 HTML 属性。

## 组件属性绑定机制

在 ofa.js 中，当我们在父组件中使用 `:toProp="fromProp"` 语法时，我们是在设置子组件实例的 JavaScript 属性，而不是设置 HTML 属性。这与直接设置 HTML 属性（如 `attr:toKey="fromKey"`）有重要区别。

```html
<!-- page1.html -->
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
```

```html
<!-- demo-comp.html -->
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
```

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

## 双向数据绑定

实例化后的组件，同样还支持双向数据绑定，使用 `sync:toProp="fromProp"` 语法。双向绑定允许父组件和子组件之间的数据同步，当任一侧的数据发生变化时，另一侧也会相应更新。

> 与 Angular 和 Vue 不同，ofa.js 无需为组件添加特殊配置或额外操作，即可原生支持双向数据绑定语法。

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

## 关键要点

- **属性绑定**：绑定到组件实例的 JavaScript 属性，保持数据类型
- **特征属性继承**：设置 HTML 属性，所有值转为字符串
- **双向绑定**：使用 `sync:` 语法实现父子组件数据同步
- **数据流向**：单向绑定 `:` 父→子，双向绑定 `sync:` 父↔子
