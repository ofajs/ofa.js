# Configuración de la aplicación

`app-config.js` archivo de configuración, además de la dirección de la página de inicio y las animaciones de cambio de página, también admite más opciones de configuración para controlar el estado de carga de la aplicación, el manejo de errores, la lógica de inicialización y las funciones de navegación.

```javascript
// app-config.js
// Contenido mostrado durante la carga
export const loading = () => "<div>Loading...</div>";

// Componente mostrado cuando la página falla al cargar
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Devolución de llamada después de la inicialización de la aplicación
export const ready() {
  console.log("App is ready!");
}

// Métodos y propiedades agregados al prototipo de la aplicación
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Ejemplo de configuración de aplicación" style="--editor-height: 500px">
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Ir a About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Botón Ir a About</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Demo de Aplicación dea.js",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <p> Acerca de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Demo de Aplicación dea.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## loading - estado de carga

Componente que se muestra durante la carga de la página, puede ser una plantilla de cadena o una función que devuelve una plantilla.

```javascript
// Plantilla de cadena simple
export const loading = "<div class='loading'>Cargando...</div>";

// Usar función para generar dinámicamente
export const loading = () => {
  return `<div class='loading'>
    <span>Cargando...</span>
  </div>`;
};
```

Aquí hay una implementación de loading hermosa y que se puede copiar directamente al proyecto:

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fallo - manejo de errores

Componente que se muestra cuando falla la carga de la página, la función recibe un parámetro de objeto que contiene `src` (dirección de la página fallida) y `error` (información del error).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Error al cargar la página</p>
    <p>Dirección: ${src}</p>
    <button on:click="back()">Volver</button>
  </div>`;
};
```

## proto - Extensión de prototipos

Añadir métodos personalizados y propiedades computadas a la instancia de la aplicación, que se pueden acceder a través de `this.app` en los componentes de la página.

```javascript
export const proto = {
  // Método personalizado
  navigateToHome() {
    this.goto("home.html");
  },
  // Propiedad computada
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Llamada en la página:

```html
<template page>
  <button on:click="app.navigateToHome()">Volver a la página principal</button>
  <p>¿Está en la página de inicio? {{app.isAtHome}}</p>
</template>
```

## ready - Callback de inicialización

Función de callback que se ejecuta después de que se haya cargado la configuración de la aplicación, aquí se pueden realizar operaciones de inicialización. Se puede acceder a los métodos y propiedades de la instancia de la aplicación a través de `this`.

```javascript
export const ready() {
  console.log("Aplicación inicializada");
  // puede acceder a this (instancia del elemento o-app)
  console.log(this.current); // obtiene la instancia del elemento o-page de la página actual
  // this.someMethod();
}
```

## allowForward - Función de avance

Controla si se habilita la función de avance del navegador. Cuando se establece en `true`, se puede navegar usando los botones de retroceso y avance del navegador.

```javascript
export const allowForward = true;
```

Cuando está habilitado, el usuario puede navegar mediante los botones de avance/retroceso del navegador, y el método de navegación `forward()` de la aplicación también se activará.

## Navegación programática

Además de usar el enlace `olink`, también se puede llamar al método de navegación en JavaScript:

```javascript
// Navegar a una página específica (agregar al historial)
this.goto("./about.html");

// Reemplazar la página actual (no agregar al historial)
this.replace("./about.html");

// Retroceder a la página anterior
this.back();

// Avanzar a la siguiente página (requiere establecer allowForward: true)
this.forward();
```

## Historial de rutas

A través de la propiedad `routers` se puede obtener el historial de navegación:

```javascript
// Obtener todo el historial de rutas
const history = app.routers;
// Formato de retorno: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Obtener la página actual
const currentPage = app.current;
```

## Escuchar cambios de ruta

Puede responder a los cambios de ruta escuchando el evento `router-change`:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Cambio de ruta:", data.name); // goto, replace, forward, back
  console.log("Dirección de la página:", data.src);
});
```