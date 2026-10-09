# Ereignisbindung

In ofa.js ist die Ereignisbindung ein wichtiger Mechanismus zur Umsetzung von Benutzerinteraktionen. Du kannst auf verschiedene Weise Ereignisbehandler für Elemente binden, um auf Benutzeraktionen zu reagieren.

## Ereignisse von proto binden

Dies ist die empfohlene Methode zur Ereignisbindung, die sich für komplexe Ereignisverarbeitungslogiken eignet. Wenn Sie die Ereignisbehandlungsfunktion im `proto`-Objekt definieren, können Sie die Codelogik besser organisieren, was die Wartung und Wiederverwendung erleichtert.

<o-playground name="Ereignisse von proto binden" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Direkte Funktionsausführung

Bei einfachen Operationen (wie Zählererhöhung, Statusumschaltung usw.) können kurze Ausdrücke direkt im Ereignisattribut geschrieben werden. Diese Methode ist prägnant und klar und eignet sich für die Verarbeitung einfacher Logik.

<o-playground name="Funktion direkt ausführen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Unterstützte Ereignistypen

ofa.js unterstützt alle Standard-DOM-Events, einschließlich, aber nicht beschränkt auf:

- Mausereignisse: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout` usw.
- Tastaturereignisse: `keydown`, `keyup`, `keypress` usw.
- Formularereignisse: `submit`, `change`, `input`, `focus`, `blur` usw.
- Touchevents: `touchstart`, `touchmove`, `touchend` usw.

Die von ofa.js unterstützten Ereignistypen sind vollständig identisch mit den nativen DOM-Ereignissen. Weitere Details finden Sie in der [MDN-Ereignisdokumentation](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)。

## Parameter an Ereignishandler übergeben

Du kannst auch Parameter an den Event-Handler übergeben：

<o-playground name="Parameter an Event-Handler übergeben" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Add 5 - Aktuell: {{count}}</button>
      <button on:click="addNumber(10)">Add 10 - Aktuell: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Zugriff auf das Ereignisobjekt

Im Event-Handler kannst du über den `event`-Parameter auf das native Event-Objekt zugreifen:

<o-playground name="Auf das Event-Objekt zugreifen" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Klicke irgendwo, um die Koordinaten zu sehen</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Sie können auch den Parameter `$event` im Ausdruck verwenden, um auf das native Ereignisobjekt zuzugreifen, z.B. um die Mausklickkoordinaten zu erhalten:

```html
<div class="container" on:click="handleClick($event)">Klicken Sie auf eine beliebige Stelle, um die Koordinaten anzuzeigen</div>
```

## Benutzerdefinierte Ereignisse überwachen

Neben dem Abhören von nativen DOM-Ereignissen können Sie auch problemlos benutzerdefinierte Ereignisse abhören, die von Komponenten ausgelöst werden:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

Für ein tieferes Verständnis von benutzerdefinierten Ereignissen lesen Sie bitte das Kapitel [Benutzerdefinierte Ereignisse](custom-events.md). Es wird empfohlen, der Reihenfolge des Tutorials Schritt für Schritt zu folgen, da sich die nachfolgenden Inhalte natürlich entfalten; natürlich sind Sie auch jederzeit willkommen, nachzuschlagen, um vorzeitig Kenntnisse zu erlangen.