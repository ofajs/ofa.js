# all



En utilisant la méthode `all`, vous pouvez obtenir tous les éléments de la page qui correspondent à un sélecteur CSS, et retourner un tableau contenant les instances de ces éléments.

<o-playground name="all - obtenir tous les éléments" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Récupérer les éléments enfants

L'instance possède également la méthode `all`, qui permet de sélectionner et d'obtenir les éléments enfants via la méthode `all` sur l'instance.

<o-playground name="all - Obtenir les éléments enfants" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>I am 1</li>
          <li>I am 2</li>
          <li>I am 3</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

