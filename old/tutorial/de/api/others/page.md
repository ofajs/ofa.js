# o-page Komponente

`o-page` ist eine der Kernkomponenten von ofa.js und repräsentiert eine eigenständige Seite oder ein Seitenmodul. Im Folgenden sind einige Schlüsseleigenschaften und -methoden von `o-page`:

## src Attribut

Das `src`-Attribut wird verwendet, um die konkrete Adresse des Seitenmoduls anzugeben. Es ist das Schlüsselattribut zur Festlegung von Inhalt und Verhalten der Seite und teilt der Anwendung mit, wo der Inhalt der jeweiligen Seite geladen werden soll.

```javascript
const page = this;
```

## goto-Methode

Die `goto`-Methode dient dazu, von der aktuellen Seite zu einer anderen Seite zu springen. Im Vergleich zur `goto`-Methode von `app` kann die `goto`-Methode von `page` **relative Adressen** verwenden, um zu anderen Seiten zu navigieren.

```javascript
page.goto("./page2.html");
```

## replace-Methode

Die Methode `replace` wird verwendet, um die aktuelle Seite durch eine andere Seite zu ersetzen. Dies ist ähnlich wie die `replace`-Methode von `app`, erfolgt jedoch innerhalb der Seite.

```javascript
page.replace("./new-page.html");
```

## Rückgabemethode

`back`-Methode wird verwendet, um zur vorherigen Seite zurückzukehren. Dies navigiert den Benutzer zur vorherigen Seite, ähnlich der Rückwärtsfunktion eines Browsers.

```javascript
page.back();
```