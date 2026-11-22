# Unterelemente

Das Abrufen von Instanzen untergeordneter Elemente ist sehr einfach. Sie müssen die Instanz lediglich als Array betrachten und die Instanzen der untergeordneten Elemente über einen numerischen Index abrufen.

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <div id="logger1" style="color:red;"></div>
      <div id="logger2" style="color:blue;"></div>
      <script>
        setTimeout(()=>{
          $("#logger1").text = $('ul').length;
          $("#logger2").text = $('ul')[1].text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## length



Die Anzahl der untergeordneten Elemente des Ziel-Elements abrufen, wie im obigen Beispiel gezeigt:

```javascript
$("#logger1").text = $('ul').length;
```