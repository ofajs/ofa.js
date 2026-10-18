# 踩坑手册（症状 → 根因 → 正确做法）

当代码行为与预期不符时，先在本页按症状检索；这里收的是「不查就会反复踩」的长尾问题。
语法/API 的常规用法见其他 references，不在此重复。
## `{{...}}` 的适用范围（重要）

`{{expr}}` **只在元素文本内容中生效**。写进 HTML 属性值里 **不会被解析**，浏览器会把整段花括号当成字符串原样显示。

❌ **错误写法**（属性值内使用 `{{}}`）：
```html
<span title="{{$data.appId}}">{{$data.appId}}</span>
<a href="{{url}}">链接</a>
<img alt="{{name}}" src="/x.png">
<div data-id="{{id}}"></div>
```

✅ **正确写法**（属性一律用 `attr:` / `:prop` / `class:` / `:style.`）：
```html
<span attr:title="$data.appId">{{$data.appId}}</span>
<a attr:href="url">链接</a>
<img attr:alt="name" src="/x.png">
<div attr:data-id="id"></div>
```

**记忆口诀**：`{{}}` 只放尖括号 `>...<` 之间；尖括号里面的一切动态值都用 `attr:` / `:prop` / `class:` / `:style.` 系列指令。

**为什么属性值不能用 `{{}}`？**
- 浏览器会先将 HTML 解析为 DOM 树，属性值在此时已成为静态字符串
- ofa.js 的模板引擎只能处理 DOM 节点，无法二次解析属性值中的 `{{}}`
- 只有文本节点（`>...<` 之间的内容）才会被 ofa.js 正确解析和响应式更新

## 布尔属性绑定必须用 `attr:`（重要）

`disabled` / `checked` / `readonly` / `hidden` / `open` 这类 HTML 布尔属性是「**存在即生效**」的——属性值是什么无所谓，只要属性存在就算启用。给这类属性绑定布尔状态时必须用 `attr:`，不能用 `:prop`。

❌ **错误写法**（`:prop` 把 `false` 渲染成属性字符串 `"false"`，属性依然存在，按钮永远禁用）：

```html
<p-button color="primary" :disabled="analyzing">AI 识别</p-button>
<!-- analyzing === false 时渲染出 disabled="false"，照样禁用 -->
```

✅ **正确写法**（`attr:` 渲染语法判断到 `false` 会直接取消该属性的设置）：

```html
<p-button color="primary" attr:disabled="analyzing">AI 识别</p-button>
<!-- analyzing === false → 不设置 disabled 属性；analyzing === true → 属性存在，禁用 -->
```

**为什么 `:prop` 会坑？**
- `:prop` 绑定的 `false` 会被序列化成字符串 `"false"` 落到属性上
- HTML 布尔属性按「存在性」判断：`disabled="false"` 与 `disabled="true"` 都算存在、都禁用
- `attr:` 指令对 `false` 有特殊处理：直接移除属性，属性不存在即恢复可用

**适用范围**：所有「有则生效、无则失效」的原生布尔属性，以及组件内用 `attrs` 定义、shadow 模板里以 `attr:xxx="xxx"` 转发的布尔型组件属性（如 punch-ui 的 `p-button` 的 `disabled`）。

## 动态类名 vs 属性绑定

数据固有属性（如 type、status、level）应使用 `attr:` + 属性选择器，样式状态切换（如 active、disabled）才使用 `class:` + 类名选择器。

❌ **错误写法**（将数据属性作为类名）：
```html
<div class="message" :class="$data.type">
  {{$data.text}}
</div>

<style>
.message.sent { color: blue; }
.message.received { color: green; }
</style>
```

✅ **正确写法**（使用属性绑定）：
```html
<div class="message" attr:type="$data.type">
  {{$data.text}}
</div>

<style>
.message[type="sent"] { color: blue; }
.message[type="received"] { color: green; }
</style>
```

