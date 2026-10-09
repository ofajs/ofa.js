# ofa.js API Reference

This document summarizes all APIs of ofa.js, including instance methods, node operations, property operations, event handling, and more.

---

## $(selector)

The `$` method is the core function in ofa.js, used to get and manipulate DOM element instances.

### Getting Element Instances

Through the `$` method, you can get the first element instance on the page that matches the CSS selector.

```javascript
$("#target1").text = 'change target 1';
```

### Finding Child Element Instances

Instances also have a `$` method, you can get the first child element instance that matches the condition through the `$` method on the instance.

```javascript
const tar = $("#target1");
tar.$('h3').text = 'change target title';
```

### Getting Child Elements Inside Shadow Nodes

You can get the instance through the `shadow` property, and then get the desired element through the `$` method:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

### Directly Instantiating Elements

You can directly initialize native elements as `$` instance objects in the following ways:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

### Generating Element Instances

#### Generate via String

```javascript
const newEl = $(`<div style="color:red">add target 1 text</div>`);
$('#target1').push(newEl);
```

#### Generate via Object

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

### Relationship Between Obtained Instances and Page/Component Instances

The `$` method can be used to get instances of corresponding page or component elements from the global scope, and its functionality is the same as the `this` reference in the lifecycle methods within page or component modules.

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS Component Example
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
          title: "OFAJS Component Example",
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

Using the `all` method, you can get all elements on the page that match the CSS selector, and return an array containing these element instances.

### Global Retrieval

```javascript
$.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});
```

### Getting Child Elements

```javascript
const tar = $("#target1");
tar.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});
```

---

## shadow

Using the `shadow` property, you can get the element's shadow root node instance.

```javascript
this.shadow.$("#target").text = 'change target';
```

### Getting Element Instances Inside Component Shadow Elements from Outside

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

---

## prev

Using the `prev` property, you can get the previous adjacent element instance of the element.

```javascript
$('#target').prev.text = "change target prev element";
```

---

## prevs

Using the `prevs` property, you can easily get all adjacent element instances before the current element, which will be returned as an array.

```javascript
$('#target').prevs.forEach(e => e.text = 'change text');
```

---

## next

Using the `next` property, you can get the next adjacent element instance of the element.

```javascript
$('#target').next.text = "change target next element";
```

---

## nexts

Using the `nexts` property, you can easily get all adjacent element instances after the current element, which will be returned as an array.

```javascript
$('#target').nexts.forEach(e => e.text = 'change text');
```

---

## siblings

Using the `siblings` property, you can easily get all adjacent element instances of the current element, which will be returned as an array.

```javascript
$('#target').siblings.forEach(e => e.text = 'change text');
```

---

## parent

Using the `parent` property, you can get the parent element instance of the instance.

```javascript
$('#target').parent.css.color = 'blue';
```

---

## parents

Using the `parents` property, you can easily get all parent element instances of the current element, which will be returned as an array.

```javascript
$("#target").parents.map(e => e.tag);
```

---

## clone

Using the `clone` method, you can clone and generate a copy of the element instance.

```javascript
const tar = $('#target').clone();
$('#logger').push(tar);
```

---

## ele

Through the `ele` property, you can get the actual Element element of the instance, so you can use native properties or methods.

```javascript
var ele = $("#target").ele;
ele.innerHTML = '<b>change target</b>';
```

---

## root

Using the `root` property, you can get the root node of the element.

### Regular Elements

On the page, the root node of regular elements is the `document` instance.

```javascript
$("#target").root.ele === document;
```

### Elements Inside Shadow Nodes

Since elements inside components are isolated from the external environment, the `root` property of elements inside shadow nodes is the shadow root node.

```javascript
this.shadow.$("#target").root === this.shadow;
```

---

## Child Elements (children)

Getting child element instances is very simple, you just need to treat the instance as an array and get its child element instances through numeric indices.

### Access via Index

```javascript
$('ul')[1].text;
```

### length

Get the number of child elements of the target element:

```javascript
$('ul').length;
```

---

## host

Using the `host` property, you can get the host component instance of the element. This is very useful for accessing the host component's data and methods inside a component.

```javascript
this.host.sayHi();
```

If the element is not inside a component or page module, the value of `host` will be `null`.

---

## app

For elements inside `o-app`, including elements inside `o-page` within `o-app`, or inner child components, their `app` property all points to the element instance of this `o-app`.

```javascript
this.app.getSomeData();
```

---

## Adding or Removing Child Elements

Element instances have array-like characteristics, adding or removing nodes only requires using those array operation methods.

### push

Add child elements from the end.

```javascript
$("ul").push(`<li style="color:red;">new li</li>`);
```

### unshift

Add child elements at the beginning of the array.

