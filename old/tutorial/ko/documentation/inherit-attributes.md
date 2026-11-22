# 특징 속성 전달

ofa.js에서 [특성 속성(Attribute)](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes)은 컴포넌트 간 데이터를 전달하는 가장 일반적인 방법 중 하나입니다. 컴포넌트의 `attrs` 객체에서 필요한 속성을 선언하기만 하면, 컴포넌트를 사용할 때 외부 데이터를 컴포넌트 내부로 전달할 수 있습니다.

## 기본 사용법

### 수신 속성 정의

컴포넌트를 사용하기 전에, 먼저 컴포넌트의 `attrs` 객체에 받을 속성을 선언해야 합니다. 속성에 기본값을 설정할 수 있습니다.

<o-playground name="기본 사용 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA 컴포넌트 예제"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS 사용 사례"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 중요 규칙

1. **유형 제한**: 전달되는 `attribute` 값은 반드시 문자열이어야 하며, 다른 유형은 자동으로 문자열로 변환됩니다.

2. **명명 변환**: HTML 속성은 대소문자를 구분하지 않으므로, 대문자가 포함된 속성을 전달할 때는 `-`로 구분된 이름(케밥 케이스 형식)을 사용해야 합니다.
   - 예: `fullName` → `full-name`

3. **정의 필수**: 컴포넌트가 `attrs` 객체에 해당 속성을 정의하지 않은 경우, 해당 attribute를 받을 수 없습니다. 설정된 값은 기본값이며, 기본값을 원하지 않으면 `null`로 설정합니다.

<o-playground name="중요 규칙 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="장삼" age="25"></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "기본 이름",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 템플릿 문법으로 Attribute 전달하기

컴포넌트 템플릿에서는 `attr:toKey="fromKey"` 구문을 사용하여 현재 컴포넌트의 `fromKey` 데이터를 하위 컴포넌트의 `toKey` 속성으로 전달할 수 있습니다.

<o-playground name="속성 전달 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 다단계 전달

다중 레이어 중첩 컴포넌트를 통해 속성을 단계적으로 전달할 수 있습니다.

컴포넌트가 다른 컴포넌트에 의존해야 하는 경우, 해당 컴포넌트에서 다른 컴포넌트의 모듈을 가져와야 합니다.

<o-playground name="다층 전달 예제" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="최상위 데이터"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>외부 컴포넌트 수신: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>내부 컴포넌트 수신: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

