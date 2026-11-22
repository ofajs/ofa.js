# style



`style` Attribut bleibt konsistent mit dem nativen.

Bitte beachten Sie, dass das `style`-Attribut nicht den tatsächlichen Wert eines Stils abrufen kann, sondern nur den im `style`-Attribut gesetzten Wert. Obwohl die `style`-Methode der [css-Methode](./css.md) ähnelt, kann sie keine vollständige Stilüberschreibung vornehmen. Im Vergleich zu `css` ist die interne Ausführungseffizienz der `style`-Methode höher.

Im Folgenden ein Beispiel, das zeigt, wie `style` verwendet wird:

<o-playground name="style - direkte Verwendung" style="--editor-height: 300px">
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

Bitte beachten Sie, dass die `style`-Methode nur die Werte des `style`-Attributs abruft und setzt, nicht jedoch die tatsächlichen berechneten Stile.

## Verwendung der Vorlagensyntax

Du kannst auch über die Template-Syntax die Stile des Ziel-Elements festlegen.

<o-playground name="style - Vorlagen-Syntax" style="--editor-height: 400px">
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

