# Benutzerdefinierte Ereignisse

In ofa.js können neben den integrierten DOM-Ereignissen auch benutzerdefinierte Ereignisse erstellt und verwendet werden, um die Kommunikation zwischen Komponenten zu ermöglichen. Benutzerdefinierte Ereignisse sind ein wichtiger Mechanismus in der komponentenbasierten Entwicklung, der es Komponenten erlaubt, Nachrichten oder Zustandsänderungen nach oben zu senden.

## emit-Methode - Auslösen benutzerdefinierter Ereignisse

Die Methode `emit` wird verwendet, um benutzerdefinierte Ereignisse auszulösen und Zustandsänderungen innerhalb der Komponente oder Benutzeraktionen an externe Beobachter mitzuteilen.

### Grundlegende Verwendung

```javascript
// Ein einfaches benutzerdefiniertes Ereignis auslösen
this.emit('custom-event');

// Ein benutzerdefiniertes Ereignis mit Daten auslösen
this.emit('data-changed', {
  data: {
    // Benutzerdefinierte Daten, beliebige Struktur je nach Bedarf
    newValue: 100,
    oldValue: 50
  }
});
```

### emit Methodenparameter

Die `emit`-Methode akzeptiert zwei Parameter:

1. **Ereignisname**: Zeichenfolge, der Name des auszulösenden Ereignisses.
2. **Optionsobjekt** (optional): Enthält Ereigniskonfigurationsoptionen
   - `data`: Die zu übergebenden Daten
   - `bubbles`: Boolescher Wert, steuert, ob das Ereignis aufsteigt (Standard: true)
   - `composed`: Boolescher Wert, steuert, ob das Ereignis die Shadow-DOM-Grenze überschreiten kann
   - `cancelable`: Boolescher Wert, steuert, ob das Ereignis abgebrochen werden kann

Dann kann das übergeordnete Element mit der `on`-Methode [(Ereignisbindung)](./event-binding.md) auf dieses benutzerdefinierte Ereignis lauschen.

### emit Verwendungsbeispiel

<o-playground name="emit Anwendungsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Klicken, um Ereignis auszulösen</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'Der Button wurde geklickt',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Ereignis-Blasenmechanismus

Die Eigenschaft `bubbles` steuert, ob ein Ereignis zu den übergeordneten Elementen aufsteigt. Wenn sie auf `true` gesetzt ist, breitet sich das Ereignis entlang des DOM-Baums nach oben aus. Der Standardwert ist `true`. Wenn sie auf `false` gesetzt ist, steigt das Ereignis nicht auf.

### Ausführliche Erklärung des Bubble-Mechanismus

- **Standardverhalten**: Mit `emit` ausgelöste Ereignisse haben standardmäßig die Blasenbildung aktiviert (`bubbles: true`)
- **Blasenpfad**: Das Ereignis beginnt beim auslösenden Element und breitet sich schrittweise nach oben aus
- **Blasenbildung verhindern**: Durch Aufruf von `event.stopPropagation()` im Ereignishandler kann die Blasenbildung gestoppt werden

### Blasenbeispiel

<o-playground name="Benutzerdefinierte Ereignis-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Äußerer Container (hört Bubbling-Ereignis): {{bubbledEventCount}} mal</p>
      <p>Inneres Komponente (hört direktes Ereignis): {{directEventCount}} mal</p>
      <p>Empfangene Daten: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Nicht-Bubbling-Ereignis auslösen</button>
      <button on:click="triggerBubblingEvent">Bubbling-Ereignis auslösen</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Nicht-Bubbling-Ereignis, wird nur vom direkten Listener erfasst
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Nicht-Bubbling-Ereignis ausgelöst', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Bubbling-Ereignis, wird zum Elternelement hochpropagiert
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Bubbling-Ereignis ausgelöst', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Durchbrechen der Shadow DOM Grenzen

Die Eigenschaft `composed` steuert, ob ein Ereignis die Shadow-DOM-Grenze überqueren kann. Das ist besonders für die Entwicklung von Web Components wichtig; der Standardwert ist `false`.

### Detaillierte Erklärung des Durchdringungsmechanismus

- **Shadow DOM-Isolation**：Standardmäßig können Ereignisse die Shadow-DOM-Grenze nicht überschreiten
- **Durchlässigkeit aktivieren**：Durch Setzen von `composed: true` können Ereignisse die Shadow-DOM-Grenze überschreiten
- **Anwendungsszenario**：Wenn eine Komponente Ereignisse an die Host-Umgebung senden muss, muss `composed: true` gesetzt werden

### Durchschlagbeispiel

<o-playground name="Beispiel für benutzerdefinierte Ereignisse mit Daten" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Ereignisse überwacht: {{bubbledEventCount}} Mal</p>
      <p>Empfangene Daten: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Ereignisse überwacht: {{bubbledEventCount}} Mal</p>
      <p>Empfangene Daten: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Nicht-durchdringendes Ereignis auslösen</button>
      <button on:click="triggerComposedEvent">Durchdringendes Ereignis auslösen</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Nicht-durchdringendes Ereignis, wird nur vom direkten Zuhörer erfasst
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Nicht-durchdringendes Ereignis ausgelöst', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Durchdringendes Ereignis, überschreitet die Shadow DOM-Grenze
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Durchdringendes Ereignis ausgelöst', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

