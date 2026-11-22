# 사용자 정의 이벤트

ofa.js에서는 내장된 DOM 이벤트 외에도 커스텀 이벤트를 만들어 사용하여 컴포넌트 간 통신을 구현할 수 있습니다. 커스텀 이벤트는 컴포넌트 기반 개발의 중요한 메커니즘으로, 컴포넌트가 상위로 메시지나 상태 변화를 브로드캐스트할 수 있도록 합니다.

## emit 메서드 - 사용자 정의 이벤트 트리거

`emit` 메서드는 커스텀 이벤트를 발생시켜 컴포넌트 내부의 상태 변화나 사용자 조작을 외부의 리스너에게 알리는 데 사용됩니다.

### 기본 사용법

```javascript
// 간단한 사용자 정의 이벤트 트리거
this.emit('custom-event');

// 데이터와 함께 사용자 정의 이벤트 트리거
this.emit('data-changed', {
  data: {
    // 요구에 따라 자유로운 구조의 사용자 정의 데이터
    newValue: 100,
    oldValue: 50
  }
});
```

### emit 메서드 매개변수

`emit` 메서드는 두 개의 인수를 받습니다:

1. **이벤트 이름**: 문자열, 트리거할 이벤트 이름을 나타냅니다.
2. **옵션 객체** (선택 사항): 이벤트 구성 옵션을 포함합니다.
   - `data`: 전달할 데이터
   - `bubbles`: 부울 값, 이벤트 버블링 여부를 제어합니다 (기본값: true)
   - `composed`: 부울 값, 이벤트가 Shadow DOM 경계를 통과할 수 있는지 여부를 제어합니다.
   - `cancelable`: 부울 값, 이벤트 취소 가능 여부를 제어합니다.

그러면 상위 요소는 `on` 메서드를 사용하여 [（이벤트 바인딩）](./event-binding.md) 이 커스텀 이벤트를 수신할 수 있습니다.

### emit 사용 예제

<o-playground name="emit 사용 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">클릭하여 이벤트 발생</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: '버튼이 클릭되었습니다',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - 이벤트 버블링 메커니즘

`bubbles` 속성은 이벤트가 부모 요소로 버블링될지 여부를 제어합니다. `true`로 설정하면 이벤트가 DOM 트리를 따라 위로 전파됩니다. 기본값은 `true`입니다. `false`로 설정하면 이벤트가 버블링되지 않습니다.

### 버블 메커니즘 상세 설명

- **기본 동작**: `emit`을 사용하여 발생한 이벤트는 기본적으로 버블링이 활성화됩니다(`bubbles: true`)
- **버블링 경로**: 이벤트는 트리거된 요소에서 시작하여 단계적으로 상위로 전파됩니다
- **버블링 중단**: 이벤트 핸들러에서 `event.stopPropagation()`을 호출하면 버블링을 중단할 수 있습니다

### 버블 예제

<o-playground name="사용자 정의 이벤트 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>바깥 컨테이너（버블 이벤트 리스닝）: {{bubbledEventCount}} 회</p>
      <p>안쪽 컴포넌트（직접 이벤트 리스닝）: {{directEventCount}} 회</p>
      <p>수신된 데이터: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">비버블 이벤트 트리거</button>
      <button on:click="triggerBubblingEvent">버블 이벤트 트리거</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 비버블 이벤트는 직접 리스너만 캡처합니다.
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '비버블 이벤트 트리거됨', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // 버블 이벤트는 부모 요소로 전파됩니다.
                this.emit('child-event', {
                  data: { type: 'bubbling', message: '버블 이벤트 트리거됨', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Shadow DOM 경계 돌파

`composed` 속성은 이벤트가 Shadow DOM 경계를 통과할 수 있는지 여부를 제어합니다. 이는 Web Components 개발에 특히 중요하며, 기본값은 `false`입니다.

### 관통 메커니즘 상세 설명

- **Shadow DOM 격리**：기본적으로 이벤트는 Shadow DOM 경계를 넘을 수 없음
- **투과 활성화**：`composed: true`를 설정하면 Shadow DOM 경계를 넘나드는 이벤트 허용
- **사용 시나리오**：컴포넌트가 호스트 환경으로 이벤트를 전송해야 할 때 반드시 `composed: true`를 설정해야 함

### 투과 예시

<o-playground name="사용자 정의 이벤트 데이터 예시" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>이벤트 수신: {{bubbledEventCount}} 회</p>
      <p>수신된 데이터: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>이벤트 수신: {{bubbledEventCount}} 회</p>
      <p>수신된 데이터: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">비침투 이벤트 발생</button>
      <button on:click="triggerComposedEvent">침투 이벤트 발생</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 비침투 이벤트, 직접 수신자만 캡처
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '비침투 이벤트 발생', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 침투 이벤트, Shadow DOM 경계를 넘어 전파됨
                this.emit('child-event', {
                  data: { type: 'composed', message: '침투 이벤트 발생', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

