# Renderizado de plantillas

ofa.js proporciona un potente motor de renderizado de plantillas, con una rica sintaxis de plantillas que ayuda a los desarrolladores a construir aplicaciones rápidamente. Comenzaremos introduciendo el renderizado de texto más común.

## Enlace de datos de página

En ofa.js, cada página tiene un objeto `data` donde puedes definir las variables que necesitas usar en la página. Cuando la página comienza a renderizarse, los datos del objeto `data` se vinculan automáticamente con la plantilla, y luego se utiliza la sintaxis `{{nombreDeVariable}}` en la plantilla para renderizar el valor de la variable correspondiente.

## Renderizado de texto

La representación de texto es la forma más básica de renderizado. Puedes usar la sintaxis `{{nombre de variable}}` en la plantilla para mostrar el valor de la variable correspondiente en el objeto `data`.

<o-playground name="Ejemplo de renderizado de texto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Código Demo de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Renderizar contenido HTML

Al añadir la directiva `:html` a un elemento, la cadena HTML de la variable correspondiente se analiza y se inserta de forma segura dentro del elemento, permitiendo renderizar dinámicamente texto enriquecido o incrustar fragmentos HTML externos sin esfuerzo.

<o-playground name="Representación de contenido HTML de ejemplo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

