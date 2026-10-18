# 模板语法：内容、属性、事件、样式

## 内容渲染

ofa.js 提供了强大的模板渲染引擎，包含丰富的模板语法，能够帮助开发者快速构建应用。首先我们从最常用的文本渲染开始介绍。

### 页面数据绑定

在 ofa.js 中，每个页面都有一个 `data` 对象，你可以在其中定义需要在页面中使用的变量。当页面开始渲染时，会自动将 `data` 对象中的数据与模板进行绑定，然后在模板中使用 `{{变量名}}` 的语法来渲染对应变量的值。

### 文本渲染

文本渲染是最基础的渲染方式，你可以在模板中使用 `{{变量名}}` 语法来显示 `data` 对象中相应变量的值。

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

### 渲染 HTML 内容

通过为元素添加 `:html` 指令，可将对应变量中的 HTML 字符串解析并安全地插入元素内部，轻松实现富文本动态渲染或外部 HTML 片段的嵌入。

```html
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
```

### `<code>` / `<pre>` 等元素内 `{{}}` 不解析（重要）

`{{变量名}}` 只在**普通元素的文本节点**中生效。**`<code>`、`<pre>`（以及 `<script>`、`<style>`、`<textarea>`）等元素内的内容被当作"原样代码/文本"，`{{}}` 不会被解析**，会原样显示成字面字符串。

❌ **错误写法**（`<code>` 内 `{{$data.code}}` 显示为字面文本）：

```html
<o-fill :value="rows">
  <div class="td"><code>{{$data.code}}</code></div>
</o-fill>
```

✅ **正确写法**（改用普通元素 + 样式模拟等宽字体）：

```html
<o-fill :value="rows">
  <div class="td"><span class="mono">{{$data.code}}</span></div>
</o-fill>
```

```css
.mono {
  font-family: Menlo, Consolas, monospace;
  font-size: 13px;
  background: #f5f5f5;
  padding: 1px 6px;
  border-radius: 4px;
}
```

- 踩坑特征：页面其余 `{{}}` 都正常渲染，唯独 `<code>`/`<pre>` 内的值显示为 `{{xxx}}` 字面、控制台无报错
- 排查口诀：凡是"代码/预格式化/脚本/样式"语义的标签，动态值一律换普通元素（`span`/`div`）或用 `:html` 注入


## 属性绑定

ofa.js 支持将数据绑定到元素实例化后对象的属性上，如 input 元素的 value 或 checked 属性等。

### 单向属性绑定

单向属性绑定使用 `:toKey="fromKey"` 语法，将组件数据"单向"同步到 DOM 元素的属性。组件数据变动时，元素属性即时更新；但元素自身的变动（如用户输入）不会反向写回组件，保持数据流的单一与可控。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    input {
      margin: 5px 0;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
  </style>
  <p>当前值: {{val}}</p>
  <input type="text" :value="val" placeholder="这是一个单向绑定的输入框">
  <p>注意：直接在输入框中修改内容不会改变上面显示的值</p>
  <script>
    export default async () => {
      return {
        data: { val: "Hello ofa.js Demo Code" }
      };
    };
  </script>
</template>
```

### 双向属性绑定

双向属性绑定采用 `sync:xxx` 语法，实现了组件数据与DOM元素之间的双向同步。当组件数据变化时，DOM 元素的属性会更新；当 DOM 元素的属性发生变化时（如用户输入），也会同步更新组件数据。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid #007acc;
      padding: 10px;
    }
    input {
      margin: 5px 0;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
  </style>
  <p>当前值: {{val}}</p>
  <input type="text" sync:value="val" placeholder="这是一个双向绑定的输入框">
  <p>提示：在输入框中修改内容会实时更新上面显示的值</p>
  <script>
    export default async () => {
      return {
        data: { val: "Hello ofa.js Demo Code" }
      };
    };
  </script>
</template>
```

#### 双向绑定的特点

- 数据流向：组件 ↔ DOM 元素（双向）
- 组件数据变化 → DOM 元素更新
- DOM 元素变化 → 组件数据更新
- 适用于需要用户输入和数据同步的场景

#### 对象的双向绑定

对于对象类型的数据绑定，**不需要使用 `sync` 语法**，直接使用 `:` 单向传递即可。这是因为 JavaScript 的对象是引用共享的，当父组件将对象传递给子组件时，子组件获取到的是同一个对象的引用，对象的修改会直接反映到原始数据上。

ofa.js 保留了 JavaScript 的这一特性，因此对象的单向传递实际上就相当于双向传递。例如：

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "张三", age: 25 } }
      };
    };
  </script>
