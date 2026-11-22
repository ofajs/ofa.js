# 이벤트 바인딩

ofa.js에서 이벤트 바인딩은 사용자 상호작용을 구현하는 중요한 메커니즘입니다. 여러 가지 방법을 통해 요소에 이벤트 핸들러를 바인딩하여 사용자의 작업에 응답할 수 있습니다.

## proto에서 이벤트 바인딩

이것은 권장되는 이벤트 바인딩 방식으로, 복잡한 이벤트 처리 로직에 적합합니다. 이벤트 처리 함수를 `proto` 객체에 정의하면 코드 로직을 더 잘 조직할 수 있으며, 유지보수와 재사용이 용이합니다.

<o-playground name="proto에서 이벤트 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 함수 직접 실행

간단한 작업(예: 카운터 증가, 상태 전환 등)의 경우 이벤트 속성에 짧은 표현식을 직접 작성할 수 있습니다. 이 방식은 간결하고 명확하여 단순한 로직을 처리하기에 적합합니다.

<o-playground name="함수 직접 실행" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 지원되는 이벤트 유형

ofa.js는 모든 표준 DOM 이벤트를 지원하며, 여기에는 다음이 포함되지만 이에 국한되지 않습니다:

- 마우스 이벤트: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout` 등
- 키보드 이벤트: `keydown`, `keyup`, `keypress` 등
- 폼 이벤트: `submit`, `change`, `input`, `focus`, `blur` 등
- 터치 이벤트: `touchstart`, `touchmove`, `touchend` 등

ofa.js에서 지원하는 이벤트 유형은 기본 DOM 이벤트와 완전히 동일하며, 자세한 내용은 [MDN 이벤트 문서](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)를 참조하십시오.

## 이벤트 핸들러에 매개변수 전달

이벤트 핸들러에 인자를 전달할 수도 있습니다:

<o-playground name="이벤트 핸들러에 매개변수 전달" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">5 추가 - 현재: {{count}}</button>
      <button on:click="addNumber(10)">10 추가 - 현재: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 이벤트 객체 접근

이벤트 핸들러에서 `event` 매개변수를 통해 네이티브 이벤트 객체에 접근할 수 있습니다:

<o-playground name="이벤트 객체에 접근" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">아무 위치나 클릭하여 좌표 확인</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

표현식에서 `$event` 매개변수를 사용하여 네이티브 이벤트 객체에 접근할 수도 있습니다. 예를 들어 마우스 클릭 좌표를 가져오는 경우:

```html
<div class="container" on:click="handleClick($event)">아무 위치나 클릭하여 좌표를 확인하세요</div>
```

## 사용자 정의 이벤트 리스닝

네이티브 DOM 이벤트를 감시하는 것 외에도, 컴포넌트가 발생시킨 커스텀 이벤트도 손쉽게 감시할 수 있습니다:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

사용자 지정 이벤트에 대해 더 깊이 이해하고 싶다면 [사용자 지정 이벤트](custom-events.md) 챕터를 참조하세요. 튜토리얼 순서에 따라 차근차근 진행하는 것을 권장하며, 이후 내용이 자연스럽게 이어질 것입니다. 물론, 언제든지 찾아보고 미리 익히셔도 좋습니다.