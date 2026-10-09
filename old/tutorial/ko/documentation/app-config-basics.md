# 애플리케이션 설정 기초

`app-config.js` 설정 파일은 애플리케이션의 다양한 동작을 정의하는 데 사용됩니다. 이 장에서는 설정 파일의 기본 구조와 사용 가능한 모든 설정 항목을 소개합니다.

## 구성 파일 구조

`app-config.js` 파일을 생성하고, ES6 모듈 문법을 사용하여 구성 항목을 내보냅니다:

```javascript
// 앱 홈 페이지 주소 (필수)
export const home = "./home.html";

// 페이지 전환 애니메이션 설정 (선택 사항)
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

// 로딩 상태 (선택 사항)
export const loading = () => {
  return "<div>Loading...</div>";
};

// 오류 처리 (선택 사항)
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// 앱 초기화 (선택 사항)
export const ready = function() {
  console.log("App is ready");
};

// 프로토타입 확장 (선택 사항)
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// 앞으로 가기 기능 활성화 (선택 사항)
export const allowForward = true;
```

## 구성 항목 개요

`app-config.js`는 다음 구성 항목을 지원합니다:

| 설정 항목 | 필수 여부 | 설명 | 상세 문서 |
|----------|----------|------|----------|
| `home` | ✅ 필수 | 앱 홈 페이지 주소 | 본 장 |
| `pageAnime` | 선택 | 페이지 전환 애니메이션 설정 | [페이지 전환 애니메이션](./page-transition-animation.md) |
| `loading` | 선택 | 페이지 로딩 중 표시할 콘텐츠 | [로딩 및 에러 처리](./app-loading-error.md) |
| `fail` | 선택 | 페이지 로딩 실패 시 표시할 콘텐츠 | [로딩 및 에러 처리](./app-loading-error.md) |
| `ready` | 선택 | 앱 초기화 완료 후 콜백 | [앱 초기화](./app-initialization.md) |
| `proto` | 선택 | 앱 프로토타입에 추가할 메서드와 속성 | [앱 초기화](./app-initialization.md) |
| `allowForward` | 선택 | 브라우저 앞으로 가기 기능 활성화 여부 | [라우팅 및 내비게이션](./app-navigation.md) |## home - 홈페이지 주소

`home`은 필수 구성 항목으로, 앱 시작 시 로드할 홈 페이지 모듈 경로를 지정합니다.

```javascript
export const home = "./pages/home.html";
```

**경로 규칙:**- 상대 경로 지원 (`app-config.js` 파일 기준)
- 절대 경로 지원
- 경로는 페이지 모듈 파일(`.html` 파일)을 가리킴

## pageAnime - 페이지 전환 애니메이션

`pageAnime`은 선택적 구성 항목으로, 페이지 전환 시의 전환 애니메이션 효과를 제어하는 데 사용됩니다.

### 기본 사용법

```javascript
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

### 애니메이션 상태 설명

페이지 전환 애니메이션에는 세 가지 상태가 포함됩니다:

| 상태 | 설명 | 트리거 시점 |
|------|------|----------|
| `current` | 현재 페이지 애니메이션 종료 후 스타일 | 페이지 전환 완료 후 |
| `next` | 새 페이지 진입 시 시작 스타일 | 새 페이지 진입 시작 시 |
| `previous` | 이전 페이지 이탈 시 목표 스타일 | 이전 페이지 이탈 시작 시 |### 더 많은 애니메이션 효과

페이지 전환 애니메이션은 다양한 효과를 지원하며, 다음을 포함합니다:- 좌우 슬라이드 (기본)
- 페이드 인/아웃
- 상하 슬라이드
- 확대/축소 효과
- 플립 효과
- 사용자 정의 애니메이션

자세한 애니메이션 구성 및 효과 예시는 [페이지 전환 애니메이션](./page-transition-animation.md) 장을 참고하세요.

## HTML에서 구성 파일 사용

HTML 파일에서 `o-app` 태그를 통해 설정 파일을 가져옵니다:

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

<o-playground name="앱 구성 기본 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 애플리케이션 홈페이지 주소
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
      <a href="./about.html" olink>Go to About</a>
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
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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
</o-playground>

