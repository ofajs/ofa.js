# 模板语法：条件、列表与结构

## 条件渲染

在 ofa.js 中，条件渲染是一种重要的功能，允许根据数据状态决定是否渲染某个元素或组件。ofa.js 提供了基于组件的条件渲染方案，通过 `o-if`、`o-else-if` 和 `o-else` 组件实现。

### o-if 组件

`o-if` 组件用于根据表达式的真假值决定是否渲染其内容。当绑定的 `value` 属性为真值时，组件内的内容会被渲染；否则内容不会出现在 DOM 中。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="isHide = !isHide">Toggle Display</button>
  <o-if :value="!isHide">
    <p>{{val}}</p>
  </o-if>
  <script>
    export default async () => {
      return {
        data: {
          isHide: false,
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

#### o-if 的工作原理

`o-if` 会在条件为真时才将内容渲染到 DOM 中，当条件为假时，o-if 内的 DOM 元素会被完全移除。这种实现方式适合在条件变化不太频繁的情况下使用，因为它涉及到 DOM 的创建和销毁。

### o-else-if 和 o-else 组件

当需要多个条件分支时，可以使用 `o-else-if` 和 `o-else` 组件配合 `o-if` 实现多分支条件渲染。

- `o-if`：必须的第一个条件组件
- `o-else-if`：可选的中间条件组件，可以有多个
- `o-else`：可选的默认条件组件，放在最后

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="num++">Toggle Display - {{num}}</button>
  <!-- 根据 num 对 3 取模的结果，切换显示不同内容 -->
  <o-if :value="num % 3 === 0">
    <p>❤️ 0 / 3</p>
  </o-if>
  <o-else-if :value="num % 3 === 1">
    <p>😊 1 / 3</p>
  </o-else-if>
  <o-else>
    <p>😭 2 / 3</p>
  </o-else>
  <script>
    export default async () => {
      return {
        data: {
          num: 0,
        },
      };
    };
  </script>
</template>
```

### 实际应用场景示例

#### 用户权限控制

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .admin-panel {
      background-color: #813b3bff;
      padding: 10px;
      margin: 10px 0;
    }
    .user-info {
      background-color: #3f6e86ff;
      padding: 10px;
      margin: 10px 0;
    }
  </style>
  <div>
    <button on:click="toggleUserRole">切换用户角色</button>
    <p>当前角色: {{role}}</p>
    <o-if :value="role === 'admin'">
      <div class="admin-panel">
        <h3>管理员面板</h3>
        <button>管理用户</button>
        <button>系统设置</button>
      </div>
    </o-if>
    <o-else-if :value="role === 'user'">
      <div class="user-info">
        <h3>用户信息</h3>
        <p>欢迎 {{userName}}!</p>
      </div>
    </o-else-if>
    <o-else>
      <p>请登录以查看内容</p>
    </o-else>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          role: 'guest',
          userName: '访客'
        },
        proto: {
          toggleUserRole() {
            if (this.role === 'guest') {
              this.role = 'user';
              this.userName = '张三';
            } else if (this.role === 'user') {
              this.role = 'admin';
            } else {
              this.role = 'guest';
              this.userName = '';
            }
          }
        }
      };
    };
  </script>
</template>
```

#### 表单验证状态显示

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    input {
      margin: 5px;
      padding: 5px;
    }
  </style>
  <div>
    <h3>邮箱验证示例</h3>
    <input type="email" :value="email" on:input="email = $event.target.value" placeholder="输入邮箱地址">
    <o-if :value="email && isValidEmail(email)">
      <p style="color:green;">✓ 邮箱格式正确</p>
    </o-if>
    <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
      <p style="color:red;">✗ 邮箱格式不正确</p>
    </o-else-if>
    <o-else>
      <p style="color:orange;">请输入邮箱地址进行验证</p>
    </o-else>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          email: ''
        },
        proto: {
          isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
          }
        }
      };
    };
  </script>
