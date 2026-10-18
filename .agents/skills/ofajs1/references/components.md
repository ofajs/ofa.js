# 组件与生命周期

## 创建组件

在 ofa.js 中，组件是实现页面复用和模块化的核心机制。组件本质上是一个自定义的 Web Component，通过定义模板、样式和逻辑，可以创建可复用的 UI 元素。

### 组件的基本结构

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

### 组件核心概念

#### tag - 组件标签名

`tag` 是组件的标签名，**必须和组件的使用标签名一致**。例如，如果你的组件 `tag` 定义为 `"demo-comp"`，那么在 HTML 中使用时就必须写 `<demo-comp></demo-comp>`。

由于组件本质上是 Web Component，因此**组件标签名必须包含连字符 `-`**。这是 Web Component 规范的要求，以确保与原生 HTML 元素的标签名不冲突。例如 `demo-comp`、`my-button`、`user-card` 等都是有效的标签名，而 `democomp`、`button`、`card` 等没有连字符的标签名是无效的。

#### 组件模块引用

通过 `l-m` 标签引入组件模块，组件模块会自动注册组件。这类似于使用 `script` 标签引入脚本，但 `l-m` 专门用于组件模块的加载和注册。

> 注意：`l-m` 引用标签是**异步引用**，适合在页面加载时按需加载组件。

### 同步引用组件

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

### 异步引用 vs 同步引用

| 引用方式 | 关键词 | 特点 |
|---------|-------|------|
| 异步引用 | `l-m` 标签 | 非阻塞加载，适合按需加载组件 |
| 同步引用 | `load` 方法搭配 `await` 关键字 | 阻塞加载，确保组件在使用前已注册 |

`l-m` 标签引用和 `load` 方法都可以加载组件模块，普遍情况建议使用 `l-m` 标签异步引用组件，以实现非阻塞加载和按需加载。


## 模块返回对象属性

