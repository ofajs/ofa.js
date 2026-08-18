# ofa.js API 参考手册

本文档汇总了 ofa.js 的所有 API，包括实例方法、节点操作、属性操作、事件处理等。

---

## $(selector)

`$` 方法是 ofa.js 中的核心函数，用于获取和操作 DOM 元素实例。

### 获取元素实例

通过 `$` 方法，你可以获取页面上符合 CSS 选择器的第一个元素实例。

```javascript
$("#target1").text = 'change target 1';
```

### 查找子元素实例

实例也拥有 `$` 方法，可以通过实例上的 `$` 方法获取元素实例的第一个符合条件的子元素实例。

```javascript
const tar = $("#target1");
tar.$('h3').text = 'change target title';
```

### 获取影子节点内的子元素

可以通过 `shadow` 属性获取实例后，再通过 `$` 方法获取想要的元素：

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

### 直接实例化元素

你可以通过以下方式直接将原生元素初始化为 `$` 实例对象：

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

### 生成元素实例

#### 通过字符串生成

```javascript
const newEl = $(`<div style="color:red">add target 1 text</div>`);
$('#target1').push(newEl);
```

#### 通过对象生成

```javascript
const newEl = $({
  tag: "div",
  text: "add target 1 text",
  css: {
    color: "red"
  }
});
$('#target1').push(newEl);
```

### 获取的示例和页面/组件实例的关系

`$` 方法可用于从全局获取对应页面或组件元素的实例，其功能与页面或组件模块内生命周期方法中的 `this` 指向相同。

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS 组件示例
  },300);
