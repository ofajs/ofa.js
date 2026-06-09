# ofa.js 模板语法快速入门案例

## 源文件内容

<!-- 源文件内容start -->

**demo.html**
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 完整功能演示</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <script
      src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs"
      type="module"
    ></script>
    <o-page src="./page.html"></o-page>
  </body>
</html>

```

**my-counter.html**
```html
<template component>
  <style>
    :host {
      display: inline-block;
      padding: 10px;
      border: 2px solid #4caf50;
      border-radius: 8px;
      background: #f1f8e9;
    }
    .counter-display {
      font-size: 24px;
      font-weight: bold;
      margin: 0 10px;
    }
    .btn {
      padding: 5px 15px;
      margin: 0 5px;
      cursor: pointer;
    }
  </style>

  <div>
    <slot></slot>
    <span class="counter-display">{{currentValue}}</span>
    <button class="btn" on:click="increment">+</button>
    <button class="btn" on:click="decrement">-</button>
  </div>

  <script>
    export default {
      tag: "my-counter",
      attrs: {
        initialValue: 0,
      },
      data: {
        currentValue: 0,
      },
      watch: {
        initialValue(val) {
          this.currentValue = val;
        },
      },
      proto: {
        increment() {
          this.currentValue++;
          this.emitChange();
        },
        decrement() {
          this.currentValue--;
          this.emitChange();
        },
        emitChange() {
          this.emit("change", {
            data: { value: this.currentValue },
          });
        },
      },
      ready() {
        this.currentValue = this.initialValue;
      },
    };
  </script>
</template>

```

**page.html**
```html
<template page>
  <l-m src="./my-counter.html"></l-m>
  <l-m src="./todo-item.html"></l-m>
  <style>
    :host {
      display: block;
    }
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .active {
      background-color: #e3f2fd;
    }
    .highlight {
      color: #1976d2;
      font-weight: bold;
    }
    .btn {
      padding: 8px 16px;
      margin: 5px;
      cursor: pointer;
    }
    .error {
      color: red;
    }
    .success {
      color: green;
    }
    .warning {
      color: orange;
    }
  </style>

  <div class="container">
    <h1>ofa.js 完整功能演示</h1>

    <div class="section">
      <h2>1. 文本插值与 HTML 渲染</h2>
      <p>普通文本: {{message}}</p>
      <p>计算属性: {{doubleCount}}</p>
      <p>HTML渲染: <span :html="htmlContent"></span></p>
    </div>

    <div class="section">
      <h2>2. 事件绑定</h2>
      <button class="btn" on:click="count++">计数 +1 ({{count}})</button>
      <button class="btn" on:click="decrement">计数 -1</button>
      <button class="btn" on:click="toggle">切换状态</button>
    </div>

    <div class="section">
      <h2>3. 条件渲染 (o-if/o-else-if/o-else)</h2>
      <o-if :value="count > 10">
        <p class="success">计数大于 10</p>
      </o-if>
      <o-else-if :value="count > 5">
        <p class="warning">计数大于 5</p>
      </o-else-if>
      <o-else>
        <p>计数小于等于 5</p>
      </o-else>
    </div>

    <div class="section">
      <h2>4. 动态类名与样式</h2>
      <p class:active="isActive" class:highlight="count > 3">
        动态类名演示 (active: {{isActive}}, highlight: {{count > 3}})
      </p>
      <p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'">
        动态样式演示 (颜色根据计数变化)
      </p>
    </div>

    <div class="section">
      <h2>5. 列表渲染 (o-fill)</h2>
      <div>
        <button class="btn" on:click="addItem">添加项目</button>
        <button class="btn" on:click="removeItem">删除最后</button>
      </div>
      <o-fill :value="todoList">
        <todo-item
          attr:idx="$index"
          :content="$data.content"
          sync:completed="$data.completed"
          on:remove="$host.removeTodoItem($index)"
        ></todo-item>
      </o-fill>
    </div>

    <div class="section">
      <h2>6. 自定义组件 (my-counter)</h2>
      <my-counter :initial-value="5" on:change="handleCounterChange">
        <span>自定义计数器: </span>
      </my-counter>
    </div>

    <div class="section">
      <h2>7. 属性绑定演示</h2>
      <p>单向绑定: {{inputValue}}</p>
      <input type="text" :value="inputValue" on:input="updateInput($event)" />
      <p>双向绑定: {{syncValue}}</p>
      <input type="text" sync:value="syncValue" />
    </div>

    <div class="section">
      <h2>8. 生命周期日志</h2>
      <div :html="lifecycleLogs"></div>
    </div>
  </div>

  <script>
    export default async ({ query }) => {
      return {
        data: {
          message: "Hello ofa.js!",
          count: 0,
          isActive: false,
          htmlContent: "<strong>加粗文本</strong>",
          inputValue: "初始值",
          syncValue: "双向绑定值",
          todoList: [
            { content: "学习 ofa.js", completed: false },
            { content: "创建组件", completed: true },
          ],
          lifecycleLogs: "",
        },
        watch: {
          count(val, { watchers }) {
            if (watchers) {
              const watcher = watchers[0];
              console.log(`count changed: ${watcher.oldValue} -> ${val}`);
            } else {
              // console.log("没有 watchers 代表是初始化时的赋值监听");
            }
          },
        },

        proto: {
          get doubleCount() {
            return this.count * 2;
          },
          decrement() {
            if (this.count > 0) this.count--;
          },
          toggle() {
            this.isActive = !this.isActive;
          },
          addItem() {
            this.todoList.push({
              content: `新项目 ${this.todoList.length + 1}`,
              completed: false,
            });
          },
          removeItem() {
            if (this.todoList.length > 0) {
              this.todoList.pop();
            }
          },
          removeTodoItem(index) {
            this.todoList.splice(index, 1);
          },
          updateInput(event) {
            this.inputValue = event.target.value;
          },
          handleCounterChange(event) {
            console.log("Counter changed:", event.data);
          },
        },
        ready() {
          this.lifecycleLogs += "<p>ready: 页面初始化完成</p>";
          console.log("Query params:", query);
        },
        attached() {
          this.lifecycleLogs += "<p>attached: 页面已挂载</p>";
        },
        detached() {
          console.log("detached: 页面已卸载");
        },
      };
    };
  </script>
