# classList

`classList` 属性和原生保持一致。你可以使用 [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) 来添加、删除和切换类名。

下面是一个示例，演示了如何使用 `classList`：

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

`classList` 属性允许你轻松地添加、删除和切换类名，以便动态更改元素的样式。
