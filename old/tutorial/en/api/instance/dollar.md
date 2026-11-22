# $

The `$` method is the core function in ofa.js, used to obtain and manipulate DOM element instances. The main features of `$` are detailed below:

## Getting Element Instances

By using the `$` method, you can obtain the first element instance on the page that matches the [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Selector_list) and perform operations on it. Here is an example:

<o-playground name="$ - Get Element">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

In the example above, we used the `$` symbol to select the element instance with `id` "target1" and modified its text content by setting the `text` property.

## Example of Finding Child Elements

The instance also has a `$` method, which can be used to obtain the first matching child element instance of an element instance.

<o-playground name="$ - Find Child Elements">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

Please do not insert the obtained element instance directly elsewhere, as such an operation will affect the original element. If you need to create a copy, you can use the [clone](./clone.md) method.

<o-playground name="$ - Instance Features" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Get Child Elements in Shadow Node

You can obtain the instance via the [shadow](./shadow.md) property, and then use the `$` method to get the desired element:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Instantiating Elements Directly

You can directly initialize native elements as `$` instance objects in the following ways:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

In this way, you can easily convert existing HTML elements into `$` instances so that you can use the functionality provided by `$` to operate and process them.

## Generate Element Instance

Besides, the `$` can be used not only to get existing element instances but also to create new element instances and add them to the page.

### Generated via String

You can use the `$` function to create new element instances from strings, as shown below:

<o-playground name="$ - String Generation" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In this example， we use the `$` function to create a new element instance with specified styles and text content， and add it to the existing element instance with the `id` of "target1".

### Generate via Object

You can also use the `$` function to generate new element instances in an object-oriented way, as shown below:

<o-playground name="$ - Object Generation" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In this example, we use the `$` function to define a new element instance through an object, including the tag type, text content, and style attributes, and add it to an existing element instance with the `id` of "target1".

## Relationship between acquired examples and page/component instances

The `$` method can be used to obtain the instance of the corresponding page or component element from the global scope, and its function is the same as the `this` reference in the lifecycle methods within the page or component module.

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