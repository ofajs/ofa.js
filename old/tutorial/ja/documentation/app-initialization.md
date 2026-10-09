# アプリ初期化

アプリケーションの初期化段階では、グローバルな設定（カスタムメソッドの追加、イベントのリスニングなど）を実行できます。`app-config.js` には、初期化ロジックを処理するための `ready` と `proto` という2つの設定項目が用意されています。

## ready - 初期化コールバック

`ready`はアプリケーション設定の読み込み完了後に実行されるコールバック関数で、ここで初期化処理を行うことができます。

### 基本的な使い方

```javascript
export const ready = function() {
  console.log("アプリが初期化されました");
  // this は o-app 要素インスタンスを指します
  console.log("現在のページ:", this.current);
};
```

> **注意**：`ready` は関数宣言または関数式を使用する必要があり、アロー関数は使用できません（正しい `this` バインディングが必要なため）。

### アプリケーションインスタンスへのアクセス

`ready` 関数内では、`this` は `o-app` 要素インスタンスを指し、アプリケーションのすべてのメソッドとプロパティにアクセスできます。

```javascript
export const ready = function() {
  // 現在のページを取得
  console.log("現在のページ:", this.current);
  
  // ルーティング履歴を取得
  console.log("ルーティング履歴:", this.routers);
  
  // ルート変更を監視
  this.on("router-change", (e) => {
    console.log("ルート変更:", e.data);
  });
};
```

### 初期化例

```javascript
export const ready = function() {
  // グローバル状態の初期化
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // ローカルストレージからユーザー情報を復元
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // ルーター変更の監視
  this.on("router-change", (e) => {
    // ページアクセスを記録
    console.log("アクセスページ:", e.data.src);
  });
};
```

## proto - プロトタイプ拡張

`proto` は、アプリケーションインスタンスにカスタムメソッドと算出プロパティを追加するために使用され、これらのメソッドはすべてのページで `this.app` を通じてアクセスできます。

### カスタムメソッドの追加

```javascript
export const proto = {
  // カスタムメソッド
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // パラメータ付きメソッド
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### 算出プロパティの追加

```javascript
export const proto = {
  // 計算プロパティ
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### 完全な例

```javascript
export const proto = {
  // ナビゲーションメソッド
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // 算出プロパティ
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // ユーティリティメソッド
  showMessage(message) {
    alert(message);
  },
};
```

## ページ内での使用

ページコンポーネントでは、`this.app` を通じてアプリケーションインスタンスのカスタムメソッドとプロパティにアクセスできます：

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">ホームに戻る</button>
  <button on:click="app.navigateToProfile()">個人センター</button>
  
  <p>ホームにいますか: {{app.isAtHome}}</p>
  <p>ログインしていますか: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // アプリインスタンスのメソッドを呼び出す
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## グローバル状態管理

`ready` と `proto` を組み合わせることで、シンプルなグローバル状態管理を実現できます：

```javascript
// app-config.js

export const ready = function() {
  // グローバル状態の初期化
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // ローカルストレージからデータを復元
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // ユーザー関連
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto("./login.html");
  },
  
  // ショッピングカート関連
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // テーマ関連
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## 完全な例

<o-playground name="アプリ初期化サンプル" style="--editor-height: 500px">
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
    export const ready = function() {
      console.log("アプリが初期化されました");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("アクセス回数:", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>ホームページにいるか: {{app.isAtHome}}</p>
      <a href="./about.html" olink>概要へ移動</a>
      <br><br>
      <button on:click="app.navigateToHome()">ホームに戻る</button>
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
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>ホームページにいるか: {{app.isAtHome}}</p>
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

