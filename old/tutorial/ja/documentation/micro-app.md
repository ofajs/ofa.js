# マイクロアプリ

`o-app` は ofa.js のコアコンテナコンポーネントであり、独立したマイクロアプリケーションを作成するために使用されます。`app-config.js` 設定ファイルを読み込み、このファイルがアプリケーションのさまざまな動作を定義します。

## 基本的な使い方

HTML で `o-app` タグを使用してマイクロアプリケーションを作成する：

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

## 設定ファイルの作成

`app-config.js`ファイルを作成し、アプリの基本設定を定義します：

```javascript
// app-config.js

// アプリのホームページアドレス（必須）
export const home = "./home.html";

// ページ切り替えアニメーション設定（オプション）
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

<o-playground name="マイクロアプリケーション例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリケーションのホームページアドレス
    export const home = "./home.html";
    // ページ遷移アニメーション設定
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
      <div style="padding: 8px;"> <button on:click="back()">戻る</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a>について</p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## ページナビゲーション

### olink 属性の使用

`o-app` 内で、`olink` 属性を持つ `<a>` タグを使用してページ切り替えを行います：

```html
<a href="./about.html" olink>概要ページにジャンプ</a>
```

`olink` はアプリのルート切り替えをトリガーし、トランジションアニメーションを伴い、ページ全体をリフレッシュしません。

### プログラミングによるナビゲーション

ページコンポーネントでは、ナビゲーションメソッドを使用できます：

```javascript
// 指定されたページに移動する
this.goto("./about.html");

// 現在のページを置き換える（履歴に追加しない）
this.replace("./about.html");

// 前のページに戻る
this.back();
```

## ページ間のパラメータ受け渡し

URLクエリでパラメータを渡し、ターゲットページはモジュール関数の `query` パラメータで受け取ります：

**送信ページ：**

```html
<a href="./detail.html?id=123" olink>詳細を見る</a>
```

**受信ページ：**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## 設定ファイルの詳細

`app-config.js` は、アプリケーションの動作を制御するためのさまざまな設定オプションをサポートしています：

| 設定項目 | 必須かどうか | 説明 |
|--------|----------|------|
| `home` | 必須 | アプリのトップページアドレス |
| `pageAnime` | オプション | ページ切り替えアニメーションの設定 |
| `loading` | オプション | ページ読み込み中に表示する内容 |
| `fail` | オプション | ページ読み込み失敗時に表示する内容 |
| `ready` | オプション | アプリ初期化完了後のコールバック |
| `proto` | オプション | アプリのプロトタイプに追加するメソッドとプロパティ |
| `allowForward` | オプション | ブラウザの「進む」機能を有効にするかどうか |## マイクロアプリケーションの特性

### 独立性

各 `o-app` インスタンスは独立したマイクロアプリケーションであり、独自の：- ルート履歴
- ページスタック
- 状態管理
- 設定オプション

### ネストして使用

`o-app` はネストして使用でき、複雑なアプリケーション構造を実現します：

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### コンポーネントとの違い

`o-app` と通常のコンポーネントの主な違い：

| 特性 | o-app | 一般コンポーネント |
|------|-------|----------|
| ルート管理 | ✅ 内蔵ルートシステム | ❌ なし |
| ページスタック | ✅ ページ履歴管理 | ❌ なし |
| 設定ファイル | ✅ 独立設定 | ❌ なし |
| ページ切替アニメーション | ✅ 対応 | ❌ なし |
| 適用シーン | アプリレベルのコンテナ | 機能コンポーネント |