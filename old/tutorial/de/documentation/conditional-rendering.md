# Bedingtes Rendern

In ofa.js ist die bedingte Darstellung eine wichtige Funktion, die es ermöglicht, basierend auf dem Datenstatus zu entscheiden, ob ein Element oder eine Komponente gerendert wird. ofa.js bietet eine komponentenbasierte Lösung für bedingte Darstellung, die über die Komponenten `o-if`, `o-else-if` und `o-else` realisiert wird.

## o-if Komponente

Die `o-if`-Komponente entscheidet anhand des Wahrheitswerts eines Ausdrucks, ob ihr Inhalt gerendert wird. Wenn das gebundene `value`-Attribut wahr ist, wird der Inhalt der Komponente gerendert; andernfalls erscheint der Inhalt nicht im DOM.

<o-playground name="o-if Funktionsweise Beispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
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

### Funktionsweise von o-if

`o-if` wird den Inhalt nur dann in das DOM rendern, wenn die Bedingung wahr ist，wenn die Bedingung falsch ist，werden die DOM Elemente innerhalb von o-if vollständig entfernt。Diese Implementierungsweise eignet sich für Situationen, in denen sich die Bedingung nicht zu häufig ändert，da sie die Erstellung und Zerstörung von DOM Elementen beinhaltet。

## o-else-if und o-else Komponenten

Wenn mehrere Bedingungszweige benötigt werden, können die Komponenten `o-else-if` und `o-else` zusammen mit `o-if` verwendet werden, um eine Mehrfachverzweigungsbedingungsdarstellung zu realisieren.

- `o-if`：erforderliche erste Bedingungskomponente
- `o-else-if`：optionale mittlere Bedingungskomponente, es können mehrere vorhanden sein
- `o-else`：optionale Standardbedingungskomponente, wird zuletzt platziert

<o-playground name="Mehrfach bedingte Rendering-Beispiele" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Anzeige umschalten - {{num}}</button>
      <!-- Je nach Ergebnis von num modulo 3 unterschiedliche Inhalte anzeigen -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Praktische Anwendungsszenarien – Beispiele

### Benutzerberechtigungskontrolle

<o-playground name="Beispiel für Benutzerberechtigungen" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Benutzerrolle wechseln</button>
        <p>Aktuelle Rolle: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Administrationspanel</h3>
            <button>Benutzer verwalten</button>
            <button>Systemeinstellungen</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Benutzerinformationen</h3>
            <p>Willkommen {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Bitte melden Sie sich an, um den Inhalt zu sehen</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Gast'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'Max Mustermann';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Anzeige des Formularvalidierungsstatus

<o-playground name="Beispiel für die Anzeige des Formularvalidierungsstatus" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <div>
        <h3>E-Mail-Validierungsbeispiel</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="E-Mail-Adresse eingeben">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ E-Mail-Format korrekt</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ E-Mail-Format falsch</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Bitte geben Sie eine E-Mail-Adresse zur Validierung ein</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Bewährte Methoden für bedingtes Rendern

1. **Verwendungsszenario**: Wenn Elemente unter verschiedenen Bedingungen selten umgeschaltet werden, ist die Verwendung von `o-if` besser geeignet, da dadurch nicht benötigte Elemente vollständig entfernt werden können, was Speicher spart.

2. **Leistungsüberlegungen**: Häufig umgeschaltete Elemente eignen sich besser für Klassenbindungen (wie `class:hide`) als für bedingtes Rendering, da bedingtes Rendern das Erstellen und Zerstören von DOM-Elementen beinhaltet.

3. **Klare Struktur**: Bedingtes Rendering eignet sich besonders für das Umschalten von Inhalten mit unterschiedlichen Strukturen, wie z. B. Tabs, Schritt-für-Schritt-Anleitungen usw.