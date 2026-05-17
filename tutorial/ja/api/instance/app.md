# app



`o-app` 内の要素（`o-app` 内の `o-page` のシャドウノード内の要素、またはさらに内部のサブコンポーネントを含む）の `app` 属性は、すべてこの `o-app` の要素インスタンスを指します。

## アプリケーションインスタンスの取得

以下は、`o-app`内の要素から`app`属性にアクセスする方法を示す例です：


<o-playground name="app - アプリインスタンスの取得" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリのホームページアドレス
    export const home = "./home.html";
    // アプリで利用可能なメソッド
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## アプリケーションインスタンスの使用

`app` インスタンスを取得したら、次のことができます：

### 1. アプリのカスタムメソッドにアクセスする

`app-config.js` の `proto` 設定項目を通じて追加されたカスタムメソッドは、任意のページやコンポーネント内で `this.app` を通じて呼び出すことができます：

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// ページまたはコンポーネントで使用する
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("ユーザーはログイン済み");
}
```

### 2. アプリケーション属性へのアクセス

```javascript
// 現在のページを取得
const currentPage = this.app.current;

// ルーティング履歴を取得
const routers = this.app.routers;

// グローバルデータにアクセス
const user = this.app.globalData?.user;
```

### 3. ナビゲーションメソッドの呼び出し

```javascript
// ページ遷移
this.app.goto("./about.html");

// 前のページに戻る
this.app.back();

// 現在のページを置き換え
this.app.replace("./login.html");
```

### 4. アプリイベントの監視

```javascript
// ルート変更の監視
this.app.on("router-change", (e) => {
  console.log("ルート変更:", e.data);
});
```

## 詳細ドキュメント

`app-config.js` でアプリケーション初期化ロジックの設定方法とカスタムメソッドの追加方法については、以下を参照してください：

- **[アプリの初期化](../../documentation/app-initialization.md)** - `ready` と `proto` 設定オプションの使い方を詳しく説明します
- **[ルーティングとナビゲーション](../../documentation/app-navigation.md)** - アプリのナビゲーション方法とルート監視について詳しく説明します

## アプリケーションインスタンスのよく使うプロパティとメソッド

| プロパティ/メソッド | 説明 |
|----------|------|
| `current` | 現在のページインスタンス |
| `routers` | ルーティング履歴 |
| `globalData` | グローバルデータ（`ready` で自身で初期化する必要があります） |
| `goto(src)` | 指定ページへ遷移 |
| `back()` | 前のページに戻る |
| `replace(src)` | 現在のページを置き換える |
| `forward()` | 次のページに進む |
| `on(event, callback)` | アプリイベントを監視 |
| カスタムメソッド | `proto` 設定によって追加されたメソッド |