**为什么这样更好？**
- **语义清晰** - `type` 是消息类型的属性，不是样式类
- **数据驱动** - 直接绑定数据属性到 HTML 属性
- **CSS 更精准** - 属性选择器比类名选择器更符合语义
- **代码可维护** - 属性名和数据字段名一致，易于理解

## ofa.js 对象 vs 原生 DOM 元素

通过 `$()` 获取的是 **ofa.js 包装对象**，提供增强方法和响应式特性；通过 `.ele` 属性访问原生 DOM 元素。

**shadow 对象的选择器方法**：`this.shadow` 返回的是 ofa.js 实例化的对象，不是原生 ShadowRoot。

❌ **错误写法**（使用原生 API）：
```javascript
const messagesDiv = this.shadow.getElementById("messages");
const element = this.shadow.querySelector(".class");
```

✅ **正确写法**（使用 ofa.js API）：
```javascript
const messagesDiv = this.shadow.$("#messages");
const element = this.shadow.$(".class");
```

**原生 DOM 属性访问**：`element.$()` 返回 ofa.js 包装对象，原生属性需通过 `.ele` 访问。

❌ **错误写法**（直接操作 ofa.js 对象）：
```javascript
const messagesDiv = this.shadow.$("#messages");
messagesDiv.scrollTop = messagesDiv.scrollHeight;  // scrollTop 是原生属性
```

✅ **正确写法**（通过 .ele 访问原生属性）：
```javascript
const messagesDiv = this.shadow.$("#messages");
messagesDiv.ele.scrollTop = messagesDiv.ele.scrollHeight;
```

**使用场景**：
- **ofa.js 方法**：使用 ofa.js 对象的方法（如 `.on()`, `.text`, `.html` 等）
- **原生属性**：通过 `.ele` 访问原生 DOM 属性（如 `.scrollTop`, `.scrollHeight`, `.clientWidth` 等）

**Playwright 测试 / 浏览器控制台中的高频踩坑点**：`$("o-app").current` 返回的也是 ofa.js 包装对象，不是原生 DOM 元素。访问 shadow DOM 时容易写错。

❌ **错误写法**（直接在包装对象上访问原生属性）：
```javascript
// Playwright 测试或浏览器控制台中
const cur = $("o-app").current;
cur.shadowRoot                    // → undefined（shadowRoot 是原生属性）
cur.shadowRoot.querySelector(...) // → 报错 not a function
```

✅ **正确写法**（通过 `.ele` 中转访问原生属性；ofa.js 自身属性可直接访问）：
```javascript
const cur = $("o-app").current;
cur.ele.shadowRoot                          // ✅ 通过 .ele 访问原生 shadowRoot
cur.ele.shadowRoot.querySelector(".item")   // ✅ 原生查询
cur.src                                     // ✅ ofa.js 包装对象的属性可直接访问
cur.data                                    // ✅ ofa.js data 可直接访问
```

| 场景 | ❌ 错误写法 | ✅ 正确写法 |
|------|------------|------------|
| Playwright/浏览器中获取当前页面 shadow DOM | `$("o-app").current.shadowRoot` | `$("o-app").current.ele.shadowRoot` |
| 测试中查询当前页面内部元素 | `$("o-app").current.shadowRoot.querySelector(...)` | `$("o-app").current.ele.shadowRoot.querySelector(...)` |

**记忆口诀**：`$()` 返回 ofa.js 包装对象，`.current` 也是包装对象；ofa.js 自己加的属性（`.src`/`.data`/`.app`）直接用，浏览器原生的属性和方法（`.shadowRoot`/`.querySelector`/`.scrollTop`）一律走 `.ele`。

## 方法命名规范

`$` 是 ofa.js 内置特殊变量的保留前缀（`$data`、`$index`、`$host`、`$event`），自定义 `proto` 方法禁止使用 `$` 前缀。

