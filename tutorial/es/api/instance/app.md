# app



Los elementos dentro de `o-app`, incluyendo aquellos dentro del nodo sombra de `o-page` dentro de `o-app`, o subcomponentes internos, su atributo `app` apunta a la instancia del elemento `o-app`.

## Obtener una instancia de la aplicación

A continuación se muestra un ejemplo que demuestra cómo acceder al atributo `app` dentro de los elementos en `o-app`:


<o-playground name="app - Obtener instancia de la aplicación" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    // Métodos disponibles en la aplicación
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
    // Configuración de la animación de cambio de página
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
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Ejemplos de uso de la aplicación

Después de obtener la instancia `app`, puedes:

### 1. Método personalizado para acceder a la aplicación

Los métodos personalizados agregados a través de la opción de configuración `proto` en `app-config.js` pueden ser llamados desde cualquier página o componente mediante `this.app`:

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// Usar en una página o componente
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("Usuario ha iniciado sesión");
}
```

### 2. Acceder a las propiedades de la aplicación

```javascript
// Obtener la página actual
const currentPage = this.app.current;

// Obtener el historial de enrutamiento
const routers = this.app.routers;

// Acceder a los datos globales
const user = this.app.globalData?.user;
```

### 3. Llamar al método de navegación

```javascript
// Navegar a página
this.app.goto("./about.html");

// Volver a la página anterior
this.app.back();

// Reemplazar la página actual
this.app.replace("./login.html");
```

### 4. Escuchar eventos de la aplicación

```javascript
// Escuchar cambios de ruta
this.app.on("router-change", (e) => {
  console.log("Cambio de ruta:", e.data);
});
```

## Documentación detallada

Para obtener información sobre cómo configurar la lógica de inicialización de la aplicación y agregar métodos personalizados en `app-config.js`, consulte:

- **[Inicialización de la aplicación](../../documentation/app-initialization.md)** - Explica detalladamente cómo usar las opciones de configuración `ready` y `proto`
- **[Enrutamiento y navegación](../../documentation/app-navigation.md)** - Explica detalladamente los métodos de navegación de la aplicación y la escucha de rutas

## Propiedades y métodos comunes de la instancia de la aplicación

| Propiedad/Método | Descripción |
|----------|------|
| `current` | Instancia de página actual |
| `routers` | Historial de rutas |
| `globalData` | Datos globales (debes inicializarlos en `ready` por ti mismo) |
| `goto(src)` | Saltar a la página especificada |
| `back()` | Volver a la página anterior |
| `replace(src)` | Reemplazar la página actual |
| `forward()` | Ir a la página siguiente |
| `on(event, callback)` | Escuchar eventos de la aplicación |
| Métodos personalizados | Métodos personalizados añadidos mediante la configuración `proto` |