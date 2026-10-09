# 類和樣式綁定



在 ofa.js 中，妳可以通過動態綁定類名、樣式和屬性來實現靈活的 UI 狀態管理。這使得界面可以根據數據的變化自動調整外觀。

## 類綁定



類綁定允許妳根據數據狀態動態地添加或移除 CSS 類。妳可以使用 `class:className="booleanExpression"` 的語法來綁定特定的類。

當 `booleanExpression` 爲 `true` 時，類名會被添加到元素上；當爲 `false` 時，類名會被移除。

### 基礎類綁定



<o-playground name="基礎類綁定" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

### 多個類綁定



妳還可以衕時綁定多個類，使元素根據不衕的條件擁有不衕的外觀狀態。

<o-playground name="多個類綁定" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

## 樣式綁定



樣式綁定允許妳直接設置內聯樣式的值，支持動態更新。ofa.js 提供瞭兩種樣式綁定方式：

### 單一樣式屬性綁定



使用 `:style.propertyName` 語法來綁定特定的樣式屬性。

<o-playground name="單一樣式屬性綁定" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

### 多樣式屬性綁定



妳也可以一次性綁定多個樣式屬性：

<o-playground name="多樣式屬性綁定" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

## 屬性綁定



除瞭類和樣式綁定，妳還可以動態綁定其他 HTML 屬性。ofa.js 使用 `attr:attributeName` 語法來實現屬性綁定。

### 基礎屬性綁定



<o-playground name="基礎屬性綁定" style="--editor-height: 700px">
  <code>
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
              tooltipText: "這是一個提示信息",
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
  </code>
</o-playground>

### 佈爾屬性處理



對於佈爾類型的屬性（如 `disabled`, `hidden`），ofa.js 會根據綁定值的眞假性來決定是否添加該屬性。

<o-playground name="佈爾屬性處理" style="--editor-height: 700px">
  <code>
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
  </code>
</o-playground>

## data() 函數



可以在樣式中使用 `data(key)` 來綁定組件數據。這非常適閤需要根據組件數據動態改變樣式的場景。

<o-playground name="樣式標籤內的數據函數" style="--editor-height: 500px">
  <code>
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
      Hover FontSize: <input type="number" sync:value="size" placeholder="這是一個雙向綁定的輸入框" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="這是一個雙向綁定的輸入框" />
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
  </code>
</o-playground>

## 註意事項



`style` 標籤內的 `data(key)` 在原理上會替換整個 style 的內容。爲避免重復渲染無關樣式，建議將包含 `data(key)` 的樣式單獨放在一個 `style` 標籤中，而不需要數據綁定的樣式則放到另一個 `style` 標籤裏，以獲得更好的性能錶現。

```html
<!-- ❌ 不帶有 data(key) 的 p:hover 也會被刷新 -->
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
<!-- ✅ 隻帶有 data(xxx) 的樣式會被重新渲染 -->
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