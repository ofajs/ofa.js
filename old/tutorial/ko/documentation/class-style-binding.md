# 클래스와 스타일 바인딩

ofa.js에서 동적으로 클래스명, 스타일 및 속성을 바인딩하여 유연한 UI 상태 관리를 구현할 수 있습니다. 이를 통해 인터페이스가 데이터 변화에 따라 자동으로 외관을 조정할 수 있습니다.

## 클래스 바인딩

클래스 바인딩을 사용하면 데이터 상태에 따라 CSS 클래스를 동적으로 추가하거나 제거할 수 있습니다. `class:className="booleanExpression"` 구문을 사용하여 특정 클래스를 바인딩할 수 있습니다.

`booleanExpression`이 `true`일 때, 클래스 이름이 요소에 추가됩니다; `false`일 때, 클래스 이름이 제거됩니다.

### 기본 클래스 바인딩

<o-playground name="기본 클래스 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <p class="green" class:hide="isHide">{{val}}</p>
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

### 여러 클래스 바인딩

또한 여러 클래스를 동시에 바인딩하여 요소가 다양한 조건에 따라 다른 외관 상태를 가지도록 할 수 있습니다.

<o-playground name="여러 클래스 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 스타일 바인딩

스타일 바인딩을 사용하면 인라인 스타일의 값을 직접 설정할 수 있으며, 동적 업데이트를 지원합니다. ofa.js는 두 가지 스타일 바인딩 방식을 제공합니다:

### 단일 스타일 속성 바인딩

`:style.propertyName` 구문을 사용하여 특정 스타일 속성을 바인딩합니다.

<o-playground name="단일 스타일 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">색상 전환</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 다양한 스타일 속성 바인딩

여러 스타일 속성을 한 번에 바인딩할 수도 있습니다:

<o-playground name="다양한 스타일 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamic Styling Example
      </p>
      <button on:click="changeStyles">Change Styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 속성 바인딩

클래스와 스타일 바인딩 외에도 다른 HTML 속성을 동적으로 바인딩할 수 있습니다. ofa.js는 `attr:attributeName` 구문을 사용하여 속성 바인딩을 구현합니다.

### 기본 속성 바인딩

<o-playground name="기본 속성 바인딩" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "이것은 힌트 정보입니다",
              val: "Hover over me to see the title",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 부울 속성 처리

불리언 타입 속성(예: `disabled`, `hidden`)의 경우, ofa.js는 바인딩 값의 진위 여부에 따라 해당 속성을 추가할지 결정합니다.

<o-playground name="불리언 속성 처리" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## data() 함수

스타일에서 `data(key)`를 사용하여 컴포넌트 데이터를 바인딩할 수 있습니다. 이는 컴포넌트 데이터에 따라 스타일을 동적으로 변경해야 하는 상황에 매우 적합합니다.

<o-playground name="스타일 태그 내 데이터 함수" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          font-size: 10px;
          color:red;
          transition: all .3s ease;
        }
      </style>
      <style>
        p:hover {
          font-size: data(size);
          color: green;
          transition: all data(time)s ease;
        }
      </style>
      Hover FontSize: <input type="number" sync:value="size" placeholder="양방향 바인딩 입력 상자입니다" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="양방향 바인딩 입력 상자입니다" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

`style` 태그 내의 `data(key)`는 원칙적으로 전체 style의 내용을 대체합니다. 불필요한 스타일의 반복 렌더링을 방지하려면, `data(key)`를 포함하는 스타일은 별도의 `style` 태그에 넣고, 데이터 바인딩이 필요 없는 스타일은 다른 `style` 태그에 배치하여 더 나은 성능을 얻는 것을 권장합니다.

```html
<!-- ❌ data(key)가 없는 p:hover도 새로고침됩니다 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ data(xxx)만 있는 스타일은 다시 렌더링됩니다 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```