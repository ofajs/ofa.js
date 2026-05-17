# Conceptos básicos de configuración de aplicaciones

El archivo de configuración `app-config.js` se utiliza para definir diversos comportamientos de la aplicación. Este capítulo presenta la estructura básica del archivo de configuración y todas las opciones de configuración disponibles.

## Estructura del archivo de configuración

Crea el archivo `app-config.js`, utiliza la sintaxis de módulos ES6 para exportar elementos de configuración:

```javascript
// app-config.js

// Dirección de la página de inicio de la aplicación (obligatorio)
export const home = "./home.html";

// Configuración de animación de transición de página (opcional)
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};

// Estado de carga (opcional)
export const loading = () => {
  return "<div>Loading...</div>";
};

// Manejo de errores (opcional)
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// Inicialización de la aplicación (opcional)
export const ready = function() {
  console.log("App is ready");
};

// Extensión de prototipo (opcional)
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// Habilitar función de avance (opcional)
export const allowForward = true;
```

## Resumen de elementos de configuración

`app-config.js` admite las siguientes opciones de configuración:

| Opción | Requerido | Descripción | Documentación detallada |
|--------|----------|------|----------|
| `home` | ✅ Obligatorio | Dirección de la página de inicio de la aplicación | Este capítulo |
| `pageAnime` | Opcional | Configuración de la animación de cambio de página | [Animación de cambio de página](./page-transition-animation.md) |
| `loading` | Opcional | Contenido mostrado durante la carga de la página | [Carga y manejo de errores](./app-loading-error.md) |
| `fail` | Opcional | Contenido mostrado cuando falla la carga de la página | [Carga y manejo de errores](./app-loading-error.md) |
| `ready` | Opcional | Callback después de que la aplicación se haya inicializado | [Inicialización de la aplicación](./app-initialization.md) |
| `proto` | Opcional | Métodos y propiedades añadidos al prototipo de la aplicación | [Inicialización de la aplicación](./app-initialization.md) |
| `allowForward` | Opcional | Habilitar la función de avance del navegador | [Enrutamiento y navegación](./app-navigation.md) |## home - dirección de la página de inicio

`home` es un elemento de configuración obligatorio que especifica la ruta del módulo de la página de inicio que se carga al iniciar la aplicación.

```javascript
export const home = "./pages/home.html";
```

**Reglas de ruta:**- Soporta rutas relativas（relativas al archivo `app-config.js`）
- Soporta rutas absolutas
- La ruta apunta a un archivo de módulo de página（archivo `.html`）

## pageAnime - Animación de transición de página

`pageAnime` es un elemento de configuración opcional que se utiliza para controlar los efectos de animación de transición al cambiar de página.

### Uso básico

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

### Descripción del estado de la animación

La animación de cambio de página incluye tres estados:

| Estado | Descripción | Momento de activación |
|------|------|----------|
| `current` | Estilo después de la animación de la página actual | Cuando se completa el cambio de página |
| `next` | Estilo inicial al entrar la nueva página | Cuando comienza a entrar la nueva página |
| `previous` | Estilo objetivo al salir la página anterior | Cuando comienza a salir la página anterior |### Más efectos de animación

La animación de cambio de página admite múltiples efectos, incluyendo:- Deslizar horizontalmente (predeterminado)
- Fundido de entrada/salida
- Deslizar verticalmente
- Efecto de zoom
- Efecto de volteo
- Animación personalizada

Para obtener ejemplos detallados de configuración y efectos de animación, consulte el capítulo [Animaciones de transición de página](./page-transition-animation.md).

## Uso de archivos de configuración en HTML

En un archivo HTML, importe el archivo de configuración a través de la etiqueta `o-app`:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="Ejemplo básico de configuración de la aplicación" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    // Configuración de animación de cambio de página
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