</template>

```

**todo-item.html**
```html
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .item-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .text {
      flex: 1;
    }
    .remove-btn {
      color: red;
      cursor: pointer;
      padding: 2px 8px;
    }
  </style>

  <div class="item-content" class:completed="completed">
    <input type="checkbox" sync:checked="completed" />
    <span class="text">{{idx + 1}}. {{content}}</span>
    <span class="remove-btn" on:click="removeSelf">✕</span>
  </div>

  <script>
    export default {
      tag: "todo-item",
      attrs: {
        content: "",
      },
      data: {
        idx: 0,
        completed: false,
      },
      proto: {
        removeSelf() {
          this.emit("remove");
        },
      },
    };
  </script>
</template>

```

<!-- 源文件内容end -->

## 语法说明

### 一、基础结构

#### 1. 引入 ofa.js
```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
```
**说明**：通过 ES Module 方式引入 ofa.js，无需 Node.js 和构建工具。

#### 2. 页面容器
```html
<o-page src="./page.html"></o-page>
```
**说明**：`<o-page>` 用于加载页面模块，`src` 属性指定页面文件路径。

---

### 二、页面模块 (`<template page>`)

#### 1. 页面定义
```html
<template page>
  <!-- 页面内容 -->
  <script>
    export default async ({ query }) => {
      return {
        data: { /* 数据 */ },
        proto: { /* 方法 */ },
        watch: { /* 侦听器 */ },
        ready() { /* 生命周期 */ },
        attached() { /* 生命周期 */ },
        detached() { /* 生命周期 */ }
      };
    };
  </script>
