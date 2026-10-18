# 模板语法

## 指令总表

| 语法 | 用途 | 示例 |
|------|------|------|
| `{{expr}}` | 文本插值（**仅限元素文本内容，不可用于属性值**） | `<span>{{message}}</span>` |
| `:html="expr"` | HTML 内容渲染（注意 XSS） | `<div :html="htmlContent"></div>` |
| `:prop="expr"` | 单向属性绑定 | `<input :value="name">` |
| `sync:prop="expr"` | 双向属性绑定 | `<input sync:value="name">` |
| `attr:name="expr"` | HTML attribute 绑定（title/href/alt/data-* 及布尔属性一律走这里） | `<a attr:href="url">` |
| `class:name="expr"` | 条件类绑定 | `<div class:active="isActive">` |
| `:style.prop="expr"` | 内联样式属性绑定（驼峰命名） | `<p :style.color="textColor">` |
| `on:event="handler或表达式"` | 事件绑定 | `<button on:click="handle">` / `on:click="count++"` |
| `one:event="handler"` | 一次性事件绑定（触发后自动解绑） | `<button one:click="init">` |
| `$event` | 事件对象 | `on:click="handle($event)"` |

指令的值**一律按 JavaScript 表达式解析**：字符串字面量要加引号
（`attr:data-type="'in'"`），裸保留字（`in`/`for`）直接 SyntaxError，
裸静态文案会当标识符求值而报错——静态值直接写普通属性，不要加 `attr:`
（详见 [pitfalls.md](./pitfalls.md)）。

## 文本插值

```html
<p>普通文本: {{message}}</p>
<p>计算属性: {{doubleCount}}</p>
<span>{{idx + 1}}. {{content}}</span>
```

- 支持 data 字段、计算属性、表达式运算
- `<code>` / `<pre>` 等元素内部 `{{}}` **不解析**（内容保护机制）
- 渲染 HTML 用 `:html`，内容必须可信（XSS 风险）

## 属性绑定与双向绑定

```html
<!-- 单向：数据 → 属性 -->
<input type="text" :value="inputValue" />

<!-- 双向：数据 ⇄ 属性（表单常用） -->
<input type="text" sync:value="syncValue" />
<input type="checkbox" sync:checked="completed" />

<!-- attribute 绑定（值序列化为字符串） -->
<a attr:href="url" attr:title="tip"></a>
<todo-item attr:idx="$index"></todo-item>
```

- `:prop` 数据变化更新属性，反向不影响数据
- `sync:prop` 双向同步；**只用于标量值，对象禁止**（v5 源码明确禁止对象
  双向同步——引用混乱）；也**避免 sync 绑到 attrs 声明的属性**（字符串
  序列化造成循环更新）
- `attr:` 对 `false` 直接移除属性、对 `true` 设置空值——布尔属性
  （disabled/checked/readonly/hidden）必须用它，`:prop` 会渲染出
  `"false"` 字符串导致属性永远存在

## 类与样式

```html
<p class:active="isActive" class:highlight="count > 3"></p>
<p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'"></p>
```

- `class:name="bool"` 可同时用多个；条件为真加类名，为假移除
- `:style.prop` 用驼峰（`fontSize`），值为表达式可自由拼接
- 样式表里可用 `data()` 绑定：`font-size: data(size);`（样式值与 data 联动）

数据固有属性（type/status/level）用 `attr:` + 属性选择器
（`.message[type="sent"]`），样式状态（active/disabled）才用 `class:`。

## 事件绑定

```html
<!-- proto 方法（推荐） -->
<button on:click="decrement">-1</button>

<!-- 内联表达式（简单逻辑） -->
<button on:click="count++">+1 ({{count}})</button>

<!-- 传参与事件对象 -->
<input :value="inputValue" on:input="updateInput($event)" />
<button on:click="add(5)">加 5</button>

<!-- 监听组件自定义事件 -->
<my-counter on:change="handleChange"></my-counter>
```

- 纯标识符（`decrement`）自动解析为 proto 方法并绑定 this
- 复杂表达式由编译后的函数直接执行
- 一次性事件用 `one:event`

## 条件渲染

