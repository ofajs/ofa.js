# o-app-Komponente

`o-app` ist eine der Kernkomponenten in ofa.js, die zur Konfiguration und Verwaltung der gesamten Anwendung dient. Im Folgenden sind einige wichtige Eigenschaften und Methoden der app:

## src



`src` Attribut wird verwendet, um die genaue Adresse des Anwendungsparameter-Konfigurationsmoduls anzugeben.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



Die Eigenschaft `current` wird verwendet, um die gerade angezeigte Seiteninstanz abzurufen. Auf diese Weise können Sie auf die aktuell dargestellte Seite zugreifen und sie bearbeiten, etwa um deren Inhalt zu aktualisieren oder bestimmte Aktionen auszuführen.

```javascript
const currentPage = app.current;
```

## goto



`goto` Methode wird verwendet, um zu einer bestimmten Seite zu springen. Sie können die Adresse der Zielseite übergeben, die App wird die Seite laden und anzeigen. Dies ist eine wichtige Methode der App-Navigation.

```javascript
app.goto("/page2.html");
```

## replace



`replace`-Methode ähnelt `goto`, dient jedoch dazu, die aktuelle Seite zu ersetzen, anstatt eine neue Seite zum Stack hinzuzufügen. Dies kann verwendet werden, um Seitenersetzungen anstelle von Stack-Navigation zu implementieren.

```javascript
app.replace("/neue-seite.html");
```

## back



`back` Methode wird verwendet, um zur vorherigen Seite zurückzukehren und die Rückwärtsnavigation der Seite zu realisieren. Dies führt den Benutzer zurück zur vorherigen Seite.

```javascript
app.back();
```

## routers



Das Attribut `routers` enthält die Routing-Konfigurationsinformationen der Anwendung. Es ist ein wichtiges Attribut, das die Routing-Regeln und Zuordnungen der einzelnen Seiten in der Anwendung definiert. Die Routing-Konfiguration bestimmt die Navigation zwischen den Seiten und die Behandlung von URLs.

```javascript
const routeConfig = app.routers;
```