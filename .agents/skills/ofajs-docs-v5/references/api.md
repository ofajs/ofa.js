# `$` 包装对象 API 参考

`$` 是 ofa.js 的核心函数（页面运行时即全局 `window.$`，与 `globalThis.ofa`
是同一个函数）。它既是选择器也是元素工厂；**通过 `$` 获取的是 ofa.js 包装
对象**（数据即元素的代理实例），原生 DOM 属性和方法一律通过 `.ele` 中转。

## 获取与实例化

```javascript
$("#target");                    // 文档内第一个匹配 → 包装对象（单例）
$("#target1").$("h3");           // 实例.$(expr)：第一个匹配的子元素实例
$("my-component").shadow.$("#x"); // .shadow 拿影子根实例，再查询其内部
$.all("li");                     // 全部匹配 → 包装实例数组（实例也有 .all）
$("#target");                    // 页面里 $ 全局取实例，等价于生命周期里的 this

const $ele = $(document.createElement("div"));  // 原生元素 → 包装实例
const $el  = $(`<div style="color:red">new</div>`); // HTML 字符串 → 元素实例
const $obj = $({ tag: "div", text: "hi" });         // 对象描述 → 元素实例
```

全局 `$("o-app")` 拿到的实例与页面生命周期里的 `this`（同一元素）全等；
组件/页面内访问所在应用用 `this.app`，不要向 window 暴露实例变量。

## 包装对象 vs 原生元素

| 场景 | ✅ 正确 | ❌ 错误 |
|------|---------|---------|
| ofa.js 自己的属性/方法（`.src` `.text` `.html` `.on` `.app`） | 直接访问 | — |
| 浏览器原生属性（`.shadowRoot` `.scrollTop` `.querySelector`） | `el.ele.shadowRoot` | `el.shadowRoot`（undefined） |
| 组件/页面的 data 字段 | `el.count`（字段是实例上的直接属性） | `el.data.count`（`.data` 是 dataset 映射，与原生一致，别用来读组件数据） |
| shadow 查询 | `this.shadow.$("#id")` | `this.shadow.querySelector("#id")` |
| 全局获取元素 | `$("#id")` | `document.querySelector` 返回原生元素，无增强方法 |
| 原生属性读写 | `$("#target").ele.scrollTop = x` | 直接在包装对象上读写 |

记忆口诀：ofa.js 加的属性直接用，浏览器原生的走 `.ele`。

## 树导航

```javascript
$("#t").prev;       $("#t").prevs;      // 前一个 / 前面全部
$("#t").next;       $("#t").nexts;      // 后一个 / 后面全部
$("#t").siblings;                        // 全部兄弟
$("#t").parent;     $("#t").parents;    // 父级 / 全部祖先
$("#t").host;                          // 宿主组件实例（不在组件内为 null）
$("#t").app;                           // 所在 o-app 实例（o-app 内任意深度可用）
$("#t").root;                          // 根节点（页面上为 document 实例）
$("#t").shadow;                        // 影子根实例
$("#t").ele;                           // 原生 Element
$("#t").tag;                           // 标签小写字符串
$("#t").index;                         // 在父级中的位置（从 0 开始）
$("#t").PATH;                          // 注册该组件的文件地址
$("#t").is("li");                      // 是否匹配表达式
```

子元素按数组操作：`$("#t")[0]` 索引访问、`.length` 子元素数量。

## 子元素增删

```javascript
$("ul").push(`<li>new</li>`);            // 末尾添加（字符串/原生元素/实例/对象均可）
$("ul").unshift(`...`);  $("ul").pop();  $("ul").shift();
$("ul").splice(1, 2, `<li>a</li>`);      // 删除/替换/插入
$("#t").before(`...`);   $("#t").after(`...`);
$("#t").remove();
$("#t").wrap(`<div></div>`);   // 包裹（必须有父节点）
$("#t").unwrap();              // 去包裹（必须有父节点且无其他兄弟）
```

## 内容与属性读写

