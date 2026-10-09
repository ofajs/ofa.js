# text



`text` 方法用於獲取或設置元素的文本內容。

## 直接使用



妳可以直接獲取或設置元素的文本內容。

<o-playground name="text - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target1">target 1</div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').text = `<b style="color:blue;">new text</b>`;
          \$("#logger").text = $("#target1").text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 模闆語法方式使用



妳還可以使用 `:text` 屬性來向目標元素設置對應的文本值。這在組件的渲染中特別有用。

<o-playground name="text - 模闆語法" style="--editor-height: 450px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./text-demo.html"></l-m>
      <text-demo></text-demo>
      <script>
        setTimeout(()=>{
          \$("text-demo").txt = "change txt from outside";
        },1000);
      </script>
    </template>
  </code>
  <code path="text-demo.html" active>
    <template component>
      <div>Rendered text:
        <span :text="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "text-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "change txt";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>
