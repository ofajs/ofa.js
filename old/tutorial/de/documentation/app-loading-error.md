# Laden und Fehlerbehandlung

Während der Ausführung der App kann das Laden der Seite Zeit in Anspruch nehmen, und es kann auch zu Ladefehlern kommen. `app-config.js` bietet die Konfigurationsoptionen `loading` und `fail`, um diese Szenarien zu behandeln.

## loading - Ladezustand

`loading` Konfigurationselement wird verwendet, um Inhalte anzuzeigen, die während des Seitenladevorgangs angezeigt werden, um die Benutzererfahrung zu verbessern.

### Einfache Stringvorlage

Der einfachste Weg ist die Verwendung von Zeichenfolgenvorlagen:

```javascript
export const loading = "<div class='loading'>Wird geladen...</div>";
```

### Dynamische Funktionsgenerierung

Mit Funktionen können komplexere Ladekomponenten dynamisch generiert werden:

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>Laden...</span>
  </div>`;
};
```

### Fortschrittsbalken-Beispiel

Nachfolgend ist ein schöner Fortschrittsbalken-Ladeeffekt:

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

Diese Fortschrittsbalken-Implementierung:- Beim Laden der Seite wächst der Fortschrittsbalken langsam von 0% auf 98%
- Nachdem die Seite vollständig geladen ist, springt der Fortschrittsbalken schnell auf 100% und verschwindet
- Verwendung von sanften Übergangsanimationen

### Benutzerdefinierte Ladeanimation

**Rotierende Ladeanimation:**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**Skelettbildschirm-Laden:**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - Fehlerbehandlung

`fail`-Konfigurationselement wird für die Fehlermeldungskomponente verwendet, die angezeigt wird, wenn das Laden der Seite fehlschlägt.

### Grundlegende Verwendung

Die `fail`-Funktion erhält ein Objektargument, das Folgendes enthält:- `src` - die Adresse der Fehlerseite
- `error` - das Fehlerinformationsobjekt

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>Seite konnte nicht geladen werden</h3>
    <p>Adresse: ${src}</p>
    <p>Fehler: ${error.message}</p>
    <button on:click="back()">Zurück zur vorherigen Seite</button>
  </div>`;
};
```

### Vollständiges Fehlerbehandlungsbeispiel

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">Laden der Seite fehlgeschlagen</h2>
    <p style="color: #666; margin-bottom: 20px;">Die Seite kann nicht geladen werden: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      Fehlermeldung: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        Zurück zur vorherigen Seite
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        Zur Startseite
      </button>
    </div>
  </div>`;
};
```

### Fehlertypbehandlung

Es können je nach Fehlertyp verschiedene Hinweise angezeigt werden:

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "Unbekannter Fehler";
  
  if (error.message.includes("404")) {
    errorMessage = "Seite nicht gefunden";
  } else if (error.message.includes("timeout")) {
    errorMessage = "Ladevorgang abgelaufen, bitte überprüfen Sie die Netzwerkverbindung";
  } else if (error.message.includes("network")) {
    errorMessage = "Netzwerkfehler, bitte versuchen Sie es später erneut";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>Es ist ein Fehler aufgetreten</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">Zurück</button>
  </div>`;
};
```

## Vollständiges Beispiel

<o-playground name="Lade- und Fehlerbehandlungsbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Startseitenadresse der App
    export const home = "./home.html";
    // Konfiguration für Seitenwechselanimationen
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>Seitenladefehler</h3>
        <p>Adresse: ${src}</p>
        <p>Fehler: ${error.message}</p>
        <button on:click="back()">Zurück zur vorherigen Seite</button>
      </div>`;
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
      <a href="./about.html" olink>Zu Über uns</a>
      <br><br>
      <a href="./not-exist.html" olink>Zu nicht existierender Seite</a>
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

