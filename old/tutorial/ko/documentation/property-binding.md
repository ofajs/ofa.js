# 속성 바인딩

ofa.js는 요소 인스턴스화 후 객체의 속성에 데이터를 바인딩하는 것을 지원합니다. 예를 들어 input 요소의 value 또는 checked 속성 등이 있습니다.

## 단방향 속성 바인딩

단방향 속성 바인딩은 `:toKey="fromKey"` 구문을 사용하여 컴포넌트 데이터를 DOM 요소의 속성에 "단방향"으로 동기화합니다. 컴포넌트 데이터가 변경되면 요소 속성이 즉시 업데이트되지만, 요소 자체의 변경(예: 사용자 입력)은 컴포넌트로 다시 쓰여지지 않아 데이터 흐름의 단일성과 제어 가능성을 유지합니다.

<o-playground name="단방향 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>현재 값: {{val}}</p>
      <input type="text" :value="val" placeholder="이것은 단방향 바인딩 입력 상자입니다">
      <p>주의: 입력 상자에서 직접 내용을 수정해도 위에 표시된 값은 변경되지 않습니다</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 양방향 속성 바인딩

양방향 속성 바인딩은 `sync:xxx` 구문을 사용하여 컴포넌트 데이터와 DOM 요소 사이의 양방향 동기화를 구현합니다. 컴포넌트 데이터가 변경되면 DOM 요소의 속성이 업데이트되고, DOM 요소의 속성이 변경될 때(예: 사용자 입력) 컴포넌트 데이터도 동기적으로 업데이트됩니다.

<o-playground name="양방향 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>현재 값: {{val}}</p>
      <input type="text" sync:value="val" placeholder="양방향 바인딩된 입력 상자입니다">
      <p>힌트: 입력 상자에서 내용을 수정하면 위에 표시된 값이 실시간으로 업데이트됩니다.</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 양방향 바인딩의 특징

- 데이터 흐름: 컴포넌트 ↔ DOM 요소 (양방향)
- 컴포넌트 데이터 변화 → DOM 요소 업데이트
- DOM 요소 변화 → 컴포넌트 데이터 업데이트
- 사용자 입력과 데이터 동기화가 필요한 시나리오에 적합

### 객체의 양방향 바인딩

객체 유형의 데이터 바인딩에서는 **`sync` 문법을 사용할 필요가 없으며**, `:` 단방향 전달만 사용하면 됩니다. 이는 JavaScript의 객체가 참조 공유되기 때문입니다. 부모 컴포넌트가 객체를 자식 컴포넌트에 전달할 때, 자식 컴포넌트는 동일한 객체의 참조를 받게 되며, 객체의 수정 사항이 원본 데이터에 바로 반영됩니다.

ofa.js는 JavaScript의 이 특성을 그대로 유지하므로, 객체의 단방향 전달은 실제로 양방향 전달과 같습니다. 예를 들어:

```html
<template page>
  <child-comp :userData="userInfo"></child-comp>
  <script>
    export default async () => {
      return {
        data: { userInfo: { name: "장산", age: 25 } }
      };
    };
  </script>
</template>
```

`child-comp` 컴포넌트에서 `userData.name`을 직접 수정하면 부모 컴포넌트의 `userInfo.name`도 동시에 업데이트됩니다. 이는 동일한 객체 참조를 가리키기 때문입니다.

### 일반적인 양방향 바인딩 시나리오

<o-playground name="양방향 폼 바인딩 예제" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>양방향 폼 바인딩 예제</h3>
      <div class="form-group">
        <label>텍스트 입력:</label>
        <input type="text" sync:value="textInput" placeholder="텍스트 입력">
      </div>
      <div class="form-group">
        <label>숫자 입력:</label>
        <input type="number" sync:value="numberInput" placeholder="숫자 입력">
      </div>
      <div class="form-group">
        <label>여러 줄 텍스트:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="여러 줄 텍스트 입력"></textarea>
      </div>
      <div class="form-group">
        <label>선택 상자:</label>
        <select sync:value="selectedOption">
          <option value="">선택하세요...</option>
          <option value="option1">옵션1</option>
          <option value="option2">옵션2</option>
          <option value="option3">옵션3</option>
        </select>
      </div>
      <div class="form-group">
        <label>체크박스:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> 약관에 동의합니다
        </label>
      </div>
      <div class="preview">
        <h4>실시간 미리보기:</h4>
        <p>텍스트: {{textInput}}</p>
        <p>숫자: {{numberInput}}</p>
        <p>여러 줄 텍스트: {{textareaInput}}</p>
        <p>선택: {{selectedOption}}</p>
        <p>체크박스 상태: {{isChecked ? '체크됨' : '체크 안 됨'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

1. **성능 고려사항**: 양방향 바인딩은 데이터 리스너를 생성하므로, 과도하게 사용하면 성능에 영향을 줄 수 있습니다.
2. **데이터 일관성**: 양방향 바인딩은 데이터와 뷰의 일관성을 보장하지만, 무한 루프 업데이트를 피하도록 주의해야 합니다.
3. **초기값 설정**: 바인딩된 데이터에 적절한 초기값을 설정하여 undefined 표시 문제를 방지하세요.
4. **이벤트 충돌**: 동일한 요소에 양방향 바인딩과 수동 이벤트 처리를 동시에 사용하지 않도록 하여 충돌을 방지하세요.