# 自定義事件



在 ofa.js 中，除瞭內置的 DOM 事件外，還可以創建和使用自定義事件來實現組件間的通信。自定義事件是組件化開發中的重要機製，牠允許組件向上廣播消息或狀態變化。

## emit 方法 - 觸發自定義事件



`emit` 方法用於觸發自定義事件，將組件內部的狀態變化或用戶操作通知給外部監聽者。

### 基本用法



```javascript
// 觸發一個簡單的自定義事件
this.emit('custom-event');

// 觸發帶數據的自定義事件
this.emit('data-changed', {
  data: {
    // 自定義數據，可根據需求任意結構
    newValue: 100,
    oldValue: 50
  }
});
```

### emit 方法參數



`emit` 方法接受兩個參數：

1. **事件名稱**：字符串，錶示要觸發的事件名稱
2. **選項對象**（可選）：包含事件配置選項
   - `data`：要傳遞的數據
   - `bubbles`：佈爾值，控製事件是否冒泡（默認爲 true）
   - `composed`：佈爾值，控製事件是否能穿過 Shadow DOM 邊界
   - `cancelable`：佈爾值，控製事件是否可以被取消

然後上層元素就可以使用`on`方法 [（事件綁定）](./event-binding.md) 監聽這個自定義事件。

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
      <button on:click="handleClick">點擊觸發事件</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: '按鈕被點擊瞭',
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

## bubbles - 事件冒泡機製



`bubbles` 屬性控製事件是否會向上冒泡到父元素。當設置爲 `true` 時，事件會沿著 DOM 樹向上傳播。默認值爲 `true`。如菓設置爲 `false`，事件將不會冒泡。

### 冒泡機製詳解



- **默認行爲**：使用 `emit` 發齣的事件默認開啓冒泡（`bubbles: true`）
- **冒泡路徑**：事件從觸發元素開始，逐級向上傳播
- **阻止冒泡**：在事件處理器中調用 `event.stopPropagation()` 可阻止冒泡

### 冒泡示例



<o-playground name="自定義事件示例" style="--editor-height: 500px">
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
      <p>外層容器（監聽冒泡事件）: {{bubbledEventCount}} 次</p>
      <p>內層組件（監聽直接事件）: {{directEventCount}} 次</p>
      <p>接受到的數據: <span style="color:red;">{{result}}</span></p>
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
      <button on:click="triggerNonBubblingEvent">觸發非冒泡事件</button>
      <button on:click="triggerBubblingEvent">觸發冒泡事件</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 非冒泡事件，隻會被直接監聽者捕獲
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '非冒泡事件觸發', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // 冒泡事件，會向上傳播到父元素
                this.emit('child-event', {
                  data: { type: 'bubbling', message: '冒泡事件觸發', timestamp: Date.now() },
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

## composed - 穿透 Shadow DOM 邊界



`composed` 屬性控製事件是否能夠穿過 Shadow DOM 邊界。這對於 Web Components 開發特別重要，默認值爲 `false`。

### 穿透機製詳解



- **Shadow DOM 隔離**：默認情況下，事件無法跨越 Shadow DOM 邊界
- **啓用穿透**：設置 `composed: true` 允許事件穿越 Shadow DOM 邊界
- **使用場景**：當組件需要向宿主環境發送事件時，必須設置 `composed: true`

### 穿透示例



<o-playground name="自定義事件帶數據示例" style="--editor-height: 500px">
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
      <p>監聽事件: {{bubbledEventCount}} 次</p>
      <p>接受到的數據: <span style="color:red;">{{result}}</span></p>
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
      <p>監聽事件: {{bubbledEventCount}} 次</p>
      <p>接受到的數據: <span style="color:pink;">{{result}}</span></p>
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
      <button on:click="triggerNonComposedEvent">觸發非穿透事件</button>
      <button on:click="triggerComposedEvent">觸發穿透事件</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 非穿透事件，隻會被直接監聽者捕獲
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '非穿透事件觸發', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 穿透事件，會跨越 Shadow DOM 邊界
                this.emit('child-event', {
                  data: { type: 'composed', message: '穿透事件觸發', timestamp: Date.now() },
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

