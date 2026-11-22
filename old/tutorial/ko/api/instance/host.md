# host



`host` 속성을 사용하면 요소의 호스트 컴포넌트 인스턴스를 얻을 수 있습니다. 이는 컴포넌트 내부에서 호스트 컴포넌트의 데이터와 메서드에 접근하는 데 매우 유용합니다.

아래는 `host` 속성을 사용하여 호스트 컴포넌트의 인스턴스를 가져오는 예시입니다:

<o-playground name="host - 호스트 가져오기" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./user-card.html"></l-m>
      <user-card username="tom"></user-card>
      <script>
        export default async function(){
          return {
            data: {
              greeting: "Hello"
            },
            proto: {
              sayHi(){
                return `${this.greeting}, I'm the host!`;
              }
            }
          };
        }
      </script>
    </template>
  </code>
  <code path="user-card.html" active>
    <template component>
      <style>
        :host{display:block;border:1px solid #ddd;padding:12px;margin:8px;border-radius:4px;}
      </style>
      <div>Username: {{username}}</div>
      <button on:click="onClick">Say Hi</button>
      <div>Response: {{response}}</div>
      <script>
        export default {
          tag: "user-card",
          attrs:{
            username: null
          },
          data: {
            response: "-"
          },
          proto: {
            onClick(){
              this.response = this.host.sayHi();
            }
          },
          ready(){
            console.log("Host method:", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 사용자 정의 컴포넌트 `user-card`를 생성하고, 컴포넌트 내부에서 `this.host`를 통해 호스트 컴포넌트(페이지)의 메서드 `sayHi`에 접근하여 컴포넌트와 호스트 간의 상호작용을 구현했습니다.

요소가 컴포넌트나 페이지 모듈 내에 없을 경우, `host`의 값은 `null`이 됩니다. 예:

<o-playground name="host - 호스트 없음" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          $("#logger").text = String($("#target").host);
        },500);
      </script>
    </template>
  </code>
</o-playground>

이 예시에서 `#target` 요소는 body 아래에 있으며, 어떤 컴포넌트나 페이지 내부에 있지 않으므로 `$("#target").host`의 값은 `null`입니다.