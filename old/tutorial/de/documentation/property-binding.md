# Attributbindung

ofa.js unterstützt die Bindung von Daten an die Eigenschaften von Objekten, die nach der Instanziierung von Elementen entstehen, wie z. B. die value- oder checked-Eigenschaft eines input-Elements.

## Einweg-Attributbindung

Einweg-Attribut-Bindung verwendet die Syntax `:toKey="fromKey"`, um Komponentendaten „einseitig“ mit dem Attribut eines DOM-Elements zu synchronisieren. Ändert sich die Komponentendatum, wird das Elementattribut sofort aktualisiert; Änderungen am Element selbst (z. B. Benutzereingaben) fließen jedoch nicht zurück in die Komponente und halten den Datenfluss einseitig und steuerbar.

<o-playground name="Einweg-Attribut-Bindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Aktueller Wert: {{val}}</p>
      <input type="text" :value="val" placeholder="Dies ist ein einweg-gebundenes Eingabefeld">
      <p>Hinweis: Eine direkte Änderung des Inhalts im Eingabefeld ändert den oben angezeigten Wert nicht</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Zweiwege-Attributbindung

Die bidirektionale Eigenschaftsbindung verwendet die `sync:xxx`-Syntax und realisiert die bidirektionale Synchronisation zwischen Komponentendaten und DOM-Elementen. Wenn sich die Komponentendaten ändern, wird die Eigenschaft des DOM-Elements aktualisiert; wenn sich die Eigenschaft des DOM-Elements ändert (z. B. durch Benutzereingaben), werden auch die Komponentendaten synchronisiert.

<o-playground name="Zwei-Wege-Datenbindung" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Aktueller Wert: {{val}}</p>
      <input type="text" sync:value="val" placeholder="Dies ist ein Eingabefeld mit bidirektionaler Bindung">
      <p>Hinweis: Änderungen im Eingabefeld aktualisieren sofort den darüber angezeigten Wert</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Merkmale der bidirektionalen Bindung

- Datenfluss: Komponente ↔ DOM-Element (bidirektional)
- Änderung der Komponentendaten → Aktualisierung des DOM-Elements
- Änderung des DOM-Elements → Aktualisierung der Komponentendaten
- Geeignet für Szenarien, die Benutzereingaben und Datensynchronisation erfordern

### Zweiseitige Datenbindung von Objekten

Für die Datenbindung bei Objekttypen **ist die `sync`-Syntax nicht erforderlich**, verwenden Sie einfach die unidirektionale Übergabe mit `:`. Dies liegt daran, dass JavaScript-Objekte als Referenz geteilt werden. Wenn die Elternkomponente ein Objekt an die Kindkomponente übergibt, erhält die Kindkomponente eine Referenz auf dasselbe Objekt. Änderungen am Objekt wirken sich direkt auf die ursprünglichen Daten aus.

ofa.js bewahrt diese Eigenschaft von JavaScript, daher entspricht die unidirektionale Übergabe von Objekten tatsächlich der bidirektionalen Übergabe. Zum Beispiel:

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "Zhang San", age: 25 } }
      };
    };
  </script>
</template>
```

Im Kind-Komponenten `child-comp` wird direkt `userData.name` geändert, und im Eltern-Komponenten wird `userInfo.name` gleichzeitig aktualisiert, da sie auf dieselbe Objektreferenz verweisen.

### Häufige Szenarien für bidirektionale Bindung

<o-playground name="Formular-Zwei-Wege-Bindung Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Formular-Zwei-Wege-Bindung Beispiel</h3>
      <div class="form-group">
        <label>Texteingabefeld:</label>
        <input type="text" sync:value="textInput" placeholder="Text eingeben">
      </div>
      <div class="form-group">
        <label>Nummerneingabefeld:</label>
        <input type="number" sync:value="numberInput" placeholder="Zahl eingeben">
      </div>
      <div class="form-group">
        <label>Mehrzeiliger Text:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Mehrzeiligen Text eingeben"></textarea>
      </div>
      <div class="form-group">
        <label>Auswahlfeld:</label>
        <select sync:value="selectedOption">
          <option value="">Bitte wählen...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Checkbox:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> Ich stimme den Bedingungen zu
        </label>
      </div>
      <div class="preview">
        <h4>Echtzeit-Vorschau:</h4>
        <p>Text: {{textInput}}</p>
        <p>Zahl: {{numberInput}}</p>
        <p>Mehrzeiliger Text: {{textareaInput}}</p>
        <p>Auswahl: {{selectedOption}}</p>
        <p>Checkbox-Status: {{isChecked ? 'angekreuzt' : 'nicht angekreuzt'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

1. **Leistungsaspekte**：Zwei-Wege-Datenbindung erstellt Daten-Listener, eine umfangreiche Nutzung kann die Leistung beeinträchtigen.
2. **Datenkonsistenz**：Zwei-Wege-Datenbindung gewährleistet die Konsistenz von Daten und Ansicht, aber es ist darauf zu achten, Endlosschleifen-Updates zu vermeiden.
3. **Initialwertsetzung**：Stellen Sie sicher, dass die gebundenen Daten geeignete Anfangswerte haben, um Anzeigeprobleme durch undefined zu vermeiden.
4. **Ereigniskonflikte**：Vermeiden Sie die gleichzeitige Verwendung von Zwei-Wege-Datenbindung und manueller Ereignisbehandlung auf demselben Element, um Konflikte zu vermeiden.