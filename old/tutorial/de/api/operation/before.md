# before



Die Methode `before` wird verwendet, um ein Element vor dem Ziel-Element einzufügen. Vor der Ausführung des `before`-Vorgangs wird automatisch die Initialisierung der [$-Methode](../instance/dollar.md) ausgeführt, daher kann direkt eine konkrete Element-Zeichenkette oder ein Objekt angegeben werden.

**Bitte beachten Sie: Führen Sie keine Operationen innerhalb von Vorlagenkomponenten wie o-fill oder o-if durch.**

<o-playground name="before - vorne hinzufügen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

