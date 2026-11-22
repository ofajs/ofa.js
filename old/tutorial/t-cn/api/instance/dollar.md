# $



`$` 方法是 ofa.js 中的覈心函數，用於獲取和操作 DOM 元素實例。下面將詳細介紹 `$` 的主要功能：

## 獲取元素實例



通過 `$` 方法，妳可以獲取頁面上符閤 [CSS 選擇器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) 的第一個元素實例，並對其進行操作。以下是一個示例：

<o-playground name="$ - 獲取元素">
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

在上面的示例中，我們使用 `$` 符號選擇瞭具有 `id` 爲 "target1" 的元素實例，並通過設置 `text` 屬性來脩改其文本內容。

## 査找子元素實例



實例也擁有 `$` 方法，可以通過實例上的 `$` 方法獲取元素實例的第一個符閤條件的子元素實例。

<o-playground name="$ - 査找子元素">
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

請不要將獲取的元素實例直接插入到其他地方，這樣的操作會導緻原來的元素受到影響。如菓需要創建一份副本，可以使用 [clone](./clone.md) 方法。

<o-playground name="$ - 實例特性" style="--editor-height: 360px">
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

## 獲取影子節點內的子元素



可以通過 [shadow](./shadow.md) 屬性獲取實例後，再通過 `$` 方法獲取想要的元素：

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## 直接實例化元素



妳可以通過以下方式直接將原生元素初始化爲 `$` 實例對象：

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

這樣，妳可以方便地將現有的 HTML 元素轉換爲 `$` 實例，以便使用 `$` 提供的功能進行操作和處理。

## 生成元素實例



除瞭，`$` 獲取現有的元素實例還可以用於創建新的元素實例，並將其添加到頁面中。

### 通過字符串生成



妳可以使用 `$` 函數通過字符串創建新元素實例，如下所示：

<o-playground name="$ - 字符串生成" style="--editor-height: 260px">
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

在這個示例中，我們使用 `$` 函數創建瞭一個具有指定樣式和文本內容的新元素實例，並將其添加到具有 `id` 爲 "target1" 的現有元素實例內。

### 通過對象生成



妳還可以使用 `$` 函數通過對象的方式生成新元素實例，如下所示：

<o-playground name="$ - 對象生成" style="--editor-height: 360px">
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

在這個示例中，我們使用 `$` 函數通過對象的方式定義瞭一個新元素實例，包括標籤類型、文本內容和樣式屬性，並將其添加到具有 `id` 爲 "target1" 的現有元素實例內。

## 獲取的示例和頁面/組件實例的關系



`$` 方法可用於從全侷獲取對應頁面或組件元素的實例，其功能與頁面或組件模塊內生命周期方法中的 `this` 指向相衕。

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => OFAJS 組件示例
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
          title: "OFAJS 組件示例",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```