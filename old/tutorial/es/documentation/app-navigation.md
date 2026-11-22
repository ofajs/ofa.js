# Enrutamiento y navegación

La navegación de páginas dentro de la aplicación es una característica central de las aplicaciones de una sola página. Este capítulo presenta cómo usar la navegación programática, gestionar el historial de rutas y escuchar los cambios en las rutas.

## allowForward - Función de avance

De forma predeterminada, la aplicación solo admite navegación hacia atrás. Después de establecer `allowForward` como `true` en `app-config.js`, se puede habilitar la funcionalidad de avance de la aplicación.

```javascript
// app-config.js
export const allowForward = true;
```

Al habilitar:

- Los usuarios pueden usar los botones adelante/atrás del navegador para navegar
- El método `forward()` de la aplicación funciona correctamente

## Navegación programática

Además de usar enlaces con el atributo `olink`, también se pueden invocar métodos de navegación en JavaScript.

> **Nota importante**:
> - Los métodos `goto`, `replace`, `back` están disponibles tanto en la **instancia de página (page)** como en la **instancia de aplicación (app)**
> - El método `forward` solo está disponible en la **instancia de aplicación (app)**
> - En una página, use: `this.goto()` o `this.app.goto()`
> - En un componente, use: `this.app.goto()` (es necesario llamarlo a través de la instancia app)
> 
> **Nota sobre la relatividad de las rutas**:
> - Al usar `goto` o `replace` en un **módulo de página**, la ruta es relativa a la dirección del **módulo de página actual**
> - Al usar `goto` o `replace` en la **instancia de aplicación (app)**, la ruta es relativa a la dirección de la **navegación de la aplicación actual**

### goto - Ir a página

Ir a la página especificada y añadir al historial:

```javascript
// Saltar a la página especificada
this.goto("./about.html");

// Saltar con parámetros
this.goto("./detail.html?id=123");
```

### replace - reemplazar página

Reemplazar la página actual, sin añadir al historial:

```javascript
// Reemplazar la página actual
this.replace("./login.html");
```

Se usa comúnmente para redirigir después del inicio de sesión y evitar que el usuario vuelva a la página de inicio de sesión al hacer clic en el botón de retroceso.

### back - atrás

Volver a la página anterior:

```javascript
this.back();
```

### forward - adelante

Avanzar a la página siguiente (es necesario establecer `allowForward: true`):

```javascript
// Llamar en una página o componente
this.app.forward();
```

> **Nota**: El método `forward` debe llamarse en la instancia de la aplicación (`app`), no en la instancia de la página. Por ejemplo, use `this.app.forward()` en lugar de `this.forward()`.

### Comparación de métodos de navegación

| Método   | Historial                     | Escenario de uso                         |
| -------- | ----------------------------- | ---------------------------------------- |
| `goto`   | Agregar nuevo registro        | Navegación normal de página              |
| `replace`| Reemplazar registro actual    | Redirección después de iniciar sesión, redireccionamiento |
| `back`   | Retroceder al anterior        | Operación de regreso                     |
| `forward`| Avanzar al siguiente          | Operación de avance (requiere habilitación) |## Historial de rutas

### Obtener historial de enrutamiento

Obten todo el historial de rutas a través de la propiedad `routers`:

```javascript
const history = app.routers;
// Formato de retorno: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### Obtener la página actual

Obtener la instancia de la página actual mediante la propiedad `current`:

```javascript
const currentPage = app.current;
console.log("Página actual:", currentPage.src);
```

### Ejemplo del historial de enrutamiento

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // Se debe usar junto con allowForward
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## Escuchar cambios de ruta

Responder a los cambios de ruta escuchando el evento `router-change`.

### Uso básico

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Cambio de ruta:", data.name);
  console.log("URL de la página:", data.src);
});
```

### Datos del evento

El objeto de datos del evento `router-change` contiene:

| Atributo | Descripción | Valores posibles |
| ------ | ------------ | ------------------------------------ |
| `name` | Tipo de navegación | `goto`, `replace`, `forward`, `back` |
| `src`  | Dirección de la página de destino | Ruta de la página |### Ejemplo de uso

```javascript
export const ready = function () {
  // Escuchar cambios de ruta
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // Registrar visita a la página
    console.log(`[${name}] Navegar a: ${src}`);

    // Actualizar título de la página
    this.updateTitle(src);

    // Enviar datos estadísticos
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "Inicio",
      "about.html": "Acerca de nosotros",
      "contact.html": "Contáctenos",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "Aplicación";
  },

  trackPageView(src) {
    // Enviar estadísticas de visita de página
    console.log("Estadísticas de visita de página:", src);
  },
};
```

## Guardias de navegación de página

Combinando la escucha de rutas, se puede implementar la funcionalidad de guardias de navegación:

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // Comprobar si se requiere inicio de sesión
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## Ejemplo completo

<o-playground name="Ejemplo de enrutamiento y navegación" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("Aplicación inicializada");
      this.on("router-change", (e) => {
        console.log("Cambio de ruta:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
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
      <p>Historial de rutas: {{app.routerCount}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="gotoAbout">Navegación programática</button>
      <br><br>
      <button on:click="goForward()">Adelante</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">Atrás</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>Historial de rutas: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">Consejo: Después de hacer clic en "Atrás", puede hacer clic en "Adelante" en la página de inicio para volver aquí.</p>
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