</template>
```

### o-fill 内部使用 o-if（作用域约束）

`o-if` 放在 `o-fill` 内部时，其 `:value` 表达式同样受到 o-fill 的**独立作用域**约束（详见上文「列表渲染」）：只能访问 `$data`、`$index`、`$host`，**不能直接引用页面 data 中的变量名**。

❌ **错误写法**（直接引用页面 data 变量 `canEditPrice` → 条件恒为 undefined，内容不渲染且控制台无报错，难以排查）：

```html
<o-fill :value="products">
  <o-if :value="canEditPrice">
    <button>改价</button>
  </o-if>
</o-fill>
```

✅ **正确写法**（通过 `$host` 访问页面数据 / 调用方法）：

```html
<o-fill :value="products">
  <o-if :value="$host.canEditPrice">
    <button>改价</button>
  </o-if>
</o-fill>
```

- `:value` 中访问当前列表项数据用 `$data.xxx`；访问页面级数据或调用方法用 `$host.xxx`
- 踩坑特征：页面其余部分正常渲染、唯独 `o-if` 内容一直不出现、控制台无报错——优先检查是否忘了 `$host` 前缀

### 条件渲染最佳实践

1. **使用场景**：当元素在不同条件下很少切换时，使用 `o-if` 更合适，因为这样可以完全移除不需要的元素，节省内存。

2. **性能考虑**：频繁切换的元素更适合使用类绑定（如 `class:hide`）而非条件渲染，因为条件渲染涉及 DOM 的创建和销毁。

3. **结构清晰**：条件渲染特别适合用于具有不同结构的内容切换，比如选项卡、步骤引导等。


## 列表渲染

### ⚠️ 重要提醒

在 o-fill 内部，**必须使用以下特殊变量**：

- **`$data`** - 当前项的数据对象
- **`$index`** - 当前项的索引（从 0 开始）
- **`$host`** - 当前组件实例，可调用组件方法或访问组件数据
- **`$parent`** - 父级（外层）渲染数据，嵌套 o-fill 时访问上层作用域
- **`$ele`** - 当前项对应的元素实例（v5 新增，可直接操作本项 DOM）

**不要使用其他变量名**（如 item、element、row 等），这些变量在 o-fill 内部是无效的。

#### 示例对比

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

#### 完整示例

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

#### 为什么必须使用 $data？

1. **ofa.js 的约定** - `$data` 是 ofa.js 在 o-fill 内部注入的特殊变量
2. **作用域限制** - o-fill 内部有独立的作用域，只能访问 `$data`、`$index`、`$host`
3. **响应式追踪** - 使用 `$data` 才能正确追踪数据变化并更新视图
4. **避免混淆** - 统一的变量名避免开发者自定义变量名导致的错误

---

### o-fill 组件介绍

`o-fill` 是列表渲染的核心组件：接收数组类型的 `value`，为每一项生成对应的 DOM，
并自动追踪数组变化做高效更新。支持两种写法：直接渲染与命名模板渲染。

#### 主要特性：
- **高效更新**：通过键值跟踪数组变化，仅更新需要变更的部分
- **索引访问**：通过 `$index` 访问当前项的索引
- **数据访问**：通过 `$data` 访问当前项的数据
- **宿主访问**：通过 `$host` 访问当前组件实例，可调用组件方法或访问组件数据
- **模板复用**：支持使用命名模板进行复杂列表渲染

### 直接渲染

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

### 模板渲染

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

### 嵌套列表渲染

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

### 性能优化和键值管理

`fill-key` 是**选填**属性，但只要列表项数据中存在唯一标识字段（如 `id`），**编写代码时就应该为 `<o-fill>` 添加 `fill-key`，这是推荐的标准写法，不要省略**。

```html
<!-- 推荐写法：使用唯一键 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

在上面的例子中，`fill-key="id"` 告诉 ofa.js 使用每项数据的 `id` 属性作为唯一标识符，这样数组发生增删、排序等顺序变化时，也能正确识别和复用对应的元素。省略 `fill-key` 时，列表项只能按位置匹配，增删、排序可能导致列表项重建（表单输入等项内状态丢失）。

