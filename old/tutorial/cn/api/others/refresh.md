# refresh

`refresh` 方法用于主动刷新组件的渲染视图。有时候组件上的数据没有更新时，可以使用该方法刷新组件的视图。

适用于需要手动刷新 [非响应式数据](../../documentation/property-response.md) 的场景。

<o-playground name="refresh - 刷新视图" style="--editor-height: 400px">
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
