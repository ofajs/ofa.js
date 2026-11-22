# off



`off` 메서드를 사용하여 등록된 이벤트 핸들러를 제거하고 이벤트 수신을 취소할 수 있습니다.

아래는 `off` 메서드를 사용하여 이벤트 리스너를 취소하는 방법을 보여주는 예제입니다:

<o-playground name="off - 이벤트 리스너 제거" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">카운트 추가</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 버튼이 클릭될 때마다 `#logger`에 클릭 횟수를 표시하는 클릭 이벤트 핸들러 `f`를 등록합니다. `off` 메서드를 사용하여 클릭 횟수가 3에 도달하면 이벤트 리스닝을 해제합니다.