</template>
```
**说明**：
- `<template page>` 标记这是一个页面模块
- 导出函数必须是 `async`，参数 `{ query }` 包含 URL 查询参数
- 返回对象包含页面的数据、方法和生命周期钩子

#### 2. 模块引用
```html
<l-m src="./my-counter.html"></l-m>
<l-m src="./todo-item.html"></l-m>
```
**说明**：`<l-m>` 标签用于引入其他组件模块，必须在页面模板顶部声明。

---

### 三、组件模块 (`<template component>`)

#### 1. 组件定义
```html
<template component>
  <style>
    :host { /* 组件容器样式 */ }
  </style>
  
  <div>
    <slot></slot>
    <span>{{currentValue}}</span>
  </div>

  <script>
    export default {
      tag: "my-counter",
      attrs: { /* 外部属性 */ },
      data: { /* 内部数据 */ },
      watch: { /* 侦听器 */ },
      proto: { /* 方法 */ },
      ready() { /* 生命周期 */ }
    };
  </script>
</template>
```
**说明**：
- `<template component>` 标记这是一个组件模块
- 必须包含 `tag` 字段，定义组件标签名
- `:host` 选择器用于定义组件容器样式
- `<slot>` 用于插槽内容

#### 2. 组件属性 (`attrs`)
```javascript
attrs: {
  initialValue: 0,
  content: ""
}
```
**说明**：
- `attrs` 定义组件的外部属性
- 可以设置默认值
- 属性值可以通过 `:prop` 或 `attr:prop` 传递
- **注意**：`attrs` 和 `data` 的 key 不能重复

#### 3. 组件数据 (`data`)
```javascript
data: {
  currentValue: 0,
  idx: 0,
  completed: false
}
```
**说明**：
- `data` 定义组件的内部响应式数据
- 数据变化会自动更新视图

---

### 四、内容渲染

#### 1. 文本插值
```html
<p>普通文本: {{message}}</p>
<p>计算属性: {{doubleCount}}</p>
<span>{{idx + 1}}. {{content}}</span>
```
**说明**：
- 使用 `{{}}` 插入变量或表达式
- 支持计算属性（通过 `get` 定义）
- 支持表达式运算

#### 2. HTML 渲染
```html
<span :html="htmlContent"></span>
<div :html="lifecycleLogs"></div>
```
**说明**：
- `:html` 用于渲染 HTML 字符串
- **警告**：确保内容可信，避免 XSS 攻击

---

### 五、事件绑定

#### 1. 内联表达式
```html
<button on:click="count++">计数 +1</button>
```
**说明**：直接在事件中写表达式，支持自增、自减等操作。

#### 2. 方法调用
```html
<button on:click="decrement">计数 -1</button>
<button on:click="toggle">切换状态</button>
<button on:click="addItem">添加项目</button>
```
**说明**：调用 `proto` 中定义的方法。

#### 3. 带参数的事件
```html
<input :value="inputValue" on:input="updateInput($event)" />
<span on:click="removeSelf">✕</span>
```
**说明**：
- `$event` 是事件对象
- 可以传递自定义参数

#### 4. 组件事件监听
```html
<my-counter on:change="handleCounterChange">
</my-counter>

<todo-item on:remove="$host.removeTodoItem($index)">
</todo-item>
```
**说明**：
- 监听组件触发的自定义事件
- `$host` 引用父组件实例
- 组件内部使用 `this.emit("eventName", data)` 触发事件

---

### 六、条件渲染

#### 1. 基本用法
```html
<o-if :value="count > 10">
  <p class="success">计数大于 10</p>
</o-if>
<o-else-if :value="count > 5">
  <p class="warning">计数大于 5</p>
</o-else-if>
<o-else>
  <p>计数小于等于 5</p>