```javascript
el.text = "new text";      const t = el.text;      // textContent
el.html = "<b>hi</b>";     const h = el.html;      // innerHTML（XSS 注意）
el.attr("test-attr");      el.attr("test-attr", "2"); // attributes 读写
el.css.color = "red";                              // 单项样式
el.css = { color: "blue", lineHeight: "5em" };     // 全量样式
el.css = { ...el.css, color: "red" };              // 展开改单项不影响其他
el.style.color = "red";                            // 与原生一致（只反映内联值）
el.classList.add("t-blue");  el.classList.remove("t-red");
el.data.one;                 el.data.red = "1";    // dataset
el.refresh();                                      // 手动刷新非响应式数据渲染
ofa.version;  $.version;                           // 框架版本号（v5 为 "5.0.0"）
```

模板侧对应写法：`:text` / `:html` / `attr:test-attr` / `:css.color` /
`:style.color`。

## 事件（on / one / emit / off）

```javascript
el.on("click", (event) => {});       // 注册
el.one("click", fn);                 // 一次性（触发后自动解绑）
el.off("click", fn);                 // 注销
el.emit("custom-event", {            // 主动派发（默认冒泡）
  data: "自定义数据",                 // 处理器经 event.data 读取
  bubbles: true,                      // 默认 true
  composed: true,                     // 默认 false；穿出 Shadow DOM 必须带
});
```

## clone

```javascript
const copy = $("#target").clone();
$("#logger").push(copy);
```

## o-app / o-page 实例成员

```javascript
const app = $("o-app");
app.src;                 // 配置模块地址
app.current;             // 当前页面实例（包装对象）
app.goto("/page2.html"); app.replace("/page2.html");
app.back();              app.forward();   // forward 需 allowForward
app.routers;             // 路由栈（父页不进栈）

const page = app.current;   // o-page 实例
page.src;                   // 页面地址（初始化后不可变）
page.goto / replace / back; // 相对页面地址解析跳转
page.pageIsReady;           // 页面就绪标记
```

页面模块的 proto/data **禁止**与这些内置成员重名（见 pitfalls.md）。

## stanz 数据特征

`$` 实例与 `$.stanz()` 创建的对象都有完整 stanz 特性：

```javascript
const tid = target.watch(() => { /* 深度监听，子对象变化也触发 */ });
target.watchTick(() => {});   // 带节流（单线程一次）
target.unwatch(tid);          // 取消监听
target._aaa = "x";            // `_` 前缀属性不走监听
const data = $.stanz({ val: 1 });   // 创建独立响应式数据
```

## extend（实例/原型扩展）

```javascript
target.extend({ say() { return "hello"; } });   // 扩展单个实例

$.fn.extend({                                    // 扩展所有实例（$ 底层）
  get good() { return "ofa.js is good"; },
});
$.fn.extend({                                    // 扩展出新模板指令（属性形）
  set red(bool) { this.css.color = bool ? "red" : ""; },
});
// <div :red="count % 3 === 0">
$.fn.extend({                                    // 方法形（需 .always = true）
  color(color, func) { this.css.color = func() ? color : ""; },
});
$.fn.color.always = true;
// <div color:red="!(count % 3)">
```

## formData（可选插件）

v5 中 formData 是统一插件目录（`packages/plugins/`）里的可选插件，
**引用才生效**——不进默认构建、不进任何 dist，当前仅 monorepo 源码场景可用：

```javascript
// monorepo 内按使用文件深度相对导入
import { formData } from "../../../plugins/formdata/formdata.mjs";

const data = formData(this.shadow);           // 收集容器内全部表单项（传 $ 实例）
const data2 = formData($("#myForm"), ".use-it"); // 只收集带 .use-it 的表单项

data.username;        // 读
data.username = "Yao"; // 写 → 相关表单元素自动更新（双向）
data.revoke();        // 不再需要时释放绑定
```

**为什么别处用不了**：插件会 import 框架内部模块——
- 从 CDN 独立引入会拉起**第二份 stanz 实例**（与页面框架分裂），所以不进
  dist、也没有 CDN 形态；
- npm 场景待 v5 发布工程统一解决（`xhear` 的 exports 目前只开放 `"."`）。

自定义表单组件接入：暴露 `value` 属性并设置 `name` attribute。
checkbox 聚合成数组、select 多选、radio/file 均有处理。插件目录约定见
`packages/plugins/CONTEXT.md`（每插件一个子目录）。
