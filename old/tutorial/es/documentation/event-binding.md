# Vinculación de eventos

En ofa.js, el enlace de eventos es un mecanismo importante para lograr la interacción del usuario. Puedes vincular manejadores de eventos a los elementos de varias maneras para responder a las acciones del usuario.

## Enlace de eventos desde proto

Esta es la forma recomendada de enlace de eventos, adecuada para lógica de manejo de eventos compleja. Definir las funciones de manejo de eventos en el objeto `proto` permite organizar mejor la lógica del código y facilita el mantenimiento y la reutilización.

<o-playground name="Enlazar eventos desde proto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Ejecutar función directamente

Para operaciones simples (como incrementar un contador, cambiar un estado, etc.), se pueden escribir expresiones breves directamente en los atributos de evento. Este método es conciso y claro, adecuado para manejar lógica simple.

<o-playground name="Ejecutar función directamente" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Tipos de eventos compatibles

ofa.js soporta todos los eventos DOM estándar, incluyendo pero no limitado a:

- Eventos de ratón: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, etc.
- Eventos de teclado: `keydown`, `keyup`, `keypress`, etc.
- Eventos de formulario: `submit`, `change`, `input`, `focus`, `blur`, etc.
- Eventos táctiles: `touchstart`, `touchmove`, `touchend`, etc.

ofa.js admite los mismos tipos de eventos que los eventos DOM nativos; para más detalles, consulte la [documentación de eventos de MDN](https://developer.mozilla.org/es/docs/Web/API/Event).

## Pasar parámetros al manejador de eventos

También puedes pasar parámetros al manejador de eventos:

<o-playground name="Pasar parámetros al manejador de eventos" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
      <button on:click="addNumber(10)">Add 10 - Current: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Acceder al objeto de evento

En los manejadores de eventos, puedes acceder al objeto de evento nativo a través del parámetro `event`:

<o-playground name="Acceder al objeto de evento" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Haga clic en cualquier lugar para ver las coordenadas</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

También puedes usar el parámetro `$event` en las expresiones para acceder al objeto de evento nativo, por ejemplo, para obtener las coordenadas del clic del mouse:

```html
<div class="container" on:click="handleClick($event)">Haga clic en cualquier lugar para ver las coordenadas</div>
```

## Escuchar eventos personalizados

Además de escuchar eventos nativos del DOM, también puedes escuchar fácilmente eventos personalizados emitidos por componentes:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

Para profundizar en los eventos personalizados, consulte el capítulo [Eventos personalizados](custom-events.md). Se recomienda seguir el tutorial en orden, ya que los contenidos posteriores se desarrollarán de forma natural; sin embargo, también puede consultarlo en cualquier momento para adelantarse.