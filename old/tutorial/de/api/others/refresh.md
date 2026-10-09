# refresh



`refresh`-Methode dient dazu, die Renderansicht einer Komponente aktiv zu aktualisieren. Wenn die Daten einer Komponente nicht aktualisiert werden, kann diese Methode verwendet werden, um die Ansicht der Komponente zu aktualisieren.

Geeignet für Szenarien, in denen [nicht-reaktive Daten](../../documentation/property-response.md) manuell aktualisiert werden müssen.

<o-playground name="refresh - Ansicht aktualisieren" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">Aktualisieren</button>
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

