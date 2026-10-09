# remove



El método `remove` se utiliza para eliminar el nodo de destino.

**Nota: no opere dentro de los componentes de plantilla como o-fill o o-if。**

<o-playground name="remove - eliminar nodo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

