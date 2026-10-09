# parent



Usando la propiedad `parent`, puede obtener la instancia del elemento padre de la instancia.

<o-playground name="parent - elemento padre" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Yo soy 1</li>
        <li id="target">Yo soy el objetivo</li>
        <li>Yo soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent es el elemento ul
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

