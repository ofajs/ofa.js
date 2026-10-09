# 스크립트 도입

ofa.js는 script 태그를 통해 직접 불러와 사용할 수 있습니다. HTML 파일의 `<head>` 또는 `<body>` 부분에 다음 코드를 추가하기만 하면 됩니다:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 기본 사용

스크립트를 도입한 후, ofa.js는 전역 스코프에 `$` 변수를 생성하며, 모든 핵심 기능은 이 객체를 통해 제공됩니다. 이 객체를 통해 ofa.js의 다양한 메서드와 속성에 액세스할 수 있습니다. 후속 튜토리얼에서 구체적인 사용법을 자세히 소개할 것입니다.

## 디버그 모드

개발 과정에서 스크립트 URL 뒤에 `#debug` 매개변수를 추가하여 디버그 모드를 활성화할 수 있습니다:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

디버그 모드는 소스 맵 기능을 활성화하여 브라우저 개발자 도구에서 파일의 원본 소스 코드를 직접 확인하고 디버깅할 수 있게 하여 개발 효율성을 크게 향상시킵니다.

## ESM 모듈

ofa.js는 ESM 모듈을 통한 가져오기도 지원합니다. 프로젝트에서 `import` 문을 사용해 ofa.js를 가져올 수 있습니다:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

ESM 모듈을 사용할 때, 코드에서 `$` 변수를 전역 스코프를 거치지 않고 바로 사용할 수 있습니다.