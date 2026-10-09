# o-page 컴포넌트

`o-page`는 ofa.js의 핵심 컴포넌트 중 하나로, 독립적인 페이지 또는 페이지 모듈을 나타냅니다. 다음은 `o-page`의 주요 속성 및 메서드입니다.

## src 속성

`src` 속성은 페이지 모듈의 구체적인 주소를 지정하는 데 사용됩니다. 이것은 페이지 내용과 동작을 지정하는 핵심 속성이며, 애플리케이션에 특정 페이지의 내용을 어디서 로드할지 알려줍니다.

```javascript
const page = this;
```

## goto 메서드

`goto` 메소드는 현재 페이지에서 다른 페이지로 이동하는 데 사용됩니다. `app`의 `goto` 메소드와 비교하여 `page`의 `goto` 메소드는 **상대 주소**를 사용하여 다른 페이지로 이동할 수 있습니다.

```javascript
page.goto("./page2.html");
```

## replace 메서드

`replace` 메서드는 현재 페이지를 다른 페이지로 교체하는 데 사용됩니다. 이는 `app`의 `replace` 메서드와 유사하지만, 페이지 내에서 교체 작업을 수행합니다.

```javascript
page.replace("./new-page.html");
```

## back 방법

`back` 메서드는 이전 페이지로 돌아가는 데 사용됩니다. 이는 사용자를 이전 페이지로 다시 이동시키며, 브라우저의 뒤로 가기 작업과 유사합니다.

```javascript
page.back();
```