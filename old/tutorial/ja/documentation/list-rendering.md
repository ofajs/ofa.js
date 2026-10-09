# リストレンダリング

在 ofa.js では、`o-fill` コンポーネントが強力なリストレンダリング機能を提供し、配列データを効率的に複数の類似した要素にレンダリングできます。このコンポーネントは、直接レンダリングとテンプレートレンダリングという2つの主な使用方法をサポートしています。

## o-fill コンポーネントの紹介

`o-fill` は ofa.js でリストレンダリングに使用されるコアコンポーネントであり、配列型の `value` プロパティを受け取り、配列の各要素に対応する DOM 要素を生成します。レンダリング中、ofa.js は自動的に配列の変更を追跡し、効率的に DOM を更新します。

### 主な特徴：

- **効率的な更新**：キーによる配列の変化を追跡し、変更が必要な部分のみを更新します
- **インデックスアクセス**：`$index` で現在のアイテムのインデックスにアクセスできます
- **データアクセス**：`$data` で現在のアイテムのデータにアクセスできます
- **ホストアクセス**：`$host` で現在のコンポーネントインスタンスにアクセスし、コンポーネントメソッドの呼び出しやデータへのアクセスが可能です
- **親アクセス**：ネストされた `o-fill` 内で、`$parent` を使って親アイテムのデータにアクセスできます
- **テンプレートの再利用**：名前付きテンプレートを使った複雑なリストレンダリングをサポートします

## 直接レンダリング

直接レンダリングは最も簡単な使用方法であり、テンプレートの内容を直接 `o-fill` タグの内部に記述します。配列が変化すると、`o-fill` は自動的に各データ項目に対応する要素を作成します。

