# tag

`tag` 属性用于获取元素的标签，返回一个小写字符串。

在下面的示例中，我们演示了如何使用 `tag` 方法来获取一个元素的标签：

<o-playground name="tag - 获取标签">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>