</template>
```

在 `child-comp` 组件中直接修改 `userData.name`，父组件中的 `userInfo.name` 也会同时更新，因为它们指向同一个对象引用。

#### 常见的双向绑定场景

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 15px;
      font-family: Arial, sans-serif;
    }
    .form-group {
      margin: 10px 0;
    }
    input, textarea, select {
      padding: 8px;
      margin: 5px 0;
      box-sizing: border-box;
    }
    .preview {
      margin-top: 15px;
      padding: 10px;
      background-color: #7b7b7bff;
      border-radius: 4px;
    }
  </style>
  <h3>表单双向绑定示例</h3>
  <div class="form-group">
    <label>文本输入框:</label>
    <input type="text" sync:value="textInput" placeholder="输入文本">
  </div>
  <div class="form-group">
    <label>数字输入框:</label>
    <input type="number" sync:value="numberInput" placeholder="输入数字">
  </div>
  <div class="form-group">
    <label>多行文本:</label>
    <textarea sync:value="textareaInput" rows="3" placeholder="输入多行文本"></textarea>
  </div>
  <div class="form-group">
    <label>选择框:</label>
    <select sync:value="selectedOption">
      <option value="">请选择...</option>
      <option value="option1">选项1</option>
      <option value="option2">选项2</option>
      <option value="option3">选项3</option>
    </select>
  </div>
  <div class="form-group">
    <label>复选框:</label>
    <label style="display:flex;">
      <input type="checkbox" sync:checked="isChecked" /> 我同意条款
    </label>
  </div>
  <div class="preview">
    <h4>实时预览:</h4>
    <p>文本: {{textInput}}</p>
    <p>数字: {{numberInput}}</p>
    <p>多行文本: {{textareaInput}}</p>
    <p>选择: {{selectedOption}}</p>
    <p>复选框状态: {{isChecked ? '已勾选' : '未勾选'}}</p>
  </div>
  <script>
    export default async () => {
      return {
        data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
      };
    };
  </script>
</template>
```

### 注意事项

1. **性能考虑**：双向绑定会创建数据监听器，大量使用可能影响性能
2. **数据一致性**：双向绑定确保数据和视图的一致性，但要注意避免无限循环更新
3. **初始值设置**：确保绑定的数据有合适的初始值，避免 undefined 显示问题
4. **事件冲突**：避免在同一元素上同时使用双向绑定和手动事件处理，以免造成冲突
5. **布尔属性禁用 `:prop`**：`disabled` / `checked` / `readonly` / `hidden` / `open` 等布尔属性必须用 `attr:disabled="isLoading"` 而非 `:disabled="isLoading"`——`:prop` 会把 `false` 渲染成属性字符串 `"false"`，HTML 布尔属性只要存在就生效（按钮永远禁用）；`attr:` 在值为 `false` 时直接取消属性设置
6. **绑定的键必须先在 data/attrs 声明**：`:prop` / `sync:` 等绑定表达式在初始化阶段立即求值，引用未声明的键会抛 `Error evaluating element expression ... ReferenceError: xxx is not defined`（不是 `undefined`），整页渲染中断；给模板新增绑定时记得同步在 `data` 补字段


## 深层属性绑定（`:toProp`）

在之前的内容中，已经初步介绍了属性绑定的基本使用方法。之前的案例是用来绑定浏览器原生元素的 `value` 属性，本节将深入探讨属性绑定的本质——它实际上是绑定到组件实例化后的 JavaScript 属性，而非 HTML 属性。

### 组件属性绑定机制

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

### 属性绑定 vs 特征属性继承

需要注意的是，属性绑定（`:`）与特征属性继承（`attr:`）有以下关键差异：

#### 属性绑定 (`:`)
- 绑定到组件实例的 JavaScript 属性
- 传递的数据保持原始类型（字符串、数字、布尔值等）
- 在组件内部可直接访问和修改，甚至不需要组件内部提前定义 `data`

#### 特征属性继承 (`attr:`)
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

### 双向数据绑定

实例化后的组件，同样还支持双向数据绑定，使用 `sync:toProp="fromProp"` 语法。双向绑定允许父组件和子组件之间的数据同步，当任一侧的数据发生变化时，另一侧也会相应更新。

> 与 Angular 和 Vue 不同，ofa.js 无需为组件添加特殊配置或额外操作，即可原生支持双向数据绑定语法。

#### 双向绑定与普通属性绑定的区别

