# 生命周期

ofa.js 组件具有完整的生命周期钩子函数，允许你在组件的不同阶段执行特定的逻辑。这些钩子函数让你能够在组件创建、挂载、更新和销毁等关键时刻介入并执行相应的操作。

## 生命周期钩子函数

ofa.js 提供了以下几个主要的生命周期钩子函数，按照常用的顺序排列：

### attached

`attached` 钩子在组件被插入到文档中时调用，表示组件已经挂载到页面上。这是最常用的生命周期钩子，通常用于执行需要在组件实际显示在页面上之后才能进行的初始化操作，避免在组件不可见时执行不必要的计算。此钩子也非常适合进行元素尺寸测量、动画启动等依赖于组件已渲染到页面的操作。

- **调用时机**: 组件被添加到 DOM 树中
- **主要用途**: 启动定时器、添加事件监听器、执行需要可见性的操作

### detached

`detached` 钩子在组件从文档中移除时调用，表示组件即将被卸载。这个钩子适合清理资源，如清除定时器、移除事件监听器等。

- **调用时机**: 组件从 DOM 树中被移除
- **主要用途**: 清理资源、取消订阅、移除事件监听器

### ready

`ready` 钩子在组件准备就绪时调用，此时组件的模板已经渲染完成，DOM 元素已经创建，但可能尚未插入到文档中。这个钩子适合进行 DOM 操作或初始化第三方库。

- **调用时机**: 组件模板渲染完成，DOM 已创建
- **主要用途**: 执行依赖 DOM 的初始化操作

### loaded

`loaded` 钩子在组件及其所有子组件、异步资源全部加载完毕后触发，此时可安全移除 loading 状态或执行依赖完整组件树的后续操作。如果没有依赖，它会在 `ready` 钩子之后调用。

- **调用时机**: 组件及其子组件完全加载完成
- **主要用途**: 执行依赖完整组件树的操作

## 生命周期执行顺序

组件的生命周期钩子按照以下顺序执行：

1. `ready` - 组件准备就绪（DOM 已创建）
2. `attached` - 组件挂载到 DOM
3. `loaded` - 组件完全加载完成

当组件从 DOM 移除时，会调用 `detached` 钩子。

## 使用示例

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

## 实际应用场景

### 初始化操作

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

### 资源管理

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

## 关键要点

- **ready**：组件准备就绪，DOM 已创建，适合 DOM 操作
- **attached**：组件挂载到 DOM，适合启动定时器、添加事件监听器
- **detached**：组件从 DOM 移除，适合清理资源
- **loaded**：组件完全加载完成，适合执行依赖完整组件树的操作
- **执行顺序**：ready → attached → loaded（移除时调用 detached）
