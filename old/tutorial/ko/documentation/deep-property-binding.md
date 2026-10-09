# 속성 바인딩 이해하기

이전 내용에서 [속성 바인딩](./property-binding.md)의 기본 사용 방법을 간략히 소개했습니다. 이전 예제는 브라우저 네이티브 요소(예: `textarea`)의 `value` 속성을 바인딩하는 데 사용되었습니다. 이번 섹션에서는 속성 바인딩의 본질에 대해 깊이 있게 다룰 것입니다. 즉, 실제로는 HTML 속성이 아닌 컴포넌트가 인스턴스화된 후의 JavaScript 속성에 바인딩된다는 점입니다.

## 컴포넌트 속성 바인딩 메커니즘

ofa.js에서 부모 컴포넌트에서 `:toProp="fromProp"` 구문을 사용할 때, 우리는 자식 컴포넌트 인스턴스의 JavaScript 속성을 설정하는 것이지 HTML 속성을 설정하는 것이 아닙니다. 이는 HTML 속성을 직접 설정하는 방식(예: `attr:toKey="fromKey"`)과 중요한 차이가 있습니다.

아래 예제는 속성 바인딩을 통해 사용자 정의 컴포넌트로 데이터를 전달하는 방법을 보여줍니다:

<o-playground name="속성 바인딩 이해하기" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는:- 부모 컴포넌트의 `val` 데이터가 자식 컴포넌트 `<demo-comp>`의 `fullName` 속성에 바인딩됨
- `:full-name="val"` 구문을 사용해 부모 컴포넌트의 `val` 값을 자식 컴포넌트의 `fullName` 속성에 전달
- 자식 컴포넌트는 해당 값을 받아 템플릿에서 `{{fullName}}`로 표시

## 속성 바인딩 vs 특성 속성 상속

주의해야 할 점은 속성 바인딩(`:`)과 특성 속성 상속(`attr:`)에는 다음과 같은 주요 차이점이 있습니다:

### 속성 바인딩 (`:`)

- 컴포넌트 인스턴스에 바인딩된 JavaScript 속성
- 전달된 데이터는 원시 타입(문자열, 숫자, 불리언 등)을 유지합니다
- 컴포넌트 내부에서 직접 접근 및 수정이 가능하며, 심지어 컴포넌트 내부에 `data`를 미리 정의할 필요도 없습니다

### 특징 속성 상속 (`attr:`)

- HTML 속성 설정
- 모든 값은 문자열로 변환됩니다
- 주로 하위 DOM 요소에 속성을 전달하는 데 사용됩니다
- 복잡한 데이터를 구문 분석하려면 특별한 처리가 필요합니다
- 속성 값을 받으려면 구성 요소 내부에 `attrs`를 미리 정의해야 합니다

문법 비교:```html
<!-- 속성 바인딩: JavaScript 값 전달, 데이터 타입 유지 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- 속성 상속: HTML 속성 설정, 모든 값이 문자열로 변환됨 -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- 실제로 문자열 "42"가 전달됨 -->
```

## 사례 비교 차이

<o-playground name="사례 대비 차이" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
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
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
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
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

여기서 `vone`은 컴포넌트 인스턴스의 속성이고, `vtwo`는 HTML의 attribute 속성입니다. attribute 속성의 값은 `[vtwo]` 선택자에 의해 선택되어 스타일이 적용되지만, `vone`은 컴포넌트 인스턴스의 속성이므로 `[vone]` 선택자에 의해 선택되지 않습니다.

## 양방향 데이터 바인딩

인스턴스화된 컴포넌트는 양방향 데이터 바인딩도 지원하며, `sync:toProp="fromProp"` 구문을 사용합니다. 양방향 바인딩은 부모 컴포넌트와 자식 컴포넌트 간의 데이터 동기화를 허용하여, 어느 한 쪽의 데이터가 변경되면 다른 쪽도 그에 따라 업데이트됩니다.

> Angular 및 Vue와 달리, ofa.js는 컴포넌트에 특별한 구성이나 추가 작업을 추가할 필요 없이 기본적으로 양방향 데이터 바인딩 구문을 지원합니다.

### 양방향 바인딩 예제

다음 예제는 부모 컴포넌트와 자식 컴포넌트 간의 양방향 데이터 바인딩을 설정하는 방법을 보여줍니다：

<o-playground name="양방향 바인딩 예제" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
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
      <h3 style="color:blue;">부모 컴포넌트의 값: {{val}}</h3>
      <p>입력창을 통해 부모 컴포넌트의 값 수정:</p>
      <input type="text" sync:value="val" placeholder="입력창에 텍스트 입력...">
      <p>자식 컴포넌트를 통해 부모 컴포넌트의 값 수정:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
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
          margin: 8px;
        }
      </style>
      <p>자식 컴포넌트 표시 값: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="자식 컴포넌트 입력창에 입력...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는:- 부모 컴포넌트의 `val`과 자식 컴포넌트의 `fullName`이 `sync:full-name="val"`을 통해 양방향 바인딩됩니다.
- 부모 컴포넌트의 입력 상자에 내용을 입력하면 자식 컴포넌트가 즉시 새 값을 표시합니다.
- 자식 컴포넌트의 입력 상자에 내용을 입력하면 부모 컴포넌트도 즉시 업데이트되어 표시됩니다.

### 양방향 바인딩과 일반 속성 바인딩의 차이

| 특성 | 일반 속성 바인딩 (`:`) | 양방향 바인딩 (`sync:`) |
|------|-------------------|-------------------|
| 데이터 흐름 | 단방향: 부모 → 자식 | 양방향: 부모 ↔ 자식 |
| 문법 | `:prop="value"` | `sync:prop="value"` |
| 자식 컴포넌트 수정 | 부모 컴포넌트에 영향 없음 | 부모 컴포넌트에 영향 |
| 적용 시나리오 | 부모 컴포넌트가 자식 컴포넌트에 설정 전달 | 부모-자식 간 데이터 동기화 필요 |### 주의사항

1. **성능 고려사항**: 양방향 바인딩은 데이터 변경 시 재렌더링을 유발하므로, 복잡한 시나리오에서 신중하게 사용해야 합니다.
2. **데이터 흐름 제어**: 과도한 양방향 바인딩은 데이터 흐름 추적을 어렵게 만들 수 있으므로, 컴포넌트 간 통신 방식을 합리적으로 설계하는 것이 좋습니다.
3. **컴포넌트 호환성**: 모든 컴포넌트가 양방향 바인딩에 적합한 것은 아니며, 컴포넌트의 설계 목적을 고려해야 합니다.