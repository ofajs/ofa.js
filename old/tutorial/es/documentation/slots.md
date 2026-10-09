# Slots

Las ranuras son marcadores de posición en los componentes que se utilizan para recibir contenido externo. Mediante el uso de ranuras, puedes crear componentes reutilizables, al mismo tiempo que permites a quienes usan el componente personalizar el contenido interno del mismo.

## Ranura predeterminada

<o-playground name="Ejemplo de ranura predeterminada" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenido de la ranura：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Contenido predeterminado del slot

Cuando el componente padre no proporciona contenido para el slot, los elementos dentro de `<slot></slot>` se mostrarán como contenido predeterminado.

<o-playground name="Ejemplo de contenido predeterminado del slot" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>Con contenido en el slot:</h3>
      <demo-comp>
        <div>Este es contenido personalizado</div>
      </demo-comp>
      <h3>Sin contenido en el slot (muestra contenido predeterminado):</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>Contenido del slot:
      <span style="color: red;">
        <slot>
          <div>Este es el contenido predeterminado</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Ranuras con nombre

Cuando un componente necesita múltiples posiciones de slot, se pueden usar slots con nombre para diferenciar los distintos slots. Mediante `<slot name="xxx">` se define un slot con nombre, y al usarlo, a través del atributo `slot="xxx"` se especifica en qué slot se coloca el contenido.

<o-playground name="Ejemplo de ranura con nombre" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenido de la ranura：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Transmisión de slots multinivel

El contenido de los slots se puede transmitir a través de múltiples niveles de componentes. Cuando un componente padre pasa contenido de slot a un componente hijo, el componente hijo puede continuar pasando este contenido de slot a sus propios componentes hijos, logrando una transmisión multicapa de slots.

<o-playground name="Ejemplo de paso de slots multinivel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">Título desde la capa más externa</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>Componente externo</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>Componente interno</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En el ejemplo anterior:- El componente padre más externo define el contenido de `slot="header"`
- El componente externo (outer-comp) recibe este contenido del slot y lo pasa al componente interno (inner-comp)
- El componente interno finalmente renderiza el contenido del slot proveniente del más externo