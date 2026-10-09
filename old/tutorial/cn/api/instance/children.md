# 子元素

获取子元素实例非常简单，你只需要将实例当作数组，通过数字索引获取它的子元素实例。

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="color:red;"></div>
      <div id="logger2" style="color:blue;"></div>
      <script>
        setTimeout(()=>{
          $("#logger1").text = $('ul').length;
          $("#logger2").text = $('ul')[1].text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## length

获取目标元素的子元素数量，案例如上所示：

```javascript
$("#logger1").text = $('ul').length;
```
