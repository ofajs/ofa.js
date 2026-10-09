# extend



`extend` es un método de orden superior utilizado para extender las propiedades o métodos de una instancia.

> Normalmente, no se recomienda que los usuarios extiendan las propiedades o métodos de la instancia, ya que esto aumenta el costo de aprendizaje. A menos que haya escenarios específicos dentro del equipo que requieran personalizar el comportamiento de la instancia, no se recomienda hacerlo.

<o-playground name="extend - Ejemplo de extensión" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 1</li>
        <li id="target">Soy el objetivo</li>
        <li>Soy 3</li>
      </ul>
      <div id="logger">registrador</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js es bueno";
          },
          say(){
            return 'hola';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          bueno : ${target.good} <br>
          decir() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Extender $ capa inferior

Similar a jQuery, también puedes extender las propiedades o métodos de la instancia subyacente mediante fn.extend; las propiedades o métodos extendidos desde fn se aplicarán a todas las instancias.

<o-playground name="extend - extensión base" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Sintaxis de plantilla ampliada

Mediante la extensión de propiedades o funciones con `extend`, se pueden aumentar las funcionalidades de la sintaxis de plantillas, e incluso proporcionar azúcar sintáctico exclusivo para componentes. Pero es importante tener en cuenta que **no se debe usar** sintaxis de plantilla no oficial, ya que imponen un cierto costo de aprendizaje para los usuarios, y una gran cantidad de azúcar sintáctico no oficial puede reducir la experiencia de desarrollo.

### Propiedades extendidas

Puedes usar `:` en la plantilla a través de la extensión de atributos. A continuación, extenderemos un atributo `red`. Cuando `red` sea `true`, el color de la fuente se volverá rojo:

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - atributo extendido" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, agregamos un atributo `red` a la sintaxis de la plantilla. Cuando `count % 3` no es igual a 0, el color de la fuente se vuelve rojo.

### Métodos de extensión

También puedes hacerlo disponible en la sintaxis de plantilla mediante el método de extensión `extend`. El nombre del método es la parte antes de los dos puntos. Aquí, hemos extendido una sintaxis de plantilla `color`, y los parámetros que la siguen se pasarán al método de extensión definido.

Aquí se ha establecido el atributo `always` como `true`, lo que significa que cada vez que el componente necesite refrescar la interfaz, se llamará a este método definido. Si no se establece `always`, esta función de sintaxis de plantilla solo se ejecutará una vez.

Entre ellos, `options` proporciona más parámetros, que pueden ayudarte a desarrollar una sintaxis de plantilla más personalizada:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - método de extensión" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Add Count</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Principio de sintaxis de plantillas

Hasta ahora, deberías haber entendido que muchas de las sintaxis de plantillas en ofa.js en realidad se extienden a través de `extend`:

- Los métodos `class`, `attr` se ejecutan cada vez que se actualiza la vista
- La vinculación de funciones como `on`, `one` solo se ejecuta una vez

Puedes consultar el siguiente ejemplo para comprender mejor el principio de renderizado de plantillas de ofa.js:

<o-playground name="extend - principio de la sintaxis de plantillas" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

