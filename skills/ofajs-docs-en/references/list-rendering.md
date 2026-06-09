# List Rendering

## ⚠️ Important Reminder

Inside o-fill, **you must use the following special variables**:

- **`$data`** - Current item's data object
- **`$index`** - Current item's index (starting from 0)
- **`$host`** - Current component instance, can call component methods or access component data

**Do not use other variable names** (like item, element, row, etc.), these variables are invalid inside o-fill.

### Example Comparison

❌ **Wrong Way** (using wrong variable names):
```html
<o-fill :value="messages">
  <div class="message">
    {{item.text}} - {{item.time}}  <!-- Wrong: using item -->
  </div>
</o-fill>
```

✅ **Correct Way** (using $data):
```html
<o-fill :value="messages">
  <div class="message">
    {{$data.text}} - {{$data.time}}  <!-- Correct: using $data -->
  </div>
</o-fill>
```

### Complete Example

```html
<o-fill :value="products">
  <div>
    {{$index + 1}}. {{$data.name}} - ¥{{$data.price}}
    <button on:click="$host.removeItem($index)">Delete</button>
  </div>
</o-fill>
```

In this example:
- `$index` gets the current item's index
- `$data.name` and `$data.price` get the current item's data
- `$host.removeItem()` calls the component's method

### Why Must Use $data?

1. **ofa.js Convention** - `$data` is a special variable injected by ofa.js inside o-fill
2. **Scope Limitation** - o-fill has an independent scope, can only access `$data`, `$index`, `$host`
3. **Reactive Tracking** - Using `$data` correctly tracks data changes and updates the view
4. **Avoid Confusion** - Unified variable names prevent errors from developer-defined variable names

---

## o-fill Component Introduction

In ofa.js, the `o-fill` component provides powerful list rendering functionality, capable of efficiently rendering array data as multiple similar elements. It supports two main usage methods: direct rendering and template rendering.

## o-fill Component Introduction

`o-fill` is the core component for list rendering in ofa.js. It receives an array-type `value` property and generates corresponding DOM elements for each item in the array. During rendering, ofa.js automatically tracks array changes and efficiently updates the DOM.

### Main Features:
- **Efficient Updates**: Tracks array changes through key values, only updating parts that need to change
- **Index Access**: Access current item's index through `$index`
- **Data Access**: Access current item's data through `$data`
- **Host Access**: Access current component instance through `$host`, can call component methods or access component data
- **Template Reuse**: Supports using named templates for complex list rendering

## Direct Rendering

Direct rendering is the simplest usage method, writing template content directly inside the `o-fill` tag. When the array changes, `o-fill` automatically creates corresponding elements for each data item.

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
  </style>
  <h3>Fruit List</h3>
  <button on:click="addItem">Add Fruit</button>
  <button on:click="removeItem">Remove Last</button>
  <ul>
    <o-fill :value="fruits">
      <li> {{$index + 1}}. {{$data.name}} - Price: ¥{{$data.price}} <button on:click="$host.removeItem($index)">Delete</button></li>
    </o-fill>
  </ul>
  <script>
    export default async () => ({
      data: { 
        fruits: [
          { name: "🍎 Apple", price: 5 },
          { name: "🍊 Orange", price: 6 },
          { name: "🍌 Banana", price: 3 }
        ],
        fruitIndex: 0,
      },
      proto: {
        addItem() {
          const fruitNames = ["🍇 Grape", "🍓 Strawberry", "🥝 Kiwi", "🍑 Peach", "🥭 Mango"];
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

In this example, we can see:
- `$index` represents the current item's index (starting from 0)
- `$data` represents the current item's data object
- `$host` represents the current component instance, can be used to call component methods or access component data
- When the array changes, the list updates automatically

## Template Rendering

For more complex list item structures, you can use the named template method. Define the template in a `template` tag, then reference it in `o-fill` through the `name` attribute.

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
    .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
    .product-name { font-weight: bold; font-size: 1.1em; }
    .product-price { color: #832c22; font-weight: bold; }
    .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
  </style>
  <h3>Product List</h3>
  <button on:click="addProduct">Add Product</button>
  <div class="products-container">
    <o-fill :value="products" name="product-template"></o-fill>
  </div>
  <template name="product-template">
    <div class="product-card">
      <div class="product-name">{{$data.name}}</div>
      <div class="product-price">¥{{$data.price}}</div>
      <div class="product-desc">{{$data.description}}</div>
      <small>Serial: {{$index + 1}}</small>
    </div>
  </template>
  <script>
    export default async () => ({
      data: {
        products: [
          { name: "MacBook Pro", price: 12999, description: "High-performance laptop, suitable for professional work" },
          { name: "iPhone 15", price: 5999, description: "Latest smartphone, excellent photo quality" },
          { name: "AirPods Pro", price: 1999, description: "Wireless noise-canceling earphones, excellent sound quality" }
        ],
        productIndex: 0,
      },
      proto: {
        addProduct() {
          const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
          const productDescs = ["Lightweight portable tablet", "Smart watch, health monitoring", "Ergonomic mouse", "Professional display"];
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

## Nested List Rendering

`o-fill` supports nested usage and can handle complex hierarchical data structures, such as tree menus, category lists, etc.

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
  <h3>Product Category Navigation</h3>
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
              name: "Electronics",
              subcategories: [
                {
                  name: "Phones",
                  items: ["iPhone", "Android Phone", "Feature Phone"]
                },
                {
                  name: "Computers",
                  items: ["Laptop", "Desktop", "Tablet"]
                }
              ]
            },
            {
              name: "Home Goods",
              subcategories: [
                {
                  name: "Kitchen",
                  items: ["Cookware", "Tableware", "Small Appliances"]
                },
                {
                  name: "Bedroom",
                  items: ["Bedding", "Wardrobe", "Decorations"]
                }
              ]
            },
            {
              name: "Clothing & Accessories",
              subcategories: [
                {
                  name: "Men's Wear",
                  items: ["T-shirt", "Shirt", "Jacket"]
                },
                {
                  name: "Women's Wear",
                  items: ["Dress", "Pants", "Accessories"]
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

## Performance Optimization and Key Management

For lists that need frequent updates, you can specify unique identifiers through the `fill-key` attribute to improve rendering performance.

```html
<!-- Use custom key for performance improvement -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

In the above example, `fill-key="id"` tells ofa.js to use each data item's `id` property as a unique identifier, so even if the array order changes, corresponding elements can be correctly identified and updated.

## List Rendering Best Practices

1. **Event Handling**: When using events in list items, note that `$host` points to the current component instance, `$data` points to current item data
2. **Choose Appropriate Rendering Method**: Use direct rendering for simple lists, use template rendering for complex structures
3. **Performance Consideration**: For large lists or frequently updated lists, use `fill-key` to specify key values
4. **Data Structure**: Ensure each item in the array is a valid data object
5. **Avoid Deep Nesting**: Although nesting is supported, avoid overly deep nesting levels

## Key Points

- **o-fill Component**: Used for list rendering, receives array-type `value` property
- **Direct Rendering**: Write template content directly inside `o-fill` tag
- **Template Rendering**: Use named templates for complex list rendering
- **Special Variables**: `$index` (index), `$data` (data), `$host` (component instance)
- **Performance Optimization**: Use `fill-key` to specify unique identifiers for better performance
- **Nested Support**: Supports nested list rendering, handles hierarchical data structures
