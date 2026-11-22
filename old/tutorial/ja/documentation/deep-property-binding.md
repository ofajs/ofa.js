# 属性バインディングを理解する

以前の内容では、[プロパティバインディング](./property-binding.md)の基本的な使用方法を簡単に紹介しました。前回の例では、ブラウザのネイティブ要素（`textarea`など）の `value` プロパティをバインドするために使用しました。本節では、プロパティバインディングの本質についてさらに深く掘り下げます。実際には、HTML属性ではなく、コンポーネントのインスタンス化後のJavaScriptプロパティにバインドされるものです。

## コンポーネント属性バインディングメカニズム

ofa.jsにおいて、親コンポーネント内で `:toProp="fromProp"` という構文を使用する際、私たちは子コンポーネントインスタンスのJavaScriptプロパティを設定しており、HTML属性を設定しているわけではありません。これは、HTML属性を直接設定する場合（例：`attr:toKey="fromKey"`）とは重要な違いがあります。

次の例では、属性バインディングを使ってカスタムコンポーネントにデータを渡す方法を示しています：

<o-playground name="属性バインディングを理解する" style="--editor-height: 500px">
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

この例では：- 親コンポーネントの `val` データが子コンポーネント `<demo-comp>` の `fullName` プロパティにバインドされます
- `:full-name="val"` 構文を使用して、親コンポーネントの `val` 値を子コンポーネントの `fullName` プロパティに渡します
- 子コンポーネントは値を受け取った後、テンプレート内で `{{fullName}}` によって表示します

## 属性バインディング vs 特性属性継承

注意すべき点として、属性バインディング（`:`）と特徴属性継承（`attr:`）には以下の重要な違いがあります：

### 属性バインディング (`:`)

- コンポーネントインスタンスにバインドされた JavaScript プロパティ
- 渡されるデータは元の型（文字列、数値、ブール値など）を保持する
- コンポーネント内部で直接アクセスおよび変更が可能であり、コンポーネント内部で事前に `data` を定義する必要すらない

### 特徴属性の継承 (`attr:`)

- HTML属性を設定
- すべての値は文字列に変換される
- 主に下位のDOM要素に属性を渡すために使用
- 複雑なデータを解析するには特別な処理が必要
- 属性値を受け取るには事前にコンポーネント内部で`attrs`を定義する必要がある

文法比較：```html
<!-- 属性バインディング：JavaScriptの値を渡し、データ型を保持 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- 属性継承：HTML属性を設定し、すべての値が文字列に変換される -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- 実際には文字列 "42" が渡されます -->
```

## ケース比較の差異

<o-playground name="ケース比較の差異" style="--editor-height: 500px">
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

其中 `vone` はコンポーネントインスタンスのプロパティ、`vtwo` はHTMLのattribute属性であり、attribute属性の値は `[vtwo]` セレクタで選択されスタイルが適用されます。一方、`vone` はコンポーネントインスタンスのプロパティであるため、`[vone]` セレクタでは選択されません。

## 双方向データバインディング

インスタンス化されたコンポーネントも、双方向データバインディングをサポートしており、`sync:toProp="fromProp"` という構文を使用します。双方向バインディングにより、親コンポーネントと子コンポーネント間でデータを同期でき、どちらかのデータが変更されると、もう一方もそれに応じて更新されます。

> AngularやVueとは異なり、ofa.jsはコンポーネントに特別な設定や追加の操作を追加する必要がなく、ネイティブに双方向データバインディング構文をサポートしています。

### 双方向バインディングの例

以下の例では、親コンポーネントと子コンポーネント間で双方向データバインディングを確立する方法を示しています：

<o-playground name="双方向バインディング例" style="--editor-height: 600px">
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
      <h3 style="color:blue;">親コンポーネントの値: {{val}}</h3>
      <p>入力ボックスで親コンポーネントの値を変更：</p>
      <input type="text" sync:value="val" placeholder="入力ボックスにテキストを入力...">
      <p>子コンポーネントで親コンポーネントの値を変更：</p>
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
      <p>子コンポーネントに表示される値: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="子コンポーネントの入力ボックスに入力...">
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

この例では：- 親コンポーネントの `val` と子コンポーネントの `fullName` は `sync:full-name="val"` によって双方向バインディングが実現されています
- 親コンポーネントの入力ボックスに内容を入力すると、子コンポーネントはすぐに新しい値を表示します
- 子コンポーネントの入力ボックスに内容を入力すると、親コンポーネントもすぐに更新されて表示されます

### 双方向バインディングと通常のプロパティバインディングの違い

| 特性 | 通常の属性バインディング (`:`) | 双方向バインディング (`sync:`) |
|------|-------------------------------|-------------------------------|
| データの流れ | 単方向：親 → 子 | 双方向：親 ↔ 子 |
| 構文 | `:prop="value"` | `sync:prop="value"` |
| 子コンポーネントでの変更 | 親コンポーネントに影響しない | 親コンポーネントに影響する |
| 適したシナリオ | 親コンポーネントから子コンポーネントに設定を渡す | 親子コンポーネント間でのデータ同期が必要な場合 |### 注意事項

1. **パフォーマンスの考慮**：双方向バインディングはデータ変更時に再レンダリングをトリガーするため、複雑なシナリオでは慎重に使用すべきです
2. **データフローの制御**：過剰な双方向バインディングはデータフローの追跡を困難にする可能性があるため、コンポーネント間の通信方法を適切に設計することを推奨します
3. **コンポーネントの互換性**：すべてのコンポーネントが双方向バインディングに適しているわけではなく、コンポーネントの設計目的を考慮する必要があります