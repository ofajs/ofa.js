# style

`style` 属性和原生保持一致。

请注意，`style` 属性无法获取样式的实际值，而只能获取在 `style` 属性上设置的值。尽管 `style` 方法与 [css 方法](./css.md) 类似，但它无法进行全量样式覆盖。相较于 `css`，`style` 方法的内部执行效率更高。

下面是一个示例，演示了如何使用 `style`：

<o-playground name="style - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

请记住，`style` 方法只获取和设置 `style` 属性上的值，而不是实际的计算样式。

## 模板语法方式使用

你还可以通过模板语法来设置目标元素的样式。

<o-playground name="style - 模板语法" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
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