❌ **错误写法**（方法名加 `$` 前缀）：
```javascript
export default async () => {
  return {
    tag: "my-component",
    data: { size: 1024 },
    proto: {
      $formatBytes(val) {
        return (val / 1024).toFixed(2) + " KB";
      }
    }
  };
};
```
```html
<span>{{$formatBytes(size)}}</span>
```

✅ **正确写法**（直接使用无前缀命名）：
```javascript
export default async () => {
  return {
    tag: "my-component",
    data: { size: 1024 },
    proto: {
      formatBytes(val) {
        return (val / 1024).toFixed(2) + " KB";
      }
    }
  };
};
```
```html
<span>{{formatBytes(size)}}</span>
```

**o-fill 内通过 `$host` 调用时同样不加 `$`：**
```html
<o-fill :value="files" fill-key="id">
  <span>{{$host.formatBytes($data.size)}}</span>
</o-fill>
```

## proto / data 禁止与内置保留名冲突（重要）

页面模块的 `proto` 方法与 `data` 字段**不能使用 ofa.js 已占用的内置名称**，否则模块注册直接失败（整页无法渲染）。新版控制台报错：

```
页面 http://.../xxx.html 的注册参数有误，'proto'上的'back'已被占用，请将'back'改为其他名字。
```

**已占用的内置名称（页面实例自带）**：
- 页面导航方法：`back()`（后退，等价 `this.app.back()`）、`goto()`、`replace()`
- 页面属性：`src`（页面地址）、`pageAnime`（切换动画）、`pageIsReady`
- `$.fn` 上的通用方法（`on` / `off` / `emit` / `$` / `text` / `html` / `css` / `data` 等）

`data` 里的字段与这些保留名冲突时会**直接 throw**（`page_invalid_key`）；`proto` 里的方法重名在较新版本**直接报注册错误**，旧版本虽只是 `console.warn` 但方法会被内置实现覆盖，行为同样不可靠。

❌ **错误写法**（自定义 `back` 与内置后退方法重名）：

```javascript
export default async () => ({
  data: { dialogOpen: false },
  proto: {
    back() {           // ❌ 与内置后退导航 back() 重名
      this.phase = "input";
    },
  },
});
```

✅ **正确写法**（改用不冲突的语义化命名）：

```javascript
export default async () => ({
  data: { dialogOpen: false },
  proto: {
    backToInput() {    // ✅ 语义化命名，避免与内置 back() 冲突
      this.phase = "input";
    },
  },
});
```

**排查口诀**：报错出现「'proto' 上的 'xxx' 已被占用」→ 该名字必是内置保留名。先规避 `back` / `goto` / `replace` / `src` / `pageAnime` / `pageIsReady` 及 `$.fn` 上的通用方法名（v5 内置实现见 [packages/ofajs/src/page.mjs](../../../../packages/ofajs/src/page.mjs) 的 `proto` 定义，v4 为 `packages/ofa/page.mjs`）；自定义方法尽量用业务语义命名（如 `openXxx` / `saveXxx` / `backToInput`）。

## 动态样式语法

**属性值内一律不解析 `{{...}}`**。需要动态值时：
- 普通属性 → `attr:属性名="表达式"`
- 组件属性 → `:属性名="表达式"` / `sync:属性名="表达式"`
- 类名 → `class:类名="布尔表达式"`
- 样式 → `:style.属性名="表达式"`

❌ **错误写法**（属性值内使用 `{{}}`，不会被解析）：
```html
<div attr:style="width: {{pct}}%"></div>
```

✅ **正确写法**（使用 `:style.` 绑定单个样式属性）：
```html
<div :style.width="pct + '%'"></div>
```

**为什么这样更好？**
- **语法正确** - 属性值内 `{{...}}` 不会被解析，必须使用指令绑定
- **表达式完整** - `:style.` 的值是 JavaScript 表达式，可自由拼接字符串
- **性能更优** - 只更新单个样式属性，而非整个 style 字符串

