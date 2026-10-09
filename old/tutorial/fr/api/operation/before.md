# before



`before` méthode est utilisée pour ajouter des éléments avant l'élément cible. Avant d'exécuter l'opération `before`, l'initialisation de la [méthode $](../instance/dollar.md) est automatiquement effectuée, ce qui permet de remplir directement une chaîne d'éléments ou un objet spécifique.

**Veuillez noter, ne pas opérer à l'intérieur des composants de modèle tels que o-fill ou o-if.**

<o-playground name="before - ajouter avant" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

