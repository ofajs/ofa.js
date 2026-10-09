# after



La méthode `after` est utilisée pour ajouter un élément après l'élément cible. Avant d'exécuter l'opération `after`, l'opération d'initialisation de la [méthode `$`](../instance/dollar.md) est automatiquement effectuée, vous pouvez donc directement indiquer une chaîne ou un objet d'élément concret.

**Veuillez noter, ne pas opérer à l'intérieur des composants de modèle tels que o-fill ou o-if.**

<o-playground name="after - ajouter après" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

