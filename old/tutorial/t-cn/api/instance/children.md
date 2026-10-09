# 子元素



獲取子元素實例非常簡單，妳隻需要將實例當作數組，通過數字索引獲取牠的子元素實例。

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



獲取目標元素的子元素數量，案例如上所示：

```javascript
$("#logger1").text = $('ul').length;
```
