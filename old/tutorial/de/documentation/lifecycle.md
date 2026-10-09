# Lebenszyklus

Die ofa.js-Komponenten verfügen über vollständige Lifecycle-Hook-Funktionen, mit denen Sie in verschiedenen Phasen der Komponente spezifische Logik ausführen können. Diese Hook-Funktionen ermöglichen es Ihnen, zu entscheidenden Zeitpunkten wie der Erstellung, dem Mounten, der Aktualisierung und der Zerstörung der Komponente einzugreifen und entsprechende Aktionen auszuführen.

## Lebenszyklus-Hook-Funktionen

ofa.js bietet die folgenden wichtigsten Lebenszyklus-Hook-Funktionen, geordnet nach der üblichen Reihenfolge:

### attached



`attached`-Hook wird aufgerufen, wenn die Komponente in das Dokument eingefügt wird, und zeigt an, dass die Komponente bereits an die Seite angehängt wurde. Dies ist der am häufigsten verwendete Lebenszyklus-Hook und wird normalerweise verwendet, um Initialisierungen durchzuführen, die erst nach dem tatsächlichen Anzeigen der Komponente auf der Seite möglich sind, um unnötige Berechnungen zu vermeiden, wenn die Komponente nicht sichtbar ist. Dieser Hook eignet sich auch hervorragend für Operationen wie Elementgrößenmessung, Animationsstart usw., die davon abhängen, dass die Komponente bereits auf der Seite gerendert wurde.

- **Aufrufzeitpunkt**: Die Komponente wird dem DOM-Baum hinzugefügt
- **Hauptverwendung**: Timer starten, Ereignis-Listener hinzufügen, Operationen ausführen, die Sichtbarkeit erfordern

### detached



`detached`-Hook wird aufgerufen, wenn die Komponente aus dem Dokument entfernt wird, was bedeutet, dass die Komponente kurz vor dem Abbau steht. Dieser Hook eignet sich zum Bereinigen von Ressourcen wie dem Löschen von Timern, Entfernen von Ereignis-Listenern usw.

- **Aufrufzeitpunkt**: Die Komponente wird aus dem DOM-Baum entfernt
- **Hauptverwendung**: Ressourcen bereinigen, Abonnements kündigen, Event-Listener entfernen

### ready



Der `ready`-Hook wird aufgerufen, wenn die Komponente bereit ist; zu diesem Zeitpunkt ist das Template der Komponente bereits gerendert, die DOM-Elemente wurden erstellt, aber möglicherweise noch nicht in das Dokument eingefügt. Dieser Hook eignet sich für DOM-Manipulationen oder die Initialisierung von Drittanbieter-Bibliotheken.

- **Aufrufzeitpunkt**: Das Rendern der Komponentenvorlage ist abgeschlossen, das DOM wurde erstellt
- **Hauptzweck**: Ausführen von Initialisierungsoperationen, die vom DOM abhängen

### loaded



`loaded`-Hook wird ausgelöst, sobald die Komponente, alle ihre Unterkomponenten und asynchrone Ressourcen vollständig geladen sind. An diesem Punkt kann der Ladezustand sicher entfernt oder nachfolgende Operationen ausgeführt werden, die von der vollständigen Komponentenhierarchie abhängen. Wenn keine Abhängigkeiten bestehen, wird er nach dem `ready`-Hook aufgerufen.

- **Aufrufzeitpunkt**: Komponente und ihre untergeordneten Komponenten sind vollständig geladen
- **Hauptverwendung**: Ausführen von Operationen, die auf dem vollständigen Komponentenbaum basieren

## Lebenszyklus-Ausführungsreihenfolge

Die Lifecycle-Hooks der Komponente werden in folgender Reihenfolge ausgeführt:

2. `ready` - Komponente bereit (DOM erstellt)
3. `attached` - Komponente an DOM angehängt
4. `loaded` - Komponente vollständig geladen

Wenn die Komponente aus dem DOM entfernt wird, wird der `detached`-Hook aufgerufen.

## Verwendungsbeispiel

Das folgende Beispiel zeigt, wie man Lebenszyklus-Hook-Funktionen in Komponenten verwendet:

<o-playground name="Lebenszyklus-Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Lebenszyklus-Demo</h3>
      <div class="counter">Zähler: {{count}}</div>
      <button on:click="count += 10">Um 10 erhöhen</button>
      <button on:click="removeSelf">Komponente entfernen</button>
      <div class="log">
        <h4>Lebenszyklus-Protokoll:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Entfernt sich selbst aus dem DOM, um den detached-Hook auszulösen
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Komponente bereit, DOM erstellt");
              console.log("Komponente bereit");
            },
            attached() {
              this.addLog("attached: Komponente an DOM angehängt");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Komponente angehängt");
            },
            detached() {
              this.addLog("detached: Komponente aus DOM entfernt");
              // Timer löschen, um Speicherlecks zu verhindern
              clearInterval(this._timer); 
              console.log("Komponente entfernt");
            },
            loaded() {
              this.addLog("loaded: Komponente vollständig geladen");
              console.log("Komponente vollständig geladen");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel kannst du die Ausführungsreihenfolge und den Zeitpunkt der verschiedenen Lebenszyklus-Hooks beobachten. Wenn du auf den Button "Komponente entfernen" klickst, siehst du, dass der `detached`-Hook ausgelöst wird.

## Praktische Anwendungsszenarien

### Initialisierungsvorgang

Dateninitialisierung im `ready`-Hook durchführen:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM-Operation
      this.initDomElements();
    }
  };
};
```

### Ressourcenmanagement

Starten Sie den Timer im `attached`-Hook und räumen Sie die Ressourcen im `detached`-Hook auf:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Timer starten
      this.timer = setInterval(() => {
        console.log('Zeitgesteuerte Aufgabe wird ausgeführt');
      }, 1000);
    },
    detached() {
      // Timer bereinigen
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Lebenszyklus-Hook-Funktionen sind ein wichtiges Konzept in der Entwicklung von ofa.js-Komponenten. Ihre korrekte Verwendung kann Ihnen helfen, den Komponentenstatus und Ressourcen besser zu verwalten und die Anwendungsleistung zu verbessern.