当列表项是纯标量（字符串/数字）、没有唯一字段时，才可以省略 `fill-key`。

### 列表渲染最佳实践

1. **事件处理**：在列表项中使用事件时，注意 `$host` 指向当前组件实例，`$data` 指向当前项数据
2. **选择合适的渲染方式**：简单列表使用直接渲染，复杂结构使用模板渲染
3. **键值管理**：列表项有唯一标识字段（如 `id`）时，应添加 `fill-key`（选填属性，但编写代码时建议始终填写）
4. **数据结构**：确保数组中的每一项都是有效的数据对象
5. **避免深层嵌套**：虽然支持嵌套，但应避免过深的嵌套层级


## 非显式组件

> **v5 起只有 o- 系写法**：`x-if` / `x-else-if` / `x-else` / `x-fill` 已移除，模板中出现会在控制台报弃用错。旧文档中的 x- 示例一律按 o- 理解。

ofa.js 内置包含两种非显式组件：

* 条件渲染组件：`o-if`、`o-else-if`、`o-else`
* 填充组件：`o-fill`

这两种组件的功能分别与 `o-if` 和 `o-fill` 组件相同，但它们本身不会真实渲染到 DOM 中，而是将其内部元素直接渲染到对应的区域。

例如：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 样式不为红色，因为 o-if 组件本身存在于 DOM 中 -->
        <div class="item">1</div>
    </o-if>
    <o-if :value="true">
        <!-- 样式为红色，因为 o-if 组件不会渲染到 DOM 中 -->
        <div class="item">2</div>
    </o-if>
</div>
```

```html
<template page>
    <style>
    :host {
        display: block;
        border: 1px solid red;
        padding: 10px;
    }
    .container > .item {
        /* 选择子一级 .item 元素为红色 */
        color:red;
    }
    /* 需要选择 o-if 组件内部的 .item 元素 */
    /* .container > o-if > .item {
        color:green;
    } */
    </style>
    <div class="container">
        <o-if :value="true">
            <!-- 样式不为红色，因为 o-if 组件本身存在于 DOM 中 -->
            <div class="item">不会显示为红色</div>
        </o-if>
        <o-if :value="true">
            <!-- 样式为红色，因为 o-if 组件不会渲染到 DOM 中 -->
            <div class="item">显示为红色</div>
        </o-if>
    </div>
    <script>
    export default async () => {
        return {
        data: {},
        };
    };
    </script>
</template>
```

### o-if 条件渲染组件

`o-if` 与 `o-if` 的功能完全相同，用于根据条件表达式的真假值决定是否渲染内容。区别在于 `o-if` 本身不会作为 DOM 元素存在，其内部内容会直接渲染到父级容器中。

```html
<div class="container">
    <o-if :value="isLoggedIn">
        <p>欢迎回来，用户！</p>
    </o-if>
</div>
```

`o-if` 也可以配合 `o-else-if` 和 `o-else` 使用：

```html
<div class="container">
    <o-if :value="role === 'admin'">
        <p>管理员面板</p>
    </o-if>
    <o-else-if :value="role === 'user'">
        <p>用户中心</p>
    </o-else-if>
    <o-else>
        <p>请登录</p>
    </o-else>
</div>
```

### o-fill 填充组件

`o-fill` 与 `o-fill` 的功能完全相同，用于将数组数据渲染为多个 DOM 元素。与 `o-if` 类似，`o-fill` 本身不会渲染到 DOM 中，其内部模板会直接渲染到父级容器。

```html
<ul>
    <o-fill :value="items">
        <li>{{$data.name}}</li>
    </o-fill>
</ul>
```

使用命名模板的示例：

```html
<ul>
    <o-fill name="li" :value="items"></o-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

### 性能说明

除了功能上的区别外，非显式组件的渲染性能会比显式组件（`o-if`、`o-fill`）**差很多**。这是因为非显式组件不会真实渲染到 DOM 中，需要额外的模拟渲染逻辑来处理内部元素的定位和更新。

