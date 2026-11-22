# ホストスタイルの注入

Web Componentsでは、`slot`スロットの制限により、スロット内の複数階層の要素に直接スタイルを設定できません。この問題を解決するために、ofa.jsは`<inject-host>`コンポーネントを提供しており、コンポーネント内部からホスト要素にスタイルを注入することで、スロットコンテンツ内の複数階層の要素に対するスタイル制御を実現します。

> 注意、まずは [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) セレクタを使用してスロットコンテンツのスタイルを設定することをお勧めします。要件を満たせない場合にのみ、`<inject-host>` コンポーネントを使用してください。

## 基本的な使い方

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 直接の子要素のスタイルを設定 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 複数階層のネストされたスタイルも設定可能 */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## ケース

以下の例は、`<inject-host>` を使用してスロット内のネストされた要素のスタイルを設定する方法を示しています。2つのコンポーネントを作成します：リストコンテナとして `user-list` コンポーネント、リスト項目として `user-list-item` コンポーネントです。 `<inject-host>` を使用することで、`user-list` コンポーネント内で `user-list-item` とその内部要素のスタイルを設定できます。

<o-playground name="注入ホストスタイル" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>張三</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">李四</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        年齢: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

実行結果から以下のことが確認できます：- `user-list-item` コンポーネントの背景色は aqua（`user-list` コンポーネントの `<inject-host>` で設定）
- 名前の文字色は赤色（`user-list` コンポーネントの `<inject-host>` で `user-list-item .item-name` スタイルを設定）

## 仕組み

`<inject-host>` コンポーネントは、内部に含まれる `<style>` タグの内容をコンポーネントのホスト要素に注入します。これにより、注入されたスタイルルールはコンポーネントの境界を越えて、slot スロット内の要素に作用します。

この方法で、次のことができます：
- スロットコンテンツ内の任意の深さの要素のスタイルを設定する
- 完全なセレクタパスを使用して、スタイルがターゲット要素にのみ適用されるようにする
- コンポーネントのスタイルのカプセル化を維持しつつ、柔軟なスタイルの透過を実現する

## 注意事項

⚠️ **スタイル汚染リスク**：注入されたスタイルはホスト要素が存在するスコープに作用するため、他のコンポーネント内の要素に影響を与える可能性があります。使用する際は必ず以下の原則に従ってください：

1. **具体的なセレクタを使用する**：可能な限り完全なコンポーネントタグパスを使用し、広範囲すぎるセレクタを避けてください。
2. **名前空間のプレフィックスを追加する**：スタイルクラスに独自のプレフィックスを追加し、他のコンポーネントとの競合の可能性を減らします。
3. **汎用的なタグセレクタの使用を避ける**：タグセレクタの代わりにクラス名や属性セレクタを使用するようにしてください。
4. **コンポーネント設計を再検討する**： `<inject-host>` を使用しなくても済むようにコンポーネント設計を最適化できるか検討してください。例えば、子コンポーネントで [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) セレクタを併用すると、よりエレガントになることがよくあります。

```html
<!-- 推奨 ✅：具体的なセレクタを使用 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 非推奨 ❌：汎用的すぎるセレクタを使用 -->
<inject-host>
    <style>
        .content {  /* 他のコンポーネントと衝突しやすい */
            color: red;
        }
    </style>
</inject-host>
```

### 性能ヒント

`<inject-host>` はホストスタイルの再注入を引き起こし、結果としてコンポーネントのリフローやリペイントを引き起こす可能性があるため、頻繁に更新されるシーンでは慎重に使用してください。  
スロット内の第1レベル要素にのみスタイルを設定する場合は、[::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 擬似クラスセレクタを優先的に使用すると、透過的な注入による追加のレンダリングオーバーヘッドを回避でき、より良いパフォーマンスを得られます。