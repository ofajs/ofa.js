# 列表渲染

## ⚠️ 重要提醒

在 o-fill 内部，**必须使用以下特殊变量**：

- **`$data`** - 当前项的数据对象
- **`$index`** - 当前项的索引（从 0 开始）
- **`$host`** - 当前组件实例，可调用组件方法或访问组件数据

**不要使用其他变量名**（如 item、element、row 等），这些变量在 o-fill 内部是无效的。

### 示例对比

❌ **错误写法**（使用错误的变量名）：
```html
<o-fill :value="messages">
  <div class="message">
    {{item.text}} - {{item.time}}  <!-- 错误：使用了 item -->
  </div>
</o-fill>
```

✅ **正确写法**（使用 $data）：
```html
<o-fill :value="messages">
  <div class="message">
    {{$data.text}} - {{$data.time}}  <!-- 正确：使用 $data -->
  </div>
</o-fill>
```

### 完整示例

```html
<o-fill :value="products">
  <div>
    {{$index + 1}}. {{$data.name}} - ¥{{$data.price}}
    <button on:click="$host.removeItem($index)">删除</button>
  </div>
</o-fill>
```

在这个例子中：
- `$index` 获取当前项的索引
- `$data.name` 和 `$data.price` 获取当前项的数据
- `$host.removeItem()` 调用组件的方法

### 为什么必须使用 $data？

1. **ofa.js 的约定** - `$data` 是 ofa.js 在 o-fill 内部注入的特殊变量
2. **作用域限制** - o-fill 内部有独立的作用域，只能访问 `$data`、`$index`、`$host`
3. **响应式追踪** - 使用 `$data` 才能正确追踪数据变化并更新视图
4. **避免混淆** - 统一的变量名避免开发者自定义变量名导致的错误

---

## o-fill 组件介绍

在 ofa.js 中，`o-fill` 组件提供了强大的列表渲染功能，能够高效地将数组数据渲染为多个相似的元素。它支持两种主要的使用方式：直接渲染和模板渲染。

## o-fill 组件介绍

`o-fill` 是 ofa.js 中用于列表渲染的核心组件，它接收一个数组类型的 `value` 属性，并为数组中的每一项生成对应的 DOM 元素。在渲染过程中，ofa.js 会自动追踪数组的变化并高效地更新 DOM。

### 主要特性：
- **高效更新**：通过键值跟踪数组变化，仅更新需要变更的部分
- **索引访问**：通过 `$index` 访问当前项的索引
- **数据访问**：通过 `$data` 访问当前项的数据
- **宿主访问**：通过 `$host` 访问当前组件实例，可调用组件方法或访问组件数据
- **模板复用**：支持使用命名模板进行复杂列表渲染

## 直接渲染

直接渲染是最简单的使用方式，将模板内容直接写在 `o-fill` 标签内部。当数组变化时，`o-fill` 会自动为每项数据创建对应的元素。

```html
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
```

在这个例子中，我们可以看到：
- `$index` 代表当前项的索引（从0开始）
- `$data` 代表当前项的数据对象
- `$host` 代表当前组件实例，可用于调用组件方法或访问组件数据
- 当数组发生变化时，列表会自动更新

## 模板渲染

对于更复杂的列表项结构，可以使用命名模板的方式。将模板定义在 `template` 标签中，然后在 `o-fill` 中通过 `name` 属性引用。

```html
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
```

## 嵌套列表渲染

`o-fill` 支持嵌套使用，可以处理复杂的层次数据结构，如树形菜单、分类列表等。

```html
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
```

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

## 关键要点

- **o-fill 组件**：用于列表渲染，接收数组类型的 `value` 属性
- **直接渲染**：将模板内容直接写在 `o-fill` 标签内部
- **模板渲染**：使用命名模板进行复杂列表渲染
- **特殊变量**：`$index`（索引）、`$data`（数据）、`$host`（组件实例）
- **性能优化**：使用 `fill-key` 指定唯一标识符提升性能
- **嵌套支持**：支持嵌套列表渲染，处理层次数据结构
