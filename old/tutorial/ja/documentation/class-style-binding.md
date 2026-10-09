# クラスとスタイルのバインディング

ofa.jsでは、クラス名、スタイル、属性を動的にバインドすることで、柔軟なUI状態管理を実現できます。これにより、データの変化に応じてインターフェースの見た目が自動的に調整されます。

## クラスバインディング

类绑定允许你根据数据状态动态地添加或移除 CSS 类。你可以使用 `class:className="booleanExpression"` 的语法来绑定特定的类。

`booleanExpression` が `true` のとき、クラス名が要素に追加され、`false` のときはクラス名が削除されます。

### 基礎クラスバインディング

<o-playground name="基本クラスバインディング" style="--editor-height: 500px">
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

### 複数クラスバインディング

複数のクラスを同時にバインドして、要素が異なる条件に応じて異なる外観状態を持つようにすることもできます。

<o-playground name="複数クラスバインディング" style="--editor-height: 500px">
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

## スタイルバインディング

スタイルバインディングを使用すると、インラインスタイルの値を直接設定でき、動的な更新をサポートします。ofa.js は2つのスタイルバインディング方法を提供しています。

### 単一スタイル属性バインディング

`:style.propertyName` という構文を使って、特定のスタイルプロパティをバインドします。

<o-playground name="単一スタイル属性バインディング" style="--editor-height: 500px">
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

### 複数スタイルの属性バインディング

複数のスタイルプロパティを一度にバインドすることもできます：

<o-playground name="多様なスタイル属性のバインディング" style="--editor-height: 500px">
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

## 属性バインディング

クラスとスタイルのバインディングに加えて、他のHTML属性を動的にバインドすることもできます。ofa.jsは `attr:attributeName` 構文を使用して属性バインディングを実現します。

### 基本的な属性バインディング

<o-playground name="基本属性バインディング" style="--editor-height: 700px">
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
              tooltipText: "これはヒント情報です",
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

### ブール属性の処理

真偽値型の属性（`disabled`、`hidden` など）について、ofa.js はバインドされた値の真偽に基づいてその属性を追加するかどうかを決定します。

<o-playground name="ブール属性の処理" style="--editor-height: 700px">
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

## data() 関数

スタイル内で `data(key)` を使用してコンポーネントデータをバインドできます。これは、コンポーネントデータに基づいてスタイルを動的に変更する必要があるシナリオに最適です。

<o-playground name="スタイルタグ内のデータ関数" style="--editor-height: 500px">
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
      ホバー時のフォントサイズ: <input type="number" sync:value="size" placeholder="これは双方向バインディングの入力ボックスです" />
      <br />
      トランジション時間: <input type="number" step="0.3" min="0" sync:value="time" placeholder="これは双方向バインディングの入力ボックスです" />
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

## 注意事項

`style` タグ内の `data(key)` は原理的に style 全体の内容を置き換えます。無関係なスタイルが重複してレンダリングされるのを防ぐため、`data(key)` を含むスタイルは独立した `style` タグに、データバインドが不要なスタイルは別の `style` タグに分けて配置し、より良いパフォーマンスを得ることをお勧めします。

```html
<!-- ❌ data(key)を持たない p:hover もリフレッシュされます -->
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
``````html
<!-- ✅ data(xxx) のみが含まれるスタイルが再レンダリングされます -->
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