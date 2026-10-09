# Crear componente

En ofa.js, los componentes son el mecanismo central para lograr la reutilización de páginas y la modularización. Un componente es esencialmente un Web Component personalizado que, al definir plantillas, estilos y lógica, permite crear elementos de interfaz de usuario reutilizables.

## Estructura básica del componente

A diferencia de los módulos de página, el elemento `<template>` del módulo de componente utiliza el atributo `component` y declara el atributo `tag` para especificar el nombre de la etiqueta del componente.

En la ubicación donde se necesita utilizar el componente, carga de forma asíncrona el módulo del componente mediante la etiqueta `l-m`; el sistema completará automáticamente el registro; después, puedes utilizar el componente directamente como una etiqueta HTML común.

<o-playground name="Ejemplo básico de componente" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "Ejemplo de componente OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Conceptos centrales del componente

### tag - nombre de la etiqueta del componente

`tag` es el nombre de la etiqueta del componente, **debe coincidir con el nombre de la etiqueta utilizada para el componente**. Por ejemplo, si el `tag` de tu componente se define como `"demo-comp"`, entonces al usarlo en HTML debes escribir `<demo-comp></demo-comp>`.

Dado que los componentes son esencialmente Web Components, **el nombre de la etiqueta del componente debe contener un guion `-`**. Este es un requisito de la especificación de Web Components para evitar conflictos con los nombres de etiquetas de elementos HTML nativos. Por ejemplo, `demo-comp`, `my-button`, `user-card` son nombres de etiqueta válidos, mientras que `democomp`, `button`, `card` sin guion no son válidos.

### Referencia al módulo de componentes

Se introduce el módulo de componente mediante la etiqueta `l-m`, y el módulo se registra automáticamente. Es similar a incluir un script con la etiqueta `script`, pero `l-m` está diseñada específicamente para cargar y registrar módulos de componentes.

> Nota: La etiqueta de referencia `l-m` es una **referencia asíncrona**, adecuada para cargar componentes bajo demanda al cargar la página.

## Componente de referencia sincrónica

En ciertos escenarios, es posible que necesites cargar componentes de forma síncrona (por ejemplo, asegurarte de que el componente esté registrado antes de usarlo). En este caso, puedes usar el método `load` junto con la palabra clave `await` para lograr una referencia síncrona.

En los módulos de componentes y en los módulos de páginas, se inyecta automáticamente la función `load`, que permite a los desarrolladores cargar de forma sincrónica los recursos necesarios.

<o-playground name="Ejemplo de componente con referencia síncrona" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "Ejemplo de componente OFAJS",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Referencia asíncrona vs referencia síncrona

| Modo de referencia | Palabra clave | Característica |
|-------------------|---------------|----------------|
| Referencia asíncrona | Etiqueta `l-m` | Carga no bloqueante, adecuada para cargar componentes bajo demanda |
| Referencia síncrona | Método `load` con la palabra clave `await` | Carga bloqueante, asegura que los componentes estén registrados antes de su uso |`l-m` la referencia de etiqueta y el método `load` pueden cargar módulos de componentes. En general, se recomienda usar la etiqueta `l-m` para hacer referencia asíncrona a componentes, con el fin de lograr una carga no bloqueante y una carga bajo demanda.