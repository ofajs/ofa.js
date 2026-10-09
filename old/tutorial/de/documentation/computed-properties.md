# Berechnete Eigenschaften

Berechnete Eigenschaften sind eine Möglichkeit, neue Daten aus reaktiven Daten abzuleiten, die sich automatisch aktualisieren, wenn sich die abhängigen Daten ändern. In ofa.js werden berechnete Eigenschaften als spezielle Methoden im `proto`-Objekt definiert, die mit den JavaScript-Schlüsselwörtern `get` oder `set` definiert werden.

## Merkmale und Vorteile

- **Caching**: Die Ergebnisse von berechneten Eigenschaften werden zwischengespeichert; sie werden nur neu berechnet, wenn sich die abhängigen Daten ändern  
- **Reaktivität**: Wenn sich die abhängigen Daten aktualisieren, wird die berechnete Eigenschaft automatisch aktualisiert  
- **Deklarativität**: Abhängigkeiten werden deklarativ erstellt, der Code ist klarer und leichter verständlich

## get berechnete Eigenschaft

Der get-Berechnete Eigenschaft wird verwendet, um neue Werte aus reaktiven Daten abzuleiten. Er akzeptiert keine Parameter und gibt nur Werte zurück, die auf Basis anderer Daten berechnet werden.

<o-playground name="get berechnete Eigenschaft Beispiel" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Klick mich - {{count}} - {{countDouble}}</button>
      <p>Der Wert der berechneten Eigenschaft countDouble ist: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble wurde aufgerufen');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Praktische Anwendungsszenarien und Beispiele

Berechnete Eigenschaften werden häufig verwendet, um komplexe Datenumwandlungslogik zu verarbeiten, wie z.B. das Filtern von Arrays oder das Formatieren von Anzeigetexten:

<o-playground name="Beispiel für berechnete Eigenschaften" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Namen filtern...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Max3', 'Anna4', 'Tom54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set Berechnete Eigenschaften

set-Eigenschaften ermöglichen es dir, den zugrunde liegenden Datenstatus durch eine Zuweisungsoperation zu ändern. Sie akzeptieren einen Parameter, der normalerweise verwendet wird, um die ursprünglichen Daten, von denen sie abhängen, rückwärts zu aktualisieren.

<o-playground name="Setter für berechnete Eigenschaft - Beispiel" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>Basiswert: {{count}}</p>
        <p>Doppelter Wert: {{countDouble}}</p>
        <button on:click="resetCount">Zähler zurücksetzen</button>
        <button on:click="setCountDouble">Doppelten Wert auf 10 setzen</button>
        <button on:click="incrementCount">Basiswert erhöhen</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // Stellt sicher, dass count nicht negativ wird
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Berechnete Eigenschaften vs Methoden

Obwohl Methoden ähnliche Funktionen implementieren können, hat die berechnete Eigenschaft eine Caching-Eigenschaft: Sie wird nur dann neu ausgewertet, wenn sich ihre abhängigen Daten ändern, was die Leistung verbessert.

```javascript
// Verwendung von berechneten Eigenschaften (empfohlen) - mit Cache
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Verwendung einer Methode - wird bei jedem Aufruf ausgeführt
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Hinweise

1. **Asynchrone Vorgänge vermeiden**: Berechnete Eigenschaften sollten synchron und ohne Nebenwirkungen sein, asynchrone Aufrufe oder direkte Änderungen des Komponentenzustands sind darin verboten.  
2. **Abhängigkeitsverfolgung**: Es muss ausschließlich auf reaktive Daten angewiesen werden, sonst sind Aktualisierungen unvorhersehbar.  
3. **Fehlerschutz**: Wenn innerhalb einer berechneten Eigenschaft zirkuläre Abhängigkeiten oder abnormale Zuweisungen auftreten, kann dies zu Renderfehlern oder sogar Endlosschleifen führen. Setzen Sie unbedingt im Voraus Randbedingungen und treffen Sie eine Ausnahmebehandlung.

## Praktische Anwendungsbeispiele

Nachfolgend ein einfaches Beispiel zur Formularvalidierung, das die Nützlichkeit von berechneten Eigenschaften zeigt:

<o-playground name="Formularvalidierungsbeispiel" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Einfaches Validierungsbeispiel</h3>
      <input type="text" sync:value="username" placeholder="Benutzernamen eingeben (mindestens 3 Zeichen)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Status: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Benutzername gültig' : 'Benutzername zu kurz';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

