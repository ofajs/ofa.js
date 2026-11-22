# 报错对照与排查口诀

本文档收拢 ofa.js 开发中的高频报错、隐蔽陷阱与排查方法。遇到「页面不渲染 /
部分渲染 / 改代码不生效」时，先来这里按报错文案对号入座。

## 一、ReferenceError：模板引用了未声明的键（改模板时最易犯）

模板中所有表达式（`{{}}`、`:prop`、`sync:`、`class:`、`:style.`、`attr:`）
在**模块初始化阶段立即求值**，引用的每个键必须在 `data` / `attrs` 中已声明。
未声明的键**不是 undefined，而是直接抛错中断整页渲染**：

```
Error: Error evaluating element expression: ':value="flag"', from file: ...
Caused by: ReferenceError: flag is not defined
```

❌ 模板用了 `noBg`，data 没声明：

```html
<o-if :value="noBg === 'off'">...</o-if>
<script>
  export default async () => ({ data: { dialogOpen: false } }); // ❌ 缺 noBg
</script>
```

✅ `data` 补声明并给安全默认值：`data: { dialogOpen: false, noBg: "off" }`。

**排查口诀**：`Error evaluating ... expression` + `ReferenceError: xxx is not
defined` → grep 模板里引用 `xxx` 的绑定，到 `data`/`attrs` 补声明。常见于给
已有页面新增绑定、忘了同步 data。

## 二、TypeError：getter 依赖了还没到达的数据

`get xxx() {}` 计算属性在**模板初始化阶段被立即求值**（早于 ready）。若
getter 内部访问了尚未填充的对象/数组字段（尤其 null/undefined 链式访问），
抛 TypeError 导致整页渲染崩溃：

```
Error: Error evaluating text expression: 'roleText'
```

❌ getter 依赖异步数据：

```javascript
export default async ({ query }) => ({
  data: { userInfo: {} },
  get roleText() {
    return ROLE_TEXT[this.userInfo.role] || ""; // userInfo 还是 {}，链式访问危险
  },
  ready() { this.loadInfo(); },   // 异步填充来不及
});
```

✅ 改 data 字段 + 异步回调赋值：

```javascript
export default async () => ({
  data: { userInfo: {}, roleText: "" },   // 预定义安全默认值
  ready() { this.loadInfo(); },
  proto: {
    async loadInfo() {
      const info = await api.getInfo();
      this.userInfo = info;
      this.roleText = ROLE_TEXT[info.role] || "";
    },
  },
});
```

**边界**：getter 只适合依赖同步已有初始值的简单计算（`get double() { return
this.count * 2 }`）。**与一类错误的区别**：getter 陷阱是字段已声明但值未到
（TypeError）；一类错误是字段根本没声明（ReferenceError）。

## 三、SyntaxError：指令值里写了裸字面量

`attr:` / `:prop` / `sync:` / `class:` / `:style.` / `on:` 的值**一律按
JavaScript 表达式解析**：

```html
❌ <button attr:data-type="in">         <!-- in 是 JS 保留字 → SyntaxError -->
❌ <button attr:title="点这里选择">      <!-- 中文短语是一整个合法标识符 → ReferenceError（最常见的踩法） -->
❌ <button attr:title="Choose one">     <!-- 多段裸词 → SyntaxError: Unexpected identifier -->
✅ <button title="点这里选择">           <!-- 静态值写普通属性，ofa 不处理无指令前缀的属性 -->
✅ <button attr:title="'点这里选择'">    <!-- 非要用 attr: 就包成字符串表达式 -->
✅ <button attr:title="locked ? '已锁定' : ''">
```

**连锁症状（极易误诊）**：这类异常会**中断整个组件/页面的 render**，而模板
HTML 已先写入 shadowRoot——表象变成「组件 DOM 都在、但 ready() 不执行、
o-fill/o-if 不展开、数据恒为空」，容易被误判为"属性绑定不生效 / 接口没返回"。

**排查口诀**：症状是「模板在、ready() 没跑」时，全仓 grep `attr:` 的值里
有没有既非表达式又非 data 字段名的裸文案（含中文是最明显的信号）。确认
ready 是否执行，可在 ready 里往 window 挂标记再读。

## 四、proto / data 与内置保留名冲突（整页注册失败）

页面实例自带一批内置成员，页面模块的 `proto` 方法与 `data` 字段**禁止重名**：

- 导航方法：`back()`（等价 `this.app.back()`）、`goto()`、`replace()`
- 页面属性：`src`、`pageAnime`、`pageIsReady`
- `$.fn` 上的通用方法：`on` / `off` / `one` / `emit` / `$` / `text` /
  `html` / `css` / `data` 等

`data` 字段冲突直接 throw（`page_invalid_key`）；proto 方法重名报注册错误：

```
页面 http://.../xxx.html 的注册参数有误，'proto'上的'back'已被占用，请将'back'改为其他名字。
```

✅ 用业务语义命名（`backToInput` / `openXxx` / `saveXxx`）。自定义 proto
方法也不要加 `$` 前缀（`$data`/`$index`/`$host`/`$event` 是模板保留变量）。

## 五、`$host` / `$data` 只存在于 o-fill 的 item 作用域

