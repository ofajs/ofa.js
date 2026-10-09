# css

The `css` method is used to get or set the style of the target element.

## Direct Use

You can directly use the `css` method to get or set the element's styles.

<o-playground name="css - Direct Usage" style="--editor-height: 300px">
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

## Full Settings

With the obtained `css` object, you can directly set the style value on the element.

<o-playground name="css - Full Settings" style="--editor-height: 400px">
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

Using the features of the `css` object, you can quickly adjust the styles of the target element.

## Using Template Syntax

You can also use template syntax to style the target element.

<o-playground name="css - template syntax" style="--editor-height: 400px">
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

## Tips for Setting CSS

You can modify a specific style property of an element using `$ele.css = {...$ele.css, color:'red'}` without affecting other style properties. This approach allows you to change just one property without rewriting the entire style.

### Example

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

In the above example, by using `{ ...myElement.css, color: 'red' }`, we only modify the color style of the element while keeping other style properties unchanged. This is a convenient technique that allows flexible modification of element styles.