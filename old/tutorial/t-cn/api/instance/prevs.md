# prevs



使用 `prevs` 屬性，您可以輕鬆獲取當前元素之前的所有相鄰元素實例，這些元素將以數組的形式返迴。

<o-playground name="prevs - 前置元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>
