# SSR y renderizado isomórfico

> Si no sabes qué es SSR, significa que actualmente no lo necesitas. Puedes saltarte este capítulo y volver a aprenderlo cuando lo necesites en el futuro.

## Renderizado isomorfo

Para mantener la experiencia fluida de CSR, un mejor reconocimiento de los bots de rastreo (SEO) y una mayor libertad en la elección del lenguaje de desarrollo del backend, ofa.js ofrece un modo único de renderizado isomórfico (Symphony Client-Server Rendering).

> Para conocer las definiciones específicas y diferencias de CSR / SSR / SSG, lea directamente la sección al final de este artículo.

El concepto central del renderizado isomorfo es:- Renderice el contenido inicial de la página en el lado del servidor para garantizar el SEO y la velocidad de carga de la primera pantalla
- El cliente asume el enrutamiento para mantener la experiencia de usuario fluida de CSR
- Adecuado para cualquier entorno de servidor, logrando una representación verdaderamente isomórfica

### Principio de implementación de renderizado isomórfico

El modo de renderización isomórfica de ofa.js se basa en el siguiente mecanismo:

1. El servidor genera una página HTML completa con una estructura de ejecución universal
2. El cliente carga el motor de ejecución CSR
3. Identifica automáticamente el entorno de ejecución actual y decide la estrategia de renderizado

### Estructura del código de renderizado isomórfico

**Módulo de página CSR original:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>Soy Página</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Página completa encapsulada con renderizado isomorfo：**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Posición de inserción del contenido del módulo de página ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

Por lo tanto, puedes usar cualquier lenguaje de desarrollo (Go, Java, PHP, Nodejs, Python, etc.), cualquier motor de renderizado de plantillas del backend (como `html/template` de Go, Smarty/Twig/Blade de PHP, etc.), e incrustar la estructura de código de renderizado isomórfico de ofa.js en la plantilla para lograr SSR.

* [Caso SSR de Nodejs](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [Caso SSR de PHP](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Caso SSR de Go](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Estructura de plantilla de renderizado isomórfico

Para implementar el modo de renderizado isomorfo, solo necesita usar la siguiente estructura de plantilla general en el lado del servidor:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Insertar dinámicamente el contenido del módulo de página correspondiente -->
  </o-app>
</body>

</html>
```

**Nota:** El HTML devuelto por el servidor debe establecer el encabezado HTTP correcto: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` es el motor de ejecución de renderizado isomórfico proporcionado por ofa.js, que determina automáticamente la estrategia de renderizado según el estado de ejecución de la página actual, asegurando la mejor experiencia de usuario en cualquier entorno.

Del mismo modo, SSG también puede aplicar esta estructura para lograr la generación de sitios estáticos.

## Diferencias entre ofa.js, SSR y otros frameworks frontend

El Symphony Client-Server Rendering (en adelante SCSR) de ofa.js también es fundamentalmente un modo SSR.

En comparación con las soluciones SSR de frameworks front-end existentes como Vue, React, Angular, la mayor ventaja de ofa.js es que **no necesita vincularse obligatoriamente a Node.js**. Esto significa que cualquier motor de renderizado de plantillas de backend (como Smarty de PHP, Jinja2 de Python, Thymeleaf de Java, etc.) puede integrar fácilmente ofa.js para implementar SSR.

## Resumen de métodos de renderización web

Las aplicaciones web modernas tienen principalmente cuatro métodos de renderizado: el renderizado tradicional basado en plantillas del lado del servidor, CSR (Client Side Rendering, renderizado del lado del cliente), SSR (Server Side Rendering, renderizado del lado del servidor) y SSG (Static Site Generation, generación de sitios estáticos). Cada método tiene sus ventajas y escenarios de aplicación adecuados.

### Renderizado tradicional de motor de plantillas del lado del servidor

Entre los muchos productos web, el motor de plantillas del lado del servidor sigue siendo el método más común para la renderización de páginas. Lenguajes de backend como Go y PHP, mediante motores de plantillas integrados o de terceros (como el `html/template` de Go, Smarty/Twig/Blade de PHP, etc.), inyectan datos dinámicos en plantillas HTML, generan una página HTML completa de una sola vez y la devuelven al cliente.

**Ventajas:**- SEO amigable, carga rápida en la primera pantalla
- Control del lado del servidor, alta seguridad
- Requisitos de pila tecnológica bajos para el equipo, los desarrolladores de backend pueden completar el desarrollo de forma independiente

**Desventajas:**- La experiencia del usuario es deficiente, ya que cada interacción requiere una recarga de la página.
- La presión del servidor es alta.
- El acoplamiento entre el frontend y el backend es alto, lo que no favorece la división del trabajo y la colaboración.

### CSR（renderizado del lado del cliente）

En el modo CSR, el contenido de la página se renderiza completamente mediante JavaScript del lado del navegador. La [aplicación de página única](./routes.md) de ofa.js es un ejemplo típico de implementación de CSR. Este método proporciona una experiencia de usuario fluida, permitiendo todas las interacciones sin necesidad de cambiar de página. Las aplicaciones de página única (SPA) desarrolladas con React o Vue junto con sus bibliotecas de enrutamiento correspondientes (como React Router o Vue Router) son implementaciones típicas de CSR.

**Ventajas:**- Experiencia de usuario fluida, cambios de página sin recarga
- Fuerte capacidad de procesamiento del cliente, respuesta rápida

**Desventajas:**- No es favorable para el SEO, los motores de búsqueda tienen dificultades para indexar el contenido

### SSR（renderizado del lado del servidor）

Manteniendo la experiencia fluida de CSR, se pasa a renderizar la página en tiempo real desde el servidor: cuando el usuario realiza una solicitud, el servidor genera instantáneamente el HTML completo y lo devuelve, logrando un verdadero renderizado del lado del servidor.

**Ventajas:**- SEO friendly, carga rápida en la primera pantalla
- Soporta contenido dinámico

**Desventajas:**- La presión del servidor es alta
- Normalmente se necesita un entorno Node.js como tiempo de ejecución, o al menos una capa intermedia de Node.js
- Todavía se necesita la activación posterior del cliente para lograr una interacción completa

### SSG（Generación de Sitios Estáticos）

Durante la fase de construcción, todas las páginas se prerenderizan como archivos HTML estáticos, que pueden ser devueltos directamente por el servidor al usuario después del despliegue.

**Ventajas:**- Velocidad de carga inicial rápida, SEO amigable
- Baja carga del servidor, rendimiento estable
- Alta seguridad

**Desventajas:**- Dificultad para actualizar contenido dinámico
- El tiempo de construcción aumenta con la cantidad de páginas