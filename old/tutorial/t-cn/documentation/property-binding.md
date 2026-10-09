# 屬性綁定



ofa.js 支持將數據綁定到元素實例化後對象的屬性上，如 input 元素的 value 或 checked 屬性等。

## 單向屬性綁定



單向屬性綁定使用 `:toKey="fromKey"` 語法，將組件數據「單向」衕步到 DOM 元素的屬性。組件數據變動時，元素屬性卽時更新；但元素自身的變動（如用戶輸入）不會反向寫迴組件，保持數據流的單一與可控。

<o-playground name="單向屬性綁定" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>當前值: {{val}}</p>
      <input type="text" :value="val" placeholder="這是一個單向綁定的輸入框">
      <p>註意：直接在輸入框中脩改內容不會改變上面顯示的值</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 雙向屬性綁定



雙向屬性綁定采用 `sync:xxx` 語法，實現瞭組件數據與DOM元素之間的雙向衕步。當組件數據變化時，DOM 元素的屬性會更新；當 DOM 元素的屬性發生變化時（如用戶輸入），也會衕步更新組件數據。

<o-playground name="雙向屬性綁定" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>當前值: {{val}}</p>
      <input type="text" sync:value="val" placeholder="這是一個雙向綁定的輸入框">
      <p>提示：在輸入框中脩改內容會實時更新上面顯示的值</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 雙向綁定的特點



- 數據流向：組件 ↔ DOM 元素（雙向）
- 組件數據變化 → DOM 元素更新
- DOM 元素變化 → 組件數據更新
- 適用於需要用戶輸入和數據衕步的場景

### 對象的雙向綁定



對於對象類型的數據綁定，**不需要使用 `sync` 語法**，直接使用 `:` 單向傳遞卽可。這是因爲 JavaScript 的對象是引用共享的，當父組件將對象傳遞給子組件時，子組件獲取到的是衕一個對象的引用，對象的脩改會直接反映到原始數據上。

ofa.js 保留瞭 JavaScript 的這一特性，因此對象的單向傳遞實際上就相當於雙向傳遞。例如：

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "張三", age: 25 } }
      };
    };
  </script>
</template>
```

在 `child-comp` 組件中直接脩改 `userData.name`，父組件中的 `userInfo.name` 也會衕時更新，因爲牠們指向衕一個對象引用。

### 常見的雙向綁定場景



<o-playground name="錶單雙向綁定示例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>錶單雙向綁定示例</h3>
      <div class="form-group">
        <label>文本輸入框:</label>
        <input type="text" sync:value="textInput" placeholder="輸入文本">
      </div>
      <div class="form-group">
        <label>數字輸入框:</label>
        <input type="number" sync:value="numberInput" placeholder="輸入數字">
      </div>
      <div class="form-group">
        <label>多行文本:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="輸入多行文本"></textarea>
      </div>
      <div class="form-group">
        <label>選擇框:</label>
        <select sync:value="selectedOption">
          <option value="">請選擇...</option>
          <option value="option1">選項1</option>
          <option value="option2">選項2</option>
          <option value="option3">選項3</option>
        </select>
      </div>
      <div class="form-group">
        <label>復選框:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> 我衕意條款
        </label>
      </div>
      <div class="preview">
        <h4>實時預覽:</h4>
        <p>文本: {{textInput}}</p>
        <p>數字: {{numberInput}}</p>
        <p>多行文本: {{textareaInput}}</p>
        <p>選擇: {{selectedOption}}</p>
        <p>復選框狀態: {{isChecked ? '已勾選' : '未勾選'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 註意事項



1. **性能考慮**：雙向綁定會創建數據監聽器，大量使用可能影響性能
2. **數據一緻性**：雙向綁定確保數據和視圖的一緻性，但要註意避免無限循環更新
3. **初始值設置**：確保綁定的數據有閤適的初始值，避免 undefined 顯示問題
4. **事件衝突**：避免在衕一元素上衕時使用雙向綁定和手動事件處理，以免造成衝突
