# 컴포넌트 생성

ofa.js에서 컴포넌트는 페이지 재사용 및 모듈화를 실현하는 핵심 메커니즘입니다. 컴포넌트는 본질적으로 사용자 정의 Web Component로, 템플릿, 스타일 및 로직을 정의하여 재사용 가능한 UI 요소를 만들 수 있습니다.

## 컴포넌트의 기본 구조

페이지 모듈과 달리, 컴포넌트 모듈의 `<template>` 요소는 `component` 속성을 사용하며, `tag` 속성을 선언하여 컴포넌트 태그 이름을 지정합니다.

컴포넌트를 사용해야 하는 위치에서 `l-m` 태그를 통해 비동기로 컴포넌트 모듈을 로드하면 시스템이 자동으로 등록을 완료합니다. 이후에는 일반 HTML 태그처럼 해당 컴포넌트를 바로 사용할 수 있습니다.

<o-playground name="컴포넌트 기본 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS 컴포넌트 예제",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 컴포넌트 핵심 개념

### tag - 컴포넌트 태그 이름

`tag`는 컴포넌트의 태그 이름이며, **반드시 컴포넌트를 사용하는 태그 이름과 일치해야 합니다**. 예를 들어, 컴포넌트의 `tag`가 `"demo-comp"`로 정의되어 있다면, HTML에서 사용할 때 반드시 `<demo-comp></demo-comp>`라고 작성해야 합니다.

컴포넌트는 본질적으로 Web Component이므로 **컴포넌트 태그 이름에는 반드시 하이픈 `-`이 포함되어야 합니다**. 이는 네이티브 HTML 요소의 태그 이름과 충돌하지 않도록 하기 위한 Web Component 사양의 요구 사항입니다. 예를 들어 `demo-comp`, `my-button`, `user-card` 등은 유효한 태그 이름이며, `democomp`, `button`, `card`와 같이 하이픈이 없는 태그 이름은 유효하지 않습니다.

### 구성 요소 모듈 참조

`l-m` 태그를 통해 컴포넌트 모듈을 가져오면, 컴포넌트 모듈이 자동으로 컴포넌트를 등록합니다. 이는 `script` 태그를 사용하여 스크립트를 가져오는 것과 유사하지만, `l-m`은 컴포넌트 모듈의 로드 및 등록에 특화되어 있습니다.

> 주의: `l-m` 인용 태그는 **비동기 인용**으로, 페이지 로딩 시 필요에 따라 컴포넌트를 로드하기에 적합합니다.

## 동기 참조 컴포넌트

어떤 시나리오에서는 동기적으로 컴포넌트를 로드해야 할 수도 있습니다 (예를 들어 컴포넌트가 사용 전에 이미 등록되었는지 확인). 이때 `load` 메서드와 `await` 키워드를 함께 사용하여 동기 참조를 구현할 수 있습니다.

컴포넌트 모듈과 페이지 모듈에서는 자동으로 `load` 함수가 주입되어 개발자가 필요한 리소스를 동기식으로 로드할 수 있습니다.

<o-playground name="동기 참조 컴포넌트 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS 컴포넌트 예시",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 비동기 참조 vs 동기 참조

| 참조 방식 | 키워드 | 특징 |
|---------|-------|------|
| 비동기 참조 | `l-m` 태그 | 비차단 로딩, 필요에 따라 컴포넌트를 로드하는 데 적합 |
| 동기 참조 | `load` 메서드와 `await` 키워드 함께 사용 | 차단 로딩, 컴포넌트가 사용 전에 등록되었음을 보장 |`l-m` 태그 참조와 `load` 메서드 모두 컴포넌트 모듈을 로드할 수 있습니다. 일반적인 경우에는 비차단 로딩과 필요 시 로딩을 구현하기 위해 `l-m` 태그를 사용하여 컴포넌트를 비동기적으로 참조하는 것을 권장합니다.