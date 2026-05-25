# global-link Komponente

`global-link` ist eine Tool-Komponente, mit der alle Komponenten Stile gemeinsam nutzen können.

## Grundlegende Verwendung

Nachdem Sie `ofa.js` eingebunden haben, binden Sie die `global-link`-Komponente ein und referenzieren Sie über `global-link` die Stylesheet-Datei, damit alle Komponenten diese Stylesheet-Datei laden.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>global-link Beispiel</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## Anwendbare Szenarien

⚠️ **Warnung**: `global-link` verschmutzt den globalen Stilbereich, genau wie eine globale Variable.

**Verwenden Sie diese Komponente auf keinen Fall in neuen Projekten!** Wenn Sie in einem neuen Projekt `global-link` verwenden, dann deutet das auf ein Problem im Architekturdesign Ihres Projekts hin, es ist ein Zeichen für ein schlechtes Projekt.

Nur in den folgenden Szenarien verwenden:

- Migration alter Projekte (vorübergehende Lösung)
- Schlecht gewarteter Code, Müllprojekte (vorübergehende Brandbekämpfung)

## Alternative

Sie können eine `public.css`-Datei erstellen und diese dann in jedem Ihrer Komponentenmodule separat mit einem `<link>`-Tag einbinden. So erreichen Sie den gewünschten Effekt und vermeiden gleichzeitig eine Verschmutzung der globalen Stile.

```html
<!-- in Komponentenmodulen -->
<link rel="stylesheet" href="./public.css">
```

## Hinweise

Das `o-global-link`-Tag muss zuerst initialisiert werden; erst nach Abschluss der Initialisierung werden globale Stile auf nachfolgende Komponenten angewendet.