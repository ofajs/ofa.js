# refresh



`refresh` método se utiliza para actualizar activamente la vista de renderizado del componente. A veces, cuando los datos del componente no se actualizan, se puede usar este método para actualizar la vista del componente.

Adecuado para escenarios donde se necesita actualizar manualmente [datos no reactivos](../../documentation/property-response.md).

<o-playground name="refresh - Actualizar vista" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">Actualizar</button>
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

