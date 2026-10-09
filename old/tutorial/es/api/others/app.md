# o-app componente

`o-app` es uno de los componentes centrales de ofa.js, utilizado para configurar y gestionar toda la aplicación. A continuación se presentan algunas propiedades y métodos clave de la aplicación:

## src



El atributo `src` se utiliza para especificar la dirección concreta del módulo de configuración de parámetros de la aplicación.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



`current` propiedad se utiliza para obtener la instancia de la página que se está mostrando. Esto puede ayudarle a acceder y manipular la página que se está mostrando actualmente, por ejemplo, para actualizar su contenido o realizar operaciones específicas.

```javascript
const currentPage = app.current;
```

## goto



`goto` método se utiliza para saltar a la página especificada. Puede pasar la dirección de la página de destino, la aplicación cargará y mostrará esa página. Este es un método importante para la navegación de la aplicación.

```javascript
app.goto("/page2.html");
```

## replace



`replace` es similar a `goto`, pero se utiliza para reemplazar la página actual en lugar de añadir una nueva página a la pila. Esto puede usarse para implementar la sustitución de páginas en lugar de la navegación por pila.

```javascript
app.replace("/new-page.html");
```

## back



El método `back` se utiliza para volver a la página anterior, realizando la operación de retroceso en la navegación. Esto lleva al usuario de regreso a la página anterior.

```javascript
app.back();
```

## routers



El atributo `routers` contiene la información de configuración de rutas de la aplicación. Es un atributo importante que define las reglas y mapeos de rutas para cada página dentro de la aplicación. La configuración de rutas determina la navegación entre páginas y cómo se manejan las URL.

```javascript
const routeConfig = app.routers;
```