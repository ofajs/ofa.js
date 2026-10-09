# unwrap



Die Methode `unwrap` dient dazu, das äußere umschließende Element des Ziel-Elements zu entfernen.

<o-playground name="unwrap - Entfernen der Umhüllung" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Zielelement **muss einen übergeordneten Knoten haben**, andernfalls kann die Unwrap-Operation nicht ausgeführt werden.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Fehler, kein übergeordnetes Element, unwrap nicht möglich
$el.$('#target').unwrap(); // Korrekt, umschließendes Element entfernen
```

Wenn das Zielelement andere Geschwisterelemente besitzt, kann auch kein unwrap ausgeführt werden.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>Ich bin ein Geschwisterknoten</div>
</div>
`);

$el.$('#target').unwrap(); // Fehler, da andere benachbarte Knoten vorhanden sind
```

**Bitte beachten Sie: Führen Sie keine Operationen innerhalb von Vorlagenkomponenten wie o-fill oder o-if durch.**