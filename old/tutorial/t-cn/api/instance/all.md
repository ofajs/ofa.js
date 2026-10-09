# all



使用 `all` 方法，妳可以獲取頁面上符閤 CSS 選擇器的所有元素，並返迴一個數組包含這些元素實例。

<o-playground name="all - 獲取所有元素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 獲取子元素



實例也擁有 `all` 方法，可以通過實例上的 `all` 方法選擇並獲取子元素。

<o-playground name="all - 獲取子元素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>I am 1</li>
          <li>I am 2</li>
          <li>I am 3</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>
