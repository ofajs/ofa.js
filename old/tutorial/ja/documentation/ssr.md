# SSR と アイソモルフィックレンダリング

> SSRとは何かわからないなら、今はまだ必要ないということですので、この章をスキップして、将来的に必要になったときに戻って学習してください。

## アイソモルフィックレンダリング

CSRのスムーズな体験、より優れたクローラー認識（SEO）、そしてより自由なバックエンド開発言語の選択を同時に維持するために、ofa.jsは独自の同型レンダリング（Symphony Client-Server Rendering）モードを提供しています。

> CSR / SSR / SSG の具体的な定義と違いを理解したい場合は、この記事の末尾の章を直接ご覧ください。

同型レンダリングの核心理念は：- サーバーサイドで初期ページコンテンツをレンダリングし、SEOと初回読み込み速度を確保
- クライアント側でルーティング処理を引き継ぎ、CSRのスムーズなユーザー体験を維持
- あらゆるサーバー環境に対応し、真の同型レンダリングを実現

### 同型レンダリングの実装原理

ofa.js の 同型レンダリングモードは、以下のメカニズムに基づいています：

1. サーバーサイドで汎用実行構造を持つ完全なHTMLページを生成する
2. クライアントがCSR実行エンジンをロードする
3. 現在の実行環境を自動認識し、レンダリング戦略を決定する

### 同じ構造を持つレンダリングコード構造

**オリジナルのCSRページモジュール：**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**同型レンダリングをカプセル化した完全なページ：**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- ページモジュールのコンテンツ挿入位置 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

したがって、任意の開発言語（Go、Java、PHP、Nodejs、Python など）や、任意のバックエンドテンプレートレンダリングエンジン（Go の `html/template`、PHP の Smarty/Twig/Blade など）を使用して、ofa.js の同型レンダリングコード構造をテンプレートに埋め込むことで、SSR を実現できます。

* [Nodejs SSR ケース](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR ケース](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR ケース](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### 同構レンダリングテンプレート構造

同じ構造のレンダリングモードを実現するには、サーバーサイドで以下の汎用テンプレート構造を使用するだけです：

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 対応するページモジュールの内容を動的に挿入します -->
  </o-app>
</body>

</html>
```

**注意：** サーバーが返すHTMLには正しいHTTPヘッダーを設定する必要があります：`Content-Type: text/html; charset=UTF-8`

`scsr.mjs` は ofa.js が提供する同型レンダリング実行エンジンであり、現在のページの動作状態に応じて自動的にレンダリング戦略を判断し、あらゆる環境で最高のユーザーエクスペリエンスを提供できるようにします。

同様に、SSG もこの構造を適用して静的サイト生成を実現できます。

## ofa.js と SSR および他のフロントエンドフレームワークの違い

ofa.js の Symphony Client-Server Rendering（以下SCSR）は本質的にもSSRモードです。

Vue、React、Angularなどの既存のフロントエンドフレームワークのSSR方式と比較して、ofa.jsの最大の利点は**Node.jsへの強制バインドが不要**であることです。つまり、任意のバックエンドテンプレートレンダリングエンジン（PHPのSmarty、PythonのJinja2、JavaのThymeleafなど）でも、ofa.jsを容易に統合してSSRを実現できます。

## ウェブページのレンダリング方式概要

モダンなウェブアプリケーションには主に4種類のレンダリング方式があります：従来のサーバーサイドテンプレートエンジンレンダリング、CSR（Client Side Rendering、クライアントサイドレンダリング）、SSR（Server Side Rendering、サーバーサイドレンダリング）、そしてSSG（Static Site Generation、静的サイト生成）です。それぞれの方式には利点と適用シーンがあります。

### 従来のサーバーサイドテンプレートエンジンレンダリング

多くのWeb製品において、サーバーサイドテンプレートエンジンは依然として最も主流なページレンダリング手段です。Go、PHPなどのバックエンド言語は、組み込みまたはサードパーティのテンプレートエンジン（Goの `html/template`、PHPのSmarty/Twig/Bladeなど）を利用して、動的データをHTMLテンプレートに注入し、一度に完全なHTMLページを生成してクライアントに返します。

**利点：**- SEO フレンドリー、初回表示が速い
- サーバー側で制御するため、セキュリティが高い
- チームの技術スタックへの要求が低く、バックエンド開発者だけで独立して開発可能

**欠点：**- ユーザーエクスペリエンスが悪く、毎回のインタラクションでページの再読み込みが必要
- サーバー側の負荷が高い
- フロントエンドとバックエンドの結合度が高く、役割分担が困難

### CSR（クライアントサイドレンダリング）

在 CSR モードでは、ページコンテンツは完全にブラウザ側のJavaScriptでレンダリングされます。ofa.jsの[シングルページアプリケーション](./routes.md)は典型的なCSR実装です。この方式はスムーズなユーザー体験を提供し、ページ遷移なしですべての操作を完了できます。ReactやVueと、それに対応するルーティングライブラリ（React RouterやVue Routerなど）を使用して開発されたシングルページアプリケーション（SPA）は、いずれも典型的なCSR実装です。

**利点：**- ユーザー体験はスムーズで、ページ切り替えにリフレッシュはありません
- クライアント側の処理能力が高く、応答が迅速です

**欠点：**- SEOに不利であり、検索エンジンが内容をインデックスしにくい

### SSR（サーバーサイドレンダリング）

CSRのスムーズな体験を維持しつつ、サーバー側でリアルタイムにページをレンダリングする方式に変更：ユーザーがリクエストを送信すると、サーバーが即座に完全なHTMLを生成して返すことで、真のサーバーサイドレンダリングを実現します。

**利点：**- SEOに優しく、初回表示が速い
- 動的コンテンツをサポート

**欠点：**- サーバー負荷が大きい
- 通常、Node.js 環境をランタイムとして必要とするか、少なくとも Node.js 中間層が必要
- 完全な対話を実現するには、後続のクライアントアクティベーションが必要

### SSG（静的サイト生成）

ビルド段階で全ページを静的なHTMLファイルに事前レンダリングし、デプロイ後は直接サーバーからユーザーに返すことができる。

**利点：**- 初回読み込みが速く、SEOに優しい
- サーバー負荷が低く、安定したパフォーマンス
- セキュリティが高い

**欠点：**- 動的コンテンツの更新が困難
- ページ数の増加に伴いビルド時間が長くなる