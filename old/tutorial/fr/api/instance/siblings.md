# siblings



En utilisant la propriété `siblings`, vous pouvez facilement obtenir toutes les instances d'éléments adjacents de l'élément actuel, ces éléments seront retournés sous forme de tableau.

<o-playground name="siblings - éléments adjacents" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

