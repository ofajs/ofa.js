# html



`html` 方法用於獲取或設置目標元素內部的 HTML 代碼。

<o-playground name="html - 直接使用" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">target 1</span>
      </div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">new text</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 註意事項



`html` 是一個比較危險的方法，被塞入 `script` 也會自動執行內部的 JavaScript 代碼，使用時註意預防 XSS。

## 模闆語法方式使用



妳還可以使用 `:html` 屬性來向目標元素設置對應的 HTML 值。這在組件的渲染中特別有用。

<o-playground name="html - 模闆語法" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>Rendered html:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>change txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>
