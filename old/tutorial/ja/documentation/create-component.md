# コンポーネントを作成する

ofa.jsにおいて、コンポーネントはページの再利用とモジュール化を実現するための中核となるメカニズムです。コンポーネントは本質的にカスタムWeb Componentであり、テンプレート、スタイル、ロジックを定義することで、再利用可能なUI要素を作成できます。

## コンポーネントの基本構造

ページモジュールとは異なり、コンポーネントモジュールの `<template>` 要素は `component` 属性を使用し、`tag` 属性でコンポーネントのタグ名を指定します。

コンポーネントを使用する場所では、`l-m` タグを使ってコンポーネントモジュールを非同期で読み込み、システムが自動的に登録を行います。その後、通常のHTMLタグのようにそのコンポーネントを直接使用できます。

<o-playground name="コンポーネント基本サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS コンポーネントサンプル",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## コンポーネントの核心概念

### tag - コンポーネントタグ名

`tag` はコンポーネントのタグ名であり、**コンポーネントの使用タグ名と一致しなければなりません**。例えば、コンポーネントの `tag` が `"demo-comp"` と定義されている場合、HTML で使用する際には `<demo-comp></demo-comp>` と記述する必要があります。

コンポーネントは本質的に Web Component であるため、**コンポーネントのタグ名には必ずハイフン `-` を含める必要があります**。これは Web Component の仕様で、ネイティブ HTML 要素のタグ名と競合しないようにするための要件です。例えば `demo-comp`、`my-button`、`user-card` などは有効なタグ名ですが、`democomp`、`button`、`card` などのハイフンがないタグ名は無効です。

### コンポーネントモジュール参照

`l-m` タグを使用してコンポーネントモジュールを導入すると、コンポーネントモジュールは自動的にコンポーネントを登録します。これは `script` タグを使用してスクリプトを導入するのと似ていますが、`l-m` はコンポーネントモジュールの読み込みと登録に特化しています。

> 注意：`l-m` 参照タグは**非同期参照**であり、ページの読み込み時にコンポーネントを必要に応じてロードするのに適しています。

## 同期参照コンポーネント

特定のシナリオでは、コンポーネントを同期的に読み込む必要がある場合があります（たとえば、使用する前にコンポーネントの登録が完了していることを保証するなど）。その場合は、`load` メソッドと `await` キーワードを組み合わせて同期的な参照を実現できます。

コンポーネントモジュールとページモジュールには、自動的に `load` 関数が注入され、開発者が必要なリソースを同期的にロードできるようになります。

<o-playground name="同期参照コンポーネントの例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS コンポーネントの例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 非同期参照 vs 同期参照

| 参照方法 | キーワード | 特徴 |
|---------|-------|------|
| 非同期参照 | `l-m` タグ | 非ブロッキング読み込み、コンポーネントのオンデマンド読み込みに適する |
| 同期参照 | `load` メソッドと `await` キーワード | ブロッキング読み込み、コンポーネントが使用前に確実に登録される |`l-m` タグ参照と `load` メソッドはどちらもコンポーネントモジュールを読み込むことができます。一般的には `l-m` タグを使用してコンポーネントを非同期に参照し、非ブロッキングロードとオンデマンドロードを実現することを推奨します。