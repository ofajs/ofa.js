# ele



通過 `ele` 屬性，妳可以獲取實例的實際 [Element 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)，從而使用原生的屬性或方法。

<o-playground name="ele - 獲取元素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
      </ul>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=>{
          var ele = $("#target").ele;
          ele.innerHTML = '<b>change target</b>';
          \$("#logger").text = ele.clientWidth;
        },500);
      </script>
    </template>
  </code>
</o-playground>
