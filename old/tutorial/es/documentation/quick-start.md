# Introducción rápida

Esta sección explicará cómo empezar rápidamente a utilizar ofa.js. En los tutoriales posteriores, omitiremos el paso de crear el archivo de entrada index.html y mostraremos únicamente el código de los archivos de módulo de página. Puede desarrollar directamente basándose en la plantilla.

## Preparar archivos básicos

Para comenzar rápidamente con ofa.js, solo necesita crear un **módulo de página** y combinarlo con un HTML de entrada. Los archivos principales necesarios son los siguientes:

- `index.html`: Archivo de entrada de la aplicación, responsable de cargar el framework ofa.js e importar los módulos de página.
- `demo-page.html`: Archivo de módulo de página, define el contenido específico, estilos y lógica de datos de la página.

### index.html (entrada de la aplicación)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ejemplo de ofa.js</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

La función principal de este archivo es:- Introducir el framework ofa.js
- Usar el componente `<o-page>` para cargar y renderizar el módulo de página

### demo-page.html (módulo de página)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

Este archivo define un componente de página simple, que incluye:- `<template page>` etiqueta, define el módulo de página
- Estilos CSS (usando el selector `:host` de Shadow DOM)
- Expresión de vinculación de datos `{{val}}`
- Lógica JavaScript, devuelve un objeto que contiene datos iniciales


## Demostración en línea

El siguiente es un ejemplo en vivo en el editor en línea, puede modificar el código directamente y ver el efecto:

<o-playground name="Demostración en línea" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Definimos los estilos mediante la etiqueta `<style>` dentro del componente. Estos estilos internos solo actúan dentro del componente, ofreciendo un buen encapsulamiento y sin afectar a otros elementos de la página.

Donde el selector `:host` se utiliza para definir los estilos del elemento huésped del componente; aquí configuramos el componente como un elemento de bloque y añadimos un borde rojo y un relleno de 10 px.

Mediante la expresión `{{key}}`, se puede renderizar el valor correspondiente de los datos del componente en la página.

Ahora has creado con éxito tu primera aplicación de ofa.js. A continuación, profundicemos en la sintaxis de renderizado de plantillas de ofa.js y sus características avanzadas.