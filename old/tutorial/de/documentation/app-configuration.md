# Anwendungskonfiguration

`app-config.js` Konfigurationsdatei unterstützt neben der Startseiten-URL und der Seitenübergangsanimation weitere Konfigurationsoptionen zur Steuerung des Ladezustands der Anwendung, der Fehlerbehandlung, der Initialisierungslogik und der Navigationsfunktionen.

```javascript
// app-config.js
// Angezeigter Inhalt beim Laden
export const loading = () => "<div>Loading...</div>";

// Komponente, die bei fehlgeschlagenem Laden angezeigt wird
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Rückruf nach Abschluss der App-Initialisierung
export const ready() {
  console.log("App is ready!");
}

// Methoden und Eigenschaften zum App-Prototyp hinzugefügt
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Anwendungskonfigurationsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseitenadresse der Anwendung
    export const home = "./home.html";
    // Seitenwechsel-Animationseinstellungen
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
};
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## loading - Ladezustand

Die Komponente, die während des Seitenladevorgangs angezeigt wird, kann eine String-Vorlage oder eine Funktion sein, die eine Vorlage zurückgibt.

```javascript
// Einfacher String-Template
export const loading = "<div class='loading'>Loading...</div>";

// Mit Funktion dynamisch erzeugen
export const loading = () => {
  return `<div class='loading'>
    <span>Ladevorgang läuft...</span>
  </div>`;
};
```

Unten ist eine schöne und direkt in Projekte kopierbare Loading-Implementierung:

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - Fehlerbehandlung

Komponente, die angezeigt wird, wenn das Seitenladen fehlschlägt. Die Funktion empfängt ein Objekt als Parameter, das `src` (Adresse der fehlgeschlagenen Seite) und `error` (Fehlermeldung) enthält.

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Seite konnte nicht geladen werden</p>
    <p>Adresse: ${src}</p>
    <button on:click="back()">Zurück</button>
  </div>`;
};
```

## proto - Prototyp-Erweiterung

Fügen Sie benutzerdefinierte Methoden und berechnete Eigenschaften zur App-Instanz hinzu, die in Seitenkomponenten über `this.app` zugegriffen werden können.

```javascript
export const proto = {
  // Benutzerdefinierte Methode
  navigateToHome() {
    this.goto("home.html");
  },
  // Berechnete Eigenschaft
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

In der Seite aufrufen:

```html
<template page>
  <button on:click="app.navigateToHome()">Zurück zur Startseite</button>
  <p>Ist auf der Startseite: {{app.isAtHome}}</p>
</template>
```

## ready - Initialisierungsrückruf

Die Callback-Funktion wird nach dem Laden der Anwendungskonfiguration ausgeführt; hier können Initialisierungsvorgänge vorgenommen werden. Über `this` kann auf Methoden und Eigenschaften der Anwendungsinstanz zugegriffen werden.

```javascript
export const ready() {
  console.log("Anwendung initialisiert");
  // this (o-app Elementinstanz) kann zugegriffen werden
  console.log(this.current); // Aktuelle Seite o-page Elementinstanz abrufen
  // this.someMethod();
}
```

## allowForward - Vorwärtsfunktion

Steuert, ob die Browser-Vorwärts-Funktion aktiviert ist. Nach dem Setzen auf `true` können die Zurück- und Vorwärts-Buttons des Browsers zur Navigation verwendet werden.

```javascript
export const allowForward = true;
```

Wenn aktiviert, kann der Benutzer über die Vorwärts-/Rückwärts-Schaltflächen des Browsers navigieren, und die Navigationsmethode `forward()` der Anwendung wird ebenfalls wirksam.

## Programmatische Navigation

Neben der Verwendung von `olink`-Links können Sie auch die Navigationsmethode in JavaScript aufrufen:

```javascript
// Zur angegebenen Seite springen (zum Verlauf hinzufügen)
this.goto("./about.html");

// Aktuelle Seite ersetzen (nicht zum Verlauf hinzufügen)
this.replace("./about.html");

// Zur vorherigen Seite zurückkehren
this.back();

// Zur nächsten Seite gehen (erfordert allowForward: true)
this.forward();
```

## Router-Verlauf

Über die Eigenschaft `routers` kann der Browserverlauf abgerufen werden:

```javascript
// Alle Router-Historie abrufen
const history = app.routers;
// Rückgabeformat: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Aktuelle Seite abrufen
const currentPage = app.current;
```

## Überwachung von Routenänderungen

Sie können auf Routenänderungen reagieren, indem Sie das Ereignis `router-change` abhören:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Routeränderung:", data.name); // goto, replace, forward, back
  console.log("Seitenadresse:", data.src);
});
```