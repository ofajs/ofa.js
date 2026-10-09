# Ajouter ou supprimer des éléments enfants

Les instances d'éléments possèdent des propriétés similaires à celles des tableaux : pour ajouter ou supprimer des nœuds, il suffit d'utiliser les méthodes de manipulation de tableaux. Lorsque vous utilisez les méthodes `push`, `unshift`, `pop`, `shift` et `splice`, l'initialisation de la [méthode $](../instance/dollar.md) est automatiquement effectuée en interne. Il est donc possible de renseigner directement des chaînes ou des objets d'éléments spécifiques.

De même, vous pouvez également utiliser d'autres méthodes de tableau, telles que `forEach`, `map`, `some`, etc.

**Veuillez noter de ne pas ajouter ou supprimer d’éléments enfants sur les éléments possédant une syntaxe de template.**

## push



Ajouter un élément enfant à la fin.

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



Ajouter un élément enfant au début du tableau.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



Supprimer le sous-élément depuis la fin.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li>Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



Supprimer des éléments enfants au début du tableau.

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Je suis 1</li>
        <li>Je suis 2</li>
        <li>Je suis 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



Il est possible de supprimer ou remplacer des éléments enfants existants, et également d'en ajouter de nouveaux. Son utilisation est similaire à la méthode `splice` des tableaux.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">new li 1</li>`, `<li style="color:green;">new li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

