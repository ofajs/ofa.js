# prevs



En utilisant l'attribut `prevs`, vous pouvez facilement obtenir toutes les instances d'éléments adjacents précédant l'élément actuel, et ces éléments seront renvoyés sous forme de tableau.

<o-playground name="prevs - éléments précédents" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

