# remove

`remove` 方法用于删除目标节点。

**请注意，不要在 o-fill 或 o-if 等模板组件内操作。**

<o-playground name="remove - 删除节点" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>
