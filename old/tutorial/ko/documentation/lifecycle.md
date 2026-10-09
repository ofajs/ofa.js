# 생명주기

ofa.js 컴포넌트는 완전한 생명 주기 훅 함수를 가지고 있어, 컴포넌트의 여러 단계에서 특정 로직을 실행할 수 있습니다. 이러한 훅 함수를 사용하면 컴포넌트 생성, 마운트, 업데이트 및 소멸과 같은 중요한 시점에 개입하여 해당 작업을 수행할 수 있습니다.

## 생명주기 훅 함수

ofa.js는 다음과 같은 주요 생명주기 훅 함수를 제공하며, 일반적으로 사용되는 순서로 정렬되어 있습니다.

### attached



`attached` 훅은 컴포넌트가 문서에 삽입되었을 때 호출되며, 컴포넌트가 페이지에 마운트되었음을 나타냅니다. 이는 가장 자주 사용되는 생명주기 훅으로, 일반적으로 컴포넌트가 실제로 페이지에 표시된 후에 수행해야 하는 초기화 작업을 실행하는 데 사용되며, 컴포넌트가 보이지 않을 때 불필요한 계산이 실행되는 것을 방지합니다. 이 훅은 또한 요소 크기 측정, 애니메이션 시작 등 컴포넌트가 페이지에 렌더링된 후에 의존하는 작업을 수행하기에도 매우 적합합니다.

- **호출 시점**: 컴포넌트가 DOM 트리에 추가됨
- **주요 용도**: 타이머 시작, 이벤트 리스너 추가, 가시성이 필요한 작업 수행

### detached



`detached` 훅은 컴포넌트가 문서에서 제거될 때 호출되며, 컴포넌트가 곧 언마운트될 것임을 나타냅니다. 이 훅은 타이머 정리, 이벤트 리스너 제거 등 리소스를 정리하는 데 적합합니다.

- **호출 시점**: 컴포넌트가 DOM 트리에서 제거될 때
- **주요 용도**: 리소스 정리, 구독 취소, 이벤트 리스너 제거

### ready



`ready` 훅은 컴포넌트가 준비되었을 때 호출되며, 이때 컴포넌트의 템플릿이 렌더링 완료되고 DOM 요소가 생성되었지만 아직 문서에 삽입되지 않았을 수 있습니다. 이 훅은 DOM 조작이나 타사 라이브러리 초기화에 적합합니다.

- **호출 시점**: 컴포넌트 템플릿 렌더링 완료, DOM 생성됨
- **주요 용도**: DOM에 의존하는 초기화 작업 수행

### loaded



`loaded` 훅은 컴포넌트와 그 모든 하위 컴포넌트, 비동기 리소스가 모두 로드된 후에 트리거되며, 이때 로딩 상태를 안전하게 제거하거나 완전한 컴포넌트 트리에 의존하는 후속 작업을 실행할 수 있습니다. 종속성이 없으면 `ready` 훅 이후에 호출됩니다.

- **호출 시기**: 컴포넌트 및 그 하위 컴포넌트가 완전히 로드됨
- **주요 용도**: 완전한 컴포넌트 트리에 의존하는 작업 수행

## 생명 주기 실행 순서

컴포넌트의 생명주기 훅은 다음 순서로 실행됩니다:

2. `ready` - 컴포넌트 준비 완료 (DOM 생성됨)
3. `attached` - 컴포넌트가 DOM에 마운트됨
4. `loaded` - 컴포넌트 완전히 로드됨

컴포넌트가 DOM에서 제거될 때 `detached` 훅이 호출됩니다.

## 사용 예시

아래 예시는 컴포넌트에서 라이프사이클 훅 함수를 사용하는 방법을 보여줍니다:

<o-playground name="생명주기 예시" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>생명주기 데모</h3>
      <div class="counter">카운터: {{count}}</div>
      <button on:click="count += 10">10 증가</button>
      <button on:click="removeSelf">컴포넌트 제거</button>
      <div class="log">
        <h4>생명주기 로그:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // DOM에서 자신을 제거하여 detached 훅을 트리거합니다
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: 컴포넌트 준비 완료, DOM 생성됨");
              console.log("컴포넌트 준비 완료");
            },
            attached() {
              this.addLog("attached: 컴포넌트가 DOM에 마운트됨");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("컴포넌트 마운트됨");
            },
            detached() {
              this.addLog("detached: 컴포넌트가 DOM에서 제거됨");
              // 타이머를 정리하여 메모리 누수 방지
              clearInterval(this._timer); 
              console.log("컴포넌트 언마운트됨");
            },
            loaded() {
              this.addLog("loaded: 컴포넌트 완전히 로드됨");
              console.log("컴포넌트 완전히 로드됨");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서, 다양한 생명주기 훅의 실행 순서와 시점을 관찰할 수 있습니다. "컴포넌트 제거" 버튼을 클릭하면 `detached` 훅이 트리거되는 것을 볼 수 있습니다.

## 실제 적용 시나리오

### 초기화 작업

`ready` 훅에서 데이터 초기화를 진행합니다:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM 조작
      this.initDomElements();
    }
  };
};
```

### 자원 관리

`attached` 훅에서 타이머를 시작하고, `detached` 훅에서 리소스를 정리합니다:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // 타이머 시작
      this.timer = setInterval(() => {
        console.log('정기 작업 실행');
      }, 1000);
    },
    detached() {
      // 타이머 정리
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

생명주기 훅 함수는 ofa.js 컴포넌트 개발에서 중요한 개념으로, 이를 올바르게 사용하면 컴포넌트 상태와 리소스를 더 잘 관리하고 애플리케이션 성능을 향상시킬 수 있습니다.

