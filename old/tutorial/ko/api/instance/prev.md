# prev



`prev` 속성을 사용하면 요소의 이전 인접 요소 인스턴스를 가져올 수 있습니다.

<o-playground name="prev - 이전 요소" style="--editor-height: 320px">
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
          \$('#target').prev.text = "change target prev element";
          \$("#logger1").text = \$('#first') === $('#target').prev
        },500);
      </script>
    </template>
  </code>
</o-playground>