<o-playground name="o-fill - 直接渲染" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>フルーツリスト</h3>
      <button on:click="addItem">フルーツを追加</button>
      <button on:click="removeItem">最後を削除</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - 価格: ¥{{$data.price}} <button on:click="$host.removeItem($index)">削除</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 りんご", price: 5 },
              { name: "🍊 オレンジ", price: 6 },
              { name: "🍌 バナナ", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 ぶどう", "🍓 いちご", "🥝 キウイ", "🍑 もも", "🥭 マンゴー"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、次のことがわかります：- `$index` は現在の項目のインデックスを表す（0から始まる）
- `$data` は現在の項目のデータオブジェクトを表す
- `$host` は現在のコンポーネントインスタンスを表し、コンポーネントメソッドの呼び出しやコンポーネントデータへのアクセスに使用できる
- 配列に変化があった場合、リストは自動的に更新される

## テンプレートレンダリング

より複雑なリスト項目構造には、名前付きテンプレートの方式を使用できます。テンプレートを `template` タグ内に定義し、それを `o-fill` 内で `name` 属性を通じて参照します。

<o-playground name="o-fill - テンプレートレンダリング" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>商品一覧</h3>
      <button on:click="addProduct">商品を追加</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>番号: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "高性能ノートパソコン、プロフェッショナルな作業に最適" },
              { name: "iPhone 15", price: 5999, description: "最新のスマートフォン、写真撮影性能が優れている" },
              { name: "AirPods Pro", price: 1999, description: "ワイヤレスノイズキャンセリングイヤホン、高音質" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["薄型軽量のタブレット", "スマートウォッチ、健康管理", "人間工学に基づいたマウス", "プロフェッショナル向けディスプレイ"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## ネストされたリストのレンダリング

`o-fill` はネスト使用をサポートしており、複雑な階層データ構造（ツリーメニュー、分類リストなど）を処理できます。

<o-playground name="o-fill - ネストリストレンダリング" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>商品カテゴリーナビゲーション</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "電子製品",
                  subcategories: [
                    {
                      name: "スマートフォン",
                      items: ["iPhone", "Androidスマートフォン", "フィーチャーフォン"]
                    },
                    {
                      name: "パソコン",
                      items: ["ノートパソコン", "デスクトップパソコン", "タブレット"]
                    }
                  ]
                },
                {
                  name: "ホーム用品",
                  subcategories: [
                    {
                      name: "キッチン用品",
                      items: ["鍋", "食器", "小型家電"]
                    },
                    {
                      name: "ベッドルーム用品",
                      items: ["寝具", "ワードローブ", "装飾品"]
                    }
                  ]
                },
                {
                  name: "衣料・アクセサリー",
                  subcategories: [
                    {
                      name: "メンズ",
                      items: ["Tシャツ", "シャツ", "アウター"]
                    },
                    {
                      name: "ウィメンズ",
                      items: ["ワンピース", "パンツ", "アクセサリー"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

上の例は、基本的な入れ子リストのレンダリングを示しています。入れ子になった `o-fill` で親アイテムのデータにアクセスする必要がある場合は、 `$parent` を使用できます。

### $parent を使用して親データにアクセス

> **バージョン要件**：`$parent` 機能は ofa.js v4.7.0 以上が必要です。

入れ子になった `o-fill` では、`$parent` を使用して親アイテムのデータにアクセスできます。`$parent` を有効にするには、入れ子の `o-fill` に `:_$parent="$data"` 属性を追加する必要があります。

**重要ルール：**- 第1層の `o-fill` は `_$parent` を必要とせず、`$host` を使用してコンポーネントデータにアクセスします
- ネストされた `o-fill`（第2層以降）は `:_$parent="$data"` を使用して親データを渡します
- `_$parent` は `$data` のみを受け取り、データフローの明確さを確保します

### $parent の使用例

以下の例では、ネストされた`o-fill`内で`$parent`を使用して親項目のデータにアクセスする方法を示します。

<o-playground name="o-fill - $parent 使用示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>分類リスト</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>分類: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>商品: {{$data}}</div>
              <div>所属分類: {{$parent.name}}</div>
            </div>
          </o-fill>
        </div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "果物",
                  items: ["リンゴ", "バナナ", "オレンジ"]
                },
                {
                  name: "野菜",
                  items: ["トマト", "キュウリ", "ナス"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

この簡単な例では：- **第一層 o-fill**：分類配列を走査し、`$data.name` は分類名です
- **ネストされた o-fill**：`:_$parent="$data"` を使って親分類データを渡します
- **$parent アクセス**：ネスト層内で、`$parent.name` で親分類の名前にアクセスします

## 性能最適化とキー値管理

頻繁に更新が必要なリストに対しては、`fill-key` 属性で一意の識別子を指定することで、レンダリングパフォーマンスを向上させることができます。

```html
<!-- カスタムキーを使用してパフォーマンスを向上 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

在上記の例では、`fill-key="id"` は ofa.js に対し、各データの `id` 属性を一意の識別子として使用するように指示します。これにより、配列の順序が変わっても、対応する要素を正しく識別して更新できます。

## リストレンダリングのベストプラクティス

1. **イベント処理**：リストアイテムでイベントを使用する場合、`$host` は現在のコンポーネントインスタンスを指し、`$data` は現在のアイテムデータを指すことに注意してください
2. **適切なレンダリング方法の選択**：単純なリストには直接レンダリングを、複雑な構造にはテンプレートレンダリングを使用します
3. **パフォーマンスへの配慮**：大規模なリストや頻繁に更新されるリストには、`fill-key` を使用してキーを指定します
4. **データ構造**：配列の各項目が有効なデータオブジェクトであることを確認します
5. **深すぎるネストの回避**：ネストはサポートされていますが、深くなりすぎないようにします
6. **$parent の正しい使用**：
   - ネストされた `o-fill` 内でのみ `$parent` を使用します
   - `:_$parent="$data"` を使用して `$parent` を有効にする必要があります
   - 最初の層の `o-fill` ではコンポーネントデータにアクセスするために `$host` を使用し、`$parent` は使用しないでください
   - `_$parent` は `$data` のみを受け入れ、他の値を渡さないでください

## 変数の使用まとめ

`o-fill` では、異なる変数にそれぞれ異なる用途と使用シーンがあります：

| 変数 | 用途 | 使用シーン | 例 |
|------|------|----------|------|
| `$host` | コンポーネントインスタンスのデータとメソッドにアクセス | 第一階層の `o-fill` | `{{$host.totalAmount}}` |
| `$data` | 現在の反復項目のデータ | すべての階層の `o-fill` | `{{$data.name}}` |
| `$index` | 現在の項目のインデックス | すべての階層の `o-fill` | `{{$index + 1}}` |
| `$parent` | 親項目のデータ | ネストされた `o-fill`（第二階層から） | `{{$parent.orderName}}` |### データアクセス層の例

```
コンポーネント data (totalAmount, orders)
  │
  └─ 第一層 o-fill: :value="orders"
      │  $host でコンポーネントデータにアクセス: {{$host.totalAmount}}
      │  $data で現在の注文にアクセス: {{$data.orderName}}
      │
      └─ 第二層 o-fill: :value="$data.items" :_$parent="$data"
          │  $parent は第一層の注文データを指す
          │  $data は items の各項目
          │  アクセス可能: {{$parent.orderName}}, {{$data.name}}
```

これらの変数を正しく使用することで、複雑なネストされたリストのレンダリングシナリオを簡単に処理できます。