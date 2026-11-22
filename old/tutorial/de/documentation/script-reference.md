# Skript-Import

ofa.js kann direkt über ein script-Tag eingebunden werden. Fügen Sie dazu einfach folgenden Code im `<head>`- oder `<body>`-Bereich Ihrer HTML-Datei ein:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Grundlegende Verwendung

Nach Einführung des Skripts erstellt ofa.js eine `$`-Variable im globalen Gültigkeitsbereich, über die alle Kernfunktionen bereitgestellt werden. Sie können über dieses Objekt auf verschiedene Methoden und Eigenschaften von ofa.js zugreifen. Die folgenden Tutorials werden die spezifische Verwendung im Detail erläutern.

## Debug-Modus

Während der Entwicklung können Sie den Debug-Modus aktivieren, indem Sie dem Skript-URL den Parameter `#debug` anhängen:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Der Debug-Modus aktiviert die Source Map-Funktion, sodass Sie in den Browser-Entwicklertools den ursprünglichen Quellcode der Dateien direkt anzeigen und debuggen können, was die Entwicklungseffizienz erheblich steigert.

## ESM-Modul

ofa.js unterstützt auch die Einbindung über ESM-Module. Sie können ofa.js in Ihrem Projekt mit einer `import`-Anweisung einbinden:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

Bei Verwendung von ESM-Modulen können Sie die Variable `$` direkt im Code verwenden, ohne auf den globalen Geltungsbereich zugreifen zu müssen.