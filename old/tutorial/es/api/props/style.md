# style



El atributo `style` se mantiene igual que el nativo.

Ten en cuenta que la propiedad `style` no puede obtener el valor real de los estilos, sino solo el valor establecido en la propiedad `style`. Aunque el método `style` es similar al [método css](./css.md), no puede realizar una sobrescritura completa de estilos. En comparación con `css`, el método `style` tiene una mayor eficiencia de ejecución interna.

A continuación se muestra un ejemplo que demuestra cómo usar `style`:

<o-playground name="style - uso directo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Recuerda que el método `style` solo obtiene y establece los valores en el atributo `style`, no los estilos calculados reales.

## Uso de la sintaxis de plantillas

También puedes configurar el estilo del elemento objetivo mediante la sintaxis de plantilla.

<o-playground name="style - Sintaxis de plantillas" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
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

