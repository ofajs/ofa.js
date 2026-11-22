# style



`style` 屬性和原生保持一緻。

請註意，`style` 屬性無法獲取樣式的實際值，而隻能獲取在 `style` 屬性上設置的值。盡管 `style` 方法與 [css 方法](./css.md) 類似，但牠無法進行全量樣式覆蓋。相較於 `css`，`style` 方法的內部執行效率更高。

下面是一個示例，演示瞭如何使用 `style`：

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

請記住，`style` 方法隻獲取和設置 `style` 屬性上的值，而不是實際的計算樣式。

## 模闆語法方式使用



妳還可以通過模闆語法來設置目標元素的樣式。

<o-playground name="style - 模闆語法" style="--editor-height: 400px">
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

