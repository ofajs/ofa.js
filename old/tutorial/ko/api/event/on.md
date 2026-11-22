# on



`on` 메서드를 사용하면 대상 요소에 이벤트 핸들러를 등록할 수 있습니다. 이를 통해 사용자의 상호작용을 쉽게 포착하고 응답할 수 있습니다.

다음은 `on` 메서드를 사용하여 버튼 요소에 클릭 이벤트 핸들러를 등록하는 방법을 보여주는 예시입니다:

<o-playground name="on - click 이벤트" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `on` 메서드를 사용하여 버튼 요소에 클릭 이벤트 핸들러를 추가했습니다. 사용자가 버튼을 클릭하면 이벤트 핸들러가 실행되어 카운터가 증가하고 결과가 페이지에 표시됩니다.

## 템플릿 구문 방식 사용

또한 템플릿 구문을 사용하여 대상 요소에 메서드를 바인딩할 수 있습니다.

<o-playground name="on - 템플릿 문법" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

이 예제에서는 버튼 요소에 `on:click`을 사용하여 `addCount`라는 메서드를 바인딩했습니다. 사용자가 버튼을 클릭하면 이 메서드가 호출되고 카운터 값이 증가하여 페이지에 표시됩니다. 이러한 방식으로 이벤트 핸들러를 컴포넌트의 메서드와 연결하여 더 복잡한 상호작용을 구현할 수 있습니다.

## event



이벤트 등록 후, 트리거되는 함수에는 event가 포함되며, 이는 네이티브와 동일합니다:

<o-playground name="on - event 매개변수" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

