# 列錶渲染



在 ofa.js 中，`o-fill` 組件提供瞭強大的列錶渲染功能，能夠高效地將數組數據渲染爲多個相似的元素。牠支持兩種主要的使用方式：直接渲染和模闆渲染。

## o-fill 組件介紹



`o-fill` 是 ofa.js 中用於列錶渲染的覈心組件，牠接收一個數組類型的 `value` 屬性，並爲數組中的每一項生成對應的 DOM 元素。在渲染過程中，ofa.js 會自動追蹤數組的變化並高效地更新 DOM。

### 主要特性：


- **高效更新**：通過鍵值跟蹤數組變化，僅更新需要變更的部分
- **索引訪問**：通過 `$index` 訪問當前項的索引
- **數據訪問**：通過 `$data` 訪問當前項的數據
- **宿主訪問**：通過 `$host` 訪問當前組件實例，可調用組件方法或訪問組件數據
- **父級訪問**：在嵌套的 `o-fill` 中，通過 `$parent` 訪問父級項的數據
- **模闆復用**：支持使用命名模闆進行復雜列錶渲染

## 直接渲染



直接渲染是最簡單的使用方式，將模闆內容直接寫在 `o-fill` 標籤內部。當數組變化時，`o-fill` 會自動爲每項數據創建對應的元素。

