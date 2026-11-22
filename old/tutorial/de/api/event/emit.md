# emit



Mit der Methode `emit` können Sie Ereignisse aktiv auslösen, und die ausgelösten Ereignisse besitzen einen Bubble-Mechanismus. Der Bubble-Mechanismus bedeutet, dass das Ereignis von inneren Elementen zu äußeren Elementen aufsteigt und die Ereignisse von innen nach außen in der Hierarchie ausgelöst werden.

Hier ist ein Beispiel, das zeigt, wie die `emit`-Methode verwendet wird, um benutzerdefinierte Ereignisse auszulösen und mithilfe des Bubbling-Mechanismus Ereignisse an äußere Elemente weiterzugeben:

<o-playground name="emit - Ereignis auslösen" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir für das `<ul>`-Element und das `<li>`-Element jeweils denselben benutzerdefinierten Ereignishandler `custom-event` registriert. Wenn wir das Ereignis mit der `emit`-Methode auslösen, blubbert das Ereignis vom `<li>`-Element zum `<ul>`-Element und löst beide Ereignishandler aus.

## Benutzerdefinierte Daten

Durch das Hinzufügen des Parameters `data` kannst du benutzerdefinierte Daten an den Ereignishandler übergeben:

<o-playground name="emit - benutzerdefinierte Daten" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel übergeben wir benutzerdefinierte Daten an den Ereignishandler über den Parameter `data`. Der Ereignishandler kann die übergebenen Daten über `event.data` abrufen.

## Ereignis auslösen, ohne zu bubbeln

Wenn Sie nicht möchten, dass ein Ereignis aufsteigt, können Sie beim Auslösen des Ereignisses den Parameter `bubbles: false` mitgeben:

<o-playground name="emit - nicht bubbling" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Ich bin target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul wird ausgelöst';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target wird ausgelöst';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir mit dem Parameter `bubbles: false` ein benutzerdefiniertes Ereignis ausgelöst. Dieses Ereignis wird nicht an übergeordnete Elemente weitergegeben, sodass nur der Ereignishandler des `<li>`-Elements ausgelöst wird.

## Durchdringen des Wurzelknotens

Standardmäßig dringen Ereignisse nicht durch den Shadow-DOM eines benutzerdefinierten Elements. Du kannst jedoch ein benutzerdefiniertes Ereignis durch Setzen von `composed: true` die Wurzel durchbrechen lassen und so Elemente außerhalb der Wurzel auslösen.

<o-playground name="emit - Root-Knoten durchdringen" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel haben wir eine benutzerdefinierte Komponente `composed-test` erstellt, die ein Element im Shadow DOM und eine Schaltfläche zum Auslösen eines Ereignisses enthält. Standardmäßig dringen Ereignisse nicht durch das Shadow DOM zum Root-Knoten. Wenn wir jedoch beim Auslösen des Ereignisses den Parameter `composed: true` verwenden, lassen wir das Ereignis zum Root-Knoten durchdringen und lösen ein Element außerhalb des Root-Knotens aus.