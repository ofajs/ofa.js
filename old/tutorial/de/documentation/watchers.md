# Lauscher

Watcher sind in ofa.js eine Funktion, um Änderungen von Daten zu überwachen und entsprechende Logik auszuführen. Wenn sich reaktive Daten ändern, wird automatisch eine Callback-Funktion ausgelöst, die dir erlaubt, Aufgaben wie Datentransformation, Seiteneffekte oder asynchrone Verarbeitungen durchzuführen.

## Grundlegende Verwendung

Listener werden im `watch`-Objekt der Komponente definiert, wobei der Schlüsselname dem zu beobachtenden Datenattributnamen entspricht und der Wert eine Callback-Funktion ist, die ausgeführt wird, wenn sich die Daten ändern.

<o-playground name="watchers - Grundlegende Verwendung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Parameter der Rückruffunktion

Die Listener-Callback-Funktion empfängt zwei Parameter:- `newValue`：Der neue Wert nach der Änderung  
- `{watchers}`：Alle Watcher-Objekte der aktuellen Komponente

Nach einer Datenänderung wird zunächst eine Debounce-Verarbeitung durchgeführt, bevor der Callback in `watch` ausgeführt wird; der Parameter `watchers` ist die Menge aller im aktuellen Debounce-Zyklus zusammengefassten Änderungen.

Die Funktion in `watch` wird sofort nach Abschluss der Komponenteninitialisierung aufgerufen, um Datenüberwachungen einzurichten. Man kann feststellen, ob es sich um den ersten Aufruf handelt, indem man prüft, ob `watchers` eine Länge hat.

<o-playground name="watchers - Rückrufparameter" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>Name: {{name}}</p>
      <p>Alter: {{age}}</p>
      <input sync:value="name" placeholder="Name eingeben" />
      <input sync:value="age" type="number" placeholder="Alter eingeben" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "Max",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // einen davon abrufen
                this.log += `Attribut "${watcher.name}" von "${watcher.oldValue}" zu "${watcher.value}" geändert\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // einen davon abrufen
                this.log += `Attribut "${watcher.name}" von "${watcher.oldValue}" zu "${watcher.value}" geändert\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Tiefe Beobachtung

Bei verschachtelten Daten vom Typ Objekt oder Array führt watch automatisch eine Tiefenüberwachung durch.

<o-playground name="watchers - Tiefenüberwachung" style="--editor-height: 700px">
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
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>Benutzerinformation:</p>
        <p>Name: {{user.name}}</p>
        <p>Alter: {{user.age}}</p>
        <p>Hobbys: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">Name ändern</button>
        <button on:click="updateAge">Alter ändern</button>
        <button on:click="addHobby">Hobby hinzufügen</button>
        <button on:click="updateHobby">Hobby ändern</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "Zhang San",
                age: 25,
                hobbies: ["Basketball", "Fußball"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // Hole einen davon
                console.log("Änderung: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Wert geändert -> Attribut "${watcher.name}" von "${watcher.oldValue}" zu "${watcher.value}" <br>`;
                }else{
                  this.log += `Methode ausgeführt ${watcher.type} -> Funktionsname "${watcher.name}" Parameter "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "Li Si";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("Schwimmen");
              },
              updateHobby() {
                this.user.hobbies[0] = "Badminton";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrere Datenquellen überwachen

Sie können gleichzeitig Änderungen mehrerer Daten überwachen und in der Callback-Funktion die entsprechende Logik basierend auf den Änderungen mehrerer Daten ausführen.

<o-playground name="watchers - Mehrere Datenquellen" style="--editor-height: 600px">
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
      <p>Breite: {{rectWidth}}</p>
      <p>Höhe: {{rectHeight}}</p>
      <p>Fläche: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="Breite" />
      <input sync:value="rectHeight" type="number" placeholder="Höhe" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Praktische Anwendungsszenarien

### 1. Formularvalidierung

<o-playground name="watchers - Formularvalidierung" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="Benutzername (3-10 Zeichen)" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="E-Mail" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "Benutzername muss 3-10 Zeichen lang sein";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. Thema einrichten

<o-playground name="watchers - Thema festlegen" style="--editor-height: 800px">
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
      <p>Einstellung: {{settings.theme}}</p>
      <p>Speicherstatus: {{saveStatus}}</p>
      <button on:click="setLight">Helles Thema</button>
      <button on:click="setDark">Dunkles Thema</button>
      <button on:click="resetSettings">Zurücksetzen</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "Gespeichert",
            },
            watch: {
              settings(){
                  this.saveStatus = "Wird gespeichert...";
                  setTimeout(() => {
                    this.saveStatus = "Gespeichert";
                    console.log("Einstellung gespeichert:", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

- **Vermeiden Sie die Änderung von überwachten Daten**: Das Ändern von überwachten Daten im Rückruf eines Watchers kann zu einer Endlosschleife führen. Falls eine Änderung erforderlich ist, stellen Sie sicher, dass eine angemessene Bedingung vorhanden ist.
- **Verwenden Sie stattdessen berechnete Eigenschaften**: Wenn Sie einen neuen Wert basierend auf Änderungen mehrerer Daten berechnen müssen, wird empfohlen, [berechnete Eigenschaften](./computed-properties.md) anstelle eines Watchers zu verwenden.