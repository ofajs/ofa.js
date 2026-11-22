# remove



La méthode `remove` est utilisée pour supprimer le nœud cible.

**Veuillez noter, ne pas opérer à l'intérieur des composants de modèle tels que o-fill ou o-if.**

<o-playground name="remove - supprimer un nœud" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

