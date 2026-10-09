# remove



`remove` 메서드는 대상 노드를 삭제하는 데 사용됩니다.

**참고: o-fill 또는 o-if와 같은 템플릿 구성 요소 내에서 작업하지 마십시오.**

<o-playground name="remove - 노드 삭제" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

