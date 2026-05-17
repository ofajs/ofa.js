# App-Initialisierung

Die Anwendungsinitialisierungsphase kann einige globale Einstellungen ausführen, wie das Hinzufügen benutzerdefinierter Methoden, das Überwachen von Ereignissen usw. `app-config.js` stellt die beiden Konfigurationsoptionen `ready` und `proto` bereit, um die Initialisierungslogik zu verarbeiten.

## ready - Initialisierungsrückruf

`ready` ist die Callback-Funktion, die nach dem Laden der Anwendungskonfiguration ausgeführt wird, hier können Initialisierungsoperationen durchgeführt werden.

### Grundlegende Verwendung

```javascript
export const ready = function() {
  console.log("App wurde initialisiert");
  // this verweist auf die o-app-Elementinstanz
  console.log("Aktuelle Seite:", this.current);
};
```

> **Achtung**: `ready` muss als Funktionsdeklaration oder Funktionsausdruck verwendet werden, darf keine Pfeilfunktion sein (da eine korrekte `this`-Bindung erforderlich ist).

### Zugriff auf die Anwendungsinstanz

In der `ready`-Funktion zeigt `this` auf die `o-app`-Elementinstanz, sodass auf alle Methoden und Eigenschaften der Anwendung zugegriffen werden kann:

```javascript
export const ready = function() {
  // Aktuelle Seite abrufen
  console.log("Aktuelle Seite:", this.current);
  
  // Routing-Verlauf abrufen
  console.log("Routing-Verlauf:", this.routers);
  
  // Routing-Änderungen überwachen
  this.on("router-change", (e) => {
    console.log("Routing-Änderung:", e.data);
  });
};
```

### Initialisierungsbeispiel

```javascript
export const ready = function() {
  // Globalen Zustand initialisieren
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // Benutzerinformationen aus dem lokalen Speicher wiederherstellen
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // Auf Routenänderungen lauschen
  this.on("router-change", (e) => {
    // Seitenzugriff protokollieren
    console.log("Seitenzugriff:", e.data.src);
  });
};
```

## proto - Prototyp-Erweiterung

`proto` wird verwendet, um der App-Instanz benutzerdefinierte Methoden und berechnete Eigenschaften hinzuzufügen, auf die in allen Seiten über `this.app` zugegriffen werden kann.

### Benutzerdefinierte Methoden hinzufügen

```javascript
export const proto = {
  // Benutzerdefinierte Methoden
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // Methode mit Parameter
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### Berechnete Eigenschaften hinzufügen

```javascript
export const proto = {
  // Berechnete Eigenschaften
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### Vollständiges Beispiel

```javascript
export const proto = {
  // Navigationsmethoden
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // Berechnete Eigenschaften
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // Hilfsmethoden
  showMessage(message) {
    alert(message);
  },
};
```

## Auf der Seite verwenden

In Seitenkomponenten kann über `this.app` auf benutzerdefinierte Methoden und Eigenschaften der App-Instanz zugegriffen werden:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">Zur Startseite</button>
  <button on:click="app.navigateToProfile()">Persönliches Zentrum</button>
  
  <p>Auf der Startseite?: {{app.isAtHome}}</p>
  <p>Angemeldet?: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // Aufrufen der Methode einer App-Instanz
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## Globales Statusmanagement

Durch die Kombination von `ready` und `proto` lässt sich eine einfache globale Zustandsverwaltung realisieren:

```javascript
// app-config.js

export const ready = function() {
  // Globale Zustände initialisieren
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // Daten aus dem lokalen Speicher wiederherstellen
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // Benutzerbezogene Funktionen
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto="./login.html";
  },
  
  // Warenkorbbezogene Funktionen
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // Themenbezogene Funktionen
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## Vollständiges Beispiel

<o-playground name="Beispiel zur App-Initialisierung" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse der App-Startseite
    export const home = "./home.html";
    // Konfiguration der Seitenübergangsanimation
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
      console.log("App wurde initialisiert");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("Anzahl der Besuche:", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>Auf der Startseite: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">Zur Startseite</button>
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
      <p>Auf der Startseite: {{app.isAtHome}}</p>
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

