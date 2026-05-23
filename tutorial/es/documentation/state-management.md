# Gestión de estado

## ¿Qué es el estado?

En ofa.js, el **estado** se refiere al atributo `data` del propio componente o módulo de página. Este estado solo puede usarse en el componente actual para almacenar y gestionar los datos internos de dicho componente.

Cuando varios componentes o páginas necesitan compartir los mismos datos, el enfoque tradicional consiste en transmitirlos mediante eventos o pasar propiedades (props) de capa en capa, lo que en aplicaciones complejas dificulta el mantenimiento del código. Por lo tanto, se necesita una **gestión del estado** —definiendo un objeto de estado compartido que permita a múltiples componentes o módulos de página acceder y modificar estos datos, logrando así la compartición del estado.

> **Consejo**: La gestión de estado es adecuada para escenarios que requieren compartir datos entre componentes y páginas, como información de usuario, carrito de compras, configuración de temas, configuración global, etc.

## Generar objeto de estado

Para crear un objeto de estado reactivo mediante `$.stanz({})`. Este método recibe un objeto normal como datos iniciales y devuelve un proxy de estado reactivo.

### Uso básico (estado global)

<o-playground name="Ejemplo de gestión de estado" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Dirección de la página de inicio de la aplicación
    export const home = "./list.html";
    // Configuración de animación de transición de página
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
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Pete",
        info: "Cada día es un nuevo comienzo, el sol siempre brilla después de la tormenta.",
    },{
        id: 10020,
        name: "Mike",
        info: "La vida es como un océano, solo los fuertes de voluntad pueden llegar al otro lado.",
    },{
        id: 10030,
        name: "John",
        info: "El secreto del éxito es mantener tus sueños y nunca rendirte.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>Contactos</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Nombre: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detalle</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // Al destruir el componente, limpiar los datos de estado montados
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Atrás</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        Nombre de usuario: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">ID de usuario: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // Al destruir el componente, limpiar los datos de estado montados
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Características del objeto de estado

### 1. Actualización responsiva

`$.stanz()` crea un objeto de estado reactivo. Cuando los datos del estado cambian, todos los componentes que hacen referencia a esos datos se actualizan automáticamente.

```javascript
const store = $.stanz({ count: 0 });

// En el componente
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // Todos los componentes que hacen referencia a store.count se actualizarán automáticamente
    },
  },
  attached() {
    // Referencia directa a la propiedad del objeto de estado
    this.store = store;
  },
  detached() {
    this.store = {}; // Cuando el componente se destruye, limpia los datos de estado montados
  },
};
```

### 2. Respuesta profunda

El objeto de estado admite reactividad profunda; los cambios en objetos y arrays anidados también serán detectados.

```javascript
const store = $.stanz({
  user: {
    name: "ZhangSan",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// Modificar propiedades anidadas también desencadena actualizaciones
store.user.name = "LiSi";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "Nueva tarea" });
```

## Mejores prácticas

### 1. Montar el estado durante la fase attached del componente

Se recomienda montar el estado compartido en el ciclo de vida `attached` del componente:

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // Monta el estado compartido en los datos del componente
    this.list = data.list;
  },
  detached() {
    // Al destruir el componente, limpia los datos de estado montados para evitar fugas de memoria
    this.list = [];
  },
};
```

### 2. Gestión razonable del ámbito del estado

El alcance del estado depende de la **ubicación de definición y el método de exportación**:

**Estado exportado con `export` en archivos JS independientes**: estado global, accesible y modificable desde toda la aplicación, se utiliza tras importarlo con `import` o `load`.

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**Estado definido internamente en la página o módulo del componente**: estado del módulo, utilizado únicamente dentro de ese módulo.

```html
<template component>
  ...
  <script>
    const localStore = $.stanz({ total: 0 });

    export default async () => {
      return {
        data: {
          localStore: {}
        },
        attached() {
          this.localStore = localStore;
        },
        detached() {
          // Cuando el componente se destruye, limpiar los datos de estado montados
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## Gestión de estado dentro del módulo

<o-playground name="Ejemplo de gestión de estado dentro del módulo" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Añadir elemento</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Añadir total de tienda</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // Al destruir el componente, vacía los datos de estado montados
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notas importantes

1. **Limpieza de estado**: En el ciclo de vida `detached` del componente, limpie oportunamente las referencias a los datos de estado para evitar fugas de memoria.

2. **Evitar dependencias circulares**: No forme referencias circulares entre objetos de estado, ya que esto puede causar problemas en el sistema reactivo.

3. **Estructuras de datos grandes**: Para estructuras de datos grandes, considere usar propiedades computadas o gestión por fragmentos para evitar costes de rendimiento innecesarios.

4. **Consistencia del estado**: Preste atención a la consistencia del estado en operaciones asíncronas; puede usar transacciones o actualizaciones por lotes para garantizar la integridad de los datos.