> 本文档外链自：[模块返回对象属性](https://github.com/ofajs/ofa.js/blob/main/tutorial/cn/api/others/module-return.md)（tutorial 目录仅存在于 v4 的 `main` 分支，v5 分支未收录）

在 ofa.js 中，无论是页面模块还是组件模块，都需要通过 `export default async () => {}` 返回一个对象来定义模块的配置和行为。

### async 函数参数

`export default async () => {}` 中的 async 函数接收一个参数对象，包含以下属性：

#### 参数列表

| 参数 | 类型 | 页面模块 | 组件模块 | 说明 |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | 加载其他模块或资源的函数 |
| `url` | `string` | ✅ | ✅ | 当前页面或组件模块的文件地址 |
| `query` | `object` | ✅ | ❌ | URL 查询参数对象 |

#### load 参数

`load` 是一个用于加载其他模块、组件或资源的函数。在组件模块和页面模块中都可以使用。`load` 函数的加载效果与 `<l-m>` 组件一致，主要用于加载 ofa.js 页面或组件的 HTML 文件。

**同步加载**：使用 `await` 关键字，会阻塞执行直到模块加载完成。

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**异步加载**：不使用 `await` 关键字，返回 Promise 对象，不会阻塞执行。适合按需加载的场景。

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('模块加载完成:', someModule);
  });
  
  return {
    data: {}
  };
};
```

#### url 参数

`url` 参数在页面模块和组件模块中都可用，表示当前模块的文件地址。

```javascript
export default async ({ url }) => {
  console.log('当前模块地址:', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

#### query 参数

`query` 参数仅在页面模块中可用，包含 URL 中的查询参数。

```javascript
export default async ({ query }) => {
  console.log('查询参数:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

### 返回属性总览

| 属性 | 类型 | 页面模块 | 组件模块 | 说明 |
|------|------|:-------:|:-------:|------|
| `tag` | `string` | ❌ | ✅ 必须 | 组件标签名 |
| `data` | `object` | ✅ | ✅ | 响应式数据对象 |
| `attrs` | `object` | ❌ | ✅ | 组件属性定义 |
| `proto` | `object` | ✅ | ✅ | 方法和计算属性 |
| `watch` | `object` | ✅ | ✅ | 侦听器 |
| `ready` | `function` | ✅ | ✅ | DOM 创建完成时调用 |
| `attached` | `function` | ✅ | ✅ | 挂载到 DOM 时调用 |
| `detached` | `function` | ✅ | ✅ | 从 DOM 移除时调用 |
| `loaded` | `function` | ✅ | ✅ | 完全加载完成时调用 |
| `routerChange` | `function` | ✅ 父页面 | ❌ | 路由变化时调用 |

> **完整文档请查看**：[模块返回对象属性](https://github.com/ofajs/ofa.js/blob/main/tutorial/cn/api/others/module-return.md)（v4 `main` 分支的 tutorial）

## 生命周期

ofa.js 组件具有完整的生命周期钩子函数，允许你在组件的不同阶段执行特定的逻辑。这些钩子函数让你能够在组件创建、挂载、更新和销毁等关键时刻介入并执行相应的操作。

### 生命周期钩子函数

ofa.js 提供了以下几个主要的生命周期钩子函数，按照常用的顺序排列：

#### attached

`attached` 钩子在组件被插入到文档中时调用，表示组件已经挂载到页面上。这是最常用的生命周期钩子，通常用于执行需要在组件实际显示在页面上之后才能进行的初始化操作，避免在组件不可见时执行不必要的计算。此钩子也非常适合进行元素尺寸测量、动画启动等依赖于组件已渲染到页面的操作。

- **调用时机**: 组件被添加到 DOM 树中
- **主要用途**: 启动定时器、添加事件监听器、执行需要可见性的操作

#### detached

`detached` 钩子在组件从文档中移除时调用，表示组件即将被卸载。这个钩子适合清理资源，如清除定时器、移除事件监听器等。

- **调用时机**: 组件从 DOM 树中被移除
- **主要用途**: 清理资源、取消订阅、移除事件监听器

#### ready

`ready` 钩子在组件准备就绪时调用，此时组件的模板已经渲染完成，DOM 元素已经创建，但可能尚未插入到文档中。这个钩子适合进行 DOM 操作或初始化第三方库。

- **调用时机**: 组件模板渲染完成，DOM 已创建
- **主要用途**: 执行依赖 DOM 的初始化操作

#### loaded

`loaded` 钩子在组件及其所有子组件、异步资源全部加载完毕后触发，此时可安全移除 loading 状态或执行依赖完整组件树的后续操作。如果没有依赖，它会在 `ready` 钩子之后调用。

- **调用时机**: 组件及其子组件完全加载完成
- **主要用途**: 执行依赖完整组件树的操作

### 生命周期执行顺序

组件的生命周期钩子按照以下顺序执行：

1. `ready` - 组件准备就绪（DOM 已创建）
2. `attached` - 组件挂载到 DOM
3. `loaded` - 组件完全加载完成

当组件从 DOM 移除时，会调用 `detached` 钩子。

### 使用示例

下面的示例展示了如何在组件中使用生命周期钩子函数：

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .counter {
      margin: 10px 0;
    }
    button {
      margin-right: 10px;
      padding: 5px 10px;
    }
  </style>
  <h3>生命周期演示</h3>
  <div class="counter">计数器: {{count}}</div>
  <button on:click="count += 10">增加10</button>
  <button on:click="removeSelf">移除组件</button>
  <div class="log">
    <h4>生命周期日志:</h4>
    <ul>
      <o-fill :value="logs">
        <li>{{$data}}</li>
      </o-fill>
    </ul>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
          logs: [],
        },
        proto: {
          removeSelf() {
            this.remove(); // 从DOM中移除自身以触发detached钩子
          },
          addLog(message) {
            this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
          }
        },
        ready() {
          this.addLog("ready: 组件准备就绪，DOM已创建");
          console.log("组件已就绪");
        },
        attached() {
          this.addLog("attached: 组件已挂载到DOM");
          this._timer = setInterval(() => {
            this.count++;
          }, 1000);
          console.log("组件已挂载");
        },
        detached() {
          this.addLog("detached: 组件已从DOM移除");
          // 清除定时器，防止内存泄漏
          clearInterval(this._timer); 
          console.log("组件已卸载");
        },
        loaded() {
          this.addLog("loaded: 组件完全加载完成");
          console.log("组件已完全加载");
        }
      };
    };
  </script>
</template>
```

在这个示例中，你可以观察到不同生命周期钩子的执行顺序和时机。当你点击"移除组件"按钮时，可以看到 `detached` 钩子被触发。

### 实际应用场景

#### 初始化操作

在 `ready` 钩子中进行数据初始化：

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM操作
      this.initDomElements();
    }
  };
};
```

#### 资源管理

在 `attached` 钩子中启动定时器，在 `detached` 钩子中清理资源：

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // 启动定时器
      this.timer = setInterval(() => {
        console.log('定时任务执行');
      }, 1000);
    },
    detached() {
      // 清理定时器
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```


