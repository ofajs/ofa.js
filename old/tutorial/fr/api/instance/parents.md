# parents



En utilisant la propriété `parents`, vous pouvez facilement obtenir toutes les instances d'éléments parents de l'élément actuel, et ces éléments seront retournés sous forme de tableau.

<o-playground name="parents - élément parent" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>I am 1</li>
          <li id="target">I am target</li>
          <li>I am 3</li>
        </ul>
      </div>
      <div>
        logger: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>

