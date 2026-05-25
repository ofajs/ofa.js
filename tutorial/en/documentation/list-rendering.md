# List Rendering

In ofa.js, the `o-fill` component provides powerful list rendering capabilities, efficiently rendering array data into multiple similar elements. It supports two main usage methods: direct rendering and template rendering.

## Introduction to o-fill Component

`o-fill` is a core component in ofa.js for list rendering, it accepts a `value` property of array type and generates corresponding DOM elements for each item in the array. During rendering, ofa.js automatically tracks changes to the array and efficiently updates the DOM.

### Main Features:

- **Efficient Updates**: Tracks array changes via keys, updating only the parts that need to change
- **Index Access**: Access the index of the current item via `$index`
- **Data Access**: Access the data of the current item via `$data`
- **Host Access**: Access the current component instance via `$host`, allowing calls to component methods or data
- **Parent Access**: In nested `o-fill`, access the data of the parent item via `$parent`
- **Template Reuse**: Supports using named templates for complex list rendering

## Direct Rendering

Direct rendering is the simplest way to use it—write the template content directly inside the `o-fill` tag. When the array changes, `o-fill` automatically creates the corresponding element for each data item.

<o-playground name="o-fill - direct rendering" style="--editor-height: 600px">
  <code>
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
  </code>
</o-playground>

In this example, we can see:- `$index` represents the index of the current item (starting from 0)
- `$data` represents the data object of the current item
- `$host` represents the current component instance, which can be used to call component methods or access component data
- When the array changes, the list updates automatically

## Template Rendering

For more complex list-item structures, you can use named templates. Define the template inside a `template` tag and reference it in `o-fill` via the `name` attribute.

<o-playground name="o-fill - Template Rendering" style="--editor-height: 600px">
  <code>
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
          <small>No.: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "High-performance laptop, suitable for professional work" },
              { name: "iPhone 15", price: 5999, description: "Latest smartphone with excellent camera performance" },
              { name: "AirPods Pro", price: 1999, description: "Wireless noise-cancelling headphones with excellent sound quality" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Lightweight and portable tablet", "Smartwatch, health monitoring", "Ergonomic mouse", "Professional-grade monitor"];
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

## Nested List Rendering

`o-fill` supports nested usage and can handle complex hierarchical data structures, such as tree menus, category lists, etc.

<o-playground name="o-fill - nested list rendering" style="--editor-height: 800px">
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
                      name: "Mobile Phones",
                      items: ["iPhone", "Android Phones", "Feature Phones"]
                    },
                    {
                      name: "Computers",
                      items: ["Laptops", "Desktops", "Tablets"]
                    }
                  ]
                },
                {
                  name: "Home & Living",
                  subcategories: [
                    {
                      name: "Kitchenware",
                      items: ["Pots & Pans", "Tableware", "Small Appliances"]
                    },
                    {
                      name: "Bedroom Supplies",
                      items: ["Bedding", "Wardrobes", "Decorations"]
                    }
                  ]
                },
                {
                  name: "Clothing & Accessories",
                  subcategories: [
                    {
                      name: "Men's Clothing",
                      items: ["T-shirts", "Shirts", "Outerwear"]
                    },
                    {
                      name: "Women's Clothing",
                      items: ["Dresses", "Pants", "Accessories"]
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

The above example demonstrates basic nested list rendering. If you need to access the data of the parent item within the nested `o-fill`, you can use `$parent`.

### Using $parent to Access Parent Data

> **Version Requirement**: The `$parent` feature requires ofa.js v4.7.0 or later.

In nested `o-fill`, you can use `$parent` to access the data of the parent item. To enable `$parent`, you need to add the `:_$parent="$data"` attribute on the nested `o-fill`.

**Important Rules:**- The first layer `o-fill` does not need `_$parent`, use `$host` to access component data
- Nested `o-fill` (starting from the second layer) uses `:_$parent="$data"` to pass parent data
- `_$parent` only accepts `$data`, ensuring clear data flow direction

### $parent Usage Example

The following example demonstrates how to use `$parent` in a nested `o-fill` to access the data of the parent item:

<o-playground name="o-fill - $parent usage example" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>Category List</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>Category: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>Product: {{$data}}</div>
              <div>Belongs to Category: {{$parent.name}}</div>
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
                  name: "Fruits",
                  items: ["Apple", "Banana", "Orange"]
                },
                {
                  name: "Vegetables",
                  items: ["Tomato", "Cucumber", "Eggplant"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In this simple example:- **First layer o-fill**: Iterate through the category array, `$data.name` is the category name
- **Nested o-fill**: Use `:_$parent="$data"` to pass the parent category data
- **$parent access**: In the nested layer, access the parent category name via `$parent.name`

## Performance Optimization and Key-Value Management

For lists that require frequent updates, you can specify a unique identifier through the `fill-key` attribute to improve rendering performance.

```html
<!-- Use custom key to improve performance -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

In the example above, `fill-key="id"` tells ofa.js to use the `id` property of each data item as the unique identifier, so that even if the order of the array changes, the corresponding elements can still be correctly identified and updated.

## List Rendering Best Practices

1. **Event Handling**: When using events in list items, note that `$host` refers to the current component instance, and `$data` refers to the current item data.
2. **Choose the Appropriate Rendering Method**: Use direct rendering for simple lists, and template rendering for complex structures.
3. **Performance Considerations**: For large or frequently updated lists, use `fill-key` to specify the key value.
4. **Data Structure**: Ensure that each item in the array is a valid data object.
5. **Avoid Deep Nesting**: Although nesting is supported, excessively deep nesting levels should be avoided.
6. **Use `$parent` Correctly**:
   - Only use `$parent` in nested `o-fill` components.
   - You must use `:_$parent="$data"` to enable `$parent`.
   - First-level `o-fill` uses `$host` to access component data; do not use `$parent`.
   - `_$parent` only accepts `$data`; do not pass other values.

## Summary of Variable Usage

In `o-fill`, different variables have different purposes and use cases:

| Variable | Purpose | Usage Scenario | Example |
|------|------|----------|------|
| `$host` | Access the data and methods of the component instance | First level `o-fill` | `{{$host.totalAmount}}` |
| `$data` | Data of the current iteration item | All levels of `o-fill` | `{{$data.name}}` |
| `$index` | Index of the current item | All levels of `o-fill` | `{{$index + 1}}` |
| `$parent` | Data of the parent item | Nested `o-fill` (starting from the second level) | `{{$parent.orderName}}` |### Data Access Layer Example

```
Component data (totalAmount, orders)
  │
  └─ Layer 1 o-fill: :value="orders"
      │  Access component data via $host: {{$host.totalAmount}}
      │  Access current order via $data: {{$data.orderName}}
      │
      └─ Layer 2 o-fill: :value="$data.items" :_$parent="$data"
          │  $parent points to the order data from Layer 1
          │  $data is each item of items
          │  Accessible: {{$parent.orderName}}, {{$data.name}}
```

By correctly using these variables, you can easily handle complex nested list rendering scenarios.