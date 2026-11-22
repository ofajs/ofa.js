# on



Mit der `on`-Methode kannst du Ereignisbehandlungsroutinen für Zielelemente registrieren. Dies ermöglicht es dir, Benutzerinteraktionen einfach zu erfassen und darauf zu reagieren.

Im Folgenden ein Beispiel, das zeigt, wie Sie mit der Methode `on` einen Klickereignis-Handler für ein Schaltflächenelement registrieren:

<o-playground name="on - click Ereignis" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `on`-Methode, um dem Button-Element einen Klickereignis-Handler hinzuzufügen. Wenn der Benutzer auf den Button klickt, wird der Ereignishandler ausgelöst, der Zähler wird erhöht und das Ergebnis wird auf der Seite angezeigt.

## Verwendung der Vorlagensyntax

Sie können auch die Vorlagensyntax verwenden, um Methoden an Zielelemente zu binden.

<o-playground name="on - Vorlagen-Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

In diesem Beispiel binden wir mit `on:click` auf dem Button-Element eine Methode namens `addCount`. Wenn der Benutzer auf den Button klickt, wird diese Methode aufgerufen, der Zähler wird erhöht und der neue Wert auf der Seite angezeigt. Auf diese Weise kannst du Ereignisbehandlungen mit Methoden der Komponente verknüpfen und komplexere Interaktionen realisieren.

## event



Nach der Registrierung eines Ereignisses wird der ausgelösten Funktion das event mitgegeben, wie bei nativen Ereignissen:

<o-playground name="on - event Parameter" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">Zähler erhöhen</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