## getter 模板陷阱（重要）

页面模块中用 `get xxx() {}` 定义计算属性供模板 `{{xxx}}` 使用时，**getter 会在模块初始化阶段被立即求值**，此时 `ready()` 尚未执行。如果 getter 内部访问了 `this.data` 中尚未初始化的对象/数组字段（尤其是 null/undefined 或深层链式访问），就会抛 `TypeError` 导致整页渲染崩溃。

**典型报错**：
```
Error: Error evaluating text expression: 'roleText'
```

❌ **错误写法**（getter 依赖异步获取的数据）：
```javascript
export default async ({ query }) => {
  return {
    data: {
      userInfo: {},  // 初始为空对象
    },
    get roleText() {
      // 模板初始化时立刻求值，此时 userInfo 还是 {}
      // 若 userInfo 是 null/undefined 或做深层链式访问就会 TypeError
      return ROLE_TEXT[this.userInfo.role] || "";
    },
    ready() {
      this.loadInfo(); // 异步赋值 userInfo，但来不及
    },
    proto: {
      async loadInfo() { /* ... */ }
    }
  };
};
// 模板：{{roleText}}
```

✅ **正确写法**（用 data 字段预定义安全默认值，在异步回调中赋值）：
```javascript
export default async ({ query }) => {
  return {
    data: {
      userInfo: {},
      roleText: "",  // 预定义为安全默认值
    },
    ready() {
      this.loadInfo();
    },
    proto: {
      async loadInfo() {
        const info = await api.getInfo();
        this.userInfo = info;
        this.roleText = ROLE_TEXT[info.role] || info.role || ""; // 异步回调中赋值
      },
    },
  };
};
// 模板：{{roleText}}
```

**getter 适用边界**：
- ✅ **适合**：只依赖**同步已有数据**且有初始值的简单计算，如 `get double() { return this.count * 2 }`（count 有初始值 0）
- ❌ **不适合**：计算结果依赖**异步获取**的数据（API 返回后才填充的对象/数组），改用 data 字段在异步回调中赋值

**为什么 getter 会立即求值？**
- ofa.js 模板引擎在模块初始化阶段会扫描模板中所有 `{{xxx}}` 表达式并建立响应式依赖
- 此时 getter 被读取，触发 getter 内部对 `this.xxx` 的访问，建立依赖追踪
- 而 `ready()` 在初始化完成后才执行，异步数据此时还未到达
- 若 getter 体内访问的字段为 null/undefined，链式读取即抛错，整个模板渲染被中断

## 模板引用的变量必须先在 data/attrs 声明（重要）

模板中所有表达式（`{{xxx}}`、`:prop`、`sync:`、`class:`、`:style.`、`attr:`）在**模块初始化阶段立即求值**，引用的每个键都必须在 `data` / `attrs` 中已声明。引用未声明的变量**不会得到 `undefined`，而是直接抛错并中断整页渲染**：

```
Error: Error evaluating element expression: ':value="flag"', from file: ...
Caused by: ReferenceError: flag is not defined
```

典型场景：**给已有页面新增功能时，模板加了新绑定，忘了在 `data` 里补字段**。报错在首次渲染时出现，且该页面/组件整体渲染失败。

❌ **错误写法**（模板用了 `noBg`，`data` 没声明）：

```html
<o-if :value="noBg === 'off'">...</o-if>
<p-switch sync:value="noBg">无底色</p-switch>

<script>
  export default async () => ({
    data: { dialogOpen: false }, // ❌ 缺 noBg 声明
  });
</script>
```

✅ **正确写法**（`data` 补上声明，给安全默认值）：

```html
<script>
  export default async () => ({
    data: { dialogOpen: false, noBg: "off" }, // ✅ 模板引用的键全部声明
  });
</script>
```

