# Seitenübergangsanimation

`pageAnime` Konfigurationselement wird verwendet, um die Übergangsanimationen beim Seitenwechsel zu steuern und die Benutzererfahrung zu verbessern.

## Grundkonfiguration

Konfiguriere die Seitenübergangsanimation in `app-config.js`:

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

## Animationsstatus

Die Seitenwechselanimation umfasst drei Zustände:

| Status | Beschreibung | Auslösezeitpunkt |
|------|------|----------|
| `current` | Stil nach Ende der Animation der aktuellen Seite | Nach Abschluss des Seitenwechsels |
| `next` | Anfangsstil beim Einblenden einer neuen Seite | Wenn die neue Seite zu erscheinen beginnt |
| `previous` | Zielstil beim Verlassen der alten Seite | Wenn die alte Seite zu verschwinden beginnt |### Statusdetails

**current（aktueller Status）**- Endgültiger Stil nach Abschluss des Seitenwechsels
- In der Regel der normale Anzeigezustand der Seite
- Zum Beispiel: `opacity: 1, transform: "translate(0, 0)"`

**Nächster (Status der nächsten Seite)**- Initialer Stil beim Betreten einer neuen Seite
- Wird verwendet, um zu definieren, von wo aus eine neue Seite betreten wird
- Zum Beispiel: `opacity: 0, transform: "translate(30px, 0)"` bedeutet, dass die Seite von rechts eintritt

**vorherige（vorheriger Seitenstatus）**- Zielstil beim Verlassen der alten Seite
- Dient zur Definition, wohin die alte Seite gehen soll
- Beispiel: `opacity: 0, transform: "translate(-30px, 0)"` bedeutet, dass sie nach links verschwindet

## Integrierte Animationseffekte

### Horizontal wischen (Standard)

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

Wirkungserklärung:- Neue Seite gleitet von rechts herein (Startposition 30px rechts, Deckkraft 0)
- Alte Seite gleitet nach links heraus (Endposition -30px links, Deckkraft 0)
- Schließlich kehren beide Seiten in ihre normale Position zurück (Deckkraft 1, Position 0)

### Ein- und Ausblenden

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

Wirkungserklärung:- Neue Seite blendet von transparent zu sichtbar ein
- Alte Seite blendet von sichtbar zu transparent aus
- Geeignet für einen klaren, eleganten Anwendungsstil

### Nach oben und unten wischen

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

Wirkungserklärung:- Neue Seite gleitet von unten herein
- Alte Seite gleitet nach oben hinaus
- Geeignet für Anwendungen mit vertikalem Scroll-Stil

### Zoom-Effekt

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

Wirkungserklärung:- Neue Seite vergrößert sich von klein auf Normalgröße
- Alte Seite vergrößert sich von Normalgröße und verschwindet
- Geeignet für Apps mit Karten- oder Modal-Stil

### Kippeffekt

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

Wirkungserklärung:- Neue Seite klappt von links herein
- Alte Seite klappt nach rechts heraus
- Geeignet für Anwendungen mit 3D-Effekten

## Benutzerdefinierte Animation

### Kombinieren mehrerer Attribute

Es können mehrere CSS-Eigenschaften kombiniert werden, um komplexe Animationen zu erstellen:

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### Verschiedene Easing-Funktionen verwenden

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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

## Unterstützte CSS-Eigenschaften

`pageAnime` unterstützt alle CSS-animierbaren Eigenschaften:

### Allgemeine Eigenschaften

- `opacity` - Deckkraft (0-1)
- `transform` - Transformation
  - `translate(x, y)` - Verschiebung
  - `scale(n)` - Skalierung
  - `rotate(deg)` - Drehung
  - `rotateX/Y(deg)` - 3D-Drehung
- `width` / `height` - Breite/Höhe
- `margin` / `padding` - Außenabstand/Innenabstand
- `background-color` - Hintergrundfarbe
- `border-radius` - Rahmenradius

### Hinweise

1. **Leistungsoptimierung**: Bevorzugen Sie `transform` und `opacity`, da sie die beste Leistung bieten
2. **Layout-Verschiebungen vermeiden**: Vermeiden Sie Eigenschaften, die Layout-Rückflüsse auslösen (z. B. `width`, `height`, `margin`)
3. **Übergangsdauer**: ofa.js fügt automatisch Übergangseffekte hinzu, standardmäßig 300ms

## Vollständiges Beispiel

<o-playground name="Seitenwechsel-Animation Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // App-Startseitenadresse
    export const home = "./home.html";
    // Seitenwechsel-Animation Konfiguration
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
      <a href="./about.html" olink>Go to About</a>
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

## Beste Praktiken

### 1. Animation einfach halten

Vermeiden Sie übermäßig komplexe Animationen; einfache Animationseffekte sind besser:

```javascript
// ✅ Empfohlen: Einfach und effektiv
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ Nicht empfohlen: Zu kompliziert
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. Berücksichtigung der Benutzererfahrung

- Die Animationsdauer sollte nicht zu lang sein（empfohlen 200-400ms）
- Vermeiden Sie Animationen, die Schwindel verursachen.
- Stellen Sie sicher, dass Animationen flüssig und ohne Ruckeln sind.

### 3. Anpassung an verschiedene Geräte

Erwägen Sie, Animationen auf Geräten mit geringer Leistung zu deaktivieren oder zu vereinfachen:

```javascript
// Erkennung der Geräteleistung
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```