# シングルページアプリケーション

单页面应用是将 `o-app` 组件与浏览器地址栏绑定，使网页 URL 与应用内的页面路径保持同步。启用单页面应用后：

- ページをリフレッシュすると、現在のルート状態を保持できます
- アドレスバーのURLをコピーして、他のブラウザやタブで開いても、同様にアプリケーションの状態を復元できます
- ブラウザの進む/戻るボタンは正常に使用できます

## 基本的な使い方

公式の `o-router` コンポーネントで `o-app` コンポーネントをラップすると、シングルページアプリケーションを実現できます。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ルーター テスト</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body 属性

`fix-body` 属性を追加すると、`o-router` は自動的に `html` および `body` のスタイルをリセットし、デフォルトの margin と padding を除去します。

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

これは以下のようなシナリオで特に役立ちます：- `o-app` でビューポートを完全に埋める必要があります
- アプリがページの唯一のコンテンツである場合

## 例

<o-playground name="単一ページアプリケーションの例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
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

## 仕組み

シングルページアプリケーションはブラウザのHashモードに基づいて実装されます：

1. アプリ内でページが切り替わると、`o-router` は自動的にアドレスバーのハッシュ値を更新します（例：`#/about.html`）
2. ユーザーがページを更新したり URL でアクセスしたりすると、`o-router` はハッシュ値を読み取り、対応するページをロードします
3. ブラウザの進む／戻るボタンがハッシュの変化をトリガーし、アプリのページナビゲーションを制御します

## URL変化の例

アプリケーションに `home.html` と `about.html` の2つのページがあるとします：

| ユーザー操作 | アドレスバーの変化 |
|-------------|-------------------|
| アプリを開く | `index.html` → `index.html#/home.html` |
| 概要ページへ移動 | `index.html#/home.html` → `index.html#/about.html` |
| 戻るボタンをクリック | `index.html#/about.html` → `index.html#/home.html` |
| ページをリフレッシュ | 現在のハッシュを維持 |## 使用制限

- シングルページアプリケーションは**1つ**の `o-app` コンポーネントとのみ連携できます