**排查口诀**：`Error evaluating element/class/... expression` + `ReferenceError: xxx is not defined` → 必是模板表达式引用了 `data` / `attrs` 中不存在的键。先 grep 模板里引用 `xxx` 的绑定，再到 `data` 补声明。

**与 getter 陷阱的区别**：getter 陷阱是字段**已声明但值未到达**（抛 TypeError）；本陷阱是字段**根本没声明**（抛 ReferenceError），后者在改模板时最易犯。

## Hash 路由 URL 格式

构建外部分享链接（邀请链接、邮件链接等）或测试中直接用 URL 导航时，hash 格式容易写错。

ofa.js hash 路由格式：**`#/pages/xxx.html`**（`#` 后直接 `/`，不带 `./` 前缀）。

❌ **错误写法**（带多余的 pathname 和 `./` 前缀）：
```javascript
const link = location.origin + location.pathname + "#./pages/set-password.html?token=xxx";
// 结果：http://host/index.html#./pages/set-password.html?token=xxx  ← 错误
```

✅ **正确写法**（`#` 后直接 `/`，不带 pathname）：
```javascript
const link = location.origin + "/#/pages/set-password.html?token=xxx";
// 结果：http://host/#/pages/set-password.html?token=xxx  ← 正确
```

**记忆口诀**：`#` 后面紧跟一个 `/`，再接从 `pages` 开始的路径；外部分享链接用 `location.origin + "/#/..."` 即可。

## 复杂单页面拆分为多个 page 模块（重要）

单个页面模块堆积过多业务（主列表 + 弹窗表单 + 多个子流程）时，应把独立业务单元（尤其是弹窗表单）拆成独立页面模块，宿主用 `<o-page>` 常驻内嵌，按「**方法调用下发参数 + 事件冒泡上抛结果**」通信：

- **宿主 → 子页面**：调用子页面暴露的方法（如 `openForm(params)`）传参
- **子页面 → 宿主**：`this.emit("xxx-save", { data, bubbles: true, composed: true })`，宿主在 `<o-page>` 标签上 `on:xxx-save` 监听，从 `event.data` 取值
- `composed: true` 必须带：子页面处于 Shadow DOM 内，缺省 `false` 时事件穿不出边界，宿主监听不到

❌ **错误写法**（初始化后改 `src` 切换参数，运行时抛错）：

```html
<o-page :src="'./form.html?id=' + editingId"></o-page>
```

`o-page` 的 `src` **初始化后不可变**，源码中再次赋值会直接抛错：`A page that has already been initialized cannot be set with the src attribute`。

✅ **正确写法**：

```html
<!-- 宿主页面 -->
<template page>
  <o-page id="form-page" src="./form.html" on:form-save="onSave"></o-page>
  <script>
    export default async () => ({
      proto: {
        openForm(item) {
          // $() 拿到的是 ofa.js 包装对象，可直接调用子页面方法
          this.shadow.$("#form-page")?.openForm(item);
        },
        onSave(event) {
          console.log(event.data); // 子页面上抛的表单值
        },
      },
    });
  </script>
</template>
```

```html
<!-- 子页面 form.html：自带 p-dialog，暴露 openForm 供宿主打开 -->
<template page>
  <p-dialog sync:open="dialogOpen" auto-close><!-- 表单控件 sync:value="form.xxx" --></p-dialog>
  <script>
    export default async () => ({
      data: { dialogOpen: false, form: {} },
      proto: {
        openForm(params) {
          Object.assign(this.form, params); // 回填参数
          this.dialogOpen = true;
        },
        save() {
          if (!this.form.name.trim()) return; // 子页面只管非空校验
          this.emit("form-save", {
            data: { ...this.form },
            bubbles: true,
            composed: true, // 穿透 Shadow DOM，宿主才能监听
          });
          this.dialogOpen = false;
        },
      },
    });
  </script>
</template>
```

**分工建议**：子页面只负责表单完整性与 UI 状态；业务归一化、id 生成、持久化由宿主处理。取消/遮罩关闭只改子页面自身 `dialogOpen`，不通知宿主。

