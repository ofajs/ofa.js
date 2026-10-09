# Características de los datos de instancia

Los objetos de instancia obtenidos o creados mediante `$` poseen todas las características de datos de stanz, ya que las instancias de `$` heredan de stanz. Esto significa que puedes utilizar los métodos de operación de datos y las características proporcionadas por `stanz` para manipular y monitorear los datos de los objetos de instancia.

> Los siguientes ejemplos utilizan elementos regulares, ya que los componentes personalizados suelen tener datos registrados incorporados, mientras que los elementos regulares generalmente solo contienen información de etiquetas, por lo que son más adecuados para la demostración.

## watch



Las instancias pueden monitorear cambios de valor mediante el método `watch`; incluso si se modifica el valor de un objeto secundario, también se puede detectar el cambio en el método `watch` del objeto.

A continuación se muestra un ejemplo que demuestra cómo usar la instancia `$` y el método `watch`:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos un objeto de instancia `$` llamado `target`, y luego usamos el método `watch` para monitorear sus cambios. Incluso si modificamos el valor de un subobjeto del objeto, como el valor de `target.bbb.child.val`, el método `watch` puede detectar estos cambios y actualizar el contenido del elemento `logger`. Esto demuestra la poderosa característica del objeto de instancia `$`, que te permite monitorear fácilmente los cambios en un objeto.

## watchTick



`watchTick` y el método `watch` tienen funciones similares, pero `watchTick` tiene una operación de throttling interna, que se ejecuta una vez en un solo hilo, por lo que en algunos escenarios con mayores requisitos de rendimiento, puede monitorear los cambios de datos de manera más efectiva.

A continuación se muestra un ejemplo que demuestra cómo usar el método `watchTick` de la instancia `$`:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'Número de ejecuciones de watch: ' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'Número de ejecuciones de watchTick: ' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos una instancia del objeto `$` llamada `target`. Luego, utilizamos el método `watch` y el método `watchTick` para monitorear los cambios del objeto. El método `watch` se ejecuta inmediatamente cuando los datos cambian, mientras que el método `watchTick` se ejecuta una vez en un solo hilo, lo que permite limitar la frecuencia de las operaciones de monitoreo. Puedes elegir usar el método `watch` o `watchTick` para monitorear los cambios en los datos según tus necesidades.

## unwatch



`unwatch` método se utiliza para cancelar la escucha de datos, y puede revocar la escucha de `watch` o `watchTick` registrada anteriormente.

Aquí hay un ejemplo que demuestra cómo usar el método `unwatch` de la instancia `$`:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero creamos una instancia `$` llamada `target`, luego registramos dos observadores mediante los métodos `watch` y `watchTick`. Después, utilizamos el método `unwatch` pasando los valores de retorno previamente guardados `tid1` y `tid2` para cancelar ambos observadores. Esto significa que el cambio de propiedad dentro del primer `setTimeout` no activará ningún observador, ya que han sido cancelados.

## Valor no escuchado

En la instancia `$`, los nombres de propiedades que comienzan con guion bajo `_` indican que estos valores no serán monitoreados por los métodos `watch` o `watchTick`. Esto es muy útil para propiedades temporales o privadas, ya que puedes modificarlas libremente sin activar la monitorización.

Dentro de la plantilla, esto se conoce como [datos no reactivos](../../documentation/state-management.md).

A continuación se muestra un ejemplo que demuestra cómo utilizar valores de atributo que comienzan con guión bajo para evitar ser escuchado:

<o-playground name="stanz - datos no reactivos" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un objeto instancia `$` llamado `target`, y luego utilizamos el método `watch` para escuchar los cambios en el valor de las propiedades. En `setTimeout`, intentamos cambiar el valor de la propiedad `_aaa`, pero este cambio no activará la escucha. Esto es muy útil para situaciones en las que se necesita actualizar el valor de una propiedad sin activar la escucha.

## Características básicas

Los datos de objeto establecidos en la instancia se convertirán en una instancia de Stanz, y este tipo de instancia de Stanz permite la escucha.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

También podemos utilizar `$.stanz` para crear un dato Stanz que no esté vinculado a una instancia.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

Estos ejemplos muestran las características básicas de configurar datos de objeto como instancias de Stanz para su escucha.

Para más características completas, consulte [stanz](https://github.com/ofajs/stanz).