</o-else>
```
**说明**：
- `<o-if>`、`<o-else-if>`、`<o-else>` 必须连续使用
- `:value` 绑定条件表达式
- 条件为真时渲染内容

---

### 七、列表渲染

#### 1. 基本用法
```html
<o-fill :value="todoList">
  <todo-item
    attr:idx="$index"
    :content="$data.content"
    sync:completed="$data.completed"
    on:remove="$host.removeTodoItem($index)"
  ></todo-item>
</o-fill>
```
**说明**：
- `<o-fill>` 用于列表渲染
- `:value` 绑定数组数据
- **`$index`** 是当前项索引（从 0 开始）
- **`$data`** 是当前项数据对象
- **`$host`** 是宿主组件实例引用

**⚠️ 重要**：在 o-fill 内部，**必须使用 `$data`、`$index`、`$host`** 这些特殊变量，不能使用其他变量名（如 item、element、row 等）。

#### 2. 列表操作
```javascript
addItem() {
  this.todoList.push({
    content: `新项目 ${this.todoList.length + 1}`,
    completed: false
  });
},
removeItem() {
  if (this.todoList.length > 0) {
    this.todoList.pop();
  }
},
removeTodoItem(index) {
  this.todoList.splice(index, 1);
}
```
**说明**：支持数组的 push、pop、splice 等操作，视图会自动更新。

---

### 八、属性绑定

#### 1. 单向绑定 (`:`)
```html
<input :value="inputValue" />
<span :html="htmlContent"></span>
<my-counter :initial-value="5"></my-counter>
```
**说明**：
- `:prop="value"` 将数据单向传递到属性
- 数据变化会更新属性，但属性变化不影响数据
- 支持短横线命名：`:initial-value`

#### 2. 双向绑定 (`sync:`)
```html
<input sync:value="syncValue" />
<input type="checkbox" sync:checked="completed" />
```
**说明**：
- `sync:prop="value"` 实现双向绑定
- 数据和属性相互影响
- 常用于表单元素

**注意**：避免将 `sync:` 与 `attrs` 属性绑定，防止类型转换导致的循环更新问题（死循环卡死界面）。

#### 3. 属性传递 (`attr:`)
```html
<todo-item attr:idx="$index"></todo-item>
```
**说明**：
- `attr:prop="value"` 将值作为字符串属性传递
- 适用于需要字符串属性的场景

---

### 九、类名与样式绑定

#### 1. 动态类名
```html
<p class:active="isActive" class:highlight="count > 3">
  动态类名演示
</p>
<div class:completed="completed">
  待办项
</div>
```
**说明**：
- `class:className="condition"` 根据条件添加/移除类名
- 条件为真时添加类名，为假时移除
- 可以同时使用多个动态类名

#### 2. 动态样式
```html
<p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'">
  动态样式演示
</p>
```
**说明**：
- `:style.property="value"` 绑定内联样式
- 支持所有 CSS 属性
- 属性名使用驼峰命名：`fontSize` 而非 `font-size`

---

### 十、计算属性与侦听器

#### 1. 计算属性
```javascript
proto: {
  get doubleCount() {
    return this.count * 2;
  }
}
```
**说明**：
- 使用 `get` 关键字定义计算属性
- 计算属性会缓存，依赖变化时重新计算
- 在模板中像普通属性一样使用：`{{doubleCount}}`

#### 2. 侦听器
```javascript
watch: {
  count(val, { watchers }) {
    if (watchers) {
      const watcher = watchers[0];
      console.log(`count changed: ${watcher.oldValue} -> ${val}`);
    } else {
      // 没有 watchers 代表是初始化时的赋值监听
    }
  },
  initialValue(val) {
    this.currentValue = val;
  }
}
```
**说明**：
- `watch` 对象定义侦听器
- 函数参数：`val`（新值）、`{ watchers }`（包含旧值的对象）
- `watchers[0].oldValue` 获取旧值
- `watchers` 为空时表示初始化赋值，非数据变化触发
- 常用于响应数据变化执行副作用

---

### 十一、生命周期钩子

#### 1. 页面生命周期
```javascript
ready() {
  this.lifecycleLogs += "<p>ready: 页面初始化完成</p>";
  console.log("Query params:", query);
},
attached() {
  this.lifecycleLogs += "<p>attached: 页面已挂载</p>";
},
detached() {
  console.log("detached: 页面已卸载");
}
```
**说明**：
- `ready()`：组件/页面初始化完成时调用
- `attached()`：组件/页面挂载到 DOM 时调用
- `detached()`：组件/页面从 DOM 移除时调用

#### 2. 组件生命周期
```javascript
ready() {
  this.currentValue = this.initialValue;
}
```
**说明**：组件的 `ready()` 常用于初始化内部数据。

---

### 十二、组件通信

#### 1. 父传子（属性传递）
```html
<my-counter :initial-value="5">
  <span>自定义计数器: </span>
