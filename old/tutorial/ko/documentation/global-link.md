# global-link 컴포넌트

`global-link`는 모든 컴포넌트가 스타일을 공유할 수 있게 해주는 도구 컴포넌트입니다.

## 기본 사용법

`ofa.js` 뒤에 `global-link` 컴포넌트를 참조하고, `global-link`를 통해 스타일 파일을 참조하면 모든 컴포넌트가 해당 스타일 파일을 로드하게 됩니다.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>global-link 예제</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/global-link/dist/global-link.min.mjs" type="module"></script>
</head>
<body>
  <o-global-link href="./global.css"></o-global-link>
</body>
</html>
```

## 적용 시나리오

⚠️ **경고**: `global-link`는 전역 스타일 범위를 오염시킬 수 있으며, 전역 변수와 동일합니다.

**새 프로젝트에서는 절대 이 컴포넌트를 사용하지 마세요!** 새 프로젝트에서 `global-link`를 사용한다면, 프로젝트 아키텍처 설계에 문제가 있다는 뜻이며, 이는 잘못된 프로젝트의 신호입니다.

다음 시나리오에서만 사용하세요:

- 레거시 프로젝트 마이그레이션 (임시 방안)
- 스파게티 코드, 망가진 프로젝트 (임시 소방)

## 대안

`public.css` 파일을 생성한 다음, 각 컴포넌트 모듈에서 (`link` 태그를 사용하여) 각각 불러오면 원하는 효과를 얻을 수 있으며, 동시에 전역 스타일 오염을 피할 수 있습니다.

```html
<!-- 컴포넌트 모듈에서 -->
<link rel="stylesheet" href="./public.css">
```

## 주의사항

반드시 우선적으로 `o-global-link` 태그를 사용하여 초기화해야 하며, 초기화가 완료된 후에야 이후 컴포넌트가 전역 스타일을 적용받게 됩니다.