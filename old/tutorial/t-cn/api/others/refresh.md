# refresh



`refresh` 方法用於主動刷新組件的渲染視圖。有時候組件上的數據沒有更新時，可以使用該方法刷新組件的視圖。

適用於需要手動刷新 [非響應式數據](../../documentation/property-response.md) 的場景。

<o-playground name="refresh - 刷新視圖" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">刷新</button>
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