```javascript
$("ul").unshift(`<li style="color:blue;">new li</li>`);
```

### pop

Remove child elements from the end.

```javascript
$("ul").pop();
```

### shift

Remove child elements at the beginning of the array.

```javascript
$("ul").shift();
```

### splice

Can delete or replace existing child elements, or add new child elements.

```javascript
$("ul").splice(1, 2, `<li>new li 1</li>`, `<li>new li 2</li>`);
```

---

## before

The `before` method is used to add elements before the target element.

```javascript
$('#target').before(`<li style="color:red;">new li</li>`);
```

---

## after

The `after` method is used to add elements after the target element.

```javascript
$('#target').after(`<li style="color:red;">new li</li>`);
```

---

## remove

The `remove` method is used to delete the target node.

```javascript
$('#target').remove();
```

---

## wrap

The `wrap` method is used to wrap a layer of elements outside the target element.

```javascript
$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
```

### Note

The target element **must have a parent node**, otherwise the wrap operation will fail.

---

## unwrap

The `unwrap` method is used to remove the outer wrapper layer element of the target element.

```javascript
$('#target').unwrap();
```

### Note

- The target element **must have a parent node**
- When the target element has other sibling elements, unwrap cannot be executed

---

## text

The `text` method is used to get or set the text content of an element.

### Direct Use

```javascript
$('#target2').text = `new text`;
console.log($("#target1").text);
```

### Template Syntax Usage

```html
<span :text="txt"></span>
```

---

## html

The `html` method is used to get or set the HTML code inside the target element.

```javascript
$('#target2').html = `<b style="color:blue;">new text</b>`;
console.log($("#target1").html);
```

### Note

`html` is a relatively dangerous method, and if `script` is inserted, the JavaScript code inside will be automatically executed. Be careful to prevent XSS when using it.

### Template Syntax Usage

```html
<span :html="txt"></span>
```

---

## attr

The `attr` method is used to get or set the attributes of an element.

### Direct Use

```javascript
// Get attribute
$("#target1").attr('test-attr');

// Set attribute
$("#target1").attr('test-attr', '2');
```

### Template Syntax Usage

```html
<div attr:test-attr="txt">I am target</div>
```

---

## css

The `css` method is used to get or set the style of the target element.

### Direct Use

```javascript
// Get style
$("#target").css.color;

// Set style
$('#target').css.color = 'red';
```

### Full Setting

```javascript
$("#target").css = {
  color: "blue",
  lineHeight: "5em"
};
```

### Template Syntax Usage

```html
<div :css.color="txt">I am target</div>
```

### Tips for Setting CSS

You can modify a style property of an element through the spread operator without affecting other style properties:

```javascript
myElement.css = { ...myElement.css, color: 'red' };
```

---

## style

The `style` property is consistent with the native one.

Please note that the `style` property cannot get the actual value of the style, but can only get the value set on the `style` attribute.

```javascript
$('#target').style.color = 'red';
```

### Template Syntax Usage

```html
<div :style.color="txt">I am target</div>
```

---

## classList

The `classList` property is consistent with the native one. You can use classList to add, remove, and toggle class names.

```javascript
$("#target").classList.remove('t-red');
$("#target").classList.add('t-blue');
```

---

## data

Get the `dataset` of the element, using the `data` property is consistent with the native dataset.

```javascript
$("#target").data.one;
$('#target').data.red = "1";
```

---

## on

Using the `on` method, you can register event handlers for target elements.

### Direct Use

```javascript
$("#target").on("click", (event) => {
  console.log(event.type);
});
```

### Template Syntax Usage

```html
<button on:click="addCount">Add Count</button>
```

### Event Parameter

After registering the event, the triggered function will be passed the event, consistent with the native one.

---

## one

Using the `one` method, you can register a one-time event handler for the target element, which means the event handler will automatically unbind after the first trigger.

### Direct Use

```javascript
$("#target").one("click", () => {
  console.log('Only triggered once');
});
```

### Template Syntax Usage

```html
<button one:click="addCount">Add Count</button>
```

---

## emit

Using the `emit` method, you can actively trigger events, and the triggered events have a bubbling mechanism.

### Basic Usage

```javascript
$("#target").emit("custom-event", {
  data: "I am data"
});
```

### Parameter Description

| Parameter | Type | Description |
|------|------|------|
| eventName | string | Event name |
| options.data | any | Custom data passed |
| options.bubbles | boolean | Whether to bubble, default true |
| options.composed | boolean | Whether to penetrate Shadow DOM, default false |

### Custom Data

```javascript
$("#target").emit("custom-event", { 
  data: "I am data"
});
```

Event handlers can get the passed data through `event.data`.

### Non-bubbling Event Triggering

