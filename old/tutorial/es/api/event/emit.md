# emit



Usando el método `emit`, puedes activar eventos de forma activa, y los eventos activados tienen un mecanismo de propagación. El mecanismo de propagación significa que los eventos se propagan desde los elementos internos hacia los externos, activándose en capas de adentro hacia afuera.

A continuación, se muestra un ejemplo que demuestra cómo usar el método `emit` para disparar un evento personalizado y utilizar el mecanismo de burbujeo para pasar el evento a elementos externos:

<o-playground name="emit - disparar evento" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, registramos el mismo manejador de evento personalizado `custom-event` para el elemento `<ul>` y el elemento `<li>`. Cuando usamos el método `emit` para disparar el evento, este evento burbujea desde el elemento `<li>` hasta el elemento `<ul>`, disparando los dos manejadores de evento.

## Datos personalizados

Al incluir el parámetro `data`, puedes pasar datos personalizados al manejador de eventos:

<o-playground name="emit - datos personalizados" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, pasamos datos personalizados al manejador de eventos a través del parámetro `data`. El manejador de eventos puede obtener los datos pasados a través de `event.data`.

## No propagar eventos de burbuja

Si no deseas que el evento se propague, puedes incluir el parámetro `bubbles: false` al activar el evento:

<o-playground name="emit - sin burbujeo" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos el parámetro `bubbles: false` para activar un evento personalizado. Este evento no se propaga a los elementos superiores, por lo que solo se activa el manejador de eventos del elemento `<li>`.

## Penetrar el nodo raíz

Por defecto, los eventos no atraviesan el Shadow DOM de los componentes personalizados. Pero puedes permitir que los eventos personalizados atraviesen el nodo raíz y se activen en elementos externos estableciendo `composed: true`.

<o-playground name="emit - atravesar nodo raíz" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'evento personalizado activado;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un componente personalizado `composed-test`, que contiene un elemento en el Shadow DOM y un botón que dispara un evento. De manera predeterminada, los eventos no atraviesan el Shadow DOM hasta el nodo raíz. Sin embargo, al usar el parámetro `composed: true` al disparar el evento, permitimos que el evento atraviese hasta el nodo raíz, activando elementos fuera del nodo raíz.