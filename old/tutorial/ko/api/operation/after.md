# after



`after` 메서드는 대상 요소의 뒤에 요소를 추가하는 데 사용됩니다. `after` 작업을 실행하기 전에 자동으로 [$ 메서드](../instance/dollar.md)의 초기화 작업이 실행되므로, 구체적인 요소 문자열이나 객체를 직접 입력할 수 있습니다.

**참고: o-fill 또는 o-if와 같은 템플릿 구성 요소 내에서 작업하지 마십시오.**

<o-playground name="after - 뒤에 추가" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

