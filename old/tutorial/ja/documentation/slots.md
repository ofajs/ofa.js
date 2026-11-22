# スロット

スロットは、コンポーネント内で外部からのコンテンツを受け取るためのプレースホルダです。スロットを使用することで、再利用可能なコンポーネントを作成しつつ、コンポーネントを使用する人がその内部のコンテンツを自由にカスタマイズできるようになります。

## デフォルトスロット

<o-playground name="默认插槽示例" style="--editor-height: 500px">
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
      </style>スロット内容：
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

### スロットのデフォルトコンテンツ

親コンポーネントがスロットコンテンツを提供していない場合、`<slot></slot>`内部の要素がデフォルトコンテンツとして表示されます。

<o-playground name="スロットデフォルトコンテンツ例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>スロットコンテンツあり：</h3>
      <demo-comp>
        <div>これはカスタムコンテンツです</div>
      </demo-comp>
      <h3>スロットコンテンツなし（デフォルトコンテンツを表示）：</h3>
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
      </style>スロットコンテンツ：
      <span style="color: red;">
        <slot>
          <div>これはデフォルトコンテンツです</div>
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

## 名前付きスロット

コンポーネントに複数のスロット位置が必要な場合、名前付きスロットを使って異なるスロットを区別できます。`<slot name="xxx">` で名前付きスロットを定義し、使用時には `slot="xxx"` 属性でどのスロットにコンテンツを入れるかを指定します。

<o-playground name="名前付きスロットの例" style="--editor-height: 500px">
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
      </style>スロット内容：
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

## 多層スロットの受け渡し

スロットの内容は、複数層のコンポーネントを越えて渡すことができます。親コンポーネントが子コンポーネントにスロットの内容を渡した後、子コンポーネントはさらにそのスロットの内容を自身の子コンポーネントに渡すことができ、スロットの多層透過を実現します。

<o-playground name="多層スロット渡しサンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">最外層からのタイトル</div>
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
      <h3>外側コンポーネント</h3>
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
      <h4>内側コンポーネント</h4>
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

上記の例では：- 最外側の親コンポーネントが `slot="header"` の内容を定義しています
- 外側のコンポーネント（outer-comp）がこのスロットの内容を受け取り、それを内側のコンポーネント（inner-comp）に渡し続けます
- 内側のコンポーネントは最終的に、最外側からのスロット内容をレンダリングします