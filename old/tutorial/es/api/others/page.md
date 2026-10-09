# Componente o-page

`o-page` es uno de los componentes principales de ofa.js, que representa una página o módulo de página independiente. A continuación se presentan algunas propiedades y métodos clave de `o-page`:

## atributo src

`src` El atributo se utiliza para especificar la dirección concreta del módulo de la página. Es un atributo clave para especificar el contenido y el comportamiento de la página, indicando a la aplicación desde dónde cargar el contenido de una página determinada.

```javascript
const page = this;
```

## método goto

El método `goto` se utiliza para saltar de la página actual a otra página. En comparación con el método `goto` de `app`, el método `goto` de `page` puede utilizar **direcciones relativas** para navegar a otras páginas.

```javascript
page.goto("./page2.html");
```

## Método replace

El método `replace` se utiliza para reemplazar la página actual por otra. Es similar al método `replace` de `app`, pero realiza la operación de reemplazo dentro de la página.

```javascript
page.replace("./new-page.html");
```

## Método back

`back` método para volver a la página anterior. Esto navega al usuario de vuelta a la página anterior, similar a la operación de retroceso del navegador.

```javascript
page.back();
```