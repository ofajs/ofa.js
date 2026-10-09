# clone



`clone` 메서드를 사용하면 요소 인스턴스의 복사본을 복제하여 생성할 수 있습니다.

<o-playground name="clone - 복제 요소" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">I am target</div>
      <div>logger:</div>
      <div id="logger"></div>
      <script>
        setTimeout(()=>{
          const tar = $('#target').clone();
          \$('#logger').push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