| 特性 | 普通属性绑定 (`:`) | 双向绑定 (`sync:`) |
|------|-------------------|-------------------|
| 数据流向 | 单向：父 → 子 | 双向：父 ↔ 子 |
| 语法 | `:prop="value"` | `sync:prop="value"` |
| 子组件修改 | 不影响父组件 | 影响父组件 |
| 适用场景 | 父组件向子组件传递配置 | 需要父子组件同步数据 |

#### 注意事项

1. **性能考虑**：双向绑定会在数据变化时触发重新渲染，应谨慎使用在复杂场景中
2. **数据流控制**：过多的双向绑定可能导致数据流难以追踪，建议合理设计组件间的通信方式
3. **组件兼容性**：不是所有组件都适合使用双向绑定，需要考虑组件的设计目的


## 属性响应

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

### 响应式数据

所有绑定到 ofa.js 实例对象上的数据都会自动转换为响应式数据。响应式数据仅支持字符串、数字、布尔值、数组、对象等基本数据类型。对于函数、类实例等复杂数据类型，则需要作为**非响应式属性**进行存储，这些属性的变化不会触发组件的重新渲染。

### 非响应式数据

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


## 事件绑定

在 ofa.js 中，事件绑定是实现用户交互的重要机制。你可以通过多种方式为元素绑定事件处理器，从而响应用户的操作。

### 从 proto 绑定事件

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

### 直接运行函数

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

### 支持的事件类型

ofa.js 支持所有标准 DOM 事件，包括但不限于：

- 鼠标事件：`click`、`dblclick`、`mousedown`、`mouseup`、`mouseover`、`mouseout` 等
- 键盘事件：`keydown`、`keyup`、`keypress` 等
- 表单事件：`submit`、`change`、`input`、`focus`、`blur` 等
- 触摸事件：`touchstart`、`touchmove`、`touchend` 等

ofa.js 支持的事件类型与原生 DOM 事件完全一致，更多细节可参考 [MDN 事件文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)。

### 传递参数到事件处理器

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

### 访问事件对象

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

### 监听自定义事件

除了监听原生 DOM 事件，你还可以轻松监听组件发出的自定义事件：

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```


## 类和样式绑定

在 ofa.js 中，你可以通过动态绑定类名、样式和属性来实现灵活的 UI 状态管理。这使得界面可以根据数据的变化自动调整外观。

### 类绑定

类绑定允许你根据数据状态动态地添加或移除 CSS 类。你可以使用 `class:className="booleanExpression"` 的语法来绑定特定的类。

当 `booleanExpression` 为 `true` 时，类名会被添加到元素上；当为 `false` 时，类名会被移除。

#### 基础类绑定

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .hide {
      display: none;
    }
  </style>
  <button on:click="isHide = !isHide">Toggle Display</button>
  <p class="green" class:hide="isHide">{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          isHide: false,
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

#### 多个类绑定

你还可以同时绑定多个类，使元素根据不同的条件拥有不同的外观状态。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .active {
      background-color: #e6f7ff;
      border: 2px solid #1890ff;
    }
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .highlight {
      font-weight: bold;
      color: #52c41a;
    }
  </style>
  <button on:click="toggleStates">Toggle States</button>
  <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
    Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
  </p>
  <script>
    export default async () => {
      return {
        data: {
          isActive: false,
          isDisabled: false,
          isHighlighted: false,
        },
        proto: {
          toggleStates() {
            this.isActive = !this.isActive;
            this.isDisabled = !this.isDisabled;
            this.isHighlighted = !this.isHighlighted;
          }
        }
      };
    };
  </script>
</template>
```

### 样式绑定

样式绑定允许你直接设置内联样式的值，支持动态更新。ofa.js 提供了两种样式绑定方式：

#### 单一样式属性绑定