```html
<o-if :value="count > 10">
  <p class="success">大于 10</p>
</o-if>
<o-else-if :value="count > 5">
  <p class="warning">大于 5</p>
</o-else-if>
<o-else>
  <p>小于等于 5</p>
</o-else>
```

- 三个标签**必须连续**书写，`<o-else>` 不带 value
- 频繁显隐用 `class:` 切换（保留 DOM），低频用 `o-if`（销毁/重建内容）
- v5 中 `o-if` 系与 `o-fill` 是**元素驻留**实现：元素本体留在 DOM
  （`display: contents` 不生成盒子），但 CSS 子选择器会隔着它
  （`.container > .item` 匹配不到 o-if 内部的 item）、`table.rows`
  不计其内部行；旧 `x-if`/`x-fill`/`x-else` 已移除，出现即控制台报弃用错

## 列表渲染（o-fill）

```html
<!-- 内联模板（推荐，简单结构） -->
<o-fill :value="todoList" fill-key="id">
  <todo-item
    attr:idx="$index"
    :content="$data.content"
    sync:completed="$data.completed"
    on:remove="$host.removeTodoItem($index)"
  ></todo-item>
</o-fill>

<!-- 命名模板（复用/复杂结构；template 必须在 o-fill 外部） -->
<o-fill :value="products" name="product-tpl" fill-key="id"></o-fill>
<template name="product-tpl">
  <div class="card">{{$data.name}} - ¥{{$data.price}}</div>
</template>
```

**item 作用域特殊变量**（o-fill 内部**必须**用它们，不能用 item/row 等自命名）：

| 变量 | 含义 |
|------|------|
| `$data` | 当前项数据 |
| `$index` | 当前项索引（从 0 开始） |
| `$host` | 宿主组件/页面实例（调 proto 方法：`$host.remove(id)`） |
| `$parent` | 父级渲染数据（嵌套 o-fill 时外层项） |
| `$ele` | 当前项元素 |

- `fill-key` 语法上选填，但列表项有唯一字段（如 id）时**始终添加**——
  否则增删/排序时列表项被整项重建，项内状态丢失
- 数组 push/pop/splice 等操作视图自动更新

## 计算属性（proto getter）

```javascript
proto: {
  get doubleCount() {
    return this.count * 2;
  },
  set fullName(val) {          // 可选 setter
    [this.firstName, this.lastName] = val.split(" ");
  },
}
```

- 用 `get` 而非 `computed`；模板中当普通属性用（`{{doubleCount}}`）
- **边界**：getter 在模板初始化时立即求值（早于 ready）——只适合依赖
  **同步已有初始值**的简单计算；依赖异步数据时改用 data 字段 + 异步回调赋值
  （见 [pitfalls.md](./pitfalls.md) getter 陷阱）

## 侦听器（watch）

```javascript
watch: {
  count(newVal, { watchers }) {
    if (!watchers) return; // 无 watchers = 初始化时的首次调用
    const w = watchers[0];
    console.log(`${w.name}: ${w.oldValue} -> ${w.value}`);
  },
  "rectWidth,rectHeight"() {   // 逗号字符串同时监听多个
    this.area = this.rectWidth * this.rectHeight;
  },
  user() { /* 对象/数组自动深度监听（含 push 等方法调用） */ },
}
```

- 回调参数：`newValue`、`{ watchers }`（本防抖周期内被合并的变更集合，
  `watchers[0].oldValue / .name / .value / .type / .target / .args`）
- 数据变更经防抖后回调；watch 函数在组件初始化完成时会先执行一次
  （此时 watchers 为空，用于建立监听）
- 不要在回调里无条件回写被监听数据（死循环）

## 生命周期

| 钩子 | 时机 | 典型用途 |
|------|------|---------|
| `ready()` | 模板渲染完成、DOM 已创建（可能未入文档） | DOM 操作、初始化第三方库 |
| `attached()` | 挂载到 DOM | 启动定时器、加监听、测量尺寸 |
| `loaded()` | 自身与子组件/异步资源全部加载完成 | 依赖完整组件树的操作、撤 loading |
| `detached()` | 从 DOM 移除 | 清理定时器/监听器/状态引用 |

执行顺序：`ready → attached → loaded`；移除时 `detached`。
`detached` 里必须清理资源（定时器、共享状态引用置空）。
