# ele



`ele` 속성을 통해 인스턴스의 실제 [Element 요소](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)를 가져올 수 있으며, 이를 통해 네이티브 속성이나 메서드를 사용할 수 있습니다.

<o-playground name="ele - 요소 가져오기" style="--editor-height: 320px">
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

