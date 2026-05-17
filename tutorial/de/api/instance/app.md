# app



In `o-app` enthaltene Elemente, einschließlich der Elemente im Schattenknoten von `o-page` innerhalb von `o-app` oder der inneren Unterkomponenten, deren `app`-Eigenschaft auf die Elementinstanz dieses `o-app` verweist.

## Anwendungsinstanz abrufen

Das Folgende ist ein Beispiel, das zeigt, wie man innerhalb eines `o-app`-Elements auf die `app`-Eigenschaft zugreift:


<o-playground name="app - App-Instanz abrufen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseite der App
    export const home = "./home.html";
    // Verfügbare Methoden der App
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
    // Konfiguration der Seitenwechselanimation
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Verwendungsbeispiele

Nachdem Sie die `app`-Instanz erhalten haben, können Sie:

### 1. Benutzerdefinierte Methode zum Zugriff auf die Anwendung

Durch die über die `proto`-Konfigurationsoption in `app-config.js` hinzugefügten benutzerdefinierten Methoden kann in jeder Seite oder Komponente über `this.app` zugegriffen werden:

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// Verwendung auf einer Seite oder Komponente
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("Benutzer ist angemeldet");
}
```

### 2. Zugriff auf Anwendungseigenschaften

```javascript
// Aktuelle Seite abrufen
const currentPage = this.app.current;

// Router-Verlauf abrufen
const routers = this.app.routers;

// Auf globale Daten zugreifen
const user = this.app.globalData?.user;
```

### 3. Navigationsmethoden aufrufen

```javascript
// Seitenwechsel
this.app.goto("./about.html");

// Zurück zur vorherigen Seite
this.app.back();

// Aktuelle Seite ersetzen
this.app.replace("./login.html");
```

### 4. Überwachen von Anwendungsereignissen

```javascript
// Routing-Änderungen überwachen
this.app.on("router-change", (e) => {
  console.log("Routing-Änderung:", e.data);
});
```

## Detaillierte Dokumentation

Informationen darüber, wie Sie die Initialisierungslogik der Anwendung in `app-config.js` konfigurieren und benutzerdefinierte Methoden hinzufügen, finden Sie unter:

- **[App-Initialisierung](../../documentation/app-initialization.md)** - Ausführliche Beschreibung der Verwendung der Konfigurationsoptionen `ready` und `proto`
- **[Routing und Navigation](../../documentation/app-navigation.md)** - Ausführliche Beschreibung der Navigationsmethoden und des Routen-Listening der App

## Häufig verwendete Eigenschaften und Methoden von Anwendungsinstanzen

| Eigenschaft/Methode | Beschreibung |
|---------------------|-------------|
| `current` | Aktuelle Seiteninstanz |
| `routers` | Verlauf der Route |
| `globalData` | Globale Daten (müssen selbst in `ready` initialisiert werden) |
| `goto(src)` | Zur angegebenen Seite springen |
| `back()` | Zur vorherigen Seite zurückkehren |
| `replace(src)` | Aktuelle Seite ersetzen |
| `forward()` | Zur nächsten Seite vorwärts gehen |
| `on(event, callback)` | Anwendungsereignisse abhören |
| Benutzerdefinierte Methode | Methoden, die über die `proto`-Konfiguration hinzugefügt werden |