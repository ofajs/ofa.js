# next

使用 `next` 属性，你可以获取元素的后一个相邻元素实例。

<o-playground name="next - 后一个元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').next.text = "change target next element";
          \$("#logger1").text = \$('#first').next === $('#target')
        },500);
      </script>
    </template>
  </code>
</o-playground>
