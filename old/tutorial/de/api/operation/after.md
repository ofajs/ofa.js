# after



Die `after`-Methode wird verwendet, um ein Element nach dem Zielelement einzufügen. Vor der Ausführung der `after`-Operation wird automatisch die Initialisierungsoperation der [$ Methode](../instance/dollar.md) ausgeführt, sodass direkt eine konkrete Elementzeichenfolge oder ein Objekt angegeben werden kann.

**Bitte beachten Sie: Führen Sie keine Operationen innerhalb von Vorlagenkomponenten wie o-fill oder o-if durch.**

<o-playground name="after - hinten hinzufügen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

