# ofa.js 快速参考表

本文档提供 ofa.js 核心 API 和语法的快速查阅，方便在开发时快速检索。

## 模板语法速查

### 内容渲染

| 语法 | 用途 | 示例 |
|------|------|------|
| `{{var}}` | 文本渲染 | `<span>{{name}}</span>` |
| `:html` | HTML 内容渲染 | `<div :html="htmlContent"></div>` |

### 属性绑定

| 语法 | 用途 | 示例 |
|------|------|------|
| `:prop="key"` | 单向属性绑定 | `<input :value="name">` |
| `sync:prop="key"` | 双向属性绑定 | `<input sync:value="name">` |
| `attr:name="key"` | HTML 属性绑定 | `<a attr:href="url">` |
| `attr:disabled="bool"` | 布尔属性绑定 | `<button attr:disabled="isDisabled">` |

### 类与样式绑定

| 语法 | 用途 | 示例 |
|------|------|------|
| `class:name="bool"` | 条件类绑定 | `<div class:active="isActive">` |
| `:style.prop="value"` | 样式属性绑定 | `<p :style.color="textColor">` |
| `data(key)` | 样式中使用数据 | `font-size: data(size);` |

### 事件绑定

| 语法 | 用途 | 示例 |
|------|------|------|
| `on:event="handler"` | 绑定事件处理器 | `<button on:click="handleClick">` |
| `on:event="expr"` | 直接执行表达式 | `<button on:click="count++">` |
| `on:event="fn(arg)"` | 传递参数 | `<button on:click="add(5)">` |
| `$event` | 访问事件对象 | `on:click="handle($event)"` |

### 条件渲染

| 组件 | 用途 | 示例 |
|------|------|------|
| `<o-if :value="bool">` | 条件渲染 | `<o-if :value="show">内容</o-if>` |
| `<o-else-if :value="bool">` | 否则如果 | `<o-else-if :value="type === 'A'">` |
| `<o-else>` | 否则 | `<o-else>默认内容</o-else>` |
| `<x-if>` | 非显式条件渲染 | 不渲染到 DOM 的条件组件 |

### 列表渲染

| 语法/属性 | 用途 | 示例 |
|------|------|------|
| `<o-fill :value="arr">` | 列表渲染 | `<o-fill :value="items">...</o-fill>` |
| `name="tpl"` | 命名模板 | `<o-fill :value="items" name="item-tpl">` |
| `fill-key="id"` | 指定键值提升性能 | `<o-fill :value="items" fill-key="id">` |
| `$index` | 当前项索引 | `{{$index}}` |
| `$data` | 当前项数据 | `{{$data.name}}` |
| `$host` | 组件实例引用 | `on:click="$host.removeItem($index)"` |
| `<x-fill>` | 非显式列表渲染 | 不渲染到 DOM 的列表组件 |

---

## 组件定义

### 基本结构

```html
<template component>
  <style>
    :host { display: block; }
  </style>
  <div>{{title}}</div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        data: { title: "Hello" },
        proto: { /* 方法 */ },
        watch: { /* 侦听器 */ },
        ready() { /* 生命周期 */ },
        attached() { /* 生命周期 */ },
        detached() { /* 生命周期 */ },
        loaded() { /* 生命周期 */ }
      };
    };
  </script>
</template>
```

### 组件引用

| 方式 | 语法 | 特点 |
|------|------|------|
| 异步引用 | `<l-m src="./comp.html">` | 非阻塞，推荐使用 |
| 同步引用 | `await load("./comp.html")` | 阻塞加载，确保注册完成 |

---

## 生命周期钩子

| 钩子 | 调用时机 | 典型用途 |
|------|---------|---------|
| `ready()` | DOM 创建完成 | DOM 操作、初始化第三方库 |
| `attached()` | 挂载到 DOM | 启动定时器、添加事件监听 |
| `detached()` | 从 DOM 移除 | 清理资源、移除监听器 |
| `loaded()` | 完全加载完成 | 依赖完整组件树的操作 |

