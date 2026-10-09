# classList



La propiedad `classList` se mantiene idéntica a la nativa. Puedes utilizar [classList](https://developer.mozilla.org/es/docs/Web/API/Element/classList) para añadir, eliminar y alternar clases.

A continuación se muestra un ejemplo que demuestra cómo usar `classList`:

<o-playground name="classList - Ejemplo de uso" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">origin text</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

La propiedad `classList` te permite agregar, eliminar y alternar nombres de clase fácilmente para cambiar dinámicamente el estilo de un elemento.