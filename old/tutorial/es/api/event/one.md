# one



Usando el método `one`, puedes registrar un controlador de eventos de una sola vez para el elemento objetivo, lo que significa que el controlador de eventos se desvinculará automáticamente después de la primera activación y no se volverá a activar.

A continuación se muestra un ejemplo que demuestra cómo usar el método `one` para registrar un controlador de eventos de clic en un elemento de botón:

<o-playground name="one - click evento de una sola vez" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos el método `one` para agregar un controlador de eventos de clic al elemento botón. Cuando el usuario hace clic en el botón, el controlador de eventos se activa, pero no se activará de nuevo después, ya que ha sido desvinculado.

## Uso de la sintaxis de plantillas

También puedes usar la sintaxis de plantilla para enlazar un controlador de eventos de una sola vez al elemento objetivo.

<o-playground name="one - sintaxis de plantillas" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
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

En este ejemplo, utilizamos `one:click` en el elemento del botón para enlazar un método llamado `addCount`. Cuando el usuario hace clic en el botón, este método se invocará, pero no se volverá a activar después, ya que es un controlador de eventos de una sola vez.