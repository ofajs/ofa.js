# o-app 컴포넌트

`o-app`는 ofa.js의 핵심 구성 요소 중 하나로, 전체 애플리케이션을 구성하고 관리하는 데 사용됩니다. 다음은 app의 몇 가지 주요 속성과 메서드입니다.

## src



`src` 속성은 애플리케이션 매개변수 구성 모듈의 구체적인 주소를 지정하는 데 사용됩니다.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



`current` 속성은 현재 표시되고 있는 페이지 인스턴스를 가져오는 데 사용됩니다. 이를 통해 현재 표시되는 페이지에 접근하고 조작할 수 있으며, 예를 들어 콘텐츠를 업데이트하거나 특정 작업을 실행할 수 있습니다.

```javascript
const currentPage = app.current;
```

## goto



`goto` 메서드는 지정된 페이지로 이동하는 데 사용됩니다. 대상 페이지의 주소를 전달하면 앱이 해당 페이지를 로드하고 표시합니다. 이것은 앱 탐색의 중요한 메서드입니다.

```javascript
app.goto("/page2.html");
```

## replace



`replace` 메서드는 `goto`와 유사하지만, 스택에 새 페이지를 추가하는 대신 현재 페이지를 대체하는 데 사용됩니다. 이것은 스택 탐색 대신 페이지 대체를 구현하는 데 사용할 수 있습니다.

```javascript
app.replace("/new-page.html");
```

## back



`back` 메서드는 이전 페이지로 돌아가기 위해 사용되며, 페이지 탐색의 뒤로 가기 작업을 구현합니다. 이는 사용자를 이전 페이지로 다시 탐색하게 합니다.

```javascript
app.back();
```

## routers



`routers` 속성은 애플리케이션의 라우트 설정 정보를 포함합니다. 이는 중요한 속성으로, 애플리케이션 내 각 페이지의 라우트 규칙과 매핑을 정의합니다. 라우트 설정은 페이지 간의 내비게이션과 URL을 어떻게 처리할지를 결정합니다.

```javascript
const routeConfig = app.routers;
```