**需要每次全新实例时**：子页面允许状态丢失的话，用 `o-if` 包裹 `<o-page>`，关闭即销毁、再开重建（`o-if` 切换会清空并重新渲染子节点），重开后需重新调用方法传参。

**拆分时机**：
- 弹窗内含独立表单 / 多步流程 → 拆
- 页面 `data` 混入大量与主内容无关的临时状态（`form` / `dialogOpen` / `editingId` …）→ 拆
- 纯展示、无独立业务状态的小片段 → 用组件模块，不要拆 page

## 模板指令的值是 JS 表达式，裸字面量（尤其保留字）报错（重要）

`attr:` / `:prop` / `sync:` / `class:` / `:style.` / `on:` 的**值一律按 JavaScript 表达式解析**，不能写裸标识符或裸字符串字面量。字符串必须加引号；JS 保留字（`in` / `class` / `for` 等）单独作表达式本身就非法，会直接报 SyntaxError。

**典型报错**（控制台持续报错，页面部分功能失效）：
```
SyntaxError: Unexpected token 'in'
```

❌ **错误写法**（把 `attr:data-type="in"` 当普通属性值写裸字面量，`in` 是 JS 保留字被当作表达式解析）：
```html
<button attr:data-type="in">入库</button>
<!-- ofa.js 将值 "in" 当作表达式 → SyntaxError: Unexpected token 'in' -->
```

✅ **正确写法**（方法名 / 表达式内字符串字面量）：
```html
<button on:click="$host.stockIn($event)">入库</button>
<!-- 事件绑到方法名，避免在指令值里写裸字面量 -->

<button attr:data-type="'in'">入库</button>
<!-- 确需传字面量时加引号，作为字符串表达式 -->
```

**排查口诀**：`SyntaxError: Unexpected token '<xxx>'`（`in`/`for`/`if` 等词）→ 必是指令属性值里写了裸标识符。优先把需要"标识类型"的场景改成方法名分发（如 `on:click="$host.stockIn($event)"`），把字符串字面量放进 `attr:` 值时要加引号（`attr:data-type="'in'"`）。

**补充：静态值不要用 `attr:`；裸静态文案会抛错（单个词/中文是 ReferenceError，多个词是 SyntaxError）且会中断组件 render**——上面那条只覆盖「保留字」这类**语法**错误。更常见、更阴的是**把静态文案直接塞进 `attr:`**（中文尤其容易中招）：它不是保留字，于是被当成**标识符**去求值——**单个词或中文短语（是一整个合法标识符）报 ReferenceError，含空格的多段英文则先报 SyntaxError: Unexpected identifier**：

```html
❌ <button attr:title="abc">                        <!-- 单个裸标识符 → ReferenceError: abc is not defined -->
❌ <button attr:title="点这里选择要看的订单状态">      <!-- 中文短语通常是一整个合法标识符 → ReferenceError（现实中最常见的踩法） -->
❌ <button attr:title="Choose a status">            <!-- 多段裸词 → SyntaxError: Unexpected identifier -->
✅ <button title="点这里选择要看的订单状态">          <!-- 静态值 → 写普通属性（ofa 不处理无指令前缀的属性） -->
✅ <button attr:title="'点这里选择要看的订单状态'">    <!-- 非要用 attr: 就包成字符串表达式 -->
✅ <button attr:title="locked ? '已锁定' : ''">      <!-- attr: 留给真正的动态表达式 -->
```

⚠️ **真正的坑是它的连锁症状**：这个异常会**中断整个组件/页面的 render**，而模板 HTML 已经先写进 shadowRoot 了——于是表象变成「组件看起来正常（DOM 都在）、但 `ready()` 不执行、后面的 `o-fill` / `o-if` 一律不展开、数据恒为空」，**极易误诊为「属性绑定不生效 / 接口没返回 / 组件没升级」**（实测踩坑：筛选组件里把 `attr:title="点这里选择…"` 写错后，弹窗里只剩静态那一项；改回 `title="点这里选择…"` 后 `ready()` 立刻执行、列表全部渲染出来）。

