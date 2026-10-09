# Template-Rendering

ofa.js bietet eine leistungsfähige Template-Rendering-Engine mit reicher Templatesyntax, die Entwicklern hilft, Anwendungen schnell zu erstellen. Beginnen wir mit der am häufigsten verwendeten Textwiedergabe.

## Seiten-Datenbindung

In ofa.js hat jede Seite ein `data`-Objekt, in dem du die Variablen definieren kannst, die auf der Seite benötigt werden. Wenn die Seite gerendert wird, werden die Daten aus dem `data`-Objekt automatisch mit der Vorlage gebunden, und in der Vorlage wird die Syntax `{{Variablenname}}` verwendet, um den Wert der entsprechenden Variablen zu rendern.

## Text-Rendering

Text-Rendering ist die grundlegendste Render-Methode; du kannst in der Vorlage die Syntax `{{Variablenname}}` verwenden, um den Wert der entsprechenden Variablen im `data`-Objekt anzuzeigen.

<o-playground name="Textwiedergabe-Beispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Rendern von HTML-Inhalten

Durch das Hinzufügen der `:html`-Anweisung zu einem Element kann die HTML-Zeichenkette aus der entsprechenden Variable sicher geparst und innerhalb des Elements eingefügt werden, wodurch die dynamische Darstellung von Rich-Text oder das Einbetten externer HTML-Segmente mühelos ermöglicht wird.

<o-playground name="Beispiel zum Rendern von HTML-Inhalten" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hallo ofa.js Demo Code</span>',
            };
          };
        };
      </script>
    </template>
  </code>
</o-playground>

