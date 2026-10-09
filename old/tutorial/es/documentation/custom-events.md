# Eventos personalizados

En ofa.js, además de los eventos DOM incorporados, también se pueden crear y usar eventos personalizados para lograr la comunicación entre componentes. Los eventos personalizados son un mecanismo importante en el desarrollo basado en componentes, ya que permiten que un componente transmita mensajes o cambios de estado hacia arriba.

## Método emit - Disparar eventos personalizados

El método `emit` se utiliza para disparar eventos personalizados, notificando a los oyentes externos sobre cambios de estado internos del componente o acciones del usuario.

### Uso básico

```javascript
// Desencadenar un evento personalizado simple
this.emit('custom-event');

// Desencadenar un evento personalizado con datos
this.emit('data-changed', {
  data: {
    // Datos personalizados, pueden tener cualquier estructura según necesidad
    newValue: 100,
    oldValue: 50
  }
});
```

### parámetros del método emit

`emit` método acepta dos parámetros:

1. **Nombre del evento**: cadena, el nombre del evento que se va a disparar
2. **Objeto de opciones** (opcional): contiene las opciones de configuración del evento
   - `data`: los datos a pasar
   - `bubbles`: booleano, controla si el evento se propaga (por defecto true)
   - `composed`: booleano, controla si el evento puede cruzar los límites de Shadow DOM
   - `cancelable`: booleano, controla si el evento puede ser cancelado

Entonces el elemento superior puede usar el método `on` [（vinculación de eventos）](./event-binding.md) para escuchar este evento personalizado.

### Ejemplo de uso de emit

<o-playground name="Ejemplo de uso de emit" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Haz clic para disparar el evento</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'El botón ha sido clicado',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Mecanismo de propagación de eventos

La propiedad `bubbles` controla si el evento se propaga hacia arriba a elementos padre. Cuando se establece en `true`, el evento se propaga hacia arriba a lo largo del árbol DOM. El valor predeterminado es `true`. Si se establece en `false`, el evento no burbujeará.

### Explicación detallada del mecanismo de burbujeo

- **Comportamiento predeterminado**: los eventos emitidos con `emit` tienen burbujeo habilitado de forma predeterminada (`bubbles: true`)
- **Ruta de burbujeo**: el evento se propaga hacia arriba desde el elemento que lo desencadena, nivel por nivel
- **Detener el burbujeo**: se puede detener el burbujeo llamando a `event.stopPropagation()` en el manejador de eventos

### Ejemplo de burbuja

<o-playground name="Ejemplo de evento personalizado" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Contenedor externo (escucha eventos burbujeantes): {{bubbledEventCount}} veces</p>
      <p>Componente interno (escucha eventos directos): {{directEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Disparar evento no burbujeante</button>
      <button on:click="triggerBubblingEvent">Disparar evento burbujeante</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Evento no burbujeante, solo será capturado por el oyente directo
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Evento no burbujeante disparado', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Evento burbujeante, se propaga hacia el elemento padre
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Evento burbujeante disparado', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - atraviesa los límites de Shadow DOM

La propiedad `composed` controla si el evento puede atravesar los límites del Shadow DOM. Esto es especialmente importante para el desarrollo de Web Components, y su valor predeterminado es `false`.

### Explicación detallada del mecanismo de penetración

- **Aislamiento de Shadow DOM**: Por defecto, los eventos no pueden cruzar los límites del Shadow DOM
- **Habilitar penetración**: Establecer `composed: true` permite que los eventos atraviesen los límites del Shadow DOM
- **Escenario de uso**: Cuando un componente necesita enviar eventos al entorno anfitrión, es necesario establecer `composed: true`

### Ejemplo de penetración

<o-playground name="Ejemplo de evento personalizado con datos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Evento escuchado: {{bubbledEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Evento escuchado: {{bubbledEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Disparar evento no compuesto</button>
      <button on:click="triggerComposedEvent">Disparar evento compuesto</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Evento no compuesto, solo lo captura el oyente directo
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Evento no compuesto disparado', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Evento compuesto, atraviesa el límite de Shadow DOM
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Evento compuesto disparado', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

