# nexts



Usando la propiedad `nexts`, puede obtener fácilmente todas las instancias de elementos adyacentes detrás del elemento actual, y estos elementos se devolverán en forma de una matriz.

<o-playground name="nexts - elemento siguiente" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

