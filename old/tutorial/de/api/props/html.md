# html



`html` Methode wird verwendet, um den HTML-Code innerhalb des Zielelements abzurufen oder festzulegen.

<o-playground name="html - direkte Verwendung" style="--editor-height: 400px">
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

## Hinweise

`html` ist eine eher gefährliche Methode; wird `script` hineingesteckt, wird das enthaltene JavaScript automatisch ausgeführt. Achten Sie bei der Verwendung auf XSS-Schutz.

## Verwendung der Vorlagensyntax

Du kannst auch das Attribut `:html` verwenden, um dem Zielelement den entsprechenden HTML-Wert zuzuweisen. Dies ist besonders nützlich beim Rendern von Komponenten.

<o-playground name="html - Vorlagen-Syntax" style="--editor-height: 500px">
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

