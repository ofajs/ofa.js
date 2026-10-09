# 애플리케이션 구성

`app-config.js` 설정 파일은 홈페이지 주소와 페이지 전환 애니메이션 외에도, 앱의 로딩 상태, 오류 처리, 초기화 로직, 네비게이션 기능을 제어하는 더 많은 구성 옵션을 지원합니다.

```javascript
// app-config.js
// 로딩 중에 표시되는 내용
export const loading = () => "<div>로딩 중...</div>";

// 페이지 로드 실패 시 표시되는 컴포넌트
export const fail = (src, error) => `<div>로드 실패: ${src}</div>`;

// 앱 초기화 완료 후 콜백
export const ready() {
  console.log("앱이 준비되었습니다!");
}

// 앱 프로토타입에 추가되는 메소드와 속성
export const proto = {
  customMethod() {
    console.log("커스텀 메소드가 호출되었습니다");
  },
};
```

<o-playground name="애플리케이션 구성 예시" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 애플리케이션 홈페이지 주소
    export const home = "./home.html";
    // 페이지 전환 애니메이션 구성
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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

## loading - 로딩 상태

페이지 로딩 중에 표시되는 컴포넌트로, 문자열 템플릿 또는 템플릿을 반환하는 함수일 수 있습니다.

```javascript
// 간단한 문자열 템플릿
export const loading = "<div class='loading'>로딩 중...</div>";

// 함수를 사용하여 동적으로 생성
export const loading = () => {
  return `<div class='loading'>
    <span>로딩 중...</span>
  </div>`;
};
```

다음은 예쁘고 프로젝트에 바로 복사하여 사용할 수 있는 로딩 구현입니다:

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - 오류 처리

페이지 로딩 실패 시 표시되는 컴포넌트, 함수는 객체 파라미터를 받으며, `src`(실패 페이지의 주소)와 `error`(오류 정보)를 포함합니다.

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>페이지 로딩 실패</p>
    <p>주소: ${src}</p>
    <button on:click="back()">뒤로가기</button>
  </div>`;
};
```

## proto - 프로토타입 확장

애플리케이션 인스턴스에 사용자 정의 메서드와 계산된 속성을 추가하면, 페이지 컴포넌트에서 `this.app`로 이들에 접근할 수 있습니다.

```javascript
export const proto = {
  // 사용자 정의 메서드
  navigateToHome() {
    this.goto("home.html");
  },
  // 계산된 속성
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

페이지에서 호출:

```html
<template page>
  <button on:click="app.navigateToHome()">홈으로 돌아가기</button>
  <p>홈에 있습니까?: {{app.isAtHome}}</p>
</template>
```

## ready - 초기화 콜백

애플리케이션 구성 로드 완료 후 실행되는 콜백 함수입니다. 여기서 초기화 작업을 수행할 수 있습니다. `this`를 통해 애플리케이션 인스턴스의 메서드와 속성에 접근할 수 있습니다.

```javascript
export const ready() {
  console.log("애플리케이션이 초기화되었습니다");
  // this(o-app 요소 인스턴스)에 접근할 수 있습니다
  console.log(this.current); // 현재 페이지 o-page 요소 인스턴스 가져오기
  // this.someMethod();
}
```

## allowForward - 전진 기능

브라우저 앞으로 가기 기능 활성화 여부를 제어합니다. `true`로 설정하면 브라우저의 뒤로 가기 및 앞으로 가기 버튼을 사용하여 탐색할 수 있습니다.

```javascript
export const allowForward = true;
```

활성화되면 사용자는 브라우저의 앞으로/뒤로 버튼을 통해 탐색할 수 있으며, 앱의 네비게이션 메서드 `forward()`도 적용됩니다.

## 프로그래밍 방식 네비게이션

`olink` 링크 외에도 JavaScript에서 네비게이션 메서드를 호출할 수 있습니다:

```javascript
// 지정된 페이지로 이동 (히스토리에 추가)
this.goto("./about.html");

// 현재 페이지 교체 (히스토리에 추가하지 않음)
this.replace("./about.html");

// 이전 페이지로 뒤로 가기
this.back();

// 다음 페이지로 앞으로 가기 (allowForward: true 설정 필요)
this.forward();
```

## 라우팅 히스토리

`routers` 속성을 통해 브라우징 기록을 얻을 수 있습니다:

```javascript
// 모든 라우트 히스토리 가져오기
const history = app.routers;
// 반환 형식: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 현재 페이지 가져오기
const currentPage = app.current;
```

## 라우트 변경 감시

`router-change` 이벤트를 수신하여 라우트 변경에 대응할 수 있습니다:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("라우트 변경:", data.name); // goto, replace, forward, back
  console.log("페이지 주소:", data.src);
});
```