使用 `:style.propertyName` 语法来绑定特定的样式属性。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
  <button on:click="isGreen = !isGreen">Toggle Color</button>
  <script>
    export default async () => {
      return {
        data: {
          isGreen: false,
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

#### 多样式属性绑定

你也可以一次性绑定多个样式属性：

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
    Dynamic Styling Example
  </p>
  <button on:click="changeStyles">Change Styles</button>
  <script>
    export default async () => {
      return {
        data: {
          textColor: 'blue',
          fontSize: 16,
          bgColor: '#f0f0f0'
        },
        proto: {
          changeStyles() {
            this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
            this.fontSize = this.fontSize === 16 ? 20 : 16;
            this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
          }
        }
      };
    };
  </script>
</template>
```

### 属性绑定

除了类和样式绑定，你还可以动态绑定其他 HTML 属性。ofa.js 使用 `attr:attributeName` 语法来实现属性绑定。

#### 基础属性绑定

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    [bg-color="red"]{
        background-color: red;
    }
    [bg-color="green"]{
        background-color: green;
    }
  </style>
  <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
  <button on:click="changeColor">Change Color</button>  
  <script>
    export default async () => {
      return {
        data: {
          bgColor: "green",
          tooltipText: "这是一个提示信息",
          val: "Hover over me to see the title",
        },
        proto: {
          changeColor() {
            this.bgColor = this.bgColor === "green" ? "red" : "green";
          }
        }
      };
    };
  </script>
</template>
```

> ⚠️ **`attr:` 的值是 JavaScript 表达式，不是字符串字面量**——**纯静态的属性值不要用 `attr:`，直接写普通属性**（中文文案最容易踩）：
>
> ```html
> ❌ <button attr:title="点这里选择要看的订单状态">   <!-- 被当标识符求值 → ReferenceError，且中断整个组件 render -->
> ✅ <button title="点这里选择要看的订单状态">         <!-- 静态值 → 普通属性（ofa 不处理无指令前缀的属性） -->
> ✅ <button attr:title="'点这里选择要看的订单状态'">   <!-- 非要用 attr: 就包成字符串表达式 -->
> ✅ <button attr:title="locked ? '已锁定' : ''">     <!-- attr: 留给真正的动态表达式 -->
> ```
>
> 静态文案误写进 `attr:` 时，异常会**中断组件 render**：模板 HTML 已挂进 shadowRoot，但 `ready()` 不执行、后面的 `o-fill` / `o-if` 不展开、数据恒为空——表象像「绑定不生效 / 接口没返回」，极易误诊。详见 [pitfalls.md](./pitfalls.md) 的「模板指令的值是 JS 表达式」一节。

#### 布尔属性处理

对于布尔类型的属性（如 `disabled`, `hidden`），ofa.js 会根据绑定值的真假性来决定是否添加该属性。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
  <br /><br />
  <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
  <br /><br />
  <label>
    <input type="checkbox" on:change="toggleAll" /> Toggle All States
  </label>
  <script>
    export default async () => {
      return {
        data: {
          isDisabled: false,
          isChecked: true,
          isButtonDisabled: false,
        },
        proto: {
          handleButtonClick() {
            alert('Button clicked!');
          },
          toggleAll(event) {
            const checked = event.target.checked;
            this.isDisabled = checked;
            this.isChecked = checked;
            this.isButtonDisabled = checked;
          }
        }
      };
    };
  </script>
</template>
```

> **踩坑提示（布尔值与自定义 `data-*` 属性）**：
> `attr:disabled="isDisabled"` 这类**内置布尔属性**（disabled / hidden 等）会按绑定值的真假渲染（true 添加属性 / false 移除属性）；
> 但**自定义 `attr:data-xxx="boolValue"` 绑定布尔值时，`true` 会渲染成无值属性**（如 `<button data-active>`），JS 中 `e.target.dataset.active` 读到的是 `""`（空字符串）而非 `"true"`，`"" !== "true"` 会让取反逻辑判断出错。
> **修复**：绑定到 `data-*` 的布尔值必须显式转字符串：`attr:data-active="$data.isActive ? 'true' : 'false'"`。

### data() 函数

可以在样式中使用 `data(key)` 来绑定组件数据。这非常适合需要根据组件数据动态改变样式的场景。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      font-size: 10px;
      color:red;
      transition: all .3s ease;
    }
  </style>
  <style>
    p:hover {
      font-size: data(size);
      color: green;
      transition: all data(time)s ease;
    }
  </style>
  Hover FontSize: <input type="number" sync:value="size" placeholder="这是一个双向绑定的输入框" />
  <br />
  TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="这是一个双向绑定的输入框" />
  <p>{{val}} - size: {{size}}</p>
  <script>
    export default async () => {
      return {
        data: {
          size: 16,
          time: 0.3,
          val: "Hello ofa.js Demo Code",
        }
      };
    };
  </script>
</template>
```

### 注意事项

`style` 标签内的 `data(key)` 在原理上会替换整个 style 的内容。为避免重复渲染无关样式，建议将包含 `data(key)` 的样式单独放在一个 `style` 标签中，而不需要数据绑定的样式则放到另一个 `style` 标签里，以获得更好的性能表现。

```html
<!-- ❌ 不带有 data(key) 的 p:hover 也会被刷新 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
```

```html
<!-- ✅ 只带有 data(xxx) 的样式会被重新渲染 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```

