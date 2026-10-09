# text

`text` method is used to get or set the text content of an element.

## Direct Use

You can directly get or set the text content of an element.

<o-playground name="text - Direct Usage" style="--editor-height: 300px">
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

## Using Template Syntax

You can also use the `:text` attribute to set the corresponding text value for the target element. This is especially useful in component rendering.

<o-playground name="text - Template Syntax" style="--editor-height: 450px">
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

