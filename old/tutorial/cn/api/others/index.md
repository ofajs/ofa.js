# index

`index` 属性用于获取元素在其父元素下的位置。这个位置是从0开始计数的，也就是说第一个元素的位置是0，第二个是1，以此类推。

在下面的示例中，我们演示了如何使用 `index` 属性来获取一个元素在其父元素下的位置：

<o-playground name="index - 获取位置" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

在这个示例中，我们首先选中一个具有 `id` 为 "target" 的 `<li>` 元素。然后，我们使用 `index` 属性来获取该元素在其父元素 `<ul>` 下的位置，即第二个元素，所以 `index` 的值为1。然后将这个值显示在具有 `id` 为 "logger" 的 `<div>` 元素中。
