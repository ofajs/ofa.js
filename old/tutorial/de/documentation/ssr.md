# SSR und isomorphes Rendering

> Wenn du nicht weißt, was SSR ist, bedeutet das, dass du es derzeit noch nicht benötigst. Du kannst dieses Kapitel überspringen und später darauf zurückkommen, wenn du es brauchst.

## Isomorphes Rendering

Um gleichzeitig die reibungslose CSR-Erfahrung, eine bessere Erkennung durch Webcrawler (SEO) und mehr Freiheit bei der Wahl der Backend-Programmiersprache zu gewährleisten, bietet ofa.js einen einzigartigen Modus für isomorphes Rendering (Symphony Client-Server Rendering).

> Um die spezifischen Definitionen und Unterschiede von CSR / SSR / SSG zu verstehen, lesen Sie bitte direkt das Kapitel am Ende dieses Artikels.

Die Kernidee des isomorphen Renderings ist:- Rendern des initialen Seiteninhalts auf dem Server, um SEO und Ladegeschwindigkeit der ersten Seite zu gewährleisten
- Übernahme der Routenverarbeitung auf dem Client, um eine flüssige Benutzererfahrung wie bei CSR zu erhalten
- Anwendbar in jeder Serverumgebung für echtes isomorphes Rendering

### Das Prinzip der Implementierung von isomorphem Rendering

Das isomorphe Rendering-Modell von ofa.js basiert auf dem folgenden Mechanismus:

1. Der Server generiert eine vollständige HTML-Seite mit einer universellen Laufzeitstruktur
2. Der Client lädt die CSR-Laufzeit-Engine
3. Die aktuelle Laufzeitumgebung wird automatisch erkannt, um das Rendering-Verfahren zu bestimmen

### Isomorphes Rendering-Code-Struktur

**Ursprüngliches CSR-Seitenmodul:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Vollständige Seite nach der Isomorphic-Rendering-Kapselung:**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Einfügeposition für Seitenmodul-Inhalte ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Du kannst also jede beliebige Entwicklungssprache (Go, Java, PHP, Nodejs, Python usw.) und jede beliebige Backend-Template-Rendering-Engine (wie Go's `html/template`, PHP's Smarty/Twig/Blade usw.) verwenden, um den isomorphen Rendering-Code-Struktur von ofa.js in das Template einzubetten, sodass SSR realisiert wird.

