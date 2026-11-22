# Entendiendo el enlace de propiedades

En el contenido anterior, se ha presentado brevemente el uso básico del [enlace de propiedades](./property-binding.md). El caso anterior se utilizó para enlazar la propiedad `value` de elementos nativos del navegador (como `textarea`), Esta sección explorará en profundidad la esencia del enlace de propiedades: en realidad, se enlaza a propiedades JavaScript después de la instanciación del componente, no a atributos HTML.

## Mecanismo de enlace de propiedades del componente

En ofa.js, cuando usamos la sintaxis `:toProp="fromProp"` en un componente padre, estamos estableciendo una propiedad JavaScript en la instancia del componente hijo, no un atributo HTML. Esto difiere significativamente de establecer directamente atributos HTML (como `attr:toKey="fromKey"`).

El siguiente ejemplo muestra cómo pasar datos a un componente personalizado mediante el enlace de propiedades:

<o-playground name="Comprender el enlace de propiedades" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo:- Los datos `val` del componente padre se enlazan con la propiedad `fullName` del componente hijo `<demo-comp>`
- Usando la sintaxis `:full-name="val"` se pasa el valor de `val` del componente padre a la propiedad `fullName` del componente hijo
- Una vez que el componente hijo recibe este valor, lo muestra en la plantilla mediante `{{fullName}}`

## Enlace de atributos vs Herencia de atributos de características

Cabe señalar que el enlace de propiedades (`:`) y la herencia de atributos característicos (`attr:`) tienen las siguientes diferencias clave:

### Enlace de atributos (`:`)

- Propiedades de JavaScript vinculadas a la instancia del componente
- Los datos transmitidos mantienen su tipo original (cadenas, números, booleanos, etc.)
- Se puede acceder y modificar directamente dentro del componente, incluso sin necesidad de definir `data` previamente dentro del componente

### Herencia de atributos de características (`attr:`)

- Configurar atributos HTML
- Todos los valores se convierten a cadenas
- Se utiliza principalmente para pasar atributos a elementos DOM subyacentes
- Requiere manejo especial para analizar datos complejos
- Debe definir `attrs` dentro del componente con anticipación para poder recibir los valores de los atributos

Comparación gramatical:```html
<!-- Enlace de atributos: pasar valores JavaScript, mantener el tipo de datos -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Herencia de atributos: establecer atributos HTML, todos los valores se convierten en cadenas -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Realmente se pasa la cadena "42" -->
```

## Diferencias de comparación de casos

<o-playground name="Comparación de diferencias de casos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Donde `vone` es una propiedad de la instancia del componente, `vtwo` es un atributo HTML, el valor del atributo será seleccionado por el selector `[vtwo]` y se aplicará el estilo, mientras que `vone` es una propiedad de la instancia del componente y no será seleccionado por el selector `[vone]`.

## Enlace de datos bidireccional

Los componentes instanciados también admiten el enlace bidireccional de datos, utilizando la sintaxis `sync:toProp="fromProp"`. El enlace bidireccional permite la sincronización de datos entre el componente padre y el componente hijo, de modo que cuando los datos de un lado cambian, el otro lado también se actualiza en consecuencia.

> A diferencia de Angular y Vue, ofa.js admite de forma nativa la sintaxis de enlace de datos bidireccional sin necesidad de añadir configuraciones especiales ni operaciones adicionales para los componentes.

### Ejemplo de vinculación bidireccional

El siguiente ejemplo muestra cómo establecer un enlace de datos bidireccional entre el componente padre y el componente hijo:

<o-playground name="Ejemplo de enlace bidireccional" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Valor en el componente padre: {{val}}</h3>
      <p>Modificar el valor del componente padre mediante el campo de entrada:</p>
      <input type="text" sync:value="val" placeholder="Ingrese texto en el campo de entrada...">
      <p>Modificar el valor del componente padre a través del componente hijo:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Valor mostrado por el componente hijo: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Ingrese en el campo de entrada del componente hijo...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo:- El `val` del componente padre y el `fullName` del componente hijo se vinculan bidireccionalmente mediante `sync:full-name="val"`
- Cuando se ingresa contenido en el cuadro de entrada del componente padre, el componente hijo muestra inmediatamente el nuevo valor
- Cuando se ingresa contenido en el cuadro de entrada del componente hijo, el componente padre también se actualiza y muestra inmediatamente

### Diferencia entre el enlace bidireccional y el enlace de propiedades normales

| Característica | Enlace de propiedad normal (`:`) | Enlace bidireccional (`sync:`) |
|------|-------------------|-------------------|
| Flujo de datos | Unidireccional: padre → hijo | Bidireccional: padre ↔ hijo |
| Sintaxis | `:prop="value"` | `sync:prop="value"` |
| Modificación del componente hijo | No afecta al componente padre | Afecta al componente padre |
| Escenario de aplicación | El componente padre pasa configuración al componente hijo | Necesita sincronizar datos entre padre e hijo |### Precauciones

1. **Consideraciones de rendimiento**: La vinculación bidireccional desencadena un re-renderizado cuando los datos cambian, debe usarse con precaución en escenarios complejos.
2. **Control del flujo de datos**: Demasiada vinculación bidireccional puede dificultar el seguimiento del flujo de datos. Se recomienda diseñar adecuadamente la comunicación entre componentes.
3. **Compatibilidad de componentes**: No todos los componentes son adecuados para la vinculación bidireccional. Se debe considerar el propósito de diseño del componente.