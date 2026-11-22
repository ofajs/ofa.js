# Carga y manejo de errores

Durante la ejecución de la aplicación, la carga de la página requiere tiempo y también puede ocurrir que falle. `app-config.js` proporciona las opciones de configuración `loading` y `fail` para manejar estos escenarios.

## loading - estado de carga

`loading` se utiliza para mostrar contenido durante el proceso de carga de la página, mejorando la experiencia del usuario.

### Plantilla de cadena simple

La forma más sencilla es usar plantillas de cadena:

```javascript
export const loading = "<div class='loading'>Cargando...</div>";
```

### Generación dinámica de funciones

El uso de funciones puede generar dinámicamente componentes de carga más complejos:

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>Cargando...</span>
  </div>`;
};
```

### Ejemplo de barra de progreso

A continuación se muestra un hermoso efecto de carga de barra de progreso:

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

Esta implementación de barra de progreso:- Cuando la página se carga, la barra de progreso crece lentamente del 0% al 98%
- Al finalizar la carga de la página, la barra de progreso se completa rápidamente hasta el 100% y desaparece
- Usa una animación de transición suave

### Animación de carga personalizada

**Animación de carga giratoria：**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**Carga de pantalla esqueleto：**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fallo - manejo de errores

`fail` se utiliza para mostrar un componente de aviso de error cuando la página no se carga correctamente.

### Uso básico

`fail` la función recibe un parámetro de objeto que contiene:- `src` - dirección de la página de error
- `error` - objeto de información de error

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>Error al cargar la página</h3>
    <p>URL: ${src}</p>
    <p>Error: ${error.message}</p>
    <button on:click="back()">Volver a la página anterior</button>
  </div>`;
};
```

### Ejemplo completo de manejo de errores

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">Error al cargar la página</h2>
    <p style="color: #666; margin-bottom: 20px;">No se pudo cargar la página: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      Información del error: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        Volver
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        Ir al inicio
      </button>
    </div>
  </div>`;
};
```

### Manejo de tipos de error

Se pueden mostrar diferentes mensajes según el tipo de error:

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "Error desconocido";
  
  if (error.message.includes("404")) {
    errorMessage = "Página no encontrada";
  } else if (error.message.includes("timeout")) {
    errorMessage = "Tiempo de carga agotado, verifique la conexión de red";
  } else if (error.message.includes("network")) {
    errorMessage = "Error de red, inténtelo de nuevo más tarde";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>Se produjo un error</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">Volver</button>
  </div>`;
};
```

## Ejemplo completo

<o-playground name="Ejemplo de carga y manejo de errores" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página principal de la aplicación
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>Error al cargar la página</h3>
        <p>Dirección: ${src}</p>
        <p>Error: ${error.message}</p>
        <button on:click="back()">Volver a la página anterior</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
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

