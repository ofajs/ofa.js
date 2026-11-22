# on



Usando el método `on`, puedes registrar manejadores de eventos para el elemento objetivo. Esto te permite capturar y responder fácilmente a las interacciones del usuario.

A continuación se muestra un ejemplo que demuestra cómo usar el método `on` para registrar un controlador de eventos de clic para un elemento de botón:

<o-playground name="evento on - click" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos el método `on` para añadir un controlador de eventos de clic al elemento botón. Cuando el usuario hace clic en el botón, se activa el controlador de eventos, el contador se incrementa y se muestra el resultado en la página.

## Uso de la sintaxis de plantillas

También puedes usar la sintaxis de plantillas para vincular métodos a los elementos de destino.

<o-playground name="on - sintaxis de plantilla" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos `on:click` en el elemento del botón para enlazar un método llamado `addCount`. Cuando el usuario hace clic en el botón, se invocará este método, el contador se incrementará y se mostrará en la página. De esta forma puedes asociar manejadores de eventos con métodos del componente y lograr interacciones más complejas.

## event



Después de registrar un evento, la función activada llevará el event, manteniéndose consistente con el nativo:

<o-playground name="on - parámetro event" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

