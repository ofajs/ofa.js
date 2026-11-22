# off



El uso del método `off` permite eliminar los controladores de eventos registrados para cancelar la escucha de eventos.

A continuación se muestra un ejemplo que demuestra cómo usar el método `off` para cancelar la escucha de eventos:

<o-playground name="off - eliminar la escucha de eventos" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, registramos un controlador de eventos de clic `f`, que muestra el número de clics en `#logger` cuando se hace clic en el botón. Usando el método `off`, cancelamos la escucha del evento cuando el número de clics llega a 3.