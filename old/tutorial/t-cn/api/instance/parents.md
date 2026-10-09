# parents



使用 `parents` 屬性，您可以輕鬆獲取當前元素的所有父元素實例，這些元素將以數組的形式返迴。

<o-playground name="parents - 父元素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>I am 1</li>
          <li id="target">I am target</li>
          <li>I am 3</li>
        </ul>
      </div>
      <div>
        logger: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>
