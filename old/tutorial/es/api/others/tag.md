# tag



El atributo `tag` se utiliza para obtener la etiqueta del elemento y devuelve una cadena en minúsculas.

En el siguiente ejemplo, demostramos cómo usar el método `tag` para obtener la etiqueta de un elemento:

<o-playground name="tag - obtener etiqueta">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

