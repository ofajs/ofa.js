# ページ切り替えアニメーション

`pageAnime` 設定項目は、ページ切り替え時のトランジションアニメーション効果を制御し、ユーザー体験を向上させるために使用されます。

## 基本構成

`app-config.js` でページ切り替えアニメーションを設定する：

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

## アニメーション状態

ページ遷移アニメーションには3つの状態があります：

| 状態 | 説明 | トリガータイミング |
|------|------|----------|
| `current` | 現在のページのアニメーション終了後のスタイル | ページ切り替え完了時 |
| `next` | 新しいページが入る際の開始スタイル | 新しいページが入り始める時 |
| `previous` | 古いページが離れる際の目標スタイル | 古いページが離れ始める時 |### 状態の詳細

**current（現在の状態）**- ページ切り替え完了後の最終スタイル
- 通常はページの通常表示状態
- 例：`opacity: 1, transform: "translate(0, 0)"`

**次へ（次のページの状態）**- 新しいページが表示される際の初期スタイル
- 新しいページがどこから入ってくるかを定義するために使用
- 例：`opacity: 0, transform: "translate(30px, 0)"` は右側から入ってくることを表す

**previous（前のページの状態）**- 旧ページが離脱する際の目標スタイル
- 旧ページの移動先を定義するために使用されます
- 例：`opacity: 0, transform: "translate(-30px, 0)"` は左方向への離脱を示します

## 内蔵アニメーション効果

### 左右スライド（デフォルト）

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

効果説明：- 新しいページが右側からスライドインする（初期位置は右側 30px、透明度 0）
- 古いページが左側へスライドアウトする（最終位置は左側 -30px、透明度 0）
- 最終的に両方のページが通常位置に戻る（透明度 1、位置 0）

### フェードイン・フェードアウト

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

効果説明：- 新しいページは透明から可視状態へとフェードインします
- 古いページは可視状態から透明へとフェードアウトします
- シンプルでエレガントなアプリケーションスタイルに適しています

### 上下スライド

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

効果説明：- 新しいページが下からスライドイン
- 古いページが上へスライドアウト
- 縦スクロールスタイルのアプリに適している

### ズームエフェクト

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

効果説明：- 新しいページが小から通常サイズへ拡大
- 古いページが通常サイズから拡大して消失
- カード型やモーダルウィンドウスタイルのアプリに最適

### 反転効果

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

効果説明：- 新しいページは左側からフリップして入る
- 古いページは右側へフリップして去る
- 3D効果が必要なアプリに適している

## カスタムアニメーション

### 複数の属性を組み合わせる

複数の CSS プロパティを組み合わせて複雑なアニメーションを作成できます。

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### 異なるイージング関数を使用する

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

## サポートされているCSSプロパティ

`pageAnime` はすべての CSS アニメーション可能なプロパティをサポートします：

### よく使われる属性

- `opacity` - 不透明度（0-1）
- `transform` - 変形
  - `translate(x, y)` - 移動
  - `scale(n)` - 拡大縮小
  - `rotate(deg)` - 回転
  - `rotateX/Y(deg)` - 3D回転
- `width` / `height` - 幅 / 高さ
- `margin` / `padding` - 外側の余白 / 内側の余白
- `background-color` - 背景色
- `border-radius` - 角丸

### 注意事項

1. **パフォーマンス最適化**：`transform` と `opacity` を優先的に使用してください。これらは最もパフォーマンスが優れています
2. **レイアウトの乱れを避ける**：レイアウトの再計算を引き起こすプロパティ（`width`、`height`、`margin` など）の使用を避けてください
3. **トランジション時間**：ofa.js は自動的にトランジション効果を追加し、デフォルトは 300ms です

## 完全な例

<o-playground name="ページ切り替えアニメーション例" style="--editor-height: 500px">
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
      <a href="./about.html" olink>Aboutへ</a>
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

## ベストプラクティス

### 1. アニメーションをシンプルに保つ

複雑すぎるアニメーションは避け、シンプルなアニメーション効果の方が優れています。

```javascript
// ✅ 推奨：シンプルで効果的
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ 非推奨：複雑すぎる
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. ユーザー体験の考慮

- アニメーションの時間は長すぎないようにする（200～400msを推奨）
- ユーザーがめまいを感じるようなアニメーションを避ける
- アニメーションがスムーズで、カクつかないようにする

### 3. 異なるデバイスへの適応

低スペック端末では、アニメーションを無効化または簡略化することを検討してください。

```javascript
// デバイスのパフォーマンスを検出
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```