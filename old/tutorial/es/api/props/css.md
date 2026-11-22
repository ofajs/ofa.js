# css



`css` método se utiliza para obtener o establecer el estilo del elemento objetivo.

## Uso directo

Puedes usar directamente el método `css` para obtener o establecer el estilo de un elemento.

<o-playground name="css - uso directo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## Configuración completa

A través del objeto `css` obtenido, puedes establecer directamente los valores de estilo en el elemento.

<o-playground name="css - Configuración completa" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

Usando las características del objeto `css`, puedes ajustar rápidamente el estilo del elemento objetivo.

## Uso de la sintaxis de plantillas

También puedes configurar el estilo del elemento objetivo mediante la sintaxis de plantilla.

<o-playground name="css - sintaxis de plantilla" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Consejos para configurar CSS

Puedes modificar una propiedad de estilo de un elemento mediante `$ele.css = {...$ele.css, color:'red'}` sin afectar otras propiedades de estilo. Esta forma permite modificar solo una propiedad sin reescribir todo el estilo.

### Ejemplo

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

En el ejemplo anterior, al usar `{ ...myElement.css, color: 'red' }`, solo modificamos el color del elemento y mantenemos el resto de las propiedades de estilo sin cambios. Esta es una técnica muy conveniente para modificar dinámicamente los estilos de un elemento.