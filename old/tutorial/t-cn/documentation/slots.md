# 插槽



插槽是組件中用於接收外部內容的佔位符。通過使用插槽，妳可以創建可復用的組件，衕時允許使用組件的人自定義組件內部的內容。

## 默認插槽



<o-playground name="默認插槽示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
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
      </style>插槽內容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 插槽默認內容



當父組件沒有提供插槽內容時，`<slot></slot>` 內部的元素將作爲默認內容顯示。

<o-playground name="插槽默認內容示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>有插槽內容：</h3>
      <demo-comp>
        <div>這是自定義內容</div>
      </demo-comp>
      <h3>無插槽內容（顯示默認內容）：</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>插槽內容：
      <span style="color: red;">
        <slot>
          <div>這是默認內容</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 命名插槽



當組件需要多個插槽位置時，可以使用命名插槽來區分不衕的插槽。通過 `<slot name="xxx">` 定義具名插槽，在使用時通過 `slot="xxx"` 屬性指定內容放入哪個插槽。

<o-playground name="命名插槽示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
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
      </style>插槽內容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 多層級插槽傳遞



插槽內容可以跨越多層組件進行傳遞。當父組件向子組件傳遞插槽內容後，子組件可以繼續將這個插槽內容傳遞給自己的子組件，實現插槽的多層透傳。

<o-playground name="多層級插槽傳遞示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">來自最外層的標題</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>外層組件</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
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
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>內層組件</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在上面的示例中：
- 最外層父組件定義瞭 `slot="header"` 的內容
- 外層組件（outer-comp）接收到這個插槽內容後，將其繼續傳遞給內層組件（inner-comp）
- 內層組件最終渲染來自最外層的插槽內容