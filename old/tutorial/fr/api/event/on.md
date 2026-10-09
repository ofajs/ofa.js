# on



En utilisant la méthode `on`, vous pouvez enregistrer des gestionnaires d'événements pour les éléments cibles. Cela vous permet de capturer et de répondre facilement aux interactions des utilisateurs.

Voici un exemple montrant comment utiliser la méthode `on` pour enregistrer un gestionnaire d'événements de clic pour un élément bouton :

<o-playground name="événement on - click" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">ajouter le compteur</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous utilisons la méthode `on` pour ajouter un gestionnaire d'événement de clic à un élément de bouton. Lorsque l'utilisateur clique sur le bouton, le gestionnaire d'événement est déclenché, le compteur s'incrémente et le résultat s'affiche sur la page.

## Utilisation via la syntaxe de modèle

Vous pouvez également utiliser la syntaxe de modèle pour lier des méthodes à des éléments cibles.

<o-playground name="on - Syntaxe de modèle" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

Dans cet exemple, nous utilisons `on:click` sur l'élément bouton pour lier une méthode nommée `addCount`. Lorsque l'utilisateur clique sur le bouton, cette méthode est appelée, la valeur du compteur s'incrémente et s'affiche sur la page. Cette approche vous permet d'associer des gestionnaires d'événements à des méthodes de composant pour réaliser des interactions plus complexes.

## event



Après l'enregistrement de l'événement, la fonction déclenchée recevra l'objet event, conformément au comportement natif :

<o-playground name="paramètre on - event" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

