# wrap



Die Methode `wrap` wird verwendet, um das Ziel-Element von einem weiteren Element umgeben. Vor Ausführung der `wrap`-Operation wird automatisch die Initialisierung der [$-Methode](../instance/dollar.md) ausgeführt, daher kann direkt ein konkreter Element-String oder ein Objekt angegeben werden.

<o-playground name="wrap - Umschließen von Elementen" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>Ich bin 1</div>
        <div id="target">Ich bin 2</div>
        <div>Ich bin 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Das Zielelement **muss einen Elternknoten haben**, sonst schlägt die Einwicklungsoperation fehl.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // Fehler, kein Elternelement, kann nicht eingewickelt werden
$el.$('#target').wrap("<div>new div</div>"); // Korrekt, Elternelement vorhanden
```

**Bitte beachten Sie: Führen Sie keine Operationen innerhalb von Vorlagenkomponenten wie o-fill oder o-if durch.**