</my-counter>
```
**说明**：
- 父组件通过属性传递数据给子组件
- 子组件在 `attrs` 中声明接收

#### 2. 子传父（事件触发）
```javascript
// 子组件
emitChange() {
  this.emit("change", {
    data: { value: this.currentValue }
  });
}

// 父组件监听
<my-counter on:change="handleCounterChange">
</my-counter>
```
**说明**：
- 子组件使用 `this.emit()` 触发事件
- 父组件使用 `on:eventName` 监听事件

#### 3. 插槽
```html
<my-counter>
  <span>自定义计数器: </span>
</my-counter>

<!-- 组件内部 -->
<div>
  <slot></slot>
  <span>{{currentValue}}</span>
</div>
```
**说明**：
- `<slot>` 标签定义插槽位置
- 父组件的内容会渲染到插槽处

---

### 十三、特殊变量

#### 1. 模板变量
- `$index`：列表渲染中的当前索引
- `$data`：列表渲染中的当前数据项
- `$event`：事件对象
- `$host`：父组件实例

#### 2. 使用示例
```html
<o-fill :value="todoList">
  <todo-item
    attr:idx="$index"
    :content="$data.content"
    on:remove="$host.removeTodoItem($index)"
  ></todo-item>
</o-fill>
```

---

### 十四、样式作用域

#### 1. 组件样式
```html
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
    }
    .completed {
      text-decoration: line-through;
    }
  </style>
</template>
```
**说明**：
- 组件内的样式自动作用域化
- `:host` 选择器针对组件容器
- 类名不会与外部冲突

---

### 十五、最佳实践

#### 1. 数据定义
- `attrs`：外部传入的属性
- `data`：内部管理的状态
- **避免**：`attrs` 和 `data` 使用相同的 key

#### 2. 方法定义
```javascript
proto: {
  increment() { /* 方法 */ },
  decrement() { /* 方法 */ }
}
```
**说明**：所有方法定义在 `proto` 对象中。

#### 3. 计算属性
```javascript
proto: {
  get doubleCount() {
    return this.count * 2;
  }
}
```
**说明**：使用 `get` 关键字，而非 `computed`。

#### 4. 事件命名
```javascript
this.emit("change", { data: { value: this.currentValue } });
```
**说明**：事件名使用小写，多个单词用短横线连接。

---

### 十六、常见错误对照

| ❌ 错误写法 | ✅ 正确写法 | 说明 |
|------------|-----------|------|
| `computed: { double() {} }` | `get double() {}` | 使用 getter 定义计算属性 |
| `v-if="show"` | `<o-if :value="show">` | 使用 o-if 组件 |
| `v-for="item in list"` | `<o-fill :value="list">` | 使用 o-fill 组件 |
| `@click="handle"` | `on:click="handle"` | 事件绑定使用 on: 前缀 |
| `:class="{ active: isActive }"` | `class:active="isActive"` | 动态类名使用 class: 语法 |
| `v-model="value"` | `sync:value="value"` | 双向绑定使用 sync: 语法 |
| `methods: { foo() {} }` | `proto: { foo() {} }` | 方法定义在 proto 对象中 |
| `data() { return {} }` | `data: {}` | data 是对象而非函数 |
