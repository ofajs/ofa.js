# ルーティングとナビゲーション

アプリ内のページナビゲーションはシングルページアプリケーションの中核機能です。本章では、プログラムによるナビゲーションの使用方法、ルーティング履歴の管理、およびルーティング変更の監視方法について説明します。

## allowForward - 前進機能

デフォルトでは、アプリは後方ナビゲーションのみをサポートします。`app-config.js` で `allowForward` を `true` に設定すると、アプリの前方機能を有効にできます。

```javascript
// app-config.js
export const allowForward = true;
```

有効にした後：

- ユーザーはブラウザの進む/戻るボタンを使用してナビゲートできます
- アプリケーションの `forward()` メソッドは正常に動作します

## プログラミングによるナビゲーション

JavaScript では、`olink` 属性を持つリンクを使用する以外に、ナビゲーションメソッドを呼び出すこともできます。

### goto - ページ遷移

指定されたページにジャンプし、履歴に追加します：

```javascript
// 指定ページに移動する
this.goto("./about.html");

// パラメータを付けて移動する
this.goto("./detail.html?id=123");
```

### replace - ページ置換

現在のページを置き換え、履歴に追加しない：

```javascript
// 現在のページを置き換える
this.replace("./login.html");
```

ログイン後のリダイレクトによく使用され、ユーザーが戻るボタンをクリックしたときにログインページに戻るのを防ぎます。

### back - 後退

前のページに戻る：

```javascript
this.back();
```

### forward - 前進

次のページに進む（`allowForward: true` を設定する必要があります）：

```javascript
// ページまたはコンポーネントで呼び出す
this.app.forward();
```

> **注意**：`forward` メソッドは、ページインスタンスではなく、アプリケーションインスタンス（`app`）で呼び出す必要があります。例えば、`this.forward()` ではなく `this.app.forward()` を使用します。

### ナビゲーション方法の比較

| メソッド  | 履歴             | 使用シーン                 |
| --------- | ---------------- | -------------------------- |
| `goto`    | 新しい履歴を追加 | 通常のページ遷移           |
| `replace` | 現在の履歴を置換 | ログイン後の遷移、リダイレクト |
| `back`    | 前の履歴に戻る   | 戻る操作                   |
| `forward` | 次の履歴に進む   | 進む操作（有効時）         |## ルーティング履歴

### ルート履歴の取得

`routers` プロパティを通じてすべてのルーティング履歴を取得します：

```javascript
const history = app.routers;
// 戻り値の形式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### 現在のページを取得

`current` プロパティを通じて現在のページインスタンスを取得する：

```javascript
const currentPage = app.current;
console.log("現在のページ:", currentPage.src);
```

### ルーティング履歴の例

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // allowForward と共に使用する必要があります
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## ルートの変更を監視する

`router-change` イベントをリッスンすることで、ルーティングの変更に対応します。

### 基本的な使い方

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("ルート変更:", data.name);
  console.log("ページアドレス:", data.src);
});
```

### イベントデータ

`router-change` イベントのデータオブジェクトには以下が含まれます：

| 属性   | 説明             | 可能な値                             |
| ------ | ---------------- | ------------------------------------ |
| `name` | ナビゲーションタイプ | `goto`, `replace`, `forward`, `back` |
| `src`  | 遷移先ページアドレス | ページパス                         |### 使用例

```javascript
export const ready = function () {
  // ルーティング変更を監視
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // ページアクセスを記録
    console.log(`[${name}] ナビゲート先: ${src}`);

    // ページタイトルを更新
    this.updateTitle(src);

    // 統計データを送信
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "ホーム",
      "about.html": "会社概要",
      "contact.html": "お問い合わせ",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "アプリ";
  },

  trackPageView(src) {
    // ページアクセス統計を送信
    console.log("ページアクセス統計:", src);
  },
};
```

## ページナビゲーションガード

ルート監視を組み合わせることで、ナビゲーションガード機能を実現できます：

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // ログインが必要かどうかを確認する
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## 完全な例

<o-playground name="ルーティングとナビゲーションの例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリのホームページアドレス
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("アプリが初期化されました");
      this.on("router-change", (e) => {
        console.log("ルート変更:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
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
      <p>ルート履歴数: {{app.routerCount}}</p>
      <a href="./about.html" olink>Aboutへ移動</a>
      <br><br>
      <button on:click="gotoAbout">プログラムによる遷移</button>
      <br><br>
      <button on:click="goForward()">進む</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">戻る</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>ルート履歴数: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">ヒント：「戻る」をクリックした後、ホームページで「進む」をクリックするとここに戻れます</p>
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

