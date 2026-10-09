# version



`ofa.version` 속성을 통해 현재 불러온 ofa.js의 버전 번호를 얻을 수 있습니다.

> **ofa.js 버전 ≥ 4.3.40 필요**

<o-playground name="version - 버전 가져오기">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

이렇게 하면 페이지에서 현재 사용 중인 ofa.js 버전을 표시할 수 있습니다.