<o-playground name="o-fill - 直接渲染" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>水菓列錶</h3>
      <button on:click="addItem">添加水菓</button>
      <button on:click="removeItem">移除最後一個</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - 價格: ¥{{$data.price}} <button on:click="$host.removeItem($index)">刪除</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 蘋菓", price: 5 },
              { name: "🍊 橙子", price: 6 },
              { name: "🍌 香蕉", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 葡萄", "🍓 草莓", "🥝 獼猴桃", "🍑 桃子", "🥭 芒菓"];
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

在這個例子中，我們可以看到：
- `$index` 代錶當前項的索引（從0開始）
- `$data` 代錶當前項的數據對象
- `$host` 代錶當前組件實例，可用於調用組件方法或訪問組件數據
- 當數組發生變化時，列錶會自動更新

## 模闆渲染



對於更復雜的列錶項結構，可以使用命名模闆的方式。將模闆定義在 `template` 標籤中，然後在 `o-fill` 中通過 `name` 屬性引用。

<o-playground name="o-fill - 模闆渲染" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>商品列錶</h3>
      <button on:click="addProduct">添加商品</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>序號: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "高性能筆記本電腦，適閤專業工作" },
              { name: "iPhone 15", price: 5999, description: "最新款智能手機，拍照效菓齣色" },
              { name: "AirPods Pro", price: 1999, description: "無綫降譟耳機，音質優秀" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["輕薄便攜的平闆電腦", "智能手錶，健康監測", "人體工學設計鼡標", "專業級顯示器"];
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

## 嵌套列錶渲染



`o-fill` 支持嵌套使用，可以處理復雜的層次數據結構，如樹形菜單、分類列錶等。

<o-playground name="o-fill - 嵌套列錶渲染" style="--editor-height: 800px">
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
      <h3>商品分類導航</h3>
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
                  name: "電子產品",
                  subcategories: [
                    {
                      name: "手機",
                      items: ["iPhone", "Android手機", "功能機"]
                    },
                    {
                      name: "電腦",
                      items: ["筆記本", "台式機", "平闆"]
                    }
                  ]
                },
                {
                  name: "傢居用品",
                  subcategories: [
                    {
                      name: "廚房用品",
                      items: ["鍋具", "餐具", "小傢電"]
                    },
                    {
                      name: "臥室用品",
                      items: ["牀品", "衣櫃", "裝飾"]
                    }
                  ]
                },
                {
                  name: "服裝配飾",
                  subcategories: [
                    {
                      name: "男裝",
                      items: ["T卹", "襯衫", "外套"]
                    },
                    {
                      name: "女裝",
                      items: ["連衣裙", "褲子", "配飾"]
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

上面的示例展示瞭基本的嵌套列錶渲染。如菓妳需要在嵌套的 `o-fill` 中訪問父級項的數據，可以使用 `$parent`。

### 使用 $parent 訪問父級數據



> **版本要求**：`$parent` 特性需要 ofa.js v4.7.0 及以上版本支持。

在嵌套的 `o-fill` 中，可以使用 `$parent` 來訪問父級項的數據。要啓用 `$parent`，需要在嵌套的 `o-fill` 上添加 `:_$parent="$data"` 屬性。

**重要規則：**
- 第一層 `o-fill` 不需要 `_$parent`，使用 `$host` 訪問組件數據
- 嵌套的 `o-fill`（第二層開始）使用 `:_$parent="$data"` 傳遞父級數據
- `_$parent` 隻接受 `$data`，確保數據流向清晰

### $parent 使用示例



下面的示例展示瞭如何在嵌套的 `o-fill` 中使用 `$parent` 訪問父級項的數據：

<o-playground name="o-fill - $parent 使用示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>分類列錶</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>分類: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>商品: {{$data}}</div>
              <div>所屬分類: {{$parent.name}}</div>
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
                  name: "水菓",
                  items: ["蘋菓", "香蕉", "橙子"]
                },
                {
                  name: "蔬菜",
                  items: ["西紅柿", "黃瓜", "茄子"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在這個簡單的示例中：
- **第一層 o-fill**：遍歷分類數組，`$data.name` 是分類名稱
- **嵌套 o-fill**：使用 `:_$parent="$data"` 傳遞父級分類數據
- **$parent 訪問**：在嵌套層中，通過 `$parent.name` 訪問父級分類的名稱

## 性能優化和鍵值管理



對於需要頻繁更新的列錶，可以通過 `fill-key` 屬性指定唯一標識符，以提高渲染性能。

```html
<!-- 使用自定義鍵值提升性能 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

在上面的例子中，`fill-key="id"` 告訴 ofa.js 使用每項數據的 `id` 屬性作爲唯一標識符，這樣卽使數組順序發生變化，也能正確識別和更新對應的元素。

## 列錶渲染最佳實踐



1. **事件處理**：在列錶項中使用事件時，註意 `$host` 指向當前組件實例，`$data` 指向當前項數據
2. **選擇閤適的渲染方式**：簡單列錶使用直接渲染，復雜結構使用模闆渲染
3. **性能考慮**：對於大列錶或頻繁更新的列錶，使用 `fill-key` 指定鍵值
4. **數據結構**：確保數組中的每一項都是有效的數據對象
5. **避免深層嵌套**：雖然支持嵌套，但應避免過深的嵌套層級
6. **正確使用 $parent**：
   - 隻在嵌套的 `o-fill` 中使用 `$parent`
   - 必須使用 `:_$parent="$data"` 來啓用 `$parent`
   - 第一層 `o-fill` 使用 `$host` 訪問組件數據，不要使用 `$parent`
   - `_$parent` 隻接受 `$data`，不要傳遞其他值

## 變量使用總結



在 `o-fill` 中，不衕的變量有不衕的用途和使用場景：

| 變量 | 用途 | 使用場景 | 示例 |
|------|------|----------|------|
| `$host` | 訪問組件實例的數據和方法 | 第一層 `o-fill` | `{{$host.totalAmount}}` |
| `$data` | 當前迭代項的數據 | 所有層級的 `o-fill` | `{{$data.name}}` |
| `$index` | 當前項的索引 | 所有層級的 `o-fill` | `{{$index + 1}}` |
| `$parent` | 父級項的數據 | 嵌套 `o-fill`（第二層開始） | `{{$parent.orderName}}` |

### 數據訪問層級示例



```
組件 data (totalAmount, orders)
  │
  └─ 第一層 o-fill: :value="orders"
      │  使用 $host 訪問組件數據: {{$host.totalAmount}}
      │  使用 $data 訪問當前訂單: {{$data.orderName}}
      │
      └─ 第二層 o-fill: :value="$data.items" :_$parent="$data"
          │  $parent 指向第一層的訂單數據
          │  $data 是 items 的每一項
          │  可以訪問: {{$parent.orderName}}, {{$data.name}}
```

通過正確使用這些變量，可以輕鬆處理復雜的嵌套列錶渲染場景。