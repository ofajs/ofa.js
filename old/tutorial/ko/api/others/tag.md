# tag



`tag` 속성은 요소의 태그를 가져오는 데 사용되며, 소문자 문자열을 반환합니다.

아래 예제에서는 `tag` 메서드를 사용하여 요소의 태그를 가져오는 방법을 보여줍니다:

<o-playground name="tag - 태그 가져오기">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

