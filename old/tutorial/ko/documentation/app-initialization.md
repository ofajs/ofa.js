# 앱 초기화

애플리케이션 초기화 단계에서 사용자 정의 메서드 추가, 이벤트 리스닝 등과 같은 전역 설정을 수행할 수 있습니다. `app-config.js`는 초기화 로직을 처리하기 위해 `ready`와 `proto` 두 개의 구성 항목을 제공합니다.

## ready - 초기화 콜백

`ready`는 앱 구성이 로드된 후 실행되는 콜백 함수로, 여기서 초기화 작업을 수행할 수 있습니다.

### 기본 사용법

```javascript
export const ready = function() {
  console.log("앱이 초기화되었습니다");
  // this는 o-app 요소 인스턴스를 가리킵니다
  console.log("현재 페이지:", this.current);
};
```

> **참고**: `ready`는 반드시 함수 선언 또는 함수 표현식을 사용해야 하며, 화살표 함수를 사용해서는 안 됩니다(올바른 `this` 바인딩이 필요하기 때문입니다).

### 애플리케이션 인스턴스에 접근

`ready` 함수에서 `this`는 `o-app` 요소 인스턴스를 가리키며, 애플리케이션의 모든 메서드와 속성에 접근할 수 있습니다:

```javascript
export const ready = function() {
  // 현재 페이지 가져오기
  console.log("현재 페이지:", this.current);
  
  // 라우팅 히스토리 가져오기
  console.log("라우팅 히스토리:", this.routers);
  
  // 라우트 변경 감시
  this.on("router-change", (e) => {
    console.log("라우트 변경:", e.data);
  });
};
```

### 초기화 예제

```javascript
export const ready = function() {
  // 전역 상태 초기화
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // 로컬 스토리지에서 사용자 정보 복원
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // 라우트 변경 감지
  this.on("router-change", (e) => {
    // 페이지 방문 기록
    console.log("방문 페이지:", e.data.src);
  });
};
```

## proto - 프로토타입 확장

`proto`는 애플리케이션 인스턴스에 사용자 정의 메서드와 계산된 속성을 추가하는 데 사용되며, 이러한 메서드는 모든 페이지에서 `this.app`을 통해 접근할 수 있습니다.

### 사용자 정의 메서드 추가

```javascript
export const proto = {
  // 사용자 정의 메서드
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // 매개변수가 있는 메서드
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### 계산 속성 추가

```javascript
export const proto = {
  // 계산된 속성
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### 전체 예시

```javascript
export const proto = {
  // 네비게이션 메서드
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // 계산된 속성
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // 유틸리티 메서드
  showMessage(message) {
    alert(message);
  },
};
```

## 페이지에서 사용

페이지 컴포넌트에서 `this.app`을 통해 애플리케이션 인스턴스의 사용자 정의 메서드와 속성에 접근할 수 있습니다:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">홈으로 돌아가기</button>
  <button on:click="app.navigateToProfile()">프로필</button>
  
  <p>홈인지: {{app.isAtHome}}</p>
  <p>로그인 여부: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // 앱 인스턴스의 메서드 호출
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## 전역 상태 관리

`ready`와 `proto`를 결합하면 간단한 전역 상태 관리를 구현할 수 있습니다:

```javascript
// app-config.js

export const ready = function() {
  // 전역 상태 초기화
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // 로컬 저장소에서 데이터 복원
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // 사용자 관련
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto("./login.html");
  },
  
  // 장바구니 관련
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // 테마 관련
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## 전체 예시

<o-playground name="앱 초기화 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈 페이지 주소
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
    export const ready = function() {
      console.log("앱이 초기화되었습니다");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("방문 횟수:", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>홈 페이지에 있습니까: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">홈으로 돌아가기</button>
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
      <p>홈 페이지에 있습니까: {{app.isAtHome}}</p>
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

