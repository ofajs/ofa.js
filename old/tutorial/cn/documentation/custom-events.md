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

然后上层元素就可以使用`on`方法 [（事件绑定）](./event-binding.md) 监听这个自定义事件。

### emit 使用示例

<o-playground name="emit 使用示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">点击触发事件</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: '按钮被点击了',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - 事件冒泡机制

`bubbles` 属性控制事件是否会向上冒泡到父元素。当设置为 `true` 时，事件会沿着 DOM 树向上传播。默认值为 `true`。如果设置为 `false`，事件将不会冒泡。

### 冒泡机制详解

- **默认行为**：使用 `emit` 发出的事件默认开启冒泡（`bubbles: true`）
- **冒泡路径**：事件从触发元素开始，逐级向上传播
- **阻止冒泡**：在事件处理器中调用 `event.stopPropagation()` 可阻止冒泡

### 冒泡示例

<o-playground name="自定义事件示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>外层容器（监听冒泡事件）: {{bubbledEventCount}} 次</p>
      <p>内层组件（监听直接事件）: {{directEventCount}} 次</p>
      <p>接受到的数据: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">触发非冒泡事件</button>
      <button on:click="triggerBubblingEvent">触发冒泡事件</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 非冒泡事件，只会被直接监听者捕获
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '非冒泡事件触发', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // 冒泡事件，会向上传播到父元素
                this.emit('child-event', {
                  data: { type: 'bubbling', message: '冒泡事件触发', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - 穿透 Shadow DOM 边界

`composed` 属性控制事件是否能够穿过 Shadow DOM 边界。这对于 Web Components 开发特别重要，默认值为 `false`。

### 穿透机制详解

- **Shadow DOM 隔离**：默认情况下，事件无法跨越 Shadow DOM 边界
- **启用穿透**：设置 `composed: true` 允许事件穿越 Shadow DOM 边界
- **使用场景**：当组件需要向宿主环境发送事件时，必须设置 `composed: true`

### 穿透示例

<o-playground name="自定义事件带数据示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>监听事件: {{bubbledEventCount}} 次</p>
      <p>接受到的数据: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>监听事件: {{bubbledEventCount}} 次</p>
      <p>接受到的数据: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">触发非穿透事件</button>
      <button on:click="triggerComposedEvent">触发穿透事件</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 非穿透事件，只会被直接监听者捕获
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '非穿透事件触发', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 穿透事件，会跨越 Shadow DOM 边界
                this.emit('child-event', {
                  data: { type: 'composed', message: '穿透事件触发', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>