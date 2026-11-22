# off

使用 `off` 方法可以注销已注册的事件处理程序，以取消对事件的监听。

下面是一个示例，演示如何使用 `off` 方法取消事件监听：

<o-playground name="off - 移除事件监听" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们注册了一个点击事件处理程序 `f`，当按钮被点击时，事件处理程序会在 `#logger` 中显示点击次数。使用 `off` 方法，我们在点击次数达到3时取消了事件的监听。