**排查口诀**：`attr:xxx="静态文案"` → `ReferenceError: xxx is not defined`；**症状是「模板在、但 `ready()` 没跑、`o-fill` 不展开」时，先全仓 grep `attr:` 的值里有没有既不是表达式、又不是 `data`/`$data` 字段名的裸文案**（含中文字符是最明显的信号）。确认 `ready()` 是否真的执行，可在 `ready()` 里往 `window` 挂个标记再读（项目里若有 log-show 之类拦截 console 的组件，`console.log` 是看不到的）。

## 页面模块缓存导致改代码不生效（调试/测试时最容易误判）

ofa.js 对已加载的页面模块有**内存级模块缓存**（同 URL 复用组件/页面模块定义），且页面通过 `fetch` 拉取模板文件——若静态服务器带 HTTP 缓存（如 `http-server` 不带 `-c-1`），浏览器还会命中磁盘缓存。两个缓存叠加的表现：**改了页面文件，但 hash 导航（不整页刷新）仍渲染旧版本**，console 无任何报错，极易误判为"代码没改对"而浪费时间排查。

**典型场景**：Playwright 测试或浏览器里用 `#/pages/xxx.html` 直接导航调试，反复修改页面模板后效果不变；甚至把文件改坏成明显错误的版本，页面仍正常渲染旧逻辑。

✅ **正确做法**：
- 开发服务器**必须禁用 HTTP 缓存**：`http-server . -p 5173 -c-1`（`-c-1` = 禁用缓存；`npm run dev` 已内置，`npm start` 不带）。
- 测试/调试需要强制重新加载时，**用带 query 的完整 URL 整页刷新**：`http://localhost:5173/index.html?t=v1#/pages/xxx.html`——query 变了 fetch 视为新 URL，绕过缓存。
- Playwright 中不要靠"导航 hash 后再等模块更新"，直接 `page.goto(url)` 整页加载。

**排查口诀**：改代码不生效 + console 无报错 → 先怀疑缓存（模块缓存 / HTTP 缓存），用带 query 的 URL 强刷排除；不要先用二分法怀疑自己的代码。

---

## `$host` / `$data` 只在 o-fill 的 item 作用域可用，根级元素直接用方法名（重要）

`$host` / `$data` 由 ofa.js 在 **o-fill 渲染列表项时**注入到 item 作用域（`createItem` 创建 `{ $data, $host, $index }`）。**根级（页面模板顶层、非 o-fill 内）作用域没有 `$host` / `$data`**，`on:click="$host.xxx()"` 会抛 `Error evaluating element expression: 'on:click="$host.xxx()"'`，点击无反应且 console 报错。

✅ **正确写法**：
```html
<!-- 根级：直接写方法名（proto 方法挂在页面实例上） -->
<button on:click="openStockHelp()">?</button>
<button on:click="goToPage(currentPage - 1)">上一页</button>
```
```html
<!-- o-fill 内：才有 $data / $host / $index -->
<o-fill :value="rows" fill-key="id">
  <button on:click="$host.deleteRow($data.id)">{{$data.name}}</button>
</o-fill>
```

❌ **错误写法（根级用 `$host`）**：
```html
<button on:click="$host.openStockHelp()">?</button>  <!-- 报错 -->
```

**排查口诀**：`on:click` 等事件表达式报 `Error evaluating element expression` → 先看元素是否在 o-fill 内；不在 o-fill 内就去掉 `$host.` 直接写方法名（o-fill 内的数字页码按钮等才保留 `$host`）。属性绑定（`:disabled="page <= 1"`）根级直接用 data 字段名，无需 `$host`。

