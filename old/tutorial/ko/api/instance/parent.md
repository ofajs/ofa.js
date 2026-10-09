# parent



`parent` 속성을 사용하면 인스턴스의 부모 요소 인스턴스를 얻을 수 있습니다.

<o-playground name="parent - 부모 요소" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').parent.css.color = 'blue'; // parent는 ul 요소
          \$('#target').css.color = 'red';
        },500);
      </script>
    </template>
  </code>
</o-playground>

