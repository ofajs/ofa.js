# アプリケーション構成

`app-config.js` 設定ファイルは、トップページのアドレスやページ切り替えアニメーション以外にも、アプリケーションのローディング状態、エラー処理、初期化ロジック、ナビゲーション機能を制御するためのより多くの設定オプションをサポートしています。

```javascript
// app-config.js
// 読み込み中に表示される内容
export const loading = () => "<div>読み込み中...</div>";

// ページの読み込みに失敗した場合に表示されるコンポーネント
export const fail = (src, error) => `<div>読み込みに失敗しました: ${src}</div>`;

// アプリの初期化完了後のコールバック
export const ready() {
  console.log("アプリの準備ができました！");
}

// アプリのプロトタイプに追加するメソッドとプロパティ
export const proto = {
  customMethod() {
    console.log("カスタムメソッドが呼ばれました");
  },
};
```

<o-playground name="アプリケーション設定例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリケーションのホームページアドレス
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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

## loading - ローディング状態

ページの読み込み中に表示されるコンポーネント。文字列テンプレートまたはテンプレートを返す関数です。

```javascript
// シンプルな文字列テンプレート
export const loading = "<div class='loading'>Loading...</div>";

// 関数を使って動的に生成
export const loading = () => {
  return `<div class='loading'>
    <span>読み込み中...</span>
  </div>`;
};
```

以下は、美しくてそのままプロジェクトにコピーして使用できる loading 実装です：

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - エラー処理

ページの読み込みに失敗した場合に表示されるコンポーネント。関数はオブジェクトパラメータを受け取り、`src`（失敗したページのアドレス）と`error`（エラーメッセージ）を含みます。

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>ページの読み込みに失敗しました</p>
    <p>アドレス: ${src}</p>
    <button on:click="back()">戻る</button>
  </div>`;
};
```

## proto - プロトタイプ拡張

アプリケーションインスタンスにカスタムメソッドと計算プロパティを追加します。これらのメソッドはページコンポーネント内で `this.app` を通じてアクセスできます。

```javascript
export const proto = {
  // カスタムメソッド
  navigateToHome() {
    this.goto("home.html");
  },
  // 算出プロパティ
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

ページ内で呼び出す：

```html
<template page>
  <button on:click="app.navigateToHome()">ホームに戻る</button>
  <p>ホームにいるか: {{app.isAtHome}}</p>
</template>
```

## ready - 初期化コールバック

アプリケーション設定の読み込みが完了した後に実行されるコールバック関数で、ここで初期化処理を行うことができます。`this`を通じてアプリケーションインスタンスのメソッドやプロパティにアクセスできます。

```javascript
export const ready() {
  console.log("アプリケーションが初期化されました");
  // this にアクセスできます (o-app 要素インスタンス)
  console.log(this.current); // 現在のページ o-page 要素インスタンスを取得する
  // this.someMethod();
}
```

## allowForward - 前進機能

控制是否启用浏览器前进功能。设置为 `true` 后，可以使用浏览器的后退和前进按钮进行导航。

```javascript
export const allowForward = true;
```

有効にすると、ユーザーはブラウザの進む／戻るボタンでナビゲーションできるようになり、アプリケーションのナビゲーションメソッド `forward()` も有効になります。

## プログラミングによるナビゲーション

除了使用 `olink` 链接，还可以在 JavaScript 中调用导航方法：

```javascript
// 指定ページに遷移（履歴に追加）
this.goto("./about.html");

// 現在のページを置き換え（履歴に追加しない）
this.replace("./about.html");

// 前のページに戻る
this.back();

// 次のページに進む（allowForward: true の設定が必要）
this.forward();
```

## ルーティング履歴

`routers` 属性を通じてブラウジング履歴を取得できます：

```javascript
// すべてのルーティング履歴を取得
const history = app.routers;
// 戻り値の形式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 現在のページを取得
const currentPage = app.current;
```

## ルートの変更を監視する

`router-change` イベントをリッスンすることで、ルートの変更に対応できます。

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("ルート変更:", data.name); // goto, replace, forward, back
  console.log("ページアドレス:", data.src);
});
```