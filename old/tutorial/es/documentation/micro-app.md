# Microaplicación

`o-app` es el componente contenedor central en ofa.js, utilizado para crear microaplicaciones independientes. Cargará el archivo de configuración `app-config.js`, que define varios comportamientos de la aplicación.

## Uso básico

En HTML, use la etiqueta `o-app` para crear una micro aplicación:

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

## Crear archivo de configuración

Crea el archivo `app-config.js` y define la configuración básica de la aplicación:

```javascript
// app-config.js

// Dirección de la página de inicio de la aplicación (obligatorio)
export const home = "./home.html";

// Configuración de animación de cambio de página (opcional)
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

<o-playground name="Ejemplo de microaplicación" style="--editor-height: 500px">
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
      <a href="./about.html?id=10010" olink>Ir a About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Ir a About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de App de ofa.js",
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
      <div style="padding: 8px;"> <button on:click="back()">Atrás</button> </div>
      <p>{{val}}</p>
      <p> Acerca de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hola Demo de App de ofa.js (desde ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Navegación de página

### Usar el atributo olink

Dentro de `o-app`, utilice la etiqueta `<a>` con el atributo `olink` para cambiar de página:

```html
<a href="./about.html" olink>Ir a la página acerca</a>
```

`olink` activa el cambio de ruta de la aplicación, con animaciones de transición, y sin recargar toda la página.

### Navegación programática

En los componentes de página, se pueden usar métodos de navegación:

```javascript
// Ir a la página especificada
this.goto("./about.html");

// Reemplazar la página actual (no se añade al historial)
this.replace("./about.html");

// Volver a la página anterior
this.back();
```

## Paso de parámetros de página

Pasar parámetros a través de URL Query, la página de destino los recibe mediante el parámetro `query` de la función del módulo:

**Página de envío:**

```html
<a href="./detail.html?id=123" olink>Ver detalles</a>
```

**Página de recepción:**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## Explicación detallada del archivo de configuración

`app-config.js` admite múltiples opciones de configuración para controlar el comportamiento de la aplicación:

| Configuración | ¿Es obligatorio? | Descripción |
|--------|----------|------|
| `home` | Requerido | Dirección de la página de inicio de la aplicación |
| `pageAnime` | Opcional | Configuración de la animación de cambio de página |
| `loading` | Opcional | Contenido mostrado al cargar la página |
| `fail` | Opcional | Contenido mostrado cuando falla la carga de la página |
| `ready` | Opcional | Función de devolución de llamada después de que se completa la inicialización de la aplicación |
| `proto` | Opcional | Métodos y propiedades agregados al prototipo de la aplicación |
| `allowForward` | Opcional | Si se habilita la función de avance del navegador |## Características de la microaplicación

### Independencia

Cada instancia de `o-app` es una microaplicación independiente, con su propia:- historial de enrutamiento
- pila de páginas
- gestión de estado
- opciones de configuración

### Uso anidado

`o-app` se puede anidar para implementar estructuras de aplicaciones complejas:

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### Diferencias con los componentes

`o-app` se diferencia de los componentes normales principalmente en que:

| Característica | o-app | Componente normal |
|------|-------|----------|
| Gestión de enrutamiento | ✅ Sistema de enrutamiento integrado | ❌ No |
| Pila de páginas | ✅ Administra el historial de páginas | ❌ No |
| Archivo de configuración | ✅ Configuración independiente | ❌ No |
| Animación de transición entre páginas | ✅ Soporte | ❌ No |
| Escenario de uso | Contenedor de nivel de aplicación | Componente funcional |