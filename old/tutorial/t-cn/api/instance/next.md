# next



使用 `next` 屬性，妳可以獲取元素的後一個相鄰元素實例。

<o-playground name="next - 後一個元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').next.text = "change target next element";
          \$("#logger1").text = \$('#first').next === $('#target')
        },500);
      </script>
    </template>
  </code>
</o-playground>
