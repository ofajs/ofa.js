# siblings



使用 `siblings` 屬性，您可以輕鬆獲取當前元素的所有相鄰元素實例，這些元素將以數組的形式返迴。

<o-playground name="siblings - 相鄰元素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>
