# クイックスタート

このセクションでは、ofa.js のクイックスタート方法について説明します。以降のチュートリアルでは、index.html エントリファイルの作成手順を省略し、ページモジュールファイルのコードのみを表示します。テンプレートを基に直接開発を進めることができます。

## 基本ファイルの準備

ofa.jsをすぐに使い始めるには、**ページモジュール**を作成し、エントリHTMLと組み合わせるだけです。必要なコアファイルは次のとおりです。

- `index.html`: アプリケーションのエントリーファイルであり、ofa.jsフレームワークをロードしてページモジュールを導入します。
- `demo-page.html`: ページモジュールファイルであり、ページの具体的な内容、スタイル、データロジックを定義します。

### index.html（アプリケーションエントリ）

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js サンプル</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

このファイルの主な役割は：- ofa.js フレームワークを導入する
- `<o-page>` コンポーネントを使用してページモジュールをロードしレンダリングする

### demo-page.html (ページモジュール)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
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
```

このファイルは簡単なページコンポーネントを定義しており、含まれています：- `<template page>` タグ、ページモジュールを定義
- CSS スタイル（Shadow DOM の `:host` セレクタを使用）
- データバインディング式 `{{val}}`
- JavaScript ロジック、初期データを含むオブジェクトを返す


## オンラインデモ

以下是在线编辑器中的实时示例，您可以直接修改代码并查看效果：

<o-playground name="オンラインデモ" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
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
</o-playground>

コンポーネント内部の `<style>` タグを使用してスタイルを定義します。これらの内部スタイルはコンポーネント内部にのみ適用され、優れたカプセル化を備えており、ページ内の他の要素に影響を与えません。

ここで `:host` セレクターはコンポーネントのホスト要素のスタイルを定義するために使用され、ここではコンポーネントをブロックレベル要素に設定し、赤い枠線と10pxのパディングを追加します。

`{{key}}` 式を使用して、コンポーネントデータ内の対応する値をページにレンダリングできます。

これで最初の ofa.js アプリケーションの作成に成功しました！次は、ofa.js のテンプレートレンダリング構文とその高度な機能について詳しく見ていきましょう。