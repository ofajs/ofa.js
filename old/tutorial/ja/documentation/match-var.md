# スタイルクエリ

`match-var` は ofa.js の、CSS 変数に基づいてスタイルをマッチングする機能コンポーネントです。`match-var` を使用すると、現在のコンポーネントの CSS 変数値に基づいて動的にマッチングし、異なるスタイルを適用できます。この機能はスタイル関連のコンテキスト状態の受け渡しに特化しており、JavaScript を使用する必要がないため、より便利で、テーマカラーなどのスタイル受け渡しのニーズに適しています。

## 核心概念

- **match-var**: スタイルマッチングコンポーネント。CSS変数の値に基づいて内部スタイルを適用するかどうかを決定します。
- **属性マッチング**: コンポーネントの属性を通じて、マッチングするCSS変数と期待値を定義します。
- **スタイル適用**: マッチングが成功した場合、内部の `<style>` タグのスタイルがコンポーネントに適用されます。

## 基本的な使い方

`match-var` コンポーネントは属性を通じて一致させる CSS 変数と期待値を定義します。コンポーネントの CSS 変数値が指定された属性値と一致した場合、内部で定義されたスタイルが適用されます。

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### 属性

`match-var` コンポーネントは、CSS 変数のマッチングルールを定義するために任意の属性を使用します。属性名は CSS 変数名（`--` プレフィックスなし）に対応し、属性値は期待されるマッチング値です。

### 動作原理

1. **ブラウザサポート**: ブラウザが `@container style()` クエリをサポートしている場合、CSSのネイティブ機能を直接使用します。
2. **フォールバック処理**: サポートされていない場合、ポーリングによりCSS変数値の変更を検出し、一致した後に動的にスタイルを注入します。
3. **手動リフレッシュ**: `$.checkMatch()` メソッドを使用して手動でスタイル検出をトリガーできます。

## 基本例

<o-playground name="基本例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">テーマ切り替え</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          CSS変数に応じて異なるスタイルを表示
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          明るいテーマを表示
        </theme-box>
        <theme-box style="--theme: dark;">
          暗いテーマを表示
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 複数条件マッチング

複数の属性を同時に使用して、より複雑なマッチング条件を定義することができます。すべてのCSS変数がマッチした場合にのみ、スタイルが適用されます。

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## 多条件マッチングの例

<o-playground name="属性マッチングの例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>テーマ: {{theme}} <button on:click="changeTheme">テーマ切り替え</button></div>
      <div>サイズ: {{size}} <button on:click="changeSize">サイズ切り替え</button></div>
      <div class="content">
        <test-card>
          <div>複数条件スタイルマッチングの例</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch 手動更新

状況によっては、CSS変数の変更が自動的に検出されない場合があります。その場合は、手動で `$.checkMatch()` メソッドを呼び出してスタイル検出をトリガーできます。

> 現在の Firefox は `@container style()` クエリをまだサポートしていないため、`$.checkMatch()` を手動で呼ぶ必要があります；将来ブラウザがネイティブにサポートした後は、システムが変数の変化を自動的に検出し、手動でのトリガーは不要になります。

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 手動でスタイル検出をトリガー
    $.checkMatch();
  }
}
```

## ベストプラクティス

1. **優先的にCSSネイティブ機能を使用**: `match-var`はブラウザネイティブの`@container style()`クエリを優先的に使用し、モダンブラウザではパフォーマンスが向上します
2. **スタイルを適切に整理**: 関連するマッチングスタイルをまとめて配置し、メンテナンスと理解を容易にします
3. **data()バインディングを使用**: `data()`ディレクティブと組み合わせることで、レスポンシブなスタイル切り替えを実現できます