# emit



`emit` 메서드를 사용하면 이벤트를 능동적으로 트리거할 수 있으며, 트리거된 이벤트는 버블링 메커니즘을 가집니다. 버블링 메커니즘은 이벤트가 내부 요소에서 외부 요소로 버블링되어 내부에서 외부로 계층적으로 이벤트가 트리거됨을 의미합니다.

다음은 `emit` 메서드를 사용하여 사용자 정의 이벤트를 트리거하고 버블링 메커니즘을 활용하여 이벤트를 외부 요소로 전달하는 방법을 보여주는 예시입니다:

<o-playground name="emit - 이벤트 트리거" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `<ul>` 요소와 `<li>` 요소에 각각 동일한 사용자 정의 이벤트 `custom-event` 핸들러를 등록했습니다. `emit` 메서드를 사용하여 이벤트를 트리거하면, 해당 이벤트가 `<li>` 요소에서 `<ul>` 요소로 버블링되어 두 개의 이벤트 핸들러가 실행됩니다.

## 사용자 정의 데이터

`data` 매개변수를 포함하면 이벤트 처리기에 사용자 정의 데이터를 전달할 수 있습니다:

<o-playground name="emit - 커스텀 데이터" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `data` 매개변수를 통해 이벤트 핸들러에 사용자 정의 데이터를 전달했습니다. 이벤트 핸들러는 `event.data`를 통해 전달된 데이터를 가져올 수 있습니다.

## 버블링 없는 이벤트 트리거

이벤트 버블링을 원하지 않는다면 이벤트를 트리거할 때 `bubbles: false` 매개변수를 전달할 수 있습니다:

<o-playground name="emit - 버블 없음" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          나는 타겟입니다
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul이 트리거됨';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target이 트리거됨';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

이 예시에서는 `bubbles: false` 파라미터를 사용하여 사용자 정의 이벤트를 트리거했습니다. 이 이벤트는 상위 요소로 버블링되지 않으므로 `<li>` 요소의 이벤트 핸들러만 실행됩니다.

## 루트 노드 관통

기본적으로 이벤트는 사용자 정의 컴포넌트의 섀도우 DOM을 관통하지 않습니다. 하지만 `composed: true`를 설정하여 사용자 정의 이벤트가 루트 노드를 관통하여 루트 노드 외부의 요소를 트리거하도록 할 수 있습니다.

<o-playground name="emit - 루트 노드 통과" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = '사용자 정의 이벤트가 발생했습니다;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"나는 Composed 이벤트입니다"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

이 예시에서는 `composed-test`라는 커스텀 컴포넌트를 생성했습니다. 이 컴포넌트에는 Shadow DOM 안의 요소와 이벤트를 트리거하는 버튼이 포함되어 있습니다. 기본적으로 이벤트는 Shadow DOM을 통해 루트 노드로 전파되지 않습니다. 그러나 이벤트를 트리거할 때 `composed: true` 매개변수를 사용하면 이벤트가 루트 노드까지 전파되어 루트 노드 외부의 요소에 도달하게 됩니다.