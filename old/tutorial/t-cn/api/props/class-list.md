# classList



`classList` 屬性和原生保持一緻。妳可以使用 [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) 來添加、刪除和切換類名。

下面是一個示例，演示瞭如何使用 `classList`：

<o-playground name="classList - 使用示例" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">origin text</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

`classList` 屬性允許妳輕鬆地添加、刪除和切換類名，以便動態更改元素的樣式。
