# $

El método `$` es la función central en ofa.js, utilizada para obtener y manipular instancias de elementos DOM. A continuación se presentan las funciones principales de `$`:

## Obtener instancia del elemento

Mediante el método `$`, puedes obtener la primera instancia de elemento que coincida con un [selector CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) en la página y operar sobre él. A continuación, se muestra un ejemplo:

<o-playground name="$ - Obtener elemento">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

En el ejemplo anterior, usamos el símbolo `$` para seleccionar la instancia del elemento con `id` "target1", y modificamos su contenido de texto configurando la propiedad `text`.

## Ejemplo de búsqueda de elementos secundarios

Las instancias también tienen el método `$`, a través del cual se puede obtener la primera instancia de elemento hijo que cumpla las condiciones.

<o-playground name="$ - Buscar elemento hijo">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

Por favor, no insertes directamente la instancia de un elemento obtenida en otro lugar, ya que esta operación afectará al elemento original. Si necesitas crear una copia, puedes utilizar el método [clone](./clone.md).

<o-playground name="$ - Características de la instancia" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Obtener los elementos hijos dentro del nodo sombra

Se puede obtener una instancia a través de la propiedad [shadow](./shadow.md), y luego usar el método `$` para obtener el elemento deseado:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Instanciación directa de elementos

Puedes inicializar directamente el elemento nativo como una instancia de `$` de la siguiente manera:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

De esta manera, puedes convertir fácilmente los elementos HTML existentes en instancias de `$` para utilizar las funciones que `$` proporciona para operar y procesar.

## Generar instancia de elemento

Además, `$` para obtener instancias de elementos existentes también se puede usar para crear nuevas instancias de elementos y agregarlas a la página.

### Generación a través de cadenas

Puedes usar la función `$` para crear una nueva instancia de elemento a partir de una cadena, como se muestra a continuación:

<o-playground name="$ - Generación de cadenas" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">añadir texto target 1</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, utilizamos la función `$` para crear una nueva instancia de elemento con el estilo y el contenido de texto especificados, y la añadimos dentro de la instancia de elemento existente con `id` "target1".

### Generación a través de objetos

También puedes usar la función `$` para generar una nueva instancia de elemento mediante un objeto, como se muestra a continuación:

<o-playground name="$ - generación de objetos" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos la función `$` para definir una nueva instancia de elemento mediante un objeto, incluyendo el tipo de etiqueta, el contenido de texto y los atributos de estilo, y la agregamos dentro de una instancia de elemento existente con el `id` "target1".

## Relación entre los ejemplos obtenidos y las instancias de páginas/componentes

`$` método se puede utilizar para obtener la instancia del elemento de página o componente correspondiente desde el ámbito global, y su función es la misma que la referencia `this` en los métodos del ciclo de vida dentro del módulo de página o componente.

```html
<!DOCTYPE html>
...
<l-m src="./test-comp.html"></l-m>
<test-comp id="target"></test-comp>
<script type="module">
  setTimeout(()=>{
    console.log($('#target').title);  // => Ejemplo de componente OFAJS
  },300);
</script>
```

```html
<!-- test-comp.html -->
 <template component>
  <div>
    <p>{{title}}</p>
  </div>
  <script>
    export default async ({ load }) => {
      return {
        tag: "test-comp",
        data: {
          title: "Ejemplo de componente OFAJS",
        },
        attached(){
          console.log(this === $('#target')); // true
        }
      };
    };
  </script>
 </template>
```