# 조건부 렌더링

ofa.js에서 조건부 렌더링은 중요한 기능으로, 데이터 상태에 따라 특정 요소나 컴포넌트를 렌더링할지 여부를 결정할 수 있습니다. ofa.js는 `o-if`, `o-else-if`, `o-else` 컴포넌트를 통해 컴포넌트 기반의 조건부 렌더링 방식을 제공합니다.

## o-if 컴포넌트

`o-if` 컴포넌트는 표현식의 참/거짓 값에 따라 콘텐츠를 렌더링할지 여부를 결정하는 데 사용됩니다. 바인딩된 `value` 속성이 참일 때 컴포넌트 내부의 콘텐츠가 렌더링되며, 그렇지 않으면 콘텐츠가 DOM에 나타나지 않습니다.

<o-playground name="o-if 작동 원리 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### o-if의 작동 원리

`o-if`는 조건이 참일 때만 내용을 DOM에 렌더링하며, 조건이 거짓일 때는 o-if 내의 DOM 요소가 완전히 제거됩니다. 이 구현 방식은 DOM의 생성과 제거가 수반되므로 조건 변화가 자주 발생하지 않는 상황에서 사용하기 적합합니다.

## o-else-if 및 o-else 컴포넌트

여러 조건 분기가 필요할 때, `o-else-if`와 `o-else` 컴포넌트를 `o-if`와 함께 사용하여 다중 분기 조건 렌더링을 구현할 수 있습니다.

- `o-if`：필수적인 첫 번째 조건 컴포넌트
- `o-else-if`：선택적인 중간 조건 컴포넌트, 여러 개 가능
- `o-else`：선택적인 기본 조건 컴포넌트, 마지막에 배치

<o-playground name="다중 분기 조건부 렌더링 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- num을 3으로 나눈 나머지에 따라 다른 내용을 표시합니다. -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 실제 응용 사례 예시

### 사용자 권한 제어

<o-playground name="사용자 권한 제어 예시" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">사용자 역할 전환</button>
        <p>현재 역할: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>관리자 패널</h3>
            <button>사용자 관리</button>
            <button>시스템 설정</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>사용자 정보</h3>
            <p>{{userName}}님 환영합니다!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>로그인 후 내용을 확인하세요</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: '방문자'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = '홍길동';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 폼 검증 상태 표시

<o-playground name="양식 유효성 검사 상태 표시 예제" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <div>
        <h3>이메일 유효성 검사 예제</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="이메일 주소 입력">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ 이메일 형식이 올바릅니다</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ 이메일 형식이 올바르지 않습니다</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">유효성 검사를 위해 이메일 주소를 입력하세요</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 조건부 렌더링 베스트 프랙티스

1. **사용 시나리오**：요소가 다른 조건에서 거의 전환되지 않는 경우 `o-if`를 사용하는 것이 더 적합합니다. 불필요한 요소를 완전히 제거하여 메모리를 절약할 수 있기 때문입니다.

2. **성능 고려 사항**：자주 전환되는 요소는 조건부 렌더링보다 클래스 바인딩(예: `class:hide`)을 사용하는 것이 더 적합합니다. 조건부 렌더링은 DOM을 생성하고 제거하는 과정을 포함하기 때문입니다.

3. **구조 명확성**：조건부 렌더링은 탭, 단계별 안내 등과 같이 서로 다른 구조를 가진 콘텐츠를 전환할 때 특히 적합합니다.