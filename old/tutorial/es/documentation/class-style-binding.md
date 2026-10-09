# Enlace de clases y estilos

En ofa.js, puedes lograr una gestión flexible del estado de la interfaz de usuario mediante la vinculación dinámica de nombres de clase, estilos y atributos. Esto permite que la interfaz se ajuste automáticamente a los cambios en los datos.

## Enlace de clases

El enlace de clases te permite agregar o eliminar dinámicamente clases CSS según el estado de los datos. Puedes usar la sintaxis `class:className="booleanExpression"` para enlazar una clase específica.

Cuando `booleanExpression` es `true`, el nombre de la clase se añade al elemento; cuando es `false`, el nombre de la clase se elimina.

### Enlace de clases básicas

<o-playground name="Enlace de clases básico" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Alternar visualización</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Código de demostración de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Enlace de múltiples clases

También puedes vincular varias clases al mismo tiempo, para que el elemento tenga diferentes estados de apariencia según diferentes condiciones.

<o-playground name="Enlaces de múltiples clases" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Alternar Estados</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Estado Actual - Activo: {{isActive}}, Deshabilitado: {{isDisabled}}, Resaltado: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace de estilos

La vinculación de estilos te permite establecer directamente los valores de los estilos en línea, soportando actualizaciones dinámicas. ofa.js proporciona dos formas de vinculación de estilos:

### Enlace de propiedad de estilo único

Utiliza la sintaxis `:style.propertyName` para enlazar propiedades de estilo específicas.

<o-playground name="Enlace de propiedad de estilo único" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hola código de ejemplo de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Enlace de atributos de múltiples estilos

También puedes vincular múltiples atributos de estilo a la vez:

<o-playground name="Vinculación de estilos múltiples" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamic Styling Example
      </p>
      <button on:click="changeStyles">Change Styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace de atributos

Además de la vinculación de clases y estilos, también puedes vincular dinámicamente otros atributos HTML. ofa.js usa la sintaxis `attr:attributeName` para implementar la vinculación de atributos.

### Vinculación de atributos básicos

<o-playground name="Enlace de propiedades básicas" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Este es un mensaje de información",
              val: "Hover over me to see the title",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Manejo de atributos booleanos

Para atributos de tipo booleano (como `disabled`, `hidden`), ofa.js decide si añadir o no el atributo en función del valor verdadero o falso del dato enlazado.

<o-playground name="Manejo de atributos booleanos" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Escribe aquí..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Haz clic</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Alternar todos los estados
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('¡Botón pulsado!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Función data()

Se puede usar `data(key)` en los estilos para vincular datos del componente. Esto es muy adecuado para escenarios donde se necesita cambiar dinámicamente el estilo según los datos del componente.

<o-playground name="Función de datos dentro de la etiqueta de estilo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          font-size: 10px;
          color:red;
          transition: all .3s ease;
        }
      </style>
      <style>
        p:hover {
          font-size: data(size);
          color: green;
          transition: all data(time)s ease;
        }
      </style>
      Hover FontSize: <input type="number" sync:value="size" placeholder="Esta es una entrada de enlace bidireccional" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="Esta es una entrada de enlace bidireccional" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notas importantes

`data(key)` dentro de la etiqueta `style` en principio reemplazará todo el contenido del estilo. Para evitar renderizados repetidos de estilos no relacionados, se recomienda colocar los estilos que contienen `data(key)` en una etiqueta `style` separada, mientras que los estilos que no requieren enlace de datos se colocan en otra etiqueta `style`, para lograr un mejor rendimiento.

```html
<!-- ❌ El p:hover sin data(key) también se actualizará -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Solo los estilos con data(xxx) serán renderizados nuevamente -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```