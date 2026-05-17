# Routing und Navigation

Die Seitennavigation innerhalb der App ist die Kernfunktion einer Single-Page-Anwendung. In diesem Kapitel wird erläutert, wie man programmatische Navigation verwendet, den Routenverlauf verwaltet und auf Routenänderungen lauscht.

## allowForward - Vorwärtsfunktion

Standardmäßig unterstützt die App nur die Rückwärtsnavigation. Wenn Sie in `app-config.js` `allowForward` auf `true` setzen, können Sie die Vorwärtsfunktion der App aktivieren.

```javascript
// app-config.js
export const allowForward = true;
```

Nach der Aktivierung:

- Benutzer können die Vor- und Zurück-Schaltflächen des Browsers zur Navigation verwenden
- Die `forward()`-Methode der Anwendung funktioniert einwandfrei

## Programmatische Navigation

Neben Links, die das `olink`-Attribut verwenden, können Navigationsmethoden auch in JavaScript aufgerufen werden.

### goto - Seite wechseln

Zur angegebenen Seite navigieren und zum Verlauf hinzufügen:

```javascript
// Zur angegebenen Seite springen
this.goto("./about.html");

// Mit Parameter springen
this.goto("./detail.html?id=123");
```

### replace - Seite ersetzen

Aktuelle Seite ersetzen, nicht zum Verlauf hinzufügen:

```javascript
// Aktuelle Seite ersetzen
this.replace("./login.html");
```

Wird häufig nach dem Login für die Weiterleitung verwendet, um zu verhindern, dass der Benutzer durch Klicken auf die Zurück-Taste zur Login-Seite zurückkehrt.

### back - zurück

Zurück zur vorherigen Seite:

```javascript
this.back();
```

### forward - Vorwärts

Zur nächsten Seite gehen (muss `allowForward: true` gesetzt werden):

```javascript
// Auf Seite oder Komponente aufrufen
this.app.forward();
```

> **Hinweis**: Die `forward`-Methode muss auf der Anwendungsinstanz (`app`) aufgerufen werden, nicht auf der Seiteninstanz. Verwenden Sie z.B. `this.app.forward()` anstelle von `this.forward()`.

### Vergleich der Navigationsmethoden

| Methode   | Verlauf      | Verwendungsszenario              |
| --------- | ------------ | -------------------------------- |
| `goto`    | Neuer Eintrag| Normales Seiten-Navigieren       |
| `replace` | Aktuellen Eintrag ersetzen | Navigation nach Login, Weiterleitung |
| `back`    | Zum vorherigen Eintrag zurück | Zurück-Operation           |
| `forward` | Zum nächsten Eintrag vorwärts | Vorwärts-Operation (bei Aktivierung) |## Router-Verlauf

### Routing-Verlauf abrufen

Abrufen aller Routing-Verläufe über die `routers`-Eigenschaft:

```javascript
const history = app.routers;
// Rückgabeformat: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### Aktuelle Seite abrufen

Über die Eigenschaft `current` die aktuelle Seiteninstanz abrufen:

```javascript
const currentPage = app.current;
console.log("Aktuelle Seite:", currentPage.src);
```

### Routing-Verlaufsbeispiel

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // Muss zusammen mit allowForward verwendet werden
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## Überwachung von Routenänderungen

Durch das Abhören des `router-change` Ereignisses auf Routenänderungen reagieren.

### Grundlegende Verwendung

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Routing-Änderung:", data.name);
  console.log("Seitenadresse:", data.src);
});
```

### Ereignisdaten

`router-change`Ereignis-Datenobjekt enthält：

| Attribut | Beschreibung           | Mögliche Werte                      |
| -------- | ---------------------- | ----------------------------------- |
| `name`   | Navigationstyp         | `goto`, `replace`, `forward`, `back` |
| `src`    | Zielseitenadresse      | Seitenpfad                          |### Verwendungsbeispiele

```javascript
export const ready = function () {
  // Überwacht Routenänderungen
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // Seitenzugriff protokollieren
    console.log(`[${name}] Navigiere zu: ${src}`);

    // Seitentitel aktualisieren
    this.updateTitle(src);

    // Statistikdaten senden
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "Startseite",
      "about.html": "Über uns",
      "contact.html": "Kontakt",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "Anwendung";
  },

  trackPageView(src) {
    // Seitenzugriffsstatistik senden
    console.log("Seitenzugriffsstatistik:", src);
  },
};
```

## Seiten-Navigationswächter

Durch die Kombination mit der Routenüberwachung kann eine Navigationsschutzfunktion implementiert werden:

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // Prüfen, ob eine Anmeldung erforderlich ist
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## Vollständiges Beispiel

<o-playground name="Routing- und Navigationsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseite der App
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("App initialisiert");
      this.on("router-change", (e) => {
        console.log("Route geändert:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
      },
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
      <p>Anzahl der Routen-Verläufe: {{app.routerCount}}</p>
      <a href="./about.html" olink>Zu About</a>
      <br><br>
      <button on:click="gotoAbout">Programmgesteuerte Navigation</button>
      <br><br>
      <button on:click="goForward()">Vorwärts</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hallo ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
            },
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
      <div style="padding: 8px;">
        <button on:click="back()">Zurück</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>Anzahl der Routen-Verläufe: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">Hinweis: Nach Klick auf "Zurück" kannst du auf der Startseite "Vorwärts" klicken, um hierher zurückzukehren.</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hallo ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

