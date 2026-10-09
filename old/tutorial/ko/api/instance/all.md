# all



`all` 메서드를 사용하면 페이지에서 CSS 선택자와 일치하는 모든 요소를 가져올 수 있으며, 해당 요소 인스턴스를 포함하는 배열을 반환합니다.

<o-playground name="all - 모든 요소 가져오기" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 자식 요소 가져오기

인스턴스도 `all` 메서드를 가지고 있으며, 인스턴스의 `all` 메서드를 통해 하위 요소를 선택하고 가져올 수 있습니다.

<o-playground name="all - 자식 요소 가져오기" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>I am 1</li>
          <li>I am 2</li>
          <li>I am 3</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

