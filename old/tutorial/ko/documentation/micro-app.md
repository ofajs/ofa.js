# 마이크로 앱

`o-app`은 ofa.js의 핵심 컨테이너 컴포넌트로, 독립적인 마이크로 앱을 생성하는 데 사용됩니다. 이는 `app-config.js` 설정 파일을 로드하며, 해당 파일은 앱의 다양한 동작을 정의합니다.

## 기본 사용

HTML에서 `o-app` 태그를 사용하여 마이크로 앱을 생성합니다:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

## 구성 파일 생성

`app-config.js` 파일을 생성하고 애플리케이션의 기본 설정을 정의합니다:

```javascript
// app-config.js

// 앱 홈 페이지 주소 (필수)
export const home = "./home.html";

// 페이지 전환 애니메이션 설정 (선택)
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

<o-playground name="마이크로 앱 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 애플리케이션 홈 페이지 주소
    export const home = "./home.html";
    // 페이지 전환 애니메이션 설정
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 페이지 네비게이션

### olink 속성 사용

`o-app` 내에서 `olink` 속성이 있는 `<a>` 태그를 사용하여 페이지를 전환합니다:

```html
<a href="./about.html" olink>소개 페이지로 이동</a>
```

`olink`는 앱의 라우팅 전환을 트리거하며, 전환 애니메이션과 함께 동작하고 전체 페이지를 새로고침하지 않습니다.

### 프로그래밍 방식 내비게이션

페이지 컴포넌트에서 탐색 메서드를 사용할 수 있습니다:

```javascript
// 지정된 페이지로 이동
this.goto("./about.html");

// 현재 페이지 교체 (히스토리에 추가되지 않음)
this.replace("./about.html");

// 이전 페이지로 돌아가기
this.back();
```

## 페이지 매개변수 전달

URL 쿼리를 통해 매개변수를 전달하면 대상 페이지는 모듈 함수의 `query` 매개변수를 통해 수신합니다:

보내는 페이지:

```html
<a href="./detail.html?id=123" olink>상세 보기</a>
```

수신 페이지:

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## 설정 파일 상세 설명

`app-config.js`는 앱 동작을 제어하기 위한 다양한 구성 옵션을 지원합니다：

| 설정 항목 | 필수 여부 | 설명 |
|--------|----------|------|
| `home` | 필수 | 앱 홈페이지 주소 |
| `pageAnime` | 선택 | 페이지 전환 애니메이션 설정 |
| `loading` | 선택 | 페이지 로딩 시 표시할 내용 |
| `fail` | 선택 | 페이지 로딩 실패 시 표시할 내용 |
| `ready` | 선택 | 앱 초기화 완료 후 호출되는 콜백 |
| `proto` | 선택 | 앱 프로토타입에 추가할 메서드 및 속성 |
| `allowForward` | 선택 | 브라우저 앞으로 가기 기능 사용 여부 |## 마이크로앱 기능

### 독립성

각 `o-app` 인스턴스는 독립적인 마이크로 앱으로, 자체적으로 다음을 가집니다:- 라우팅 히스토리
- 페이지 스택
- 상태 관리
- 구성 옵션

### 중첩 사용

`o-app`은 중첩하여 사용할 수 있어 복잡한 애플리케이션 구조를 구현할 수 있습니다:

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### 컴포넌트와의 차이점

`o-app`와 일반 컴포넌트의 주요 차이점:

| 특성 | o-app | 일반 컴포넌트 |
|------|-------|----------|
| 라우팅 관리 | ✅ 내장 라우팅 시스템 | ❌ 없음 |
| 페이지 스택 | ✅ 페이지 히스토리 관리 | ❌ 없음 |
| 설정 파일 | ✅ 독립 설정 | ❌ 없음 |
| 페이지 전환 애니메이션 | ✅ 지원 | ❌ 없음 |
| 적용 시나리오 | 앱 수준 컨테이너 | 기능 컴포넌트 |