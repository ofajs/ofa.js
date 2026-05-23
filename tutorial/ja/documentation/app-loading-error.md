# 読み込みとエラー処理

アプリケーションの実行中、ページの読み込みには時間がかかり、読み込みに失敗する場合もあります。`app-config.js` は、これらのシーンに対処するための `loading` と `fail` 設定項目を提供しています。

## loading - ローディング状態

`loading` 設定項目は、ページの読み込み中に表示されるコンテンツ用で、ユーザーエクスペリエンスを向上させます。

### シンプルな文字列テンプレート

最も簡単な方法は、文字列テンプレートを使用することです：

```javascript
export const loading = "<div class='loading'>Loading...</div>";
```

### 動的関数生成

関数を使用すると、より複雑なローディングコンポーネントを動的に生成できます：

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>ロード中...</span>
  </div>`;
};
```

### プログレスバーのサンプル

以下は美しいプログレスバーの読み込みエフェクトです：

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

このプログレスバーの実装：- ページ読み込み時、プログレスバーは0%から徐々に98%まで増加します
- ページ読み込み完了後、プログレスバーは素早く100%まで増加して消えます
- 滑らかなトランジションアニメーションを使用

### カスタムローディングアニメーション

**回転ローディングアニメーション：**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**スケルトンローディング：**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - エラー処理

`fail`設定項目は、ページ読み込み失敗時に表示されるエラープロンプトコンポーネントに使用されます。

### 基本的な使い方

`fail` 関数はオブジェクト引数を受け取り、含む：- `src` - 失敗ページのアドレス
- `error` - エラー情報オブジェクト

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>ページの読み込みに失敗しました</h3>
    <p>アドレス: ${src}</p>
    <p>エラー: ${error.message}</p>
    <button on:click="back()">前のページに戻る</button>
  </div>`;
};
```

### 完全なエラーハンドリングの例

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">ページの読み込みに失敗しました</h2>
    <p style="color: #666; margin-bottom: 20px;">ページを読み込めません: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      エラーメッセージ: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        前のページに戻る
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        ホームに戻る
      </button>
    </div>
  </div>`;
};
```

### エラータイプ処理

異なるエラータイプに応じて異なるヒントを表示できます：

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "不明なエラー";
  
  if (error.message.includes("404")) {
    errorMessage = "ページが存在しません";
  } else if (error.message.includes("timeout")) {
    errorMessage = "読み込みがタイムアウトしました。ネットワーク接続を確認してください";
  } else if (error.message.includes("network")) {
    errorMessage = "ネットワークエラーです。後でもう一度お試しください";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>エラーが発生しました</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">戻る</button>
  </div>`;
};
```

## 完全な例

<o-playground name="読み込みとエラー処理の例" style="--editor-height: 500px">
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>ページの読み込みに失敗しました</h3>
        <p>アドレス: ${src}</p>
        <p>エラー: ${error.message}</p>
        <button on:click="back()">前のページに戻る</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>存在しないページへ</a>
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

