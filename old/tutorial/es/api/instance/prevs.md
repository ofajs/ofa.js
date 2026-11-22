# prevs



Con la propiedad `prevs`, puede obtener fácilmente todas las instancias de elementos adyacentes anteriores al elemento actual, que se devolverán en forma de array.

<o-playground name="prevs - elementos anteriores" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'cambiar texto');
        },500);
      </script>
    </template>
  </code>
</o-playground>

