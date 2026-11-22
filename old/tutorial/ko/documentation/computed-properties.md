# 계산 속성

계산 속성은 반응형 데이터에서 새로운 데이터를 파생시키는 방식이며, 의존하는 데이터의 변화에 따라 자동으로 업데이트됩니다. ofa.js에서 계산 속성은 `proto` 객체에 정의된 특별한 메서드로, JavaScript의 `get` 또는 `set` 키워드를 사용하여 정의합니다.

## 특징과 장점

- **캐싱성**: 계산된 속성의 결과는 캐시되며, 의존하는 데이터가 변경될 때만 다시 계산됩니다.
- **반응성**: 의존하는 데이터가 업데이트되면 계산된 속성이 자동으로 업데이트됩니다.
- **선언형**: 선언 방식으로 의존 관계를 생성하여 코드가 더 명확하고 이해하기 쉬워집니다.

## get 계산 속성

get 계산 속성은 반응형 데이터에서 새로운 값을 파생하는 데 사용되며, 매개변수를 받지 않고 다른 데이터를 기반으로 계산된 값만 반환합니다.

<o-playground name="get 계산 속성 예제" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>계산 속성 countDouble의 값: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble가 접근됨');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 실제 응용 시나리오 예시

계산 속성은 복잡한 데이터 변환 로직을 처리하는 데 자주 사용됩니다. 예를 들어 배열 필터링, 텍스트 서식 지정 등이 있습니다.

<o-playground name="계산 속성 예시" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="이름 필터링...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['장3', '리4', '왕54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 계산 속성

set 계산 속성은 할당 작업을 통해 기본 데이터 상태를 수정할 수 있게 해줍니다. 이는 하나의 매개변수를 받으며, 일반적으로 의존하는 원본 데이터를 역방향으로 업데이트하는 데 사용됩니다.

<o-playground name="set 계산 속성 예제" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>기본 값: {{count}}</p>
        <p>두 배 값: {{countDouble}}</p>
        <button on:click="resetCount">카운트 재설정</button>
        <button on:click="setCountDouble">두 배 값을 10으로 설정</button>
        <button on:click="incrementCount">기본 값 증가</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // count가 음수가 되지 않도록
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 계산 속성 vs 메서드

비록 메서드도 비슷한 기능을 구현할 수 있지만, 계산된 속성은 캐싱 특성을 가지고 있어 의존하는 데이터가 변경될 때만 다시 평가되므로 성능이 더 우수합니다.

```javascript
// 계산된 속성 사용(권장) - 캐시 있음
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// 메서드 사용 - 호출할 때마다 실행됨
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## 주의사항

1. **비동기 작업 피하기**: 계산된 속성은 동기적이고 부작용이 없어야 하며, 비동기 호출이나 컴포넌트 상태를 직접 수정하는 것을 금지합니다.  
2. **의존성 추적**: 반드시 반응형 데이터에만 의존해야 합니다. 그렇지 않으면 업데이트가 예측 불가능해집니다.  
3. **오류 방지**: 계산된 속성 내부에서 순환 의존성이나 비정상적인 할당이 발생하면 렌더링 실패 또는 무한 루프로 이어질 수 있으므로, 반드시 경계 조건을 미리 설정하고 예외 처리를 철저히 해야 합니다.

## 실제 적용 예시

아래는 계산된 속성의 유용성을 보여주는 간단한 폼 검증 예제입니다:

<o-playground name="폼 검증 예제" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>간단한 검증 예제</h3>
      <input type="text" sync:value="username" placeholder="사용자 이름 입력(최소 3자)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        상태: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? '사용자 이름 유효' : '사용자 이름 길이 부족';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

