# html

The `html` method is used to get or set the HTML code inside the target element.

<o-playground name="html - Direct Usage" style="--editor-height: 400px">
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

## Notes

`html` is a relatively dangerous method; when inserted into `script`, it will also automatically execute the internal JavaScript code. Be careful to prevent XSS when using it.

## Using Template Syntax

You can also use the `:html` attribute to set the corresponding HTML value for the target element. This is particularly useful in component rendering.

<o-playground name="html - Template Syntax" style="--editor-height: 500px">
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

