# 特徴属性の受け渡し

ofa.jsにおいて、[特徴属性（Attribute）](https://developer.mozilla.org/ja/docs/Web/API/Element/attributes)はコンポーネント間でデータを渡す最も一般的な方法の一つです。コンポーネントの `attrs` オブジェクトに必要な属性を宣言するだけで、コンポーネントを使用するときに外部データをコンポーネント内部に渡すことができます。

## 基本的な使い方

### 受信プロパティの定義

コンポーネントを使用する前に、まずコンポーネントの `attrs` オブジェクト内で受け取る必要のある属性を宣言する必要があります。属性にはデフォルト値を設定できます。

<o-playground name="基本使用例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA コンポーネント例"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS 使用例"></demo-comp>
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

### 重要ルール

1. **型制限**：渡される attribute の値は文字列でなければならず、他の型は自動的に文字列に変換される。

2. **命名変換**：HTML 属性は大文字・小文字を区別しないため、大文字を含む属性を渡す際は `-` で区切った名前（kebab-case 形式）を用いる。
   - 例：`fullName` → `full-name`

3. **定義必須**：コンポーネントが `attrs` オブジェクトに対応する属性を定義していない場合、その attribute を受け取ることはできない。設定された値はデフォルト値であり、デフォルト値を不要とする場合は `null` を設定する。

<o-playground name="重要なルール例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="山田太郎" age="25"></demo-comp>
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
              userName: "デフォルトの名前",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## テンプレート構文の属性受け渡し

コンポーネントのテンプレートでは、`attr:toKey="fromKey"` という構文を使って、現在のコンポーネントの `fromKey` データを子コンポーネントの `toKey` プロパティに渡すことができます。

<o-playground name="属性受け渡し例" style="--editor-height: 500px">
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

## マルチレベルの伝達

多層ネストされたコンポーネントを通じて、attributeを層ごとに渡すことができます。

コンポーネントが他のコンポーネントに依存する必要がある場合、コンポーネント内で他のコンポーネントのモジュールを導入する必要があります。

<o-playground name="多階層渡しの例" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="トップデータ"></outer-comp>
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
      <p>外部コンポーネント受信: {{userName}}</p>
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
      <p>内部コンポーネント受信: {{userName}}</p>
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

