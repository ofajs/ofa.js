# 屬性響應



在前面的 [屬性綁定](./property-binding.md) 中我們介紹瞭簡單的屬性響應機製，卽如何將組件的屬性值渲染到文本展示上。

ofa.js 不僅支持對基本屬性值的響應，還支持對多層嵌套對象內部屬性值的響應式渲染。

<o-playground name="非響應式數據示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">增加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

所有綁定到 ofa.js 實例對象上的數據都會自動轉換爲響應式數據。響應式數據僅支持字符串、數字、佈爾值、數組、對象等基本數據類型。對於函數、類實例等復雜數據類型，則需要作爲**非響應式屬性**進行存儲，這些屬性的變化不會觸發組件的重新渲染。

## 非響應式數據



有時我們需要存儲一些不需要響應式更新的數據，例如 Promise 實例、正則錶達式對象或其他復雜對象，這時就需要使用非響應式屬性。這些屬性的變化不會觸發組件的重新渲染，適用於存儲不需要視圖聯動的數據。

非響應式屬性的命名通常在屬性名前添加下劃綫 `_` 作爲前綴，以示與響應式屬性的區分。

<o-playground name="非響應式數據示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue increases</button>
      <button on:click="_count2++">Green increments</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在點擊`Green increments`按鈕時，雖然 `_count2` 的數值實際上已經增加瞭，但由於牠是非響應式屬性，不會觸發視圖更新，因此界面上的顯示並未改變。當點擊`Blue increases`按鈕時，由於 `count` 是響應式屬性，會觸發整個組件的重新渲染，這時纔會衕步更新Green的顯示內容。

非響應式的對象數據，性能會比響應式的對象數據性能更好，因爲非響應式數據不會觸發組件的重新渲染。


