# clone

使用 `clone` 方法可以克隆并生成一份元素实例的副本。

<o-playground name="clone - 克隆元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">I am target</div>
      <div>logger:</div>
      <div id="logger"></div>
      <script>
        setTimeout(()=>{
          const tar = $('#target').clone();
          \$('#logger').push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>
