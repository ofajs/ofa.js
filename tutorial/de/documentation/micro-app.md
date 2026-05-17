# Mikro-App

`o-app` ist die zentrale Container-Komponente in ofa.js, die zur Erstellung unabhängiger Micro-Apps dient. Sie lädt die Konfigurationsdatei `app-config.js`, die verschiedene Verhaltensweisen der App definiert.

## Grundlegende Verwendung

Verwenden Sie das `o-app`-Tag in HTML, um eine Mikro-App zu erstellen:

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

## Konfigurationsdatei erstellen

Erstellen Sie die Datei `app-config.js` und definieren Sie die grundlegende Konfiguration der Anwendung:

```javascript
// app-config.js

// Startseite der App (erforderlich)
export const home = "./home.html";

// Konfiguration der Seitenwechselanimation (optional)
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

<o-playground name="Micro-App-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseiten-Adresse der App
    export const home = "./home.html";
    // Konfiguration der Seitenübergangs-Animation
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
      <a href="./about.html?id=10010" olink>Zu About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Zu About (10030)</a>
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
      <p>{{val}}</p>
      <p> Über <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (von ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Seitennavigation

### Verwendung des olink-Attributs

Innerhalb von `o-app` verwenden Sie das `<a>`-Tag mit dem `olink`-Attribut, um zwischen Seiten zu wechseln:

```html
<a href="./about.html" olink>Zur Über-Seite springen</a>
```

`olink` löst den Routenwechsel der Anwendung aus, inklusive Übergangsanimation, ohne die gesamte Seite neu zu laden.

### Programmatische Navigation

In Seitenkomponenten können Navigationsmethoden verwendet werden:

```javascript
// Zur angegebenen Seite springen
this.goto("./about.html");

// Aktuelle Seite ersetzen (nicht zum Verlauf hinzufügen)
this.replace("./about.html");

// Zur vorherigen Seite zurückkehren
this.back();
```

## Seitenparameterübergabe

Über URL-Query Parameter übergeben, die Zielseite empfängt sie über den `query`-Parameter der Modulfunktion:

**Seite senden:**

```html
<a href="./detail.html?id=123" olink>Details anzeigen</a>
```

**Empfangsseite:**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## Detaillierte Erklärung der Konfigurationsdatei

`app-config.js` unterstützt eine Vielzahl von Konfigurationsoptionen, um das Verhalten der App zu steuern：

| Konfigurationselement | Erforderlich? | Beschreibung |
|--------|----------|------|
| `home` | Erforderlich | Adresse der Startseite der App |
| `pageAnime` | Optional | Konfiguration für Seitenübergangsanimationen |
| `loading` | Optional | Inhalt, der beim Laden der Seite angezeigt wird |
| `fail` | Optional | Inhalt, der bei Fehlern beim Laden der Seite angezeigt wird |
| `ready` | Optional | Callback nach Abschluss der App-Initialisierung |
| `proto` | Optional | Methoden und Eigenschaften, die dem App-Prototyp hinzugefügt werden |
| `allowForward` | Optional | Ob die Vorwärtsfunktion des Browsers aktiviert wird |## Micro-App-Funktionen

### Unabhängigkeit

Jede `o-app`-Instanz ist eine unabhängige Mikro-App und hat eigene:- Routenverlauf
- Seitenstapel
- Statusverwaltung
- Konfigurationsoptionen

### Verschachtelte Verwendung

`o-app` kann verschachtelt verwendet werden, um komplexe Anwendungsstrukturen zu realisieren：

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### Unterschiede zu Komponenten

`o-app` Hauptunterschiede zu normalen Komponenten:

| Eigenschaft | o-app | Normale Komponente |
|------|-------|----------|
| Routenverwaltung | ✅ Integriertes Routensystem | ❌ Keine |
| Seiten-Stack | ✅ Verwaltet Seitenverlauf | ❌ Keine |
| Konfigurationsdatei | ✅ Unabhängige Konfiguration | ❌ Keine |
| Seitenwechsel-Animation | ✅ Unterstützt | ❌ Keine |
| Geeigneter Einsatzbereich | Anwendungscontainer | Funktionskomponente |