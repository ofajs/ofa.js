# アプリ設定の基本

`app-config.js` 設定ファイルは、アプリケーションのさまざまな動作を定義するために使用されます。この章では、設定ファイルの基本構造と、利用可能なすべての設定項目について説明します。

## 構成ファイルの構造

`app-config.js` ファイルを作成し、ES6 モジュール構文を使用して設定項目をエクスポートします:

```javascript
// app-config.js

// アプリのホームページアドレス（必須）
export const home = "./home.html";

// ページ切り替えアニメーションの設定（任意）
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};

// ローディング状態（任意）
export const loading = () => {
  return "<div>Loading...</div>";
};

// エラーハンドリング（任意）
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// アプリの初期化（任意）
export const ready = function() {
  console.log("App is ready");
};

// プロトタイプ拡張（任意）
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// 進む機能を有効にする（任意）
export const allowForward = true;
```

## 設定項目の概要

`app-config.js` は以下の設定項目をサポートします：

| 設定項目 | 必須かどうか | 説明 | 詳細ドキュメント |
|--------|----------|------|----------|
| `home` | ✅ 必須 | アプリのホームページアドレス | 本章 |
| `pageAnime` | 任意 | ページ遷移アニメーション設定 | [ページ遷移アニメーション](./page-transition-animation.md) |
| `loading` | 任意 | ページ読み込み中に表示されるコンテンツ | [読み込みとエラー処理](./app-loading-error.md) |
| `fail` | 任意 | ページ読み込み失敗時に表示されるコンテンツ | [読み込みとエラー処理](./app-loading-error.md) |
| `ready` | 任意 | アプリ初期化完了後のコールバック | [アプリ初期化](./app-initialization.md) |
| `proto` | 任意 | アプリのプロトタイプに追加されるメソッドとプロパティ | [アプリ初期化](./app-initialization.md) |
| `allowForward` | 任意 | ブラウザの進む機能を有効にするかどうか | [ルーティングとナビゲーション](./app-navigation.md) |## home - トップページアドレス

`home` は必須設定項目で、アプリケーション起動時に読み込むホーム画面モジュールのパスを指定します。

```javascript
export const home = "./pages/home.html";
```

**パスルール：**- 相対パスをサポート（ `app-config.js` ファイルからの相対パス）
- 絶対パスをサポート
- パスはページモジュールファイル（ `.html` ファイル）を指します

## pageAnime - ページ切り替えアニメーション

`pageAnime` はオプション設定項目で、ページ切り替え時のトランジションアニメ効果を制御するために使用されます。

### 基本的な使い方

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

### アニメーション状態説明

ページ遷移アニメーションには3つの状態があります：

| 状態 | 説明 | トリガータイミング |
|------|------|----------|
| `current` | 現在のページのアニメーション終了後のスタイル | ページ切り替え完了時 |
| `next` | 新しいページが入る際の開始スタイル | 新しいページが入り始める時 |
| `previous` | 古いページが離れる際の目標スタイル | 古いページが離れ始める時 |### その他のアニメーション効果

ページ切り替えアニメーションは多様なエフェクトに対応しており、以下のものが含まれます：- 左右スライド（デフォルト）
- フェードイン・フェードアウト
- 上下スライド
- ズーム効果
- フリップ効果
- カスタムアニメーション

詳細なアニメーションの設定と効果例については、[ページ切り替えアニメーション](./page-transition-animation.md) の章を参照してください。

## HTMLで設定ファイルを使用する

HTMLファイル内で、`o-app` タグを使って設定ファイルを導入します：

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="アプリ構成の基本例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリのホームページアドレス
    export const home = "./home.html";
    // ページ切り替えアニメーション設定
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