</script>
```

```html
<!-- test-comp.html -->
<template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "OFAJS 组件示例",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
</template>
```

---

## all

使用 `all` 方法，你可以获取页面上符合 CSS 选择器的所有元素，并返回一个数组包含这些元素实例。

### 全局获取

```javascript
$.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});
```

### 获取子元素

```javascript
const tar = $("#target1");
tar.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});
```

---

## shadow

使用 `shadow` 属性，你可以获取元素的影子根节点实例。

```javascript
this.shadow.$("#target").text = 'change target';
```

### 从外部获取组件影子元素内的元素实例

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

---

## prev

使用 `prev` 属性，你可以获取元素的前一个相邻元素实例。

```javascript
$('#target').prev.text = "change target prev element";
```

---

## prevs

使用 `prevs` 属性，您可以轻松获取当前元素之前的所有相邻元素实例，这些元素将以数组的形式返回。

```javascript
$('#target').prevs.forEach(e => e.text = 'change text');
```

---

## next

使用 `next` 属性，你可以获取元素的后一个相邻元素实例。

```javascript
$('#target').next.text = "change target next element";
```

---

## nexts

使用 `nexts` 属性，您可以轻松获取当前元素后面的所有相邻元素实例，这些元素将以数组的形式返回。

```javascript
$('#target').nexts.forEach(e => e.text = 'change text');
```

---

## siblings

使用 `siblings` 属性，您可以轻松获取当前元素的所有相邻元素实例，这些元素将以数组的形式返回。

```javascript
$('#target').siblings.forEach(e => e.text = 'change text');
```

---

## parent

使用 `parent` 属性，您可以获得实例的父元素实例。

```javascript
$('#target').parent.css.color = 'blue';
```

---

## parents

使用 `parents` 属性，您可以轻松获取当前元素的所有父元素实例，这些元素将以数组的形式返回。

```javascript
$("#target").parents.map(e => e.tag);
```

---

## clone

使用 `clone` 方法可以克隆并生成一份元素实例的副本。

```javascript
const tar = $('#target').clone();
$('#logger').push(tar);
```

---

## ele

通过 `ele` 属性，你可以获取实例的实际 Element 元素，从而使用原生的属性或方法。

```javascript
var ele = $("#target").ele;
ele.innerHTML = '<b>change target</b>';
```

---

## root

使用 `root` 属性可以获取元素的根节点。

### 普通元素

在页面上，普通元素的根节点都是 `document` 实例。

```javascript
$("#target").root.ele === document;
```

### 影子节点内的元素

由于组件内元素与外部环境是隔离的，影子节点内的元素的 `root` 属性就是影子根节点。

```javascript
this.shadow.$("#target").root === this.shadow;
```

---

## 子元素 (children)

获取子元素实例非常简单，你只需要将实例当作数组，通过数字索引获取它的子元素实例。

### 通过索引访问

```javascript
$('ul')[1].text;
```

### length

获取目标元素的子元素数量：

```javascript
$('ul').length;
```

---

## host

使用 `host` 属性，可以获取元素的宿主组件实例。这对于在组件内部访问其宿主组件的数据和方法非常有用。

```javascript
this.host.sayHi();
```

如果元素不在组件或页面模块内，`host` 的值将为 `null`。

---

## app

在 `o-app` 内的元素，包括在 `o-app` 内的 `o-page` 的影子节点内的元素，或者再内部的子组件，它们的 `app` 属性都指向这个 `o-app` 的元素实例。

```javascript
this.app.getSomeData();
```

---

## 添加或删除子元素

元素实例拥有类似数组的特性，添加或删除节点只需要使用数组那几个操作方法即可。

### push

从末尾添加子元素。

```javascript
$("ul").push(`<li style="color:red;">new li</li>`);
```

### unshift

在数组的开头添加子元素。

```javascript
$("ul").unshift(`<li style="color:blue;">new li</li>`);
```

### pop

从末尾删除子元素。

```javascript
$("ul").pop();
```

### shift

在数组的开头删除子元素。

```javascript
$("ul").shift();
```

### splice

可以删除或替换现有子元素，也可以添加新子元素。

```javascript
$("ul").splice(1, 2, `<li>new li 1</li>`, `<li>new li 2</li>`);
```

---

## before

`before` 方法用于向目标元素的前面添加元素。

```javascript
$('#target').before(`<li style="color:red;">new li</li>`);
```

---

## after

`after` 方法用于向目标元素的后面添加元素。

```javascript
$('#target').after(`<li style="color:red;">new li</li>`);
```

---

## remove

`remove` 方法用于删除目标节点。

```javascript
$('#target').remove();
```

---

## wrap

`wrap` 方法用于在目标元素的外部包裹一层元素。

```javascript
$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
```

### 注意事项

目标元素**必须拥有父节点**，否则包裹操作会失败。

---

## unwrap

`unwrap` 方法用于移除目标元素的外部包裹层元素。

```javascript
$('#target').unwrap();
```

### 注意事项

- 目标元素**必须拥有父节点**
- 当目标元素拥有其他兄弟元素时，不可以执行 unwrap

---

## text

`text` 方法用于获取或设置元素的文本内容。

### 直接使用

```javascript
$('#target2').text = `new text`;
console.log($("#target1").text);
```

### 模板语法方式使用

```html
<span :text="txt"></span>
```

---

## html

`html` 方法用于获取或设置目标元素内部的 HTML 代码。

```javascript
$('#target2').html = `<b style="color:blue;">new text</b>`;
console.log($("#target1").html);
```

### 注意事项

`html` 是一个比较危险的方法，被塞入 `script` 也会自动执行内部的 JavaScript 代码，使用时注意预防 XSS。

### 模板语法方式使用

```html
<span :html="txt"></span>
```

---

## attr

`attr` 方法用于获取或设置元素的 attributes。

### 直接使用

```javascript
// 获取属性
$("#target1").attr('test-attr');

// 设置属性
$("#target1").attr('test-attr', '2');
```

### 模板语法方式使用

```html
<div attr:test-attr="txt">I am target</div>
```

---

## css

`css` 方法用于获取或设置目标元素的样式。

### 直接使用

```javascript
// 获取样式
$("#target").css.color;

