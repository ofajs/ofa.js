# ele

通过 `ele` 属性，你可以获取实例的实际 [Element 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)，从而使用原生的属性或方法。

<o-playground name="ele - 获取元素" style="--editor-height: 320px">
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
