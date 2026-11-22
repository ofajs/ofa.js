# is



La méthode `is` est utilisée pour vérifier si un élément correspond à une expression.

<o-playground name="is - Détection des éléments" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          Is li: ${target.is('li')} <br>
          Is div: ${target.is('div')} <br>
          Have id: ${target.is('[id]')} <br>
          Have class: ${target.is('[class]')} <br>
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