## 特征属性（attrs）继承

在 ofa.js 中，特征属性（Attribute）是组件间传递数据最常用的方式之一。只需在组件的 `attrs` 对象中声明所需属性，即可在使用组件时将外部数据传入组件内部。

### 基本用法

#### 定义接收属性

在使用组件之前，需要先在组件的 `attrs` 对象中声明需要接收的属性。属性可以设置默认值。

```html
<!-- demo.html -->
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp first="OFA" full-name="OFA 组件示例"></demo-comp>
  <br>
  <demo-comp first="NoneOS" full-name="NoneOS 使用案例"></demo-comp>
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
```

#### 重要规则

1. **类型限制**：传递的 attribute 值必须是字符串，其他类型会被自动转换为字符串。

2. **命名转换**：由于 HTML 属性不区分大小写，传递包含大写字母的属性时，需要使用 `-` 分割命名（kebab-case 格式）。
   - 例如：`fullName` → `full-name`

3. **必须定义**：如果组件未在 `attrs` 对象中定义对应属性，则无法接收该 attribute。设置的值为默认值，如果不想要默认值则设置为 `null`。

### 模板语法传递 Attribute

在组件的模板中，可以使用 `attr:toKey="fromKey"` 语法，将当前组件的 `fromKey` 数据传递到子组件的 `toKey` 属性上。

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
```

### 多层级传递

可以通过多层嵌套组件逐层传递 attribute。如果组件需要依赖其他组件，需要在组件中引入其他组件的模块。


## 自定义事件

在 ofa.js 中，除了内置的 DOM 事件外，还可以创建和使用自定义事件来实现组件间的通信。自定义事件是组件化开发中的重要机制，它允许组件向上广播消息或状态变化。

### emit 方法 - 触发自定义事件

`emit` 方法用于触发自定义事件，将组件内部的状态变化或用户操作通知给外部监听者。

#### 基本用法

```javascript
// 触发一个简单的自定义事件
this.emit('custom-event');

// 触发带数据的自定义事件
this.emit('data-changed', {
  data: {
    // 自定义数据，可根据需求任意结构
    newValue: 100,
    oldValue: 50
  }
});
```

#### emit 方法参数

`emit` 方法接受两个参数：

1. **事件名称**：字符串，表示要触发的事件名称
2. **选项对象**（可选）：包含事件配置选项
   - `data`：要传递的数据
   - `bubbles`：布尔值，控制事件是否冒泡（默认为 true）
   - `composed`：布尔值，控制事件是否能穿过 Shadow DOM 边界
   - `cancelable`：布尔值，控制事件是否可以被取消

然后上层元素就可以使用`on`方法监听这个自定义事件。

### bubbles - 事件冒泡机制

`bubbles` 属性控制事件是否会向上冒泡到父元素。当设置为 `true` 时，事件会沿着 DOM 树向上传播。默认值为 `true`。如果设置为 `false`，事件将不会冒泡。

#### 冒泡机制详解

- **默认行为**：使用 `emit` 发出的事件默认开启冒泡（`bubbles: true`）
- **冒泡路径**：事件从触发元素开始，逐级向上传播
- **阻止冒泡**：在事件处理器中调用 `event.stopPropagation()` 可阻止冒泡

### composed - 穿透 Shadow DOM 边界

`composed` 属性控制事件是否能够穿过 Shadow DOM 边界。这对于 Web Components 开发特别重要，默认值为 `false`。

#### 穿透机制详解

- **Shadow DOM 隔离**：默认情况下，事件无法跨越 Shadow DOM 边界
- **启用穿透**：设置 `composed: true` 允许事件穿越 Shadow DOM 边界
- **使用场景**：当组件需要向宿主环境发送事件时，必须设置 `composed: true`

### 跨 Shadow DOM 上抛（内嵌 o-page 场景）

页面模块被宿主以 `<o-page>` 内嵌时，处于宿主页面的 Shadow DOM 内。子页面向宿主上抛结果时，`emit` 必须同时开启 `bubbles` 和 `composed`，宿主

## 插槽

插槽是组件中用于接收外部内容的占位符。通过使用插槽，你可以创建可复用的组件，同时允许使用组件的人自定义组件内部的内容。

### 默认插槽

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

#### 插槽默认内容

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

### 命名插槽

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

### 多层级插槽传递

插槽内容可以跨越多层组件进行传递。当父组件向子组件传递插槽内容后，子组件可以继续将这个插槽内容传递给自己的子组件，实现插槽的多层透传。

