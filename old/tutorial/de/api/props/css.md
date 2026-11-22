# css



`css` Methode wird verwendet, um den Stil des Zielelements abzurufen oder festzulegen.

## Direkte Verwendung

Du kannst direkt die `css`-Methode verwenden, um den Stil eines Elements abzurufen oder festzulegen.

<o-playground name="css - direkte Verwendung" style="--editor-height: 300px">
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

## Vollständige Einstellungen

Durch das erhaltene `css`-Objekt kannst du direkt den Style-Wert auf dem Element festlegen.

<o-playground name="css - Alle Einstellungen" style="--editor-height: 400px">
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

Mit den Eigenschaften des `css`-Objekts können Sie schnell den Stil des Zielelements anpassen.

## Verwendung der Vorlagensyntax

Du kannst auch über die Template-Syntax die Stile des Ziel-Elements festlegen.

<o-playground name="css - Vorlagensyntax" style="--editor-height: 400px">
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

## Tipps zur CSS-Einstellung

Du kannst die Art und Weise `$ele.css = {...$ele.css, color:'red'}` verwenden, um eine einzelne Stil-Eigenschaft eines Elements zu ändern, ohne andere Stil-Eigenschaften zu beeinflussen. Diese Methode ermöglicht es, nur eine Eigenschaft zu ändern, ohne den gesamten Stil neu schreiben zu müssen.

### Beispiel

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

Im obigen Beispiel verwenden wir `{ ...myElement.css, color: 'red' }`, um nur die Farbe des Elements zu ändern, während die anderen Stileigenschaften unverändert bleiben. Dies ist ein sehr praktischer Trick, um die Stile eines Elements flexibel zu modifizieren.