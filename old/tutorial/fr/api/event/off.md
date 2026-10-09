# off



Utiliser la méthode `off` permet de désenregistrer un gestionnaire d'événements déjà enregistré, afin d'annuler l'écoute de l'événement.

Voici un exemple montrant comment utiliser la méthode `off` pour supprimer un écouteur d’événement :

<o-playground name="off - supprimer l'écouteur d'événement" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous avons enregistré un gestionnaire d'événements `f` pour le clic. Lorsque le bouton est cliqué, le gestionnaire affiche le nombre de clics dans `#logger`. En utilisant la méthode `off`, nous avons supprimé l'écoute de l'événement lorsque le nombre de clics a atteint 3.