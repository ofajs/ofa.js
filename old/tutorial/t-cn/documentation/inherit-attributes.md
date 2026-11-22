# 傳遞特徵屬性



在 ofa.js 中，[特徵屬性（Attribute）](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes)是組件間傳遞數據最常用的方式之一。隻需在組件的 `attrs` 對象中聲明所需屬性，卽可在使用組件時將外部數據傳入組件內部。

## 基本用法



### 定義接收屬性



在使用組件之前，需要先在組件的 `attrs` 對象中聲明需要接收的屬性。屬性可以設置默認值。

<o-playground name="基本用法示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA 組件示例"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS 使用案例"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 重要規則



1. **類型限製**：傳遞的 attribute 值必須是字符串，其他類型會被自動轉換爲字符串。

2. **命名轉換**：由於 HTML 屬性不區分大小寫，傳遞包含大寫字母的屬性時，需要使用 `-` 分割命名（kebab-case 格式）。
   - 例如：`fullName` → `full-name`

3. **必須定義**：如菓組件未在 `attrs` 對象中定義對應屬性，則無法接收該 attribute。設置的值爲默認值，如菓不想要默認值則設置爲 `null`。

<o-playground name="重要規則示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="張三" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "默認名稱",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 模闆語法傳遞 Attribute



在組件的模闆中，可以使用 `attr:toKey="fromKey"` 語法，將當前組件的 `fromKey` 數據傳遞到子組件的 `toKey` 屬性上。

<o-playground name="屬性傳遞示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
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
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
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
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 多層級傳遞



可以通過多層嵌套組件逐層傳遞 attribute。

如菓組件需要依賴其他組件，需要在組件中引入其他組件的模塊。

<o-playground name="多層級傳遞示例" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="頂層數據"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>外層組件接收: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>內層組件接收: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