* [Nodejs SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR Beispiel](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Isomorphe Rendering-Vorlagenstruktur

Um den isomorphen Rendering-Modus zu implementieren, verwenden Sie einfach die folgende allgemeine Vorlagenstruktur auf der Serverseite:

```html
<!doctype html>
<html lang="de">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seitentitel</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Dynamisch den Inhalt des entsprechenden Seitenmoduls einfügen -->
  </o-app>
</body>

</html>
```

**Hinweis:** Der vom Server zurückgegebene HTML-Code muss den korrekten HTTP-Header setzen: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` ist die von ofa.js bereitgestellte isomorphe Rendering-Engine, die automatisch die Renderstrategie basierend auf dem aktuellen Seitenstatus bestimmt, um unter allen Umgebungen ein optimales Benutzererlebnis zu gewährleisten.

Gleichermaßen kann SSG diese Struktur auch anwenden, um statische Websites zu generieren.

## ofa.js und SSR sowie Unterschiede zu anderen Frontend-Frameworks

Die Symphony Client-Server Rendering (im Folgenden als SCSR bezeichnet) von ofa.js ist im Wesentlichen ebenfalls ein SSR-Modus.

Im Vergleich zu den SSR-Lösungen bestehender Frontend-Frameworks wie Vue, React, Angular usw. liegt der größte Vorteil von ofa.js darin, **dass es nicht zwingend an Node.js gebunden ist**. Dies bedeutet, dass jede beliebige Backend-Template-Engine (wie Smarty für PHP, Jinja2 für Python, Thymeleaf für Java usw.) problemlos ofa.js integrieren kann, um SSR zu realisieren.

## Übersicht der Webseiten-Rendering-Methoden

Moderne Webanwendungen verwenden hauptsächlich vier Rendering-Methoden: traditionelles serverseitiges Template-Engine-Rendering, CSR (Client Side Rendering, clientseitiges Rendering), SSR (Server Side Rendering, serverseitiges Rendering) und SSG (Static Site Generation, statische Seitengenerierung). Jede Methode hat ihre Vorteile und geeigneten Anwendungsszenarien.

### Rendering mit traditionellen serverseitigen Template-Engines

In zahlreichen Webprodukten sind serverseitige Template-Engines nach wie vor die gängigste Methode zur Seitendarstellung. Backend-Sprachen wie Go und PHP nutzen integrierte oder Drittanbieter-Template-Engines (z. B. Go's `html/template`, PHPs Smarty/Twig/Blade usw.), um dynamische Daten in HTML-Templates einzufügen, eine vollständige HTML-Seite zu generieren und an den Client zurückzugeben.

**Vorteile:**- SEO-freundlich, schnelles Laden des ersten Bildschirminhalts  
- Servergesteuert, höhere Sicherheit  
- Geringere Anforderungen an den Technologie-Stack des Teams, Backend-Entwickler können die Entwicklung eigenständig abschließen

**Nachteile：**- Schlechte Benutzererfahrung, bei jeder Interaktion ist ein Seiten-Refresh erforderlich
- Hohe Serverlast
- Hohe Kopplung zwischen Frontend und Backend, erschwert die Arbeitsteilung

### CSR (Client-Side Rendering)

Im CSR-Modus werden die Seiteninhalte vollständig vom clientseitigen JavaScript gerendert. Die [Single-Page-Anwendung](./routes.md) von ofa.js ist eine typische CSR-Implementierung. Diese Methode bietet ein flüssiges Benutzererlebnis, bei dem alle Interaktionen ohne Seitenwechsel erfolgen. Single-Page-Anwendungen (SPAs), die mit React oder Vue in Verbindung mit den entsprechenden Routing-Bibliotheken (wie React Router oder Vue Router) entwickelt wurden, sind ebenfalls typische CSR-Implementierungen.

**Vorteile:**- Flüssige Benutzererfahrung, Seitenwechsel ohne Neuladen
- Starke Client-Verarbeitungsfähigkeit, schnelle Reaktion

**Nachteile：**- nachteilig für SEO，Suchmaschinen haben Schwierigkeiten, den Inhalt zu indexieren

### SSR（Serverseitiges Rendern）

Beibehaltung der flüssigen CSR-Erfahrung bei gleichzeitigem Echtzeit-Rendering der Seite auf dem Server: Sobald der Nutzer eine Anfrage stellt, erzeugt der Server sofort vollständiges HTML und sendet es zurück – echtes Server-Side Rendering.

**Vorteile:**- SEO-freundlich, schnelles Laden des oberen Bildbereichs
- Unterstützung für dynamische Inhalte

**Nachteile：**- Hohe Serverlast
- In der Regel wird eine Node.js-Umgebung als Laufzeit benötigt, oder zumindest eine Node.js-Middleware-Schicht
- Es ist dennoch eine nachfolgende Client-Aktivierung erforderlich, um vollständige Interaktion zu erreichen

### SSG (Static Site Generation)

In der Build-Phase werden alle Seiten vorab als statische HTML-Dateien gerendert, die nach der Bereitstellung direkt vom Server an den Benutzer zurückgegeben werden können.

**Vorteile:**- Schnelle Erstladezeit, SEO-freundlich
- Geringe Serverlast, stabile Leistung
- Hohe Sicherheit

**Nachteile：**- Schwierigkeiten bei der Aktualisierung dynamischer Inhalte
- Die Build-Zeit erhöht sich mit der Anzahl der Seiten