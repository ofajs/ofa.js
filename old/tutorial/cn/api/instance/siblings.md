# siblings

使用 `siblings` 属性，您可以轻松获取当前元素的所有相邻元素实例，这些元素将以数组的形式返回。

<o-playground name="siblings - 相邻元素" style="--editor-height: 360px">
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
