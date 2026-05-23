# 라우팅과 네비게이션

앱 내 페이지 탐색은 단일 페이지 애플리케이션의 핵심 기능입니다. 이 장에서는 프로그래밍 방식 탐색 사용법, 라우팅 히스토리 관리 및 라우트 변경 감지 방법을 소개합니다.

## allowForward - 전진 기능

기본적으로, 앱은 뒤로 가기 탐색만 지원합니다. `app-config.js`에서 `allowForward`를 `true`로 설정하면 앱의 앞으로 가기 기능을 활성화할 수 있습니다.

```javascript
// app-config.js
export const allowForward = true;
```

활성화 후:

- 사용자가 브라우저의 앞으로/뒤로 버튼을 사용하여 탐색할 수 있습니다
- 앱의 `forward()` 메서드가 정상적으로 작동합니다

## 프로그래밍 방식 네비게이션

`olink` 속성을 사용하는 링크 외에도 JavaScript에서 내비게이션 메서드를 호출할 수 있습니다.

> **중요 설명**:
> - `goto`, `replace`, `back` 메서드는 **페이지 인스턴스(page)** 와 **앱 인스턴스(app)** 모두에서 사용 가능합니다
> - `forward` 메서드는 **앱 인스턴스(app)** 에서만 사용 가능합니다
> - 페이지에서 사용: `this.goto()` 또는 `this.app.goto()`
> - 컴포넌트에서 사용: `this.app.goto()` (app 인스턴스를 통해 호출해야 함)
> 
> **경로 상대성 설명**:
> - **페이지 모듈**에서 `goto` 또는 `replace`를 사용하면 경로는 **현재 페이지 모듈** 기준의 주소입니다
> - **앱 인스턴스(app)** 에서 `goto` 또는 `replace`를 사용하면 경로는 **현재 앱 내비게이션** 기준의 주소입니다

### goto - 페이지 이동

지정된 페이지로 이동하고, 기록에 추가합니다:

```javascript
// 지정된 페이지로 이동
this.goto("./about.html");

// 매개변수와 함께 이동
this.goto("./detail.html?id=123");
```

### replace - 페이지 교체

현재 페이지를 대체하고, 방문 기록에 추가하지 않음:

```javascript
// 현재 페이지 교체
this.replace("./login.html");
```

로그인 후 이동 시 자주 사용되며, 사용자가 뒤로가기 버튼을 클릭하여 로그인 페이지로 돌아가는 것을 방지합니다.

### back - 뒤로

이전 페이지로 돌아가기:

```javascript
this.back();
```

### 앞으로 - 전진

다음 페이지로 이동 ( `allowForward: true` 설정 필요 ):

```javascript
// 페이지 또는 컴포넌트에서 호출합니다.
this.app.forward();
```

> **참고**: `forward` 메서드는 페이지 인스턴스가 아닌 애플리케이션 인스턴스(`app`)에서 호출해야 합니다. 예를 들어 `this.forward()` 대신 `this.app.forward()`를 사용하세요.

### 네비게이션 방법 비교

| 메소드      | 히스토리     | 사용 시나리오           |
| --------- | ------------ | ------------------ |
| `goto`    | 새 기록 추가   | 일반적인 페이지 이동       |
| `replace` | 현재 기록 대체 | 로그인 후 이동, 리디렉션 |
| `back`    | 이전 기록으로 되돌아가기 | 돌아가기 동작           |
| `forward` | 다음 기록으로 앞으로 가기 | 앞으로 가기 동작 (활성화 필요) |## 라우팅 히스토리

### 라우팅 기록 가져오기

`routers` 속성을 통해 모든 라우팅 기록 가져오기:

```javascript
const history = app.routers;
// 반환 형식: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### 현재 페이지 가져오기

`current` 속성을 통해 현재 페이지 인스턴스를 가져옵니다:

```javascript
const currentPage = app.current;
console.log("현재 페이지:", currentPage.src);
```

### 라우팅 기록 예시

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // allowForward와 함께 사용해야 합니다
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## 라우트 변경 감시

`router-change` 이벤트를 수신하여 라우팅 변경에 응답합니다.

### 기본 사용법

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("라우터 변경:", data.name);
  console.log("페이지 주소:", data.src);
});
```

### 이벤트 데이터

`router-change` 이벤트의 데이터 객체에는 다음이 포함됩니다:

| 속성   | 설명         | 가능한 값                          |
| ------ | ------------ | ------------------------------------ |
| `name` | 네비게이션 유형 | `goto`, `replace`, `forward`, `back` |
| `src`  | 대상 페이지 주소 | 페이지 경로                        |### 사용 예시

```javascript
export const ready = function () {
  // 라우팅 변화 감지
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // 페이지 방문 기록
    console.log(`[${name}] 탐색 대상: ${src}`);

    // 페이지 제목 업데이트
    this.updateTitle(src);

    // 통계 데이터 전송
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "홈",
      "about.html": "회사 소개",
      "contact.html": "문의하기",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "앱";
  },

  trackPageView(src) {
    // 페이지 방문 통계 전송
    console.log("페이지 방문 통계:", src);
  },
};
```

## 페이지 내비게이션 가드

라우트 리스닝과 결합하여 내비게이션 가드 기능을 구현할 수 있습니다:

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // 로그인 필요 여부 확인
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## 전체 예시

<o-playground name="라우팅 및 탐색 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈페이지 주소
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("앱이 초기화되었습니다");
      this.on("router-change", (e) => {
        console.log("라우트 변경:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
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
      <p>라우트 히스토리 수: {{app.routerCount}}</p>
      <a href="./about.html" olink>About으로 이동</a>
      <br><br>
      <button on:click="gotoAbout">프로그래밍 방식 이동</button>
      <br><br>
      <button on:click="goForward()">앞으로 가기</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">뒤로 가기</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>라우트 히스토리 수: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">힌트: "뒤로 가기"를 클릭한 후, 홈페이지에서 "앞으로 가기"를 클릭하면 여기로 돌아옵니다</p>
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

