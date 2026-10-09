# tag



`tag` 屬性用於獲取元素的標籤，返迴一個小寫字符串。

在下面的示例中，我們演示瞭如何使用 `tag` 方法來獲取一個元素的標籤：

<o-playground name="tag - 獲取標籤">
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
