# Klassen- und Stilbindung

In ofa.js können Sie durch dynamisches Binden von Klassennamen, Stilen und Attributen ein flexibles UI-State-Management realisieren. Dadurch passt sich die Benutzeroberfläche automatisch an Änderungen der Daten an.

## Klassenbindung

Klassenbindungen erlauben es dir, CSS-Klassen basierend auf dem Datenzustand dynamisch hinzuzufügen oder zu entfernen. Du kannst die Syntax `class:className="booleanExpression"` verwenden, um eine bestimmte Klasse zu binden.

Wenn `booleanExpression` `true` ist, wird der Klassenname zum Element hinzugefügt; wenn `false` ist, wird der Klassenname entfernt.

### Basisklassenbindung

<o-playground name="Basis-Klassenbindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Mehrere Klassenbindungen

Sie können auch mehrere Klassen gleichzeitig binden, sodass das Element je nach unterschiedlichen Bedingungen verschiedene Erscheinungszustände hat.

<o-playground name="Mehrere Klassen-Bindungen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Stilbindung

Stil-Bindung ermöglicht es dir, die Werte von Inline-Stilen direkt zu setzen und dynamisch zu aktualisieren. ofa.js bietet zwei Arten der Stil-Bindung:

### Einzelne Stilattributbindung

Verwenden Sie die Syntax `:style.propertyName`, um bestimmte Stilattribute zu binden.

<o-playground name="Einzelne Stilattributbindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Farbe umschalten</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hallo ofa.js Demo-Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Mehrfache Stilattributbindung

Du kannst auch mehrere Stileigenschaften auf einmal binden:

<o-playground name="Bindung mehrerer Stil-Eigenschaften" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamic Styling Example
      </p>
      <button on:click="changeStyles">Change Styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Attributbindung

Neben der Bindung von Klassen und Stilen können Sie auch andere HTML-Attribute dynamisch binden. ofa.js verwendet die Syntax `attr:attributeName`, um Attributbindungen zu realisieren.

### Grundlegende Attributbindung

<o-playground name="Grundlegende Attributbindung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Dies ist eine Hinweisinformation",
              val: "Bewege die Maus über mich, um den Titel zu sehen",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Boolesche Attribute Behandlung

Für boolesche Attribute (wie `disabled`, `hidden`) entscheidet ofa.js anhand des Wahrheitswerts des gebundenen Werts, ob das Attribut hinzugefügt wird.

<o-playground name="Boolesche Attributbehandlung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Hier tippen..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Klick mich</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Alle Zustände umschalten
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Schaltfläche geklickt!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## data() Funktion

Man kann `data(key)` im Stil verwenden, um Komponentendaten zu binden. Dies eignet sich hervorragend für Szenarien, in denen der Stil dynamisch basierend auf den Komponentendaten geändert werden muss.

<o-playground name="Datenfunktion innerhalb von Style-Tags" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          font-size: 10px;
          color:red;
          transition: all .3s ease;
        }
      </style>
      <style>
        p:hover {
          font-size: data(size);
          color: green;
          transition: all data(time)s ease;
        }
      </style>
      Hover FontSize: <input type="number" sync:value="size" placeholder="Dies ist ein bidirektional gebundenes Eingabefeld" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="Dies ist ein bidirektional gebundenes Eingabefeld" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hallo ofa.js Demo-Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Das `data(key)` innerhalb des `style`-Tags ersetzt im Prinzip den gesamten Inhalt des Styles. Um wiederholtes Rendern irrelevante Stile zu vermeiden, wird empfohlen, Stile mit `data(key)` in einem eigenen `style`-Tag zu platzieren, während Stile ohne Datenbindung in einen anderen `style`-Tag ausgelagert werden, um eine bessere Leistung zu erzielen.

```html
<!-- ❌ Ein p:hover ohne data(key) wird ebenfalls aktualisiert -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Nur Styles mit data(xxx) werden neu gerendert -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```