// 设置样式
$('#target').css.color = 'red';
```

### 全量设置

```javascript
$("#target").css = {
  color: "blue",
  lineHeight: "5em"
};
```

### 模板语法方式使用

```html
<div :css.color="txt">I am target</div>
```

### 设置 css 的技巧

你可以通过展开运算符来修改元素的某个样式属性，而不影响其他样式属性：

```javascript
myElement.css = { ...myElement.css, color: 'red' };
```

---

## style

`style` 属性和原生保持一致。

请注意，`style` 属性无法获取样式的实际值，而只能获取在 `style` 属性上设置的值。

```javascript
$('#target').style.color = 'red';
```

### 模板语法方式使用

```html
<div :style.color="txt">I am target</div>
```

---

## classList

`classList` 属性和原生保持一致。你可以使用 classList 来添加、删除和切换类名。

```javascript
$("#target").classList.remove('t-red');
$("#target").classList.add('t-blue');
```

---

## data

获取元素的 `dataset`，使用 `data` 属性和原生 dataset 保持一致。

```javascript
$("#target").data.one;
$('#target').data.red = "1";
```

---

## on

使用 `on` 方法，你可以为目标元素注册事件处理程序。

### 直接使用

```javascript
$("#target").on("click", (event) => {
  console.log(event.type);
});
```

### 模板语法方式使用

```html
<button on:click="addCount">Add Count</button>
```

### event 参数

在注册事件后，触发的函数会被带上 event，和原生保持一致。

---

## one

使用 `one` 方法，你可以为目标元素注册一次性事件处理程序，这意味着事件处理程序将在第一次触发后自动解除绑定。

### 直接使用

```javascript
$("#target").one("click", () => {
  console.log('只触发一次');
});
```

### 模板语法方式使用

```html
<button one:click="addCount">Add Count</button>
```

---

## emit

使用 `emit` 方法，你可以主动触发事件，而且触发的事件具有冒泡机制。

### 基本用法

```javascript
$("#target").emit("custom-event", {
  data: "I am data"
});
```

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| eventName | string | 事件名称 |
| options.data | any | 传递的自定义数据 |
| options.bubbles | boolean | 是否冒泡，默认 true |
| options.composed | boolean | 是否穿透 Shadow DOM，默认 false |

### 自定义数据

```javascript
$("#target").emit("custom-event", { 
  data: "I am data"
});
```

事件处理程序可以通过 `event.data` 获取传递的数据。

### 不冒泡触发事件

```javascript
$("#target").emit("custom-event", {
  bubbles: false
});
```

### 穿透根节点

```javascript
this.shadow.$("#target").emit("custom-event", {
  composed: true,
  data: "I am composed event"
});
```

---

## off

使用 `off` 方法可以注销已注册的事件处理程序。

```javascript
const f = () => { console.log('clicked'); };
$("#target").on("click", f);
$("#target").off("click", f);
```

---

## o-app 组件

`o-app` 是 ofa.js 中的核心组件之一，用于配置和管理整个应用程序。

### src

指定应用参数配置模块的具体地址。

```javascript
const app = $("o-app");
console.log(app.src);
```

### current

获取正在展示中的页面实例。

```javascript
const currentPage = app.current;
```

### goto

跳转到指定的页面。

```javascript
app.goto("/page2.html");
```

### replace

替换当前页面而不是在堆栈中添加新页面。

```javascript
app.replace("/new-page.html");
```

### back

返回上一页。

```javascript
app.back();
```

### routers

包含应用程序的路由配置信息。

```javascript
const routeConfig = app.routers;
```

---

## o-page 组件

`o-page` 是 ofa.js 中的核心组件之一，代表着一个独立的页面或页面模块。

### src 属性

指定页面模块的具体地址。

### goto 方法

从当前页面跳转到另一个页面（支持相对地址）。

```javascript
page.goto("./page2.html");
```

### replace 方法

替换当前页面为另一个页面。

```javascript
page.replace("./new-page.html");
```

### back 方法

返回到前一个页面。

```javascript
page.back();
```

> ⚠️ `goto` / `replace` / `back`（以及 `src` / `pageAnime` / `pageIsReady`）是 o-page 实例的**内置成员**，页面模块的 `proto` 方法与 `data` 字段**禁止重名**，否则模块注册报错（如「'proto'上的'back'已被占用」），整页无法渲染。详见 [SKILL.md](../SKILL.md)「proto / data 禁止与内置保留名冲突」。

---

## formData

`formData` 方法用于生成与表单元素绑定的对象数据，使得处理表单元素更加简单和高效。

### 基本使用

```javascript
const data = $("#myForm").formData();
console.log(data.username);
```

### 反向数据绑定

修改对象的属性时，相关的表单元素值也会自动更新：

```javascript
data.username = "Yao";
data.sex = "man";
```

### 监听特定的表单

```javascript
const data = $("#myForm").formData(".use-it");
```

### 自定义表单组件

自定义表单组件只需要添加一个 **value 属性** 并设置 **name 特性**。

### 在组件内使用

```javascript
attached() {
  this.fdata = this.shadow.formData();
}
```

---

## tag

`tag` 属性用于获取元素的标签，返回一个小写字符串。

```javascript
$("#logger").tag; // "div"
```

---

## index

`index` 属性用于获取元素在其父元素下的位置（从0开始计数）。

```javascript
$("#target").index; // 1
```

---

## is

`is` 方法用于检测元素是否符合表达式。

```javascript
const target = $("#target");
target.is('li');        // true/false
target.is('[id]');      // 是否有 id 属性
target.is('[class]');   // 是否有 class 属性
```

---

## refresh

`refresh` 方法用于主动刷新组件的渲染视图。适用于需要手动刷新非响应式数据的场景。

```javascript
this.refresh();
```

---

## PATH

`PATH` 属性用于获取该组件的注册组件的文件地址。

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

---

## extend

`extend` 是一个高阶方法，用于扩展实例的属性或方法。

### 扩展单个实例

```javascript
target.extend({
  get good() {
    return "ofa.js is good";
  },
  say() {
    return 'hello';
  }
});
```

### 扩展 $ 底层

```javascript
$.fn.extend({
  get good() {
    return "ofa.js is good";
  },
  say() {
    return 'hello';
  }
});
```

### 扩展模板语法 - 属性

```javascript
$.fn.extend({
  set red(bool) {
    if (bool) {
      this.css.color = "red";
    } else {
      this.css.color = '';
    }
  }
});
```

使用：`<div :red="count % 3">{{count}}</div>`

### 扩展模板语法 - 方法

```javascript
$.fn.extend({
  color(color, func, options) {
    const bool = func();
    if (bool) {
      this.css.color = color;
    } else {
      this.css.color = '';
    }
  }
});
$.fn.color.always = true;
```

使用：`<div color:red="!(count % 3)">{{count}}</div>`

---

## version

通过 `ofa.version` 属性，你可以获取当前引入的 ofa.js 的版本号。

```javascript
ofa.version; // "4.3.40"
```

---

## 实例数据特征 (stanz)

通过 `$` 获取或创建的实例对象，拥有完整 stanz 数据特性。

### watch

监听值的变动，即使改动了对象的子对象的值，也能监听到变动。

```javascript
const target = $("#target");
target.watch(() => {
  console.log('数据变化了');
});
```

### watchTick

和 `watch` 方法功能类似，但内部有节流操作，在单个线程下执行一次。

```javascript
target.watchTick(() => {
  console.log('数据变化了');
});
```

### unwatch

取消对数据的监听。

```javascript
const tid = target.watch(() => { /* ... */ });
target.unwatch(tid);
```

### 不被监听的值

使用下划线 `_` 开头的属性名表示这些值不会被 `watch` 或 `watchTick` 方法监听。

```javascript
target._aaa = "I am aaa"; // 不会触发监听
```

### $.stanz

创建一个没有与实例绑定的 Stanz 数据。

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```
