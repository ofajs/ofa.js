# shadow



En utilisant l'attribut `shadow`, vous pouvez obtenir l'instance de la racine fantôme (shadow root) d'un élément.

<o-playground name="shadow - nœud fantôme" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Il convient de noter qu’il faut éviter de modifier directement les éléments à l’intérieur des nœuds fantômes dans les éléments comportant une syntaxe de modèle, afin de garantir la cohérence et la maintenabilité des opérations.

## Obtenir l’instance d’un élément à l’intérieur de l’ombre d’un composant depuis l’extérieur

Vous pouvez également obtenir une instance d’élément personnalisé depuis l’extérieur, puis accéder aux éléments à l’intérieur du nœud fantôme via la propriété `shadow`, comme suit :

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - accès externe" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

