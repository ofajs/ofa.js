# 列表渲染

在 ofa.js 中，`o-fill` 组件提供了强大的列表渲染功能，能够高效地将数组数据渲染为多个相似的元素。它支持两种主要的使用方式：直接渲染和模板渲染。

## o-fill 组件介绍

`o-fill` 是 ofa.js 中用于列表渲染的核心组件，它接收一个数组类型的 `value` 属性，并为数组中的每一项生成对应的 DOM 元素。在渲染过程中，ofa.js 会自动追踪数组的变化并高效地更新 DOM。

### 主要特性：
- **高效更新**：通过键值跟踪数组变化，仅更新需要变更的部分
- **索引访问**：通过 `$index` 访问当前项的索引
- **数据访问**：通过 `$data` 访问当前项的数据
- **宿主访问**：通过 `$host` 访问当前组件实例，可调用组件方法或访问组件数据
- **父级访问**：在嵌套的 `o-fill` 中，通过 `$parent` 访问父级项的数据
- **模板复用**：支持使用命名模板进行复杂列表渲染

## 直接渲染

直接渲染是最简单的使用方式，将模板内容直接写在 `o-fill` 标签内部。当数组变化时，`o-fill` 会自动为每项数据创建对应的元素。

<o-playground name="o-fill - 直接渲染" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>水果列表</h3>
      <button on:click="addItem">添加水果</button>
      <button on:click="removeItem">移除最后一个</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - 价格: ¥{{$data.price}} <button on:click="$host.removeItem($index)">删除</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 苹果", price: 5 },
              { name: "🍊 橙子", price: 6 },
              { name: "🍌 香蕉", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 葡萄", "🍓 草莓", "🥝 猕猴桃", "🍑 桃子", "🥭 芒果"];
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

在这个例子中，我们可以看到：
- `$index` 代表当前项的索引（从0开始）
- `$data` 代表当前项的数据对象
- `$host` 代表当前组件实例，可用于调用组件方法或访问组件数据
- 当数组发生变化时，列表会自动更新

## 模板渲染

对于更复杂的列表项结构，可以使用命名模板的方式。将模板定义在 `template` 标签中，然后在 `o-fill` 中通过 `name` 属性引用。

<o-playground name="o-fill - 模板渲染" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>商品列表</h3>
      <button on:click="addProduct">添加商品</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>序号: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "高性能笔记本电脑，适合专业工作" },
              { name: "iPhone 15", price: 5999, description: "最新款智能手机，拍照效果出色" },
              { name: "AirPods Pro", price: 1999, description: "无线降噪耳机，音质优秀" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["轻薄便携的平板电脑", "智能手表，健康监测", "人体工学设计鼠标", "专业级显示器"];
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

## 嵌套列表渲染

`o-fill` 支持嵌套使用，可以处理复杂的层次数据结构，如树形菜单、分类列表等。

### 使用 $parent 访问父级数据

在嵌套的 `o-fill` 中，可以使用 `$parent` 来访问父级项的数据。要启用 `$parent`，需要在嵌套的 `o-fill` 上添加 `:_$parent="$data"` 属性。

**重要规则：**
- 第一层 `o-fill` 不需要 `_$parent`，使用 `$host` 访问组件数据
- 嵌套的 `o-fill`（第二层开始）使用 `:_$parent="$data"` 传递父级数据
- `_$parent` 只接受 `$data`，确保数据流向清晰

<o-playground name="o-fill - 嵌套列表渲染" style="--editor-height: 800px">
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
      <h3>商品分类导航</h3>
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
                  name: "电子产品",
                  subcategories: [
                    {
                      name: "手机",
                      items: ["iPhone", "Android手机", "功能机"]
                    },
                    {
                      name: "电脑",
                      items: ["笔记本", "台式机", "平板"]
                    }
                  ]
                },
                {
                  name: "家居用品",
                  subcategories: [
                    {
                      name: "厨房用品",
                      items: ["锅具", "餐具", "小家电"]
                    },
                    {
                      name: "卧室用品",
                      items: ["床品", "衣柜", "装饰"]
                    }
                  ]
                },
                {
                  name: "服装配饰",
                  subcategories: [
                    {
                      name: "男装",
                      items: ["T恤", "衬衫", "外套"]
                    },
                    {
                      name: "女装",
                      items: ["连衣裙", "裤子", "配饰"]
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

### $parent 使用示例

下面的示例展示了如何在嵌套的 `o-fill` 中使用 `$parent` 访问父级项的数据：

<o-playground name="o-fill - $parent 使用示例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>分类列表</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>分类: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>商品: {{$data}}</div>
              <div>所属分类: {{$parent.name}}</div>
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
                  name: "水果",
                  items: ["苹果", "香蕉", "橙子"]
                },
                {
                  name: "蔬菜",
                  items: ["西红柿", "黄瓜", "茄子"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在这个简单的示例中：
- **第一层 o-fill**：遍历分类数组，`$data.name` 是分类名称
- **嵌套 o-fill**：使用 `:_$parent="$data"` 传递父级分类数据
- **$parent 访问**：在嵌套层中，通过 `$parent.name` 访问父级分类的名称

## 性能优化和键值管理

对于需要频繁更新的列表，可以通过 `fill-key` 属性指定唯一标识符，以提高渲染性能。

```html
<!-- 使用自定义键值提升性能 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

在上面的例子中，`fill-key="id"` 告诉 ofa.js 使用每项数据的 `id` 属性作为唯一标识符，这样即使数组顺序发生变化，也能正确识别和更新对应的元素。

## 列表渲染最佳实践

1. **事件处理**：在列表项中使用事件时，注意 `$host` 指向当前组件实例，`$data` 指向当前项数据
2. **选择合适的渲染方式**：简单列表使用直接渲染，复杂结构使用模板渲染
3. **性能考虑**：对于大列表或频繁更新的列表，使用 `fill-key` 指定键值
4. **数据结构**：确保数组中的每一项都是有效的数据对象
5. **避免深层嵌套**：虽然支持嵌套，但应避免过深的嵌套层级
6. **正确使用 $parent**：
   - 只在嵌套的 `o-fill` 中使用 `$parent`
   - 必须使用 `:_$parent="$data"` 来启用 `$parent`
   - 第一层 `o-fill` 使用 `$host` 访问组件数据，不要使用 `$parent`
   - `_$parent` 只接受 `$data`，不要传递其他值

## 变量使用总结

在 `o-fill` 中，不同的变量有不同的用途和使用场景：

| 变量 | 用途 | 使用场景 | 示例 |
|------|------|----------|------|
| `$host` | 访问组件实例的数据和方法 | 第一层 `o-fill` | `{{$host.totalAmount}}` |
| `$data` | 当前迭代项的数据 | 所有层级的 `o-fill` | `{{$data.name}}` |
| `$index` | 当前项的索引 | 所有层级的 `o-fill` | `{{$index + 1}}` |
| `$parent` | 父级项的数据 | 嵌套 `o-fill`（第二层开始） | `{{$parent.orderName}}` |

### 数据访问层级示例

```
组件 data (totalAmount, orders)
  │
  └─ 第一层 o-fill: :value="orders"
      │  使用 $host 访问组件数据: {{$host.totalAmount}}
      │  使用 $data 访问当前订单: {{$data.orderName}}
      │
      └─ 第二层 o-fill: :value="$data.items" :_$parent="$data"
          │  $parent 指向第一层的订单数据
          │  $data 是 items 的每一项
          │  可以访问: {{$parent.orderName}}, {{$data.name}}
```

通过正确使用这些变量，可以轻松处理复杂的嵌套列表渲染场景。