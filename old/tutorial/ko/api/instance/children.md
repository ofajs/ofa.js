# 자식 요소

자식 요소 인스턴스를 가져오는 것은 매우 간단합니다. 인스턴스를 배열로 취급하고 숫자 인덱스를 통해 자식 요소 인스턴스를 가져오면 됩니다.

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



대상 요소의 자식 요소 수를 가져오며, 사례는 위와 같습니다:

```javascript
$("#logger1").text = $('ul').length;
```