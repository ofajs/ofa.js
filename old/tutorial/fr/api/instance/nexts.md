# nexts



En utilisant l'attribut `nexts`, vous pouvez facilement obtenir toutes les instances d'éléments adjacents situés après l'élément actuel, et ces éléments seront retournés sous forme de tableau.

<o-playground name="nexts - éléments suivants" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

