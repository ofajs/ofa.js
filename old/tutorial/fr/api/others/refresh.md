# refresh



La méthode `refresh` est utilisée pour rafraîchir activement la vue de rendu du composant. Lorsque les données sur le composant ne sont pas mises à jour, vous pouvez utiliser cette méthode pour rafraîchir la vue du composant.

Convient aux scénarios nécessitant un rafraîchissement manuel des [données non réactives](../../documentation/property-response.md).

<o-playground name="refresh - Rafraîchir la vue" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">Rafraîchir</button>
      <script>
        export default {
          tag: "refresh-demo",
          data: {
            _count: 0,
          },
          attached() {
            this._timer = setInterval(() => {
              this._count++;
            }, 200);
          },
        };
      </script>
    </template>
  </code>
</o-playground>

