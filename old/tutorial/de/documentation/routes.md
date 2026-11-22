# Single-Page-Anwendung

Eine Single-Page-Anwendung bindet die `o-app`-Komponente an die Adressleiste des Browsers, sodass die URL der Webseite mit den Seitenpfaden innerhalb der Anwendung synchron bleibt. Nach dem Aktivieren der Single-Page-Anwendung:

- Das Aktualisieren der Webseite kann den aktuellen Routenstatus beibehalten.
- Durch Kopieren der URL in der Adressleiste und Öffnen in einem anderen Browser oder Tab kann der Anwendungsstatus ebenfalls wiederhergestellt werden.
- Die Vorwärts-/Rückwärts-Schaltflächen des Browsers funktionieren normal.

## Grundlegende Verwendung

Verwenden Sie die offizielle `o-router`-Komponente, um die `o-app`-Komponente zu umschließen, und schon erhalten Sie eine Single-Page-Anwendung.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body Eigenschaft

Fügen Sie das Attribut `fix-body` hinzu, dann wird `o-router` automatisch die Stile von `html` und `body` zurücksetzen und die standardmäßigen Ränder und Abstände entfernen.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Dies ist besonders nützlich in den folgenden Szenarien:- Erfordert, dass `o-app` den Viewport vollständig ausfüllt
- Wenn die Anwendung der einzige Inhalt der Seite ist

## Beispiel

<o-playground name="Einseitige Anwendungsdemo" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // Startseite der Anwendung
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

## Funktionsweise

Implementierung des browserbasierten Hash-Modus für Single-Page-Anwendungen:

1. Wenn innerhalb der Anwendung ein Seitenwechsel stattfindet, aktualisiert `o-router` automatisch den Hash-Wert in der Adressleiste (z. B. `#/about.html`).
2. Wenn der Benutzer die Seite aktualisiert oder über eine URL darauf zugreift, liest `o-router` den Hash-Wert und lädt die entsprechende Seite.
3. Die Vorwärts-/Rückwärts-Schaltflächen des Browsers lösen eine Änderung des Hash-Werts aus und steuern so die Seitennavigation der Anwendung.

## URL-Änderungsbeispiele

Angenommen, die Anwendung hat zwei Seiten: `home.html` und `about.html`:

| Benutzeraktion | Adressleistenänderung |
|---------|-----------|
| App öffnen | `index.html` → `index.html#/home.html` |
| Zur Über-Seite navigieren | `index.html#/home.html` → `index.html#/about.html` |
| Zurück klicken | `index.html#/about.html` → `index.html#/home.html` |
| Seite aktualisieren | Aktuellen Hash beibehalten |## Nutzungsbeschränkungen

- Ein Single-Page-Application kann nur mit **einer** `o-app`-Komponente verwendet werden