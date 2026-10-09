# 自定义事件

在 ofa.js 中，除了内置的 DOM 事件外，还可以创建和使用自定义事件来实现组件间的通信。自定义事件是组件化开发中的重要机制，它允许组件向上广播消息或状态变化。

## emit 方法 - 触发自定义事件

`emit` 方法用于触发自定义事件，将组件内部的状态变化或用户操作通知给外部监听者。

### 基本用法

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

### emit 方法参数

`emit` 方法接受两个参数：

1. **事件名称**：字符串，表示要触发的事件名称
2. **选项对象**（可选）：包含事件配置选项
   - `data`：要传递的数据
   - `bubbles`：布尔值，控制事件是否冒泡（默认为 true）
   - `composed`：布尔值，控制事件是否能穿过 Shadow DOM 边界
   - `cancelable`：布尔值，控制事件是否可以被取消

然后上层元素就可以使用`on`方法监听这个自定义事件。

## bubbles - 事件冒泡机制

`bubbles` 属性控制事件是否会向上冒泡到父元素。当设置为 `true` 时，事件会沿着 DOM 树向上传播。默认值为 `true`。如果设置为 `false`，事件将不会冒泡。

### 冒泡机制详解

- **默认行为**：使用 `emit` 发出的事件默认开启冒泡（`bubbles: true`）
- **冒泡路径**：事件从触发元素开始，逐级向上传播
- **阻止冒泡**：在事件处理器中调用 `event.stopPropagation()` 可阻止冒泡

## composed - 穿透 Shadow DOM 边界

`composed` 属性控制事件是否能够穿过 Shadow DOM 边界。这对于 Web Components 开发特别重要，默认值为 `false`。

### 穿透机制详解

- **Shadow DOM 隔离**：默认情况下，事件无法跨越 Shadow DOM 边界
- **启用穿透**：设置 `composed: true` 允许事件穿越 Shadow DOM 边界
- **使用场景**：当组件需要向宿主环境发送事件时，必须设置 `composed: true`

## 关键要点

- **emit 方法**：触发自定义事件，支持传递数据
- **事件参数**：事件名称、data、bubbles、composed、cancelable
- **冒泡机制**：`bubbles: true` 允许事件向上冒泡
- **穿透 Shadow DOM**：`composed: true` 允许事件穿越 Shadow DOM 边界
- **监听事件**：使用 `on:事件名` 监听自定义事件

## 跨 Shadow DOM 上抛（内嵌 o-page 场景）

页面模块被宿主以 `<o-page>` 内嵌时，处于宿主页面的 Shadow DOM 内。子页面向宿主上抛结果时，`emit` 必须同时开启 `bubbles` 和 `composed`，宿主