**补充（属性绑定通道同样命中）：顶层（非 o-fill 内）的 `o-if :value` 与 `attr:` 属性绑定引用 `$host.xxx` 会静默失效**——不报错、不求值异常，而是内容/属性**永不渲染**（o-if 恒不显示、attr 不设置）。例如：
```html
<!-- ❌ 顶层 o-if 内容永不渲染（条件为真也不显示） -->
<o-if :value="!$host.warehouseId">请先选择仓库</o-if>
<!-- ❌ 顶层 attr: 永不设置（输入框始终可用） -->
<input attr:disabled="!$host.canInput" />
```
✅ **正确写法**：属性绑定里直接用 data 字段名（`o-if :value="warehouseId === ''"` / `attr:disabled="!warehouseId || !selectedChannel"`）；`attr:` 也**不要绑定 proto getter**（`!$host.canInput` 不渲染），把条件展开成响应式 data 字段的表达式。**排查口诀**：顶层 o-if 内容不出现 / attr 属性不生效、console 无报错 → 检查绑定表达式是否引用了 `$host`（顶层没有 `$host`，只有 o-fill 的 item 作用域才注入）。

## o-fill 文本插值表达式不要写 `&&`（整块不渲染，重要）

**症状**：给 o-fill 内某条文本插值加 `&&` 表达式（如 `{{ $data.x && $data.x !== '裸果' ? ' · 内包装 ' + $data.x : '' }}`）后，**整个 o-fill 区块不渲染**（列表项全消失），页面其它区域（标题/工具条/分页）正常，无整页报错，仅 console 有一条 `SyntaxError: Unexpected token '&'`（`new Function` 编译时抛错）。

**最小复现对照**（`{{}}` 文本插值通道）：
- `{{ $data.pack && $data.pack ? ... : '' }}`（含 `&&`）→ ❌ **整块 o-fill 不渲染**
- `{{ $data.pack ? '·内 ' + $data.pack : '' }}`（三元 + 拼接）→ ✅
- `{{ $data.pack === '裸果' ? '' : ... }}`（`===`）→ ✅
- `{{ $data.pack !== '裸果' ? ... }}`（`!==`）→ ✅
- `{{$host.xxx($data)}}`（方法调用）→ ✅

**根因**：o-fill 的 item 模板把 `{{}}` 表达式经 `encodeURIComponent` 编码写入 `expr` 属性再取回编译，`&&` 在此链路中损坏（残留单个 `&`），`new Function` 编译失败；且失败发生在该 o-fill 的渲染循环中，导致整个区块中断。`!==`、`===`、三元、字符串拼接均不受影响。

**修复**：文本插值里避免 `&&`，抽成 `$host` 方法（方法内 JS 不受模板编译限制）：
```js
// proto 中
innerPackingText(d) {
  const ip = d && d.inner_packing;
  if (!ip || ip === "裸果") return "";
  return " · 内包装 " + ip;
}
```
```html
<!-- 模板中 -->
<div>{{$host.innerPackingText($data)}}</div>
```

**排查口诀**：o-fill 整块不渲染 + console 有 `SyntaxError: Unexpected token '&'` → 在该 o-fill 内 grep `&&` 的 `{{` 表达式，全部改方法调用。（`&&` 在属性绑定通道是否安全未验证，遇到同场景优先方法化，不赌。）

---

## 历史：v4.7.x 曾存在「import 被注释破坏」的编译缺陷（已修复）

> 定性：ofa.js 模块编译实现缺陷（`drawUrl` 按 `;` 切分 `<script>` 后重写 import），已在新版修复。import 之间放注释（`//`、`/* */`、行尾注释）是标准 ESM 合法写法，现在可正常使用，无需规避。若在旧版本（≈v4.7.2 及之前）遇到 `Failed to resolve module specifier "../.."` 且报错随 import「顺移」，升级框架即可；临时规避是把注释挪到 import 块之后。

