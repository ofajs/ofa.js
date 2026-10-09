# tag



La propriété `tag` est utilisée pour obtenir l'étiquette de l'élément, et retourne une chaîne en minuscules.

Dans l'exemple ci-dessous, nous montrons comment utiliser la méthode `tag` pour obtenir la balise d'un élément :

<o-playground name="tag - obtenir l'étiquette">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

