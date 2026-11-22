# ネストされたページ/ルーティング

在 ofa.js 中，ネストされたページ（ネストされたルーティングとも呼ばれる）は強力な機能で、親子階層関係を持つページ構造を作成できるようにします。親ページはレイアウトコンテナとして、`<slot>` スロットを介して子ページのコンテンツをレンダリングします。

## 基本概念

- **親ページ（レイアウト）**：レイアウトコンテナとしてのページで、ナビゲーションバー、サイドバーなどの共通UI要素を含む
- **子ページ**：具体的な業務ページの内容で、親ページの `<slot>` スロット位置にレンダリングされる

## 親ページの書き方

親ページは、子ページのレンダリング位置を確保するために `<slot></slot>` タグを使用する必要があります。

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
    ...
  </style>
  ...
  <div class="content">
    <slot></slot>
  </div>
  ...
</template>
```

## サブページの書き方

子ページは `parent` プロパティをエクスポートすることで親ページのパスを指定します。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export const parent = 'layout.html'; // ⚠️ 关键なコード

    export default async () => {
      return {
        data: {
          val: "Hello ofa.js デモコード",
        },
      };
    };
  </script>
</template>
```

## ネストされたページの例

以下は完全なネストルートの例で、ルートレイアウト、親ページ、子ページを含みます：

<o-playground name="ネストされたページの例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // アプリのホームページアドレス
    export const home = "./sub-page01.html";
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
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>ページ1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>ページ2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>私はサブページ1です</h1>
      <p>現在のルート：{{src}}</p>
      <a href="./sub-page02.html" olink>ページ2にジャンプ</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>私はサブページ2です</h1>
      <p>現在のルート：{{src}}</p>
      <a href="./sub-page01.html" olink>ページ1にジャンプ</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 父ページのルート監視

親ページは `routerChange` ライフサイクルフックを使用してルート変更を監視できます。これは、現在のルートに応じてナビゲーション状態を更新する必要がある場合に非常に便利です。

```html
<template page>
  ...
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## 注意事項

- `parent` 属性の値は相対パス（例：`./layout.html`）または絶対パス（例：`/pages/layout.html`）にすることができます
- 親ページには `<slot></slot>` タグが含まれている必要があります。そうしないと、子ページのコンテンツが表示されません
- 親ページのスタイルは子ページに継承され、子ページは独自のスタイルを定義することもできます
- `routerChange` フックを使用してルートの変更を監視し、ナビゲーションのハイライトなどの機能を実装できます

## 多段階ネスト

親ページもまた、自身の親ページを持つことができ、多段階のネスト構造を形成します。

```html
<!-- 子ページ -->
<template page>
  <p>子ページコンテンツ</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- 親ページ -->
<template page>
  <div class="layout">
    <nav>ナビゲーションバー</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## 多階層ネスト例

<o-playground name="ネストされたルート完全サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // アプリのホームページアドレス
    export const home = "./sub-page01.html";
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
  <code path="root-layout.html">
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
          border: 1px dashed gray;
        }
        .root {
          height: 100%;
          word-break: break-word;
          padding: 10px;
        }
      </style>
      <div style="text-align: center;font-weight: bold;">Root Layout</div>
      <div class="root">
        <slot></slot>
      </div>
      <script>
        export default () => {
          return { data: {} };
        };
      </script>
    </template>
  </code>
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>ページ1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>ページ2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export const parent = "./root-layout.html";
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>私は子ページ 1</h1>
      <p>現在のルート：{{src}}</p>
      <a href="./sub-page02.html" olink>ページ2に移動</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>私は子ページ 2</h1>
      <p>現在のルート：{{src}}</p>
      <a href="./sub-page01.html" olink>ページ1に移動</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

