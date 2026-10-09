# prevs



`prevs` 속성을 사용하면 현재 요소 이전의 모든 인접 요소 인스턴스를 쉽게 가져올 수 있으며, 이러한 요소는 배열 형태로 반환됩니다.

<o-playground name="prevs - 이전 요소" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

