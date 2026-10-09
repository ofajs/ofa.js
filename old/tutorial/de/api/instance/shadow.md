# shadow



Mit der `shadow`-Eigenschaft können Sie die Instanz des Shadow-Root-Knotens eines Elements abrufen.

<o-playground name="shadow - Schattenknoten" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Es ist zu beachten, dass die direkte Modifikation von Elementen innerhalb von Schattenknoten in Elementen mit Vorlagensyntax vermieden werden sollte, um die Konsistenz und Wartbarkeit der Operationen zu gewährleisten.

## Instanzen von Elementen innerhalb der Schatten-DOM-Komponente von außen abrufen

Sie können auch eine benutzerdefinierte Elementinstanz von außen abrufen und dann über die `shadow`-Eigenschaft auf Elemente im Schattenknoten zugreifen, wie unten gezeigt:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - externer Zugriff" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

