# one



`one` 메서드를 사용하여 대상 요소에 일회성 이벤트 핸들러를 등록할 수 있습니다. 즉, 이벤트 핸들러는 첫 번째 트리거 후 자동으로 바인딩이 해제되어 다시 트리거되지 않습니다.

다음은 `one` 메서드를 사용하여 버튼 요소에 클릭 이벤트 핸들러를 등록하는 방법을 보여주는 예제입니다:

<o-playground name="one - click 일회성 이벤트" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `one` 메서드를 사용하여 버튼 요소에 클릭 이벤트 핸들러를 추가했습니다. 사용자가 버튼을 클릭하면 이벤트 핸들러가 실행되지만, 이후에는 바인딩이 해제되어 다시 실행되지 않습니다.

## 템플릿 구문 방식 사용

또한 템플릿 구문을 사용하여 대상 요소에 일회성 이벤트 핸들러를 바인딩할 수 있습니다.

<o-playground name="one - 템플릿 구문" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 버튼 요소에 `one:click`을 사용하여 `addCount`라는 메서드를 바인딩했습니다. 사용자가 버튼을 클릭하면 이 메서드가 호출되지만, 이후에는 다시 트리거되지 않습니다. 이는 일회성 이벤트 핸들러이기 때문입니다.