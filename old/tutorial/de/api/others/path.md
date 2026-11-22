# PATH



`PATH`-Attribut wird normalerweise für benutzerdefinierte Komponenten oder Seitenkomponenten verwendet, um die Dateiadresse der registrierten Komponente zu erhalten. Dies kann Ihnen während des Entwicklungsprozesses helfen, die Quelle der Komponente zu verstehen. Insbesondere wenn Sie andere Ressourcendateien referenzieren oder laden müssen, können Sie das `PATH`-Attribut verwenden, um den Dateipfad zu erstellen.

Im Folgenden finden Sie ein einfaches Beispiel, das zeigt, wie das Attribut `PATH` in einer benutzerdefinierten Komponente verwendet wird:

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

In diesem Beispiel haben wir ein `my-comp`-Element mit der `id` „myCustomComponent“ ausgewählt und dann über das `PATH`-Attribut den Dateipfad dieser benutzerdefinierten Komponente abgerufen. Du kannst die Variable `componentPath` nach Bedarf im Skriptteil verwenden, z. B. um Pfade für andere Ressourcendateien zu bilden oder weitere Aktionen durchzuführen.