**执行顺序**: ready → attached → loaded（移除时调用 detached）

---

## 数据管理

### data 对象

```javascript
data: {
  message: "Hello",
  count: 0,
  user: { name: "张三", age: 25 },
  items: [1, 2, 3]
}
```

### 计算属性

```javascript
proto: {
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },
  set fullName(val) {
    [this.firstName, this.lastName] = val.split(' ');
  }
}
```

### 侦听器

```javascript
watch: {
  count(newVal, { watchers }) {
    console.log('count changed:', newVal);
  },
  "prop1,prop2"() {
    // 监听多个属性
  }
}
```

---

## 自定义事件

### 触发事件

```javascript
this.emit('custom-event');

this.emit('data-changed', {
  data: { value: 100 },
  bubbles: true,
  composed: true
});
```

### 监听事件

```html
<my-component on:custom-event="handler"></my-component>
```

---

## 状态管理

### 创建状态对象

```javascript
export const store = $.stanz({
  user: null,
  theme: "light"
});
```

### 组件中使用

```javascript
attached() {
  this.userData = store.user;
},
detached() {
  this.userData = {}; // 清理引用
}
```

---

## 上下文状态（Provider/Consumer）

### 提供者

```html
<o-provider name="userInfo" user-id="123" user-name="张三">
  ...
</o-provider>
```

### 消费者

```html
<o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
```

### 根提供者（全局）

```html
<o-root-provider name="globalConfig" theme="dark"></o-root-provider>
```

---

## 特殊组件

### 插槽

```html
<slot></slot>
<slot name="header"></slot>
```

### 样式查询

```html
<match-var theme="dark">
  <style>
    :host { background-color: #333; }
  </style>
</match-var>
```

### 注入宿主样式

```html
<inject-host>
  <style>
    parent-comp child-comp { color: red; }
  </style>
</inject-host>
```

### replace-temp

```html
<select>
  <template is="replace-temp">
    <x-fill :value="options">
      <option>{{$data}}</option>
    </x-fill>
  </template>
</select>
```

---

## 页面与应用

### 页面模块

```html
<template page>
  <style>:host { display: block; }</style>
  <script>
    export default async ({ load, query }) => {
      return { data: {}, proto: {} };
    };
  </script>
</template>
```

### 微应用

```html
<o-app src="./app-config.js"></o-app>
```

### 路由

```html
<o-router>
  <a href="#/page1">Page 1</a>
  <a href="#/page2">Page 2</a>
</o-router>
```

---

## 常用实例方法

| 方法 | 用途 | 示例 |
|------|------|------|
| `this.goto(url)` | 页面跳转 | `this.goto('./detail.html')` |
| `this.back()` | 返回上一页 | `this.back()` |
| `this.getProvider(name)` | 获取提供者 | `this.getProvider('userInfo')` |
| `this.emit(name, opts)` | 触发自定义事件 | `this.emit('change', { data: val })` |
| `this.remove()` | 移除组件 | `this.remove()` |

---

## 特殊变量

| 变量 | 用途 | 可用位置 |
|------|------|---------|
| `$event` | 事件对象 | 事件处理器中 |
| `$index` | 列表项索引（从 0 开始） | o-fill / x-fill 内部 |
| `$data` | 列表项数据对象 | o-fill / x-fill 内部 |
| `$host` | 组件实例引用 | o-fill / x-fill 内部 |

**⚠️ 重要提醒**：在 o-fill / x-fill 内部，**必须使用 `$data`、`$index`、`$host`** 这些特殊变量，**不能使用其他变量名**（如 item、element、row 等）。

**错误示例**：
```html
<o-fill :value="items">
  <div>{{item.name}}</div>  <!-- ❌ 错误：使用了 item -->
</o-fill>
```

**正确示例**：
```html
<o-fill :value="items">
  <div>{{$data.name}}</div>  <!-- ✅ 正确：使用 $data -->
</o-fill>
```
