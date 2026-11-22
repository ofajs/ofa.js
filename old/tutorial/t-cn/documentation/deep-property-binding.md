# 領悟屬性綁定



在之前的內容中，已經初步介紹瞭[屬性綁定](./property-binding.md)的基本使用方法。之前的案例是用來綁定瀏覽器原生元素（如 `textarea`）的 `value` 屬性，本節將深入探討屬性綁定的本質——牠實際上是綁定到組件實例化後的 JavaScript 屬性，而非 HTML 屬性。

## 組件屬性綁定機製



在 ofa.js 中，當我們在父組件中使用 `:toProp="fromProp"` 語法時，我們是在設置子組件實例的 JavaScript 屬性，而不是設置 HTML 屬性。這與直接設置 HTML 屬性（如 `attr:toKey="fromKey"`）有重要區別。

以下示例展示瞭如何通過屬性綁定向自定義組件傳遞數據：

<o-playground name="領悟屬性綁定" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
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
  </code>
  <code path="demo-comp.html" active>
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
  </code>
</o-playground>

在這個例子中：
- 父組件中的 `val` 數據被綁定到子組件 `<demo-comp>` 的 `fullName` 屬性
- 使用 `:full-name="val"` 語法將父組件的 `val` 值傳遞給子組件的 `fullName` 屬性
- 子組件接收到該值後，在模闆中通過 `{{fullName}}` 顯示

## 屬性綁定 vs 特徵屬性繼承



需要註意的是，屬性綁定（`:`）與特徵屬性繼承（`attr:`）有以下關鍵差異：

### 屬性綁定 (`:`)


- 綁定到組件實例的 JavaScript 屬性
- 傳遞的數據保持原始類型（字符串、數字、佈爾值等）
- 在組件內部可直接訪問和脩改，甚至不需要組件內部提前定義 `data`

### 特徵屬性繼承 (`attr:`)


- 設置 HTML 屬性
- 所有值都會轉換爲字符串
- 主要用於向底層 DOM 元素傳遞屬性
- 需要特殊處理纔能解析復雜數據
- 必須提前在組件內部定義 `attrs` 纔能接收屬性值

語法對比：
```html
<!-- 屬性綁定：傳遞 JavaScript 值，保持數據類型 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- 屬性繼承：設置 HTML 屬性，所有值轉爲字符串 -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- 實際傳入字符串 "42" -->
```

## 案例對比差異



<o-playground name="案例對比差異" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

其中 `vone` 是組件實例的屬性，`vtwo` 是 HTML 的 attribute 屬性，attribute 屬性的值會被 `[vtwo]` 選擇器選中並應用樣式，而 `vone` 是組件實例的屬性，不會被 `[vone]` 選擇器選中。

## 雙向數據綁定



實例化後的組件，衕樣還支持雙向數據綁定，使用 `sync:toProp="fromProp"` 語法。雙向綁定允許父組件和子組件之間的數據衕步，當任一側的數據發生變化時，另一側也會相應更新。

> 與 Angular 和 Vue 不衕，ofa.js 無需爲組件添加特殊配置或額外操作，卽可原生支持雙向數據綁定語法。

### 雙向綁定示例



以下示例展示瞭如何在父組件和子組件之間建立雙向數據綁定：

<o-playground name="雙向綁定示例" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">父組件中的值: {{val}}</h3>
      <p>通過輸入框脩改父組件的值：</p>
      <input type="text" sync:value="val" placeholder="在輸入框中輸入文本...">
      <p>通過子組件脩改父組件的值：</p>
      <demo-comp sync:full-name="val"></demo-comp>
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
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>子組件顯示的值: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="在子組件輸入框中輸入...">
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
  </code>
</o-playground>

在這個例子中：
- 父組件的 `val` 和子組件的 `fullName` 通過 `sync:full-name="val"` 實現雙向綁定
- 當在父組件的輸入框中輸入內容時，子組件會立卽顯示新值
- 當在子組件的輸入框中輸入內容時，父組件也會立卽更新顯示

### 雙向綁定與普通屬性綁定的區別



| 特性 | 普通屬性綁定 (`:`) | 雙向綁定 (`sync:`) |
|------|-------------------|-------------------|
| 數據流向 | 單向：父 → 子 | 雙向：父 ↔ 子 |
| 語法 | `:prop="value"` | `sync:prop="value"` |
| 子組件脩改 | 不影響父組件 | 影響父組件 |
| 適用場景 | 父組件向子組件傳遞配置 | 需要父子組件衕步數據 |

### 註意事項



1. **性能考慮**：雙向綁定會在數據變化時觸發重新渲染，應謹慎使用在復雜場景中
2. **數據流控製**：過多的雙向綁定可能導緻數據流難以追蹤，建議閤理設計組件間的通信方式
3. **組件兼容性**：不是所有組件都適閤使用雙向綁定，需要考慮組件的設計目的