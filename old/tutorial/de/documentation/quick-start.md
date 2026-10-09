# Schnellstart

Dieser Abschnitt zeigt Ihnen, wie Sie schnell mit ofa.js beginnen können. In den folgenden Tutorials werden wir den Schritt der Erstellung der index.html-Einstiegsdatei auslassen und nur den Code der Seitenmoduldateien zeigen. Sie können direkt auf Basis der Vorlage entwickeln.

## Vorbereitung der Basisdokumente

Um schnell mit ofa.js zu beginnen, erstellen Sie einfach ein **Seitenmodul** und kombinieren Sie es mit einer Einstiegs-HTML. Die benötigten Kern-Dateien sind wie folgt:

- `index.html`: Die Einstiegsdatei der Anwendung, die das ofa.js-Framework lädt und das Seitenmodul einbindet
- `demo-page.html`: Die Seitenmoduldatei, die den konkreten Inhalt, die Stile und die Datenlogik der Seite definiert

### index.html (Anwendungseingang)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Beispiel</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

Die Hauptfunktion dieser Datei ist:- Einbindung des ofa.js-Frameworks
- Verwenden der `<o-page>` Komponente zum Laden und Rendern des Seitenmoduls

### demo-page.html (Seitenmodul)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hallo ofa.js Demo-Code",
        },
      };
    };
  </script>
</template>
```

Diese Datei definiert eine einfache Seitenkomponente, die Folgendes enthält:- `<template page>`-Tag, definiert ein Seitenmodul
- CSS-Stile (unter Verwendung des `:host`-Selektors von Shadow DOM)
- Datenbindungsausdruck `{{val}}`
- JavaScript-Logik, die ein Objekt mit Anfangsdaten zurückgibt


## Online-Demo

Hier ist ein Live-Beispiel im Online-Editor, bei dem Sie den Code direkt ändern und das Ergebnis anzeigen können:

<o-playground name="Online-Demo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Wir definieren Stile durch das `<style>`-Tag innerhalb der Komponente. Diese internen Stile wirken nur innerhalb der Komponente, haben eine gute Kapselung und beeinflussen keine anderen Elemente auf der Seite.

Dabei wird der `:host`-Selektor verwendet, um den Stil des Host-Elements der Komponente zu definieren. Hier setzen wir die Komponente als Blockelement und fügen einen roten Rand und einen Innenabstand von 10px hinzu.

Mit dem Ausdruck `{{key}}` kann der entsprechende Wert aus den Komponentendaten auf die Seite gerendert werden.

Jetzt haben Sie erfolgreich Ihre erste ofa.js-Anwendung erstellt! Als Nächstes lassen Sie uns die Template-Rendering-Syntax und die erweiterten Funktionen von ofa.js vertiefen.