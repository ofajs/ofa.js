# Slots

Slots sind Platzhalter in Komponenten, die zum Empfangen externer Inhalte dienen. Durch die Verwendung von Slots kannst du wiederverwendbare Komponenten erstellen und gleichzeitig den Nutzern der Komponenten ermöglichen, den Inhalt innerhalb der Komponente anzupassen.

## Standard-Slot

<o-playground name="Standard-Slot-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Slot-Inhalt:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Standard-Slot-Inhalt

Wenn die übergeordnete Komponente keinen Slot-Inhalt bereitstellt, werden die Elemente innerhalb von `<slot></slot>` als Standardinhalt angezeigt.

<o-playground name="Beispiel für Standardinhalte des Slots" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>Mit Slot-Inhalt:</h3>
      <demo-comp>
        <div>Dies ist benutzerdefinierter Inhalt</div>
      </demo-comp>
      <h3>Ohne Slot-Inhalt (Standardinhalt wird angezeigt):</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>Slot-Inhalt:
      <span style="color: red;">
        <slot>
          <div>Dies ist der Standardinhalt</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Benannte Slots

Wenn eine Komponente mehrere Slot-Positionen benötigt, können benannte Slots verwendet werden, um verschiedene Slots zu unterscheiden. Definiere einen benannten Slot mit `<slot name="xxx">` und gib beim Gebrauch über das Attribut `slot="xxx"` an, in welchen Slot der Inhalt eingefügt werden soll.

<o-playground name="Beispiel für benannte Slots" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Slot-Inhalt:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrstufige Slot-Übergabe

Slot-Inhalte können über mehrere Komponentenebenen hinweg weitergegeben werden. Wenn eine übergeordnete Komponente Slot-Inhalte an eine untergeordnete Komponente übergibt, kann die untergeordnete Komponente diese Slot-Inhalte wiederum an ihre eigenen untergeordneten Komponenten weitergeben, wodurch eine mehrschichtige Durchleitung der Slots realisiert wird.

<o-playground name="Mehrstufiges Slot-Passing-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">Titel von der äußersten Ebene</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>Äußere Komponente</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>Innere Komponente</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Im obigen Beispiel:- Die äußerste Elternkomponente definiert den Inhalt von `slot="header"`
- Die äußere Komponente (outer-comp) empfängt diesen Slot-Inhalt und leitet ihn an die innere Komponente (inner-comp) weiter
- Die innere Komponente rendert schließlich den Slot-Inhalt der äußersten Ebene