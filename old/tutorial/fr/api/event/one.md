# one



En utilisant la méthode `one`, vous pouvez enregistrer un gestionnaire d’événement unique pour l’élément cible, ce qui signifie que le gestionnaire sera automatiquement désactivé après la première occurrence et ne se déclenchera plus.

Voici un exemple montrant comment utiliser la méthode `one` pour enregistrer un gestionnaire d’événement de clic sur un élément bouton :

<o-playground name="one - click événement unique" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la méthode `one` pour ajouter un gestionnaire d'événement de clic à un élément bouton. Lorsque l'utilisateur clique sur le bouton, le gestionnaire d'événement se déclenche, mais ne se déclenchera plus par la suite car il a été désassocié.

## Utilisation via la syntaxe de modèle

Vous pouvez également utiliser la syntaxe de modèle pour lier un gestionnaire d’événements unique à l’élément cible.

<o-playground name="one - syntaxe de template" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la liaison `one:click` sur l'élément bouton pour lier une méthode nommée `addCount`. Lorsque l'utilisateur clique sur le bouton, cette méthode sera appelée, mais elle ne se déclenchera plus par la suite, car il s'agit d'un gestionnaire d'événements à usage unique.