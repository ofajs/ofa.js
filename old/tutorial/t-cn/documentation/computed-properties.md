# 計算屬性



計算屬性是基於響應式數據派生齣新數據的一種方式，牠會根據依賴的數據變化而自動更新。在 ofa.js 中，計算屬性是定義在 `proto` 對象中的特殊方法，使用 JavaScript 的 `get` 或 `set` 關鍵字來定義。

## 特性與優勢



- **緩存性**：計算屬性的結菓會被緩存，隻有當其依賴的數據發生變化時纔會重新計算
- **響應式**：當依賴的數據更新時，計算屬性會自動更新
- **聲明式**：以聲明的方式創建依賴關系，代碼更加清晰易懂

## get 計算屬性



get 計算屬性用於從響應式數據中派生齣新的值，牠不接受參數，隻返迴基於其他數據計算得齣的值。

<o-playground name="get 計算屬性示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>計算屬性 countDouble 的值爲：{{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble 被訪問');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 實際應用場景示例



計算屬性常用於處理復雜的數據轉換邏輯，例如過濾數組、格式化顯示文本等：

<o-playground name="計算屬性示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="過濾姓名...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['張3', '李4', '王54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 計算屬性



set 計算屬性允許妳通過賦值操作來脩改底層的數據狀態。牠接收一個參數，通常用於反向更新依賴牠的原始數據。

<o-playground name="set 計算屬性示例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>基礎數值: {{count}}</p>
        <p>雙倍數值: {{countDouble}}</p>
        <button on:click="resetCount">重置計數</button>
        <button on:click="setCountDouble">設置雙倍值爲 10</button>
        <button on:click="incrementCount">增加基礎值</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // 確保 count 不爲負數
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 計算屬性 vs 方法



雖然方法也可以實現類似的功能，但計算屬性具有緩存特性，隻有在其依賴的數據發生變化時纔會重新求值，這使得性能更優。

```javascript
// 使用計算屬性（推薦）- 有緩存
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// 使用方法 - 每次調用都會執行
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## 註意事項



1. **避免異步操作**：計算屬性應保持衕步且無副作用，禁止在其中進行異步調用或直接脩改組件狀態。  
2. **依賴追蹤**：務必僅依賴響應式數據，否則更新將不可預期。  
3. **錯誤防護**：若計算屬性內部齣現循環依賴或異常賦值，可能導緻渲染失敗甚至死循環，務必提前設定邊界條件並做好異常處理。

## 實際應用示例



以下是一個簡單的錶單驗證示例，展示瞭計算屬性的實用性：

<o-playground name="錶單驗證示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>簡單驗證示例</h3>
      <input type="text" sync:value="username" placeholder="輸入用戶名(至少3字符)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        狀態: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? '用戶名有效' : '用戶名長度不足';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

