# index



`index` 屬性用於獲取元素在其父元素下的位置。這個位置是從0開始計數的，也就是說第一個元素的位置是0，第二個是1，以此類推。

在下面的示例中，我們演示瞭如何使用 `index` 屬性來獲取一個元素在其父元素下的位置：

<o-playground name="index - 獲取位置" style="--editor-height: 300px">
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

在這個示例中，我們首先選中一個具有 `id` 爲 "target" 的 `<li>` 元素。然後，我們使用 `index` 屬性來獲取該元素在其父元素 `<ul>` 下的位置，卽第二個元素，所以 `index` 的值爲1。然後將這個值顯示在具有 `id` 爲 "logger" 的 `<div>` 元素中。
