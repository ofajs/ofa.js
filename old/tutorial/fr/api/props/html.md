# html



`html` méthode utilisée pour obtenir ou définir le code HTML à l'intérieur de l'élément cible.

<o-playground name="html - utilisation directe" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">target 1</span>
      </div>
      <div id="target2">texte d'origine</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">nouveau texte</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Points d'attention

`html` est une méthode relativement dangereuse : même si un `script` y est injecté, le code JavaScript interne s’exécute automatiquement ; veillez à prévenir les XSS lors de son utilisation.

## Utilisation via la syntaxe de modèle

Vous pouvez également utiliser l'attribut `:html` pour définir la valeur HTML correspondante sur l'élément cible. Cela est particulièrement utile dans le rendu des composants.

<o-playground name="html - syntaxe de modèle" style="--editor-height: 500px">
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

