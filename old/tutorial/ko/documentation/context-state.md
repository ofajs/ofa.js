# 컨텍스트 상태

컨텍스트 상태는 ofa.js에서 컴포넌트 간 데이터 공유를 위한 메커니즘입니다. 제공자(Provider)와 소비자(Consumer) 패턴을 통해 부모-자식 컴포넌트, 계층 간 컴포넌트 간 데이터 전달을 props를 통해 계층적으로 전달하지 않고도 구현할 수 있습니다.

## 핵심 개념

- **o-provider**: 데이터 제공자, 공유해야 할 데이터를 정의합니다.
- **o-consumer**: 데이터 소비자, 가장 가까운 제공자로부터 데이터를 가져옵니다.
- **watch:xxx**: 소비자 데이터의 변화를 감시하고, 컴포넌트나 페이지 모듈의 속성에 바인딩합니다.

## o-provider 제공자

`o-provider` 컴포넌트는 공유 데이터의 제공자를 정의하는 데 사용됩니다. `name` 속성을 통해 자신의 이름을 식별하고, 속성(예: `custom-a="value"`)을 통해 공유할 데이터를 정의합니다.

```html
<o-provider name="userInfo" custom-name="장삼" custom-age="25">
  ...
</o-provider>
```

### 속성

- `name`: 공급자의 고유 식별 이름으로, 소비자가 해당 공급자를 찾는 데 사용됩니다.

### 특성

1. **자동 속성 전달**: provider의 모든 비예약 속성은 공유 데이터로 전달됩니다.
2. **반응형 업데이트**: provider의 데이터가 변경되면, 해당 provider를 소비하는 대응하는 name의 consumer가 자동으로 업데이트됩니다.
3. **계층 검색**: consumer는 가장 가까운 상위 provider부터 해당 name의 데이터를 검색합니다.

## o-consumer 소비자

`o-consumer` 컴포넌트는 제공자의 데이터를 소비(사용)하는 데 사용됩니다. `name` 속성을 통해 소비할 제공자의 이름을 지정합니다.

```html
<o-consumer name="userInfo"></o-consumer>
```

### 속성

- `name`: 소비할 공급자 이름

### 특성

1. **자동 데이터 획득**: consumer는 가장 가까운 상위 provider에서 해당 name의 데이터를 자동으로 획득합니다.
2. **속성 병합**: 동일한 name을 가진 여러 provider가 특정 속성을 가지고 있다면, 소비자에게 가장 가까운 provider의 속성이 우선합니다.
3. **속성 감시**: `watch:xxx`를 통해 특정 속성의 변화를 감시할 수 있습니다.

## 데이터 변경 감시

`watch:xxx`를 통해 제공자 데이터의 변화를 감시할 수 있습니다:

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## 기본 예제

<o-playground name="기본 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>사용자 ID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}}아바타
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      User-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider 루트 제공자

`o-root-provider`는 루트 수준의 전역 제공자이며, 그 범위는 전체 문서입니다. 상위 provider가 없는 경우에도 소비자는 루트 제공자의 데이터를 얻을 수 있습니다.

```html
<!-- 전역 루트 제공자 정의 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- 페이지의 어느 위치에서나 소비 가능 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### 특성

1. **전역 스코프**: 루트 제공자의 데이터는 전체 페이지에서 사용 가능
2. **우선순위**: 동일한 name의 provider와 root-provider가 동시에 존재할 때, 소비자에게 가장 가까운 provider가 우선
3. **제거 가능**: root-provider를 제거하면 소비자는 다른 provider를 찾도록 되돌아감

## root-provider 예제

<o-playground name="root-provider 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>테마: {{theme}}</div>
        <div>언어: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - 테마: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - 언어: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 우선순위 예제

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- 여기👇에서 가져온 custom-value는 "parent"입니다 -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- 여기👇에서 가져온 custom-value는 "root"입니다 -->
<o-consumer name="test"></o-consumer>

```

### 우선순위 예시 데모

<o-playground name="우선순위 예제 데모" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>상위 Provider의 값: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>루트 Provider의 값: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        자식 컴포넌트의 값: {{customValue}} (가장 가까운 것은 {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## getProvider(name) 메서드

`getProvider(name)`는 인스턴스 메서드로, 해당 name에 해당하는 제공자 요소를 가져옵니다. DOM을 따라 위쪽으로 가장 가까운 상위 provider를 찾으며, 찾지 못하면 root-provider를 반환합니다.

### 컴포넌트 또는 페이지 모듈 내에서 getProvider(name) 메서드 사용

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## getProvider 예시

<o-playground name="getProvider 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="장삼" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Provider 데이터 가져오기</button>
      <div>현재 이름: {{currentName}}</div>
      <div>현재 나이: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Provider 데이터 수정</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider 찾음:", provider);
                console.log("이름:", provider.customName);
                console.log("나이:", provider.customAge);
                alert(`Provider 데이터: ${provider.customName}, ${provider.customAge}세`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "이사";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 엘리먼트에서 provider 얻기

```javascript
// 현재 요소의 상위 provider 가져오기
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("제공자 찾음:", provider.customName);
}

// 전역 root-provider 직접 가져오기
const globalProvider = $.getRootProvider("globalConfig");
```

### 사용 시나리오

1. **수동 데이터 수집**: 제공자 데이터에 직접 액세스해야 하는 시나리오에서 사용
2. **Shadow DOM 간**: Shadow DOM 내부에서 상위 공급자 찾기
3. **이벤트 처리**: 이벤트 콜백에서 해당 공급자 가져오기

## dispatch 이벤트 디스패치

provider는 자신을 소비하는 모든 consumer에게 이벤트를 발송할 수 있습니다:

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// 이벤트 전달
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## 이벤트 디스패치 예시

<o-playground name="이벤트 발송 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["채팅방에 오신 것을 환영합니다"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>채팅방</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="메시지 입력...">
      <button on:click="sendMessage">전송</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 모범 사례

1. **합리적인 명명**: provider와 consumer에 의미 있는 name을 사용하여 추적과 유지보수를 용이하게 합니다.
2. **과도한 사용 피하기**: context 상태는 컴포넌트 간 데이터 공유에 적합하며, 일반적인 부모-자식 컴포넌트에는 props 사용을 권장합니다.
3. **루트 프로바이더는 전역 설정용**: 테마, 언어, 전역 상태 등은 root-provider를 사용하는 것이 적합합니다.
4. **적시 정리**: provider가 제거되면 consumer는 데이터를 자동으로 제거하므로 수동 처리가 필요 없습니다.