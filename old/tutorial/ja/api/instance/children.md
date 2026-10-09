# 子要素

子要素インスタンスの取得は非常に簡単で、インスタンスを配列として扱い、数値インデックスでその子要素インスタンスを取得するだけです。

<o-playground name="children" style="--editor-height: 380px">
  <code path="demo.html">
    <template>
      <ul>
        <li>私は1です</li>
        <li>私は2です</li>
        <li>私は3です</li>
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



ターゲット要素の子要素の数を取得します。例は上記の通りです。

```javascript
$("#logger1").text = $('ul').length;
```