```javascript
$("#target").emit("custom-event", {
  bubbles: false
});
```

### Penetrating Root Node

```javascript
this.shadow.$("#target").emit("custom-event", {
  composed: true,
  data: "I am composed event"
});
```

---

## off

Using the `off` method, you can unregister registered event handlers.

```javascript
const f = () => { console.log('clicked'); };
$("#target").on("click", f);
$("#target").off("click", f);
```

---

## o-app Component

`o-app` is one of the core components in ofa.js, used to configure and manage the entire application.

### src

Specifies the specific address of the application parameter configuration module.

```javascript
const app = $("o-app");
console.log(app.src);
```

### current

Get the currently displayed page instance.

```javascript
const currentPage = app.current;
```

### goto

Jump to the specified page.

```javascript
app.goto("/page2.html");
```

### replace

Replace the current page instead of adding a new page to the stack.

```javascript
app.replace("/new-page.html");
```

### back

Go back to the previous page.

```javascript
app.back();
```

### routers

Contains the application's routing configuration information.

```javascript
const routeConfig = app.routers;
```

---

## o-page Component

`o-page` is one of the core components in ofa.js, representing an independent page or page module.

### src Property

Specifies the specific address of the page module.

### goto Method

Jump from the current page to another page (supports relative addresses).

```javascript
page.goto("./page2.html");
```

### replace Method

Replace the current page with another page.

```javascript
page.replace("./new-page.html");
```

### back Method

Go back to the previous page.

```javascript
page.back();
```

> ⚠️ `goto` / `replace` / `back` (as well as `src` / `pageAnime` / `pageIsReady`) are **built-in members** of the o-page instance. Page modules' `proto` methods and `data` fields **must not use these names**, otherwise module registration fails (e.g. "'back' on 'proto' is already taken") and the whole page cannot render. See [SKILL.md](../SKILL.md) "proto / data Must Not Collide with Built-in Reserved Names".

---

## formData

The `formData` method is used to generate object data bound to form elements, making it easier and more efficient to handle form elements.

### Basic Usage

```javascript
const data = $("#myForm").formData();
console.log(data.username);
```

### Reverse Data Binding

When modifying object properties, the related form element values will also be automatically updated:

```javascript
data.username = "Yao";
data.sex = "man";
```

### Listening to Specific Forms

```javascript
const data = $("#myForm").formData(".use-it");
```

### Custom Form Components

Custom form components only need to add a **value property** and set a **name attribute**.

### Using Inside Components

```javascript
attached() {
  this.fdata = this.shadow.formData();
}
```

---

## tag

The `tag` property is used to get the element's tag, returning a lowercase string.

```javascript
$("#logger").tag; // "div"
```

---

## index

The `index` property is used to get the position of the element under its parent element (counting from 0).

```javascript
$("#target").index; // 1
```

---

## is

The `is` method is used to detect whether the element matches the expression.

```javascript
const target = $("#target");
target.is('li');        // true/false
target.is('[id]');      // Whether it has id attribute
target.is('[class]');   // Whether it has class attribute
```

---

## refresh

The `refresh` method is used to actively refresh the component's rendering view. Suitable for scenarios that require manual refresh of non-reactive data.

```javascript
this.refresh();
```

---

## PATH

The `PATH` property is used to get the file address of the component registered for this component.

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

---

## extend

`extend` is a higher-order method used to extend the properties or methods of instances.

### Extending a Single Instance

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

### Extending $ Base Layer

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

### Extending Template Syntax - Properties

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

Usage: `<div :red="count % 3">{{count}}</div>`

### Extending Template Syntax - Methods

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

Usage: `<div color:red="!(count % 3)">{{count}}</div>`

---

## version

Through the `ofa.version` property, you can get the version number of the currently imported ofa.js.

```javascript
ofa.version; // "4.3.40"
```

---

## Instance Data Characteristics (stanz)

Instance objects obtained or created through `$` have complete stanz data characteristics.

### watch

Listen for value changes, even if the value of a sub-object of the object is changed, the change can be detected.

```javascript
const target = $("#target");
target.watch(() => {
  console.log('Data changed');
});
```

### watchTick

Similar to the `watch` method in functionality, but with throttling internally, executing once in a single thread.

```javascript
target.watchTick(() => {
  console.log('Data changed');
});
```

### unwatch

Cancel data listening.

```javascript
const tid = target.watch(() => { /* ... */ });
target.unwatch(tid);
```

### Unwatched Values

Property names starting with underscore `_` indicate that these values will not be monitored by `watch` or `watchTick` methods.

```javascript
target._aaa = "I am aaa"; // Will not trigger listening
```

### $.stanz

Create a Stanz data not bound to instances.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```
