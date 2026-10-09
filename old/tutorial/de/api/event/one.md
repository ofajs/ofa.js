# one



Mit der `one`-Methode können Sie für ein Zielelement einen einmaligen Ereignishandler registrieren, was bedeutet, dass der Ereignishandler nach dem ersten Auslösen automatisch entbunden wird und nicht erneut ausgelöst wird.

Hier ist ein Beispiel, das zeigt, wie die `one`-Methode verwendet wird, um einen Klick-Ereignishandler für ein Button-Element zu registrieren:

<o-playground name="one - click Einmalereignis" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `one`-Methode, um dem Button-Element einen Klick-Ereignishandler hinzuzufügen. Wenn der Benutzer auf den Button klickt, wird der Ereignishandler ausgelöst, aber danach nicht erneut, da er entbunden wurde.

## Verwendung der Vorlagensyntax

Du kannst auch die Vorlagensyntax verwenden, um einmalige Ereignisbehandlungsprogramme an Zielelemente zu binden.

<o-playground name="one - Vorlagensyntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel binden wir mit `one:click` eine Methode namens `addCount` an das Button-Element. Wenn der Benutzer auf den Button klickt, wird diese Methode aufgerufen, aber danach nicht erneut ausgelöst, da es sich um einen einmaligen Ereignishandler handelt.