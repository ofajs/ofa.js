# Inicialización de la aplicación

La fase de inicialización de la aplicación puede ejecutar algunas configuraciones globales, como agregar métodos personalizados, escuchar eventos, etc. `app-config.js` proporciona las opciones de configuración `ready` y `proto` para manejar la lógica de inicialización.

## ready - Callback de inicialización

`ready` es una función de devolución de llamada que se ejecuta después de que se cargan las configuraciones de la aplicación, y se pueden realizar operaciones de inicialización aquí.

### Uso básico

```javascript
export const ready = function() {
  console.log("Aplicación inicializada");
  // this se refiere a la instancia del elemento o-app
  console.log("Página actual:", this.current);
};
```

> **Nota**: `ready` debe declararse con una función declarativa o una expresión de función, no se puede usar una función flecha (ya que se necesita la vinculación correcta de `this`).

### Acceder a la instancia de la aplicación

En la función `ready`, `this` apunta a la instancia del elemento `o-app`, y se puede acceder a todos los métodos y propiedades de la aplicación:

```javascript
export const ready = function() {
  // Obtener la página actual
  console.log("Página actual:", this.current);
  
  // Obtener el historial de rutas
  console.log("Historial de rutas:", this.routers);
  
  // Escuchar cambios de ruta
  this.on("router-change", (e) => {
    console.log("Cambio de ruta:", e.data);
  });
};
```

### Ejemplo de inicialización

```javascript
export const ready = function() {
  // Inicializar el estado global
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // Recuperar la información del usuario del almacenamiento local
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // Escuchar cambios de ruta
  this.on("router-change", (e) => {
    // Registrar la visita a la página
    console.log("Página visitada:", e.data.src);
  });
};
```

## proto - Extensión de prototipos

`proto` se utiliza para agregar métodos personalizados y propiedades calculadas a la instancia de la aplicación, los cuales pueden ser accedidos en todas las páginas a través de `this.app`.

### Agregar métodos personalizados

```javascript
export const proto = {
  // Métodos personalizados
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // Método con parámetro
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### Agregar propiedades calculadas

```javascript
export const proto = {
  // propiedades calculadas
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### Ejemplo completo

```javascript
export const proto = {
  // Métodos de navegación
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // Propiedades calculadas
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // Métodos utilitarios
  showMessage(message) {
    alert(message);
  },
};
```

## Usar en la página

En el componente de página, se puede acceder a los métodos y propiedades personalizados de la instancia de la aplicación mediante `this.app`:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">Volver al inicio</button>
  <button on:click="app.navigateToProfile()">Centro personal</button>
  
  <p>¿Está en inicio? {{app.isAtHome}}</p>
  <p>¿Ha iniciado sesión? {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // Llama al método de la instancia de la aplicación
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## Gestión de estado global

Combinando `ready` y `proto`, se puede implementar una gestión de estado global simple:

```javascript
// app-config.js

export const ready = function() {
  // Inicializar estado global
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // Restaurar datos desde almacenamiento local
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // Usuario
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto("./login.html");
  },
  
  // Carrito
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // Tema
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## Ejemplo completo

<o-playground name="Ejemplo de inicialización de aplicación" style="--editor-height: 500px">
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
    export const ready = function() {
      console.log("Aplicación inicializada");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("Número de visitas:", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>¿Está en la página de inicio?: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">Volver a la página de inicio</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de aplicación ofa.js",
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
      <p>¿Está en la página de inicio?: {{app.isAtHome}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de aplicación ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

