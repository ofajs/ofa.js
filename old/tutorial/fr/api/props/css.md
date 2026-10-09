# css



`css` méthode est utilisée pour obtenir ou définir le style d'un élément cible.

## Utilisation directe

Vous pouvez utiliser directement la méthode `css` pour obtenir ou définir le style d'un élément.

<o-playground name="css - utilisation directe" style="--editor-height: 300px">
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

## Configuration complète

Grâce à l'objet `css` acquis, vous pouvez directement définir la valeur de style sur l'élément.

<o-playground name="css - Configuration complète" style="--editor-height: 400px">
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

En utilisant les propriétés de l’objet `css`, vous pouvez rapidement ajuster le style de l’élément cible.

## Utilisation via la syntaxe de modèle

Vous pouvez également définir le style de l'élément cible à l'aide de la syntaxe de modèle.

<o-playground name="css - Syntaxe du modèle" style="--editor-height: 400px">
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

## Astuces pour configurer le css

Vous pouvez modifier une propriété de style d'un élément en utilisant `$ele.css = {...$ele.css, color:'red'}` sans affecter les autres propriétés de style. Cette approche permet de ne modifier qu'une seule propriété sans avoir à réécrire l'ensemble du style.

### Exemple

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

Dans l'exemple ci-dessus, en utilisant `{ ...myElement.css, color: 'red' }`, nous avons modifié uniquement le style de couleur de l'élément, tout en gardant les autres propriétés de style inchangées. C'est une astuce très pratique qui permet de modifier les styles d'un élément de manière flexible.