# refresh



`refresh` メソッドは、コンポーネントのレンダリングビューを能動的にリフレッシュするために使用されます。コンポーネント上のデータが更新されていない場合、このメソッドを使用してコンポーネントのビューをリフレッシュすることができます。

手動での更新が必要な[非レスポンシブデータ](../../documentation/property-response.md)のシナリオに適用されます。

<o-playground name="refresh - ビューを更新" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">リフレッシュ</button>
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

