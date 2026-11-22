# SSR과 동형 렌더링

> SSR이 무엇인지 잘 모르신다면, 현재 그 기능이 필요하지 않다는 뜻이므로 이 장을 건너뛰셔도 됩니다. 나중에 필요할 때 다시 돌아와 학습하세요.

## 동형 렌더링

ofa.js는 CSR의 원활한 경험, 더 나은 크롤러 인식(SEO), 그리고 더 자유로운 백엔드 개발 언어 선택을 동시에 유지하기 위해 독특한 동형 렌더링(Symphony Client-Server Rendering) 모드를 제공합니다.

> CSR / SSR / SSG의 정의와 차이를 알고 싶다면, 본문 말미의 해당 챕터를 직접 읽어 주세요.

동형 렌더링의 핵심 개념은:- 서버 측에서 초기 페이지 콘텐츠를 렌더링하여 SEO와 첫 화면 로딩 속도를 보장합니다.
- 클라이언트 측에서 라우팅 처리를 담당하여 CSR의 부드러운 사용자 경험을 유지합니다.
- 모든 서버 환경에 적용 가능하여 진정한 동형 렌더링을 구현합니다.

### 동형 렌더링 구현 원리

ofa.js의 동형 렌더링 모드는 다음 메커니즘을 기반으로 합니다:

1. 서버가 범용 실행 구조를 포함한 완전한 HTML 페이지를 생성합니다.
2. 클라이언트가 CSR 실행 엔진을 로드합니다.
3. 현재 실행 환경을 자동으로 식별하여 렌더링 전략을 결정합니다.

### 동형 렌더링 코드 구조

**원시 CSR 페이지 모듈:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**동일 구조 렌더링 캡슐화 후의 완전한 페이지:**

```html
<!doctype html>
<html lang="ko">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페이지 제목</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 페이지 모듈 내용 삽입 위치 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>저는 페이지입니다</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

따라서 개발 언어(Go, Java, PHP, Nodejs, Python 등)와 백엔드 템플릿 렌더링 엔진(Go의 `html/template`, PHP의 Smarty/Twig/Blade 등)을 자유롭게 사용하여, ofa.js의 동형 렌더링 코드 구조를 템플릿에 삽입하면 SSR을 구현할 수 있습니다.

* [Nodejs SSR 사례](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR 사례](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR 사례](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### 동형 렌더링 템플릿 구조

동형 렌더링 모드를 구현하려면 서버 측에서 다음과 같은 범용 템플릿 구조를 사용하면 됩니다:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 동적으로 해당 페이지 모듈 내용을 삽입합니다. -->
  </o-app>
</body>

</html>
```

**참고:** 서버에서 반환하는 HTML은 올바른 HTTP 헤더를 설정해야 합니다: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs`는 ofa.js가 제공하는 동형 렌더링 실행 엔진으로, 현재 페이지의 실행 상태에 따라 렌더링 전략을 자동으로 판단하여 어떤 환경에서도 최상의 사용자 경험을 제공하도록 보장합니다.

마찬가지로, SSG도 이 구조를 적용하여 정적 사이트 생성을 구현할 수 있습니다.

## ofa.js와 SSR 및 기타 프론트엔드 프레임워크의 차이

ofa.js의 Symphony Client-Server Rendering（이하 SCSR）은 본질적으로 SSR 모드이기도 합니다.

Vue, React, Angular 등 기존 프론트엔드 프레임워크의 SSR 방식과 비교했을 때, ofa.js의 가장 큰 장점은 **Node.js에 강제로 종속되지 않는다는 점**입니다. 즉, 모든 백엔드 템플릿 렌더링 엔진(예: PHP의 Smarty, Python의 Jinja2, Java의 Thymeleaf 등)이 ofa.js를 쉽게 통합하여 SSR을 구현할 수 있습니다.

## 웹페이지 렌더링 방식 개요

현대 웹 애플리케이션에는 주로 네 가지 렌더링 방식이 있습니다: 전통적인 서버 측 템플릿 엔진 렌더링, CSR(Client Side Rendering, 클라이언트 측 렌더링), SSR(Server Side Rendering, 서버 측 렌더링), SSG(Static Site Generation, 정적 사이트 생성)입니다. 각 방식마다 장점과 적합한 사용 사례가 있습니다.

### 전통적인 서버 측 템플릿 엔진 렌더링

다양한 웹 제품 중에서도 서버 측 템플릿 엔진은 여전히 가장 주류인 페이지 렌더링 방법입니다. Go, PHP 등의 백엔드 언어는 내장 또는 서드파티 템플릿 엔진(예: Go의 `html/template`, PHP의 Smarty/Twig/Blade 등)을 활용하여 동적 데이터를 HTML 템플릿에 주입하고, 한 번에 완성된 HTML 페이지를 생성하여 클라이언트에 반환합니다.

**장점：**- SEO 친화적, 첫 화면 로딩 속도 빠름
- 서버 측 제어, 보안성 높음
- 팀 기술 스택 요구 낮음, 백엔드 개발자만으로도 개발 완료 가능

**단점:**- 사용자 경험이 좋지 않으며, 매번 상호작용 시 페이지가 새로고침됨
- 서버 측 부하가 큼
- 프론트엔드와 백엔드 간의 결합도가 높아 분업 협업에 불리함

### CSR（클라이언트 측 렌더링）

CSR 모드에서 페이지 콘텐츠는 전적으로 브라우저 측 JavaScript에 의해 렌더링되며, ofa.js의 [단일 페이지 애플리케이션](./routes.md)이 전형적인 CSR 구현입니다. 이 방식은 페이지 전환 없이 모든 상호작용을 완료할 수 있어 부드러운 사용자 경험을 제공합니다. React 또는 Vue를 해당 라우팅 라이브러리(예: React Router 또는 Vue Router)와 함께 사용하여 개발한 단일 페이지 애플리케이션(SPA)은 모두 전형적인 CSR 구현입니다.

**장점：**- 사용자 경험이 원활하며 페이지 전환 시 새로고침 없음
- 클라이언트 처리 성능이 뛰어나며 응답 속도가 빠름

**단점:**- SEO에 불리하고, 검색 엔진이 콘텐츠를 색인하기 어렵습니다

### SSR（서버사이드 렌더링）

CSR의 유창한 경험을 유지하면서, 서버가 페이지를 실시간으로 렌더링하도록 변경: 사용자가 요청을 보낼 때 서버가 즉시 완전한 HTML을 생성하여 반환하며, 진정한 서버 사이드 렌더링을 구현합니다.

**장점：**- SEO 친화적, 첫 화면 로딩 속도 빠름
- 동적 콘텐츠 지원

**단점:**- 서버 부하가 큼
- 일반적으로 런타임으로서 Node.js 환경이 필요하거나, 적어도 한 겹의 Node.js 미들웨어 계층이 필요함
- 여전히 후속 클라이언트 활성화가 있어야만 완전한 상호작용을 구현할 수 있음

### SSG（정적 사이트 생성）

빌드 단계에서 모든 페이지를 사전 렌더링하여 정적 HTML 파일로 생성하고, 배포 후 서버에서 직접 사용자에게 반환할 수 있습니다.

**장점：**- 첫 로딩 속도가 빠르고, SEO에 친화적임
- 서버 부하가 낮고, 성능이 안정적임
- 보안성이 높음

**단점:**- 동적 콘텐츠 업데이트가 어려움
- 빌드 시간이 페이지 수 증가에 따라 늘어남