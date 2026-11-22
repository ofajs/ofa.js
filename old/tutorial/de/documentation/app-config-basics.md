# Grundlagen der Anwendungskonfiguration

`app-config.js` Konfigurationsdatei wird verwendet, um verschiedene Verhaltensweisen der Anwendung zu definieren. Dieses Kapitel stellt die grundlegende Struktur der Konfigurationsdatei und alle verfügbaren Konfigurationsoptionen vor.

## Konfigurationsdateistruktur

Erstellen Sie die Datei `app-config.js` und exportieren Sie Konfigurationselemente mit ES6-Modul-Syntax:

```javascript
// app-config.js

// Startseitenadresse der App (erforderlich)
export const home = "./home.html";

// Konfiguration der Seitenwechsel-Animation (optional)
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

// Ladezustand (optional)
export const loading = () => {
  return "<div>Loading...</div>";
};

// Fehlerbehandlung (optional)
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// App-Initialisierung (optional)
export const ready = function() {
  console.log("App is ready");
};

// Prototyp-Erweiterung (optional)
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// Vorwärtsfunktion aktivieren (optional)
export const allowForward = true;
```

## Konfigurationselemente-Übersicht

`app-config.js` unterstützt die folgenden Konfigurationsoptionen:

| Konfigurationsoption | Erforderlich | Beschreibung | Detaillierte Dokumentation |
|--------|----------|------|----------|
| `home` | ✅ Erforderlich | Startseiten-Adresse der App | Dieses Kapitel |
| `pageAnime` | Optional | Konfiguration der Seitenübergangsanimation | [Seitenübergangsanimation](./page-transition-animation.md) |
| `loading` | Optional | Inhalt, der beim Laden der Seite angezeigt wird | [Laden und Fehlerbehandlung](./app-loading-error.md) |
| `fail` | Optional | Inhalt, der bei fehlgeschlagenem Laden der Seite angezeigt wird | [Laden und Fehlerbehandlung](./app-loading-error.md) |
| `ready` | Optional | Callback nach Abschluss der App-Initialisierung | [App-Initialisierung](./app-initialization.md) |
| `proto` | Optional | Methoden und Eigenschaften, die dem App-Prototypen hinzugefügt werden | [App-Initialisierung](./app-initialization.md) |
| `allowForward` | Optional | Aktiviert die Vorwärtsfunktion des Browsers | [Routing und Navigation](./app-navigation.md) |## home - Startseitenadresse

`home` ist eine erforderliche Konfigurationsoption, die den Pfad des Home-Moduls angibt, das beim Anwendungsstart geladen wird.

```javascript
export const home = "./pages/home.html";
```

**Pfadregeln:**- Unterstützt relative Pfade（bezogen auf die `app-config.js`-Datei）
- Unterstützt absolute Pfade
- Der Pfad verweist auf eine Seitenmoduldatei（`.html`-Datei）

## pageAnime - Seitenwechsel-Animation

`pageAnime` ist eine optionale Konfigurationsoption, die die Übergangsanimation beim Seitenwechsel steuert.

### Grundlegende Verwendung

```javascript
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
```

### Erläuterung der Animationszustände

Die Seitenwechselanimation umfasst drei Zustände:

| Status | Beschreibung | Auslösezeitpunkt |
|------|------|----------|
| `current` | Stil nach Ende der Animation der aktuellen Seite | Nach Abschluss des Seitenwechsels |
| `next` | Anfangsstil beim Einblenden einer neuen Seite | Wenn die neue Seite zu erscheinen beginnt |
| `previous` | Zielstil beim Verlassen der alten Seite | Wenn die alte Seite zu verschwinden beginnt |### Weitere Animationseffekte

Seitenwechselanimationen unterstützen mehrere Effekte, einschließlich:- Links-/Rechtswischen (Standard)
- Ein-/Ausblenden
- Hoch-/Runterswischen
- Zoomeffekt
- Umdreheffekt
- Benutzerdefinierte Animation

Detaillierte Konfiguration der Animationen und Beispiele für Effekte finden Sie im Kapitel [Seitenübergangsanimation](./page-transition-animation.md).

## Konfigurationsdateien in HTML verwenden

In einer HTML-Datei wird die Konfigurationsdatei über das `o-app`-Tag eingebunden:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="Grundlegendes Beispiel für Anwendungskonfiguration" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Adresse der Startseite der Anwendung
    export const home = "./home.html";
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
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Zu About</a>
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
      <div style="padding: 8px;"> <button on:click="back()">Zurück</button> </div>
      <p> Über <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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

