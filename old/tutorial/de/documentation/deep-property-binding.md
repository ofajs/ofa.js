# Verstehen der Eigenschaftsbindung

Im vorherigen Inhalt wurde bereits die grundlegende Verwendung der [Eigenschaftsbindung](./property-binding.md) vorgestellt. Das vorherige Beispiel diente dazu, die `value`-Eigenschaft eines nativen Browserelements (wie `textarea`) zu binden. Dieser Abschnitt wird das Wesen der Eigenschaftsbindung näher untersuchen——sie bindet tatsächlich an JavaScript-Eigenschaften nach der Instanziierung der Komponente, nicht an HTML-Attribute.

## Mechanismus der Komponenten-Attributbindung

In ofa.js verwenden wir in der übergeordneten Komponente die Syntax `:toProp="fromProp"`, um eine JavaScript-Eigenschaft des untergeordneten Komponenteninstanz zu setzen, nicht um ein HTML-Attribut zu setzen. Dies unterscheidet sich wesentlich vom direkten Setzen eines HTML-Attributs (wie `attr:toKey="fromKey"`).

Das folgende Beispiel zeigt, wie man Daten über Attribut-Bindung an eine benutzerdefinierte Komponente übergibt:

<o-playground name="Attribut-Bindung verstehen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel:- Die `val`-Daten der Elternkomponente werden an die `fullName`-Eigenschaft der Kindkomponente `<demo-comp>` gebunden
- Mit der Syntax `:full-name="val"` wird der Wert von `val` der Elternkomponente an die `fullName`-Eigenschaft der Kindkomponente übergeben
- Die Kindkomponente empfängt den Wert und zeigt ihn in der Vorlage mit `{{fullName}}` an

## Eigenschaftsbindung vs. Merkmalsvererbung

Es ist zu beachten, dass es zwischen Attribut-Bindung (`:`) und Merkmals-Attribut-Vererbung (`attr:`) folgende wesentliche Unterschiede gibt:

### Attributbindung (`:`)

- An die Komponenteninstanz gebundene JavaScript-Eigenschaften
- Die übergebenen Daten bleiben primitive Typen (Zeichenketten, Zahlen, Booleans usw.)
- Innerhalb der Komponente kann direkt darauf zugegriffen und sie modifiziert werden, ohne dass `data` vorab definiert werden muss.

### Vererbung von Feature-Attributen (`attr:`)

- HTML-Attribute setzen
- Alle Werte werden in Zeichenketten umgewandelt
- Hauptsächlich zum Übergeben von Attributen an zugrunde liegende DOM-Elemente
- Erfordert spezielle Verarbeitung, um komplexe Daten zu analysieren
- `attrs` muss vorher innerhalb der Komponente definiert werden, um Attributwerte empfangen zu können

Grammatikvergleich:```html
<!-- Attributbindung: Übergabe von JavaScript-Werten, Beibehaltung des Datentyps -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Attributvererbung: Festlegen von HTML-Attributen, alle Werte werden in Zeichenfolgen umgewandelt -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Tatsächlich wird die Zeichenfolge "42" übergeben -->
```

## Unterschiede im Fallvergleich

<o-playground name="Fallvergleich Unterschied" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Dabei ist `vone` eine Eigenschaft der Komponenteninstanz, `vtwo` ist ein HTML-Attribut. Der Wert des Attributs wird vom Selektor `[vtwo]` ausgewählt und das Styling angewendet, während `vone` eine Eigenschaft der Komponenteninstanz ist und nicht vom Selektor `[vone]` ausgewählt wird.

## Zwei-Wege-Datenbindung

Nach der Instanziierung unterstützt die Komponente auch die bidirektionale Datenbindung unter Verwendung der Syntax `sync:toProp="fromProp"`. Die bidirektionale Bindung ermöglicht die Synchronisation von Daten zwischen der übergeordneten und der untergeordneten Komponente. Wenn sich die Daten auf einer Seite ändern, wird die andere Seite entsprechend aktualisiert.

> Anders als Angular und Vue unterstützt ofa.js die native bidirektionale Datenbindungssyntax, ohne dass spezielle Konfigurationen oder zusätzliche Operationen für Komponenten erforderlich sind.

### Beispiel für bidirektionale Bindung

Das folgende Beispiel zeigt, wie eine bidirektionale Datenbindung zwischen einer übergeordneten und einer untergeordneten Komponente hergestellt wird:

<o-playground name="Zwei-Wege-Datenbindung Beispiel" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Wert in der Elternkomponente: {{val}}</h3>
      <p>Den Wert der Elternkomponente über das Eingabefeld ändern:</p>
      <input type="text" sync:value="val" placeholder="Text im Eingabefeld eingeben...">
      <p>Den Wert der Elternkomponente über die Kindkomponente ändern:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Wert, der in der Kindkomponente angezeigt wird: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="In der Kindkomponente eingeben...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel:- Der `val` des übergeordneten Komponenten und der `fullName` des untergeordneten Komponenten realisieren eine bidirektionale Bindung über `sync:full-name="val"`.
- Wenn im Eingabefeld des übergeordneten Komponenten ein Inhalt eingegeben wird, zeigt der untergeordnete Komponente sofort den neuen Wert an.
- Wenn im Eingabefeld des untergeordneten Komponenten ein Inhalt eingegeben wird, aktualisiert der übergeordnete Komponente ebenfalls sofort die Anzeige.

### Unterschied zwischen bidirektionaler Bindung und normaler Eigenschaftsbindung

| Eigenschaft | Normale Attribut-Bindung (`:`) | Zwei-Wege-Bindung (`sync:`) |
|------|-------------------|-------------------|
| Datenfluss | Einbahnstraße: Eltern → Kind | Zwei-Wege: Eltern ↔ Kind |
| Syntax | `:prop="value"` | `sync:prop="value"` |
| Änderung durch Kind-Komponente | Beeinflusst Eltern-Komponente nicht | Beeinflusst Eltern-Komponente |
| Anwendungsfall | Eltern-Komponente übergibt Konfiguration an Kind-Komponente | Synchronisation der Daten zwischen Eltern- und Kind-Komponente erforderlich |### Hinweise

1. **Leistungsüberlegungen**: Die bidirektionale Bindung löst bei Datenänderungen eine erneute Darstellung aus, daher sollte sie in komplexen Szenarien mit Vorsicht verwendet werden.
2. **Datenflusskontrolle**: Zu viele bidirektionale Bindungen können dazu führen, dass der Datenfluss schwer nachvollziehbar ist. Es wird empfohlen, die Kommunikationsmethode zwischen Komponenten sinnvoll zu gestalten.
3. **Komponentenkompatibilität**: Nicht alle Komponenten eignen sich für die bidirektionale Bindung. Der Zweck des Komponentendesigns sollte berücksichtigt werden.