此外，非显式组件可能引发一些难以察觉的 bug：由于它们不会真正进入 DOM，依赖 DOM 结构的操作（如事件绑定、样式计算或第三方库查询）可能失效或表现异常。

因此，建议**优先使用显式组件**（`o-if`、`o-else-if`、`o-else`、`o-fill`），仅在特定场景下使用非显式组件。

### 使用场景

虽然非显式组件性能较差，但在以下场景中可能会用到：

1. **避免额外的 DOM 层级**：当你不想让 `o-if` 或 `o-fill` 元素成为 DOM 结构的一部分时
2. **样式继承**：当你需要让内部元素直接继承父容器的样式，而不受中间组件元素的影响时
3. **CSS 选择器限制**：当你需要使用父级直接子选择器（如 `.container > .item`）来精确控制样式，但不希望中间有额外的包装元素时

## replace-temp 组件

在 `<select>`、`<table>` 等特殊元素内部进行列表渲染时，浏览器的 HTML
解析器会把非白名单元素（包括 `<o-fill>` 这类自定义元素）"修正"到错误
的位置（foster parenting），导致列表渲染失败。`replace-temp` 就是解决
这个问题的写法——**v5 仍然必需**：`<template>` 在解析器表格白名单内，
其内容能原样通过解析，ofa.js 在**编译期自动解包**（内容原位展开、
包装元素移除），无需任何手动处理。

### 使用方法

在 `<template>` 标签上设置 `is="replace-temp"`，放在浏览器会自动修正
结构的元素内部：

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <div>
    <select>
        <template is="replace-temp">
            <o-fill :value="items">
                <option>{{$data}}</option>
            </o-fill>
        </template>
    </select>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          items: ["A", "B", "C"],
        },
      };
    };
  </script>
</template>
```

### 使用场景

1. **在 `<select>` 元素内使用列表渲染**：解析器会把 `<select>` 内的非
   `<option>` 元素修正掉，上例写法可正常渲染
2. **在 `<table>`/`<tbody>` 内使用列表渲染**：见下一节的表格行专用写法
3. **其他解析器会自动修正结构的场景**

### 表格行的专用写法（重要）

`<option>` 可以内联在 `<o-fill>` 里，但 **`<tr>` 不行**：`<tr>` 只在
`<template>` 根层级被解析器放行，包在 `<o-fill>` 内部仍会被丢弃。表格
行的正确写法是 **replace-temp + 命名模板引用**——行内容写在顶层命名
模板里（根层级放行 tr），`<o-fill>` 用 `name` 引用它：

```html
<template page>
  <table class="table">
    <thead>
      <tr><th>列名称</th><th>列说明</th></tr>
    </thead>
    <tbody>
      <template is="replace-temp">
        <o-fill :value="$data.Columns" name="tableDetail"></o-fill>
      </template>
    </tbody>
  </table>

  <!-- 行内容写在顶层命名模板里：根层级的 tr 不会被解析器丢弃 -->
  <template name="tableDetail">
    <tr class="col-row">
      <td>{{$data.DbColumnName}}</td>
      <td>{{$data.ColumnDescription}}</td>
    </tr>
  </template>
</template>
```

命名模板内的行模板支持 `$data`（行数据）、`$host`（宿主组件）、
`$index`（索引），与内联写法一致。

### 工作原理

ofa.js 编译模板时会自动完成解包（`unwrapReplaceTemps`）：

1. 解析阶段：`<template is="replace-temp">` 凭借 template 的白名单
   身份，让内部内容原样通过解析器（不被 foster parenting 修正）
2. 编译阶段：ofa.js 把 replace-temp 的内容原位展开、包装元素移除，
   后续渲染与普通写法完全一致
3. 全程纯 DOM 移动，无序列化往返

因此 replace-temp 只是**静态模板的书写技巧**——用 JS 动态创建 DOM 时
（`document.createElement` + `append`）不受解析器限制，无需此写法。