`$host` / `$data` / `$index` 由 o-fill 渲染列表项时注入；**根级（非 o-fill
内）没有它们**：

```html
❌ <button on:click="$host.openHelp()">?</button>   <!-- 根级：报 Error evaluating element expression -->
✅ <button on:click="openHelp()">?</button>          <!-- 根级直接写方法名 -->

❌ <o-if :value="!$host.warehouseId">...</o-if>      <!-- 顶层 o-if 引 $host：静默失效，内容永不渲染 -->
✅ <o-if :value="warehouseId === ''">...</o-if>       <!-- 直接用 data 字段 -->
```

**隐蔽变体**：顶层 `attr:` 绑定引用 `$host.xxx` **不报错但永不设置**。
**排查口诀**：顶层 o-if 不出现 / attr 不生效、console 无报错 → 检查表达式
是否引用了 `$host`；attr 也不要绑 proto getter，把条件展开成 data 字段表达式。

## 六、布尔属性必须用 `attr:`

`disabled` / `checked` / `readonly` / `hidden` 这类「存在即生效」的属性，
用 `:prop` 绑 false 会渲染出 `disabled="false"`（属性存在照样禁用）；`attr:`
对 false 直接移除属性：

```html
❌ <button :disabled="analyzing">AI 识别</button>      <!-- false 时仍禁用 -->
✅ <button attr:disabled="analyzing">AI 识别</button>  <!-- false → 无 disabled 属性 -->
```

组件内用 attrs 声明、shadow 模板里 `attr:xxx="xxx"` 转发的布尔型组件属性
同理。

## 七、`{{}}` 只在元素文本内容生效

`{{expr}}` 写进属性值不会被解析（浏览器解析 HTML 时属性值已是静态字符串）：

```html
❌ <a href="{{url}}">链接</a>  <span title="{{$data.appId}}"></span>
✅ <a attr:href="url">链接</a>  <span attr:title="$data.appId"></span>
```

口诀：`{{}}` 只放 `>...<` 之间；尖括号内的动态值用 `attr:` / `:prop` /
`class:` / `:style.`。`<code>` 内部的 `{{}}` 同样不解析（内容保护仅覆盖
code；`<pre>` 无保护、照常渲染）。

## 八、动态类名 vs 属性绑定

数据固有属性（type/status/level）用 `attr:` + 属性选择器；样式状态
（active/disabled）用 `class:`：

```html
✅ <div class="message" attr:type="$data.type">  +  .message[type="sent"] { color: blue; }
❌ <div class="message sent" :class="...">       <!-- 类名表达数据类型，语义与选择器都变差 -->
```

## 九、o-page 的 src 初始化后不可变

```html
❌ <o-page :src="'./form.html?id=' + editingId"></o-page>   <!-- 运行时抛错 -->
```

报错：`A page that has already been initialized cannot be set with the src
attribute`。正确姿势是常驻 `<o-page>` + 宿主调用子页面方法传参 +
emit(bubbles+composed) 上抛结果（完整模式见
[app-routing.md](./app-routing.md) 单页拆分一节）；确需销毁重建时外层包
`<o-if>`。

## 十、Hash 路由 URL 格式

hash 格式是 `#/pages/xxx.html`（`#` 后直接 `/`，不带 `./`，不带 pathname）：

```javascript
❌ location.origin + location.pathname + "#./pages/set.html?token=x"
✅ location.origin + "/#/pages/set.html?token=x"
```

## 十一、改代码不生效 → 先怀疑缓存

ofa.js 对已加载的页面模块有**内存级模块缓存**（同 URL 复用模块定义），页面
模板又经 fetch 拉取——若静态服务器带 HTTP 缓存，两层缓存叠加的表现是：
**改了页面文件，hash 导航仍渲染旧版本，console 无任何报错**。

- 开发服务器禁用 HTTP 缓存（如 `http-server -c-1`）
- 调试强刷用带 query 的完整 URL 整页刷新（query 变了 fetch 视为新 URL）
- Playwright 中直接 `page.goto(url)` 整页加载，不要依赖 hash 导航触发热更新

排查口诀：改代码不生效 + 无报错 → 先排除缓存，再怀疑自己的代码。

## 十二、包装对象与 .ele 边界（测试/控制台高频）

`$()` 与 `$("o-app").current` 返回的都是 ofa.js 包装对象；ofa.js 自身属性
（`.src` / `.data` / `.app`）直接访问，浏览器原生属性一律走 `.ele`：

```javascript
❌ $("o-app").current.shadowRoot                    // undefined
✅ $("o-app").current.ele.shadowRoot.querySelector(".item")
✅ $("o-app").current.src                           // 包装对象属性直接用
```

页面内元素则用 `this.app` / `this.shadow.$()`，不要向 window 暴露实例变量。

## 历史坑（v4 时代，v5 已免疫/修复，仅作背景）

- **o-fill 文本插值里的 `&&`**：v4 编码链路会损坏 `&&` 导致整块列表不渲染；
  v5 渲染管线重写后 `&&` 在 `{{}}` 与指令表达式中均可正常使用
- **import 之间的注释破坏编译**（v4.7.2 及之前的 drawUrl 按 `;` 切分实现
  缺陷）：新版已修复，import 块内注释可正常使用
