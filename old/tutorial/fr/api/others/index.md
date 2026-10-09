# index



L'attribut `index` sert à obtenir la position d’un élément parmi ses frères. Cette position est comptée à partir de 0 ; ainsi, le premier élément se trouve en position 0, le second en position 1, et ainsi de suite.

Dans l'exemple ci-dessous, nous démontrons comment utiliser la propriété `index` pour obtenir la position d'un élément sous son élément parent :

<o-playground name="index - Obtenir la position" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

Dans cet exemple, nous sélectionnons d'abord un élément `<li>` avec l'`id` "target". Ensuite, nous utilisons l'attribut `index` pour obtenir la position de cet élément sous son élément parent `<ul>`, c'est-à-dire le deuxième élément, donc la valeur de `index` est 1. Enfin, cette valeur est affichée dans l'élément `<div>` avec l'`id` "logger".