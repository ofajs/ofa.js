# css



`css` 方法用於獲取或設置目標元素的樣式。

## 直接使用



妳可以直接使用 `css` 方法來獲取或設置元素的樣式。

<o-playground name="css - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## 全量設置



通過獲取的 `css` 對象，妳可以直接設置在元素上的 style 值。

<o-playground name="css - 全量設置" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

使用 `css` 對象的特性，妳可以快速地調整目標元素的樣式。

## 模闆語法方式使用



妳還可以通過模闆語法來設置目標元素的樣式。

<o-playground name="css - 模闆語法" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## 設置 css 的技巧



妳可以通過 `$ele.css = {...$ele.css, color:'red'}` 的方式來脩改元素的某個樣式屬性，而不影響其他樣式屬性。這種方式可以在不重寫整個樣式的情況下，隻脩改其中一個屬性。

### 示例



```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

在上面的示例中，通過使用 `{ ...myElement.css, color: 'red' }`，我們隻脩改瞭元素的顏色樣式，而將其他樣式屬性保持不變。這是一個很方便的技巧，可以靈活地脩改元素的樣式。
