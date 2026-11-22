# Attributantwort

In der vorherigen [Eigenschaftsbindung](./property-binding.md) haben wir den einfachen Eigenschaftsreaktionsmechanismus vorgestellt, also wie die Eigenschaftswerte einer Komponente in der Textanzeige gerendert werden.

ofa.js unterstützt nicht nur die Reaktivität einfacher Attributwerte, sondern auch die reaktive Darstellung von Attributwerten in tief verschachtelten Objekten.

<o-playground name="Beispiel für nicht-reaktive Daten" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">Erhöhen</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Alle Daten, die an das ofa.js-Instanzobjekt gebunden sind, werden automatisch in reaktive Daten umgewandelt. Reaktive Daten unterstützen nur grundlegende Datentypen wie Zeichenketten, Zahlen, Boolesche Werte, Arrays und Objekte. Komplexe Datentypen wie Funktionen und Klasseninstanzen müssen als **nicht-reaktive Eigenschaften** gespeichert werden, und Änderungen dieser Eigenschaften lösen kein erneutes Rendern der Komponente aus.

## Nicht-reaktive Daten

Manchmal müssen wir Daten speichern, die keine reaktiven Updates benötigen, wie z.B. Promise-Instanzen, reguläre Ausdrucksobjekte oder andere komplexe Objekte. In diesem Fall müssen nicht-reaktive Eigenschaften verwendet werden. Änderungen dieser Eigenschaften lösen kein erneutes Rendern der Komponenten aus und eignen sich zum Speichern von Daten, die keine Sichtverknüpfung erfordern.

Die Benennung von nicht-reaktiven Eigenschaften erfolgt üblicherweise durch das Hinzufügen eines Unterstrichs `_` als Präfix vor dem Eigenschaftsnamen, um sie von reaktiven Eigenschaften zu unterscheiden.

<o-playground name="Beispiel für nicht-reaktive Daten" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blau erhöht</button>
      <button on:click="_count2++">Grün erhöht</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Beim Klicken auf die Schaltfläche `Green increments` wurde der Wert von `_count2` zwar tatsächlich erhöht, da es sich jedoch um eine nicht-reaktive Eigenschaft handelt, wird keine Aktualisierung der Ansicht ausgelöst, und die Anzeige in der Benutzeroberfläche bleibt unverändert. Beim Klicken auf die Schaltfläche `Blue increases` wird hingegen, da `count` eine reaktive Eigenschaft ist, eine vollständige Neurenderung der Komponente ausgelöst, wodurch die Anzeige von Green erst jetzt synchron aktualisiert wird.

Nicht-reaktive Objektdaten haben eine bessere Leistung als reaktive Objektdaten, da nicht-reaktive Daten kein erneutes Rendern der Komponente auslösen.


