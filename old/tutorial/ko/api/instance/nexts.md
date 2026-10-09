# nexts



`nexts` 속성을 사용하면 현재 요소 뒤에 있는 모든 인접한 요소 인스턴스를 손쉽게 가져올 수 있으며, 이들은 배열 형태로 반환됩니다.

<o-playground name="nexts - 후행 요소" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

