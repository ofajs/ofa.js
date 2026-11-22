# app



`o-app` 내의 요소, `o-app` 내의 `o-page`의 섀도 노드 내의 요소, 또는 더 내부의 자식 컴포넌트는 모두 `app` 속성이 이 `o-app` 요소 인스턴스를 가리킵니다.

## 앱 인스턴스 가져오기

다음은 `o-app` 내 요소에서 `app` 속성에 접근하는 예시입니다:


<o-playground name="app - 앱 인스턴스 가져오기" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈페이지 주소
    export const home = "./home.html";
    // 앱에서 사용 가능한 메서드
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 애플리케이션 사용 예제

`app` 인스턴스를 가져온 후 다음을 수행할 수 있습니다:

### 1. 애플리케이션 접근을 위한 사용자 정의 방법

`app-config.js`의 `proto` 설정 항목을 통해 추가된 사용자 정의 메서드는 모든 페이지나 컴포넌트에서 `this.app`을 통해 호출할 수 있습니다:

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// 페이지나 컴포넌트에서 사용
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("사용자가 로그인되었습니다");
}
```

### 2. 애플리케이션 속성 접근

```javascript
// 현재 페이지 가져오기
const currentPage = this.app.current;

// 라우팅 기록 가져오기
const routers = this.app.routers;

// 전역 데이터 접근
const user = this.app.globalData?.user;
```

### 3. 내비게이션 메서드 호출

```javascript
// 페이지 이동
this.app.goto("./about.html");

// 이전 페이지로 돌아가기
this.app.back();

// 현재 페이지 교체
this.app.replace("./login.html");
```

### 4. 애플리케이션 이벤트 수신 대기

```javascript
// 라우터 변경 감지
this.app.on("router-change", (e) => {
  console.log("라우터 변경:", e.data);
});
```

## 세부 문서

`app-config.js`에서 애플리케이션 초기화 로직을 구성하고 사용자 정의 메서드를 추가하는 방법은 다음을 참조하세요:

- **[앱 초기화](../../documentation/app-initialization.md)** - `ready` 및 `proto` 설정 항목의 사용 방법을 자세히 소개합니다.
- **[라우팅과 네비게이션](../../documentation/app-navigation.md)** - 앱의 네비게이션 방법과 라우트 감시에 대해 자세히 소개합니다.

## 애플리케이션 인스턴스의 자주 사용되는 속성 및 메서드

| 속성/메서드 | 설명 |
|----------|------|
| `current` | 현재 페이지 인스턴스 |
| `routers` | 라우팅 히스토리 |
| `globalData` | 전역 데이터 (`ready`에서 직접 초기화 필요) |
| `goto(src)` | 지정된 페이지로 이동 |
| `back()` | 이전 페이지로 돌아가기 |
| `replace(src)` | 현재 페이지 대체 |
| `forward()` | 다음 페이지로 전진 |
| `on(event, callback)` | 앱 이벤트 수신 |
| 사용자 정의 메서드 | `proto` 설정을 통해 추가된 메서드 |