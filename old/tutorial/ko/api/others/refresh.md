# refresh



`refresh` 메서드는 컴포넌트의 렌더링 뷰를 능동적으로 새로 고치는 데 사용됩니다. 때로는 컴포넌트의 데이터가 업데이트되지 않았을 때 이 메서드를 사용해 컴포넌트의 뷰를 새로 고칠 수 있습니다.

수동 새로고침이 필요한 [비반응형 데이터](../../documentation/property-response.md) 시나리오에 적용됩니다.

<o-playground name="refresh - 뷰 새로고침" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">새로고침</button>
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

