# 빠른 시작

이 섹션에서는 ofa.js를 빠르게 시작하는 방법을 소개합니다. 이후 튜토리얼에서는 index.html 진입 파일 생성 단계를 생략하고 페이지 모듈 파일의 코드만 보여드릴 것입니다. 템플릿을 기반으로 바로 개발할 수 있습니다.

## 기초 파일 준비

ofa.js를 빠르게 시작하려면 **페이지 모듈**을 하나 만들고 진입 HTML과 함께 사용하면 됩니다. 필요한 핵심 파일은 다음과 같습니다:

- `index.html`: 애플리케이션의 진입 파일로, ofa.js 프레임워크를 로드하고 페이지 모듈을 불러오는 역할을 함
- `demo-page.html`: 페이지 모듈 파일로, 페이지의 구체적인 콘텐츠, 스타일 및 데이터 로직을 정의함

### index.html (애플리케이션 진입점)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 예시</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

이 파일의 주요 역할은:- ofa.js 프레임워크 소개
- `<o-page>` 컴포넌트를 사용하여 페이지 모듈을 로드하고 렌더링

### demo-page.html (페이지 모듈)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
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
```

이 파일은 다음을 포함하는 간단한 페이지 컴포넌트를 정의합니다:- `<template page>` 태그, 페이지 모듈 정의
- CSS 스타일 (Shadow DOM의 `:host` 선택자 사용)
- 데이터 바인딩 표현식 `{{val}}`
- JavaScript 로직, 초기 데이터를 포함하는 객체 반환


## 온라인 데모

다음은 온라인 편집기에서의 실시간 예시입니다, 코드를 직접 수정하고 결과를 확인할 수 있습니다:

<o-playground name="온라인 데모" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
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
</o-playground>

우리는 컴포넌트 내부의 `<style>` 태그를 통해 스타일을 정의하며, 이러한 내부 스타일은 컴포넌트 내부에만 작용하며 우수한 캡슐화를 제공하여 페이지의 다른 요소에 영향을 주지 않습니다.

여기서 `:host` 선택자는 컴포넌트 호스트 요소의 스타일을 정의하는 데 사용되며, 여기서는 컴포넌트를 블록 레벨 요소로 설정하고 빨간색 테두리와 10px의 안쪽 여백을 추가합니다.

`{{key}}` 표현식을 통해 컴포넌트 데이터에서 해당 값을 페이지에 렌더링할 수 있습니다.

지금 첫 번째 ofa.js 애플리케이션을 성공적으로 생성했습니다! 다음으로, ofa.js의 템플릿 렌더링 구문과 고급 기능에 대해 자세히 알아보겠습니다.