# html



El método `html` se utiliza para obtener o establecer el código HTML interno del elemento objetivo.

<o-playground name="html - uso directo" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">target 1</span>
      </div>
      <div id="target2">origin text</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">new text</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Notas importantes

`html` es un método bastante peligroso, ya que al insertarlo en `script` también ejecutará automáticamente el código JavaScript interno, así que ten cuidado al usarlo para prevenir XSS.

## Uso de la sintaxis de plantillas

También puedes usar el atributo `:html` para establecer el valor HTML correspondiente en el elemento de destino. Esto es especialmente útil en la renderización de componentes.

<o-playground name="html - sintaxis de plantilla" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>Rendered html:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>change txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

