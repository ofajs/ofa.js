# 로딩 및 오류 처리

애플리케이션이 실행되는 동안 페이지 로딩에는 시간이 소요되며, 로딩 실패가 발생할 수도 있습니다. `app-config.js`는 이러한 상황을 처리하기 위해 `loading` 및 `fail` 구성 항목을 제공합니다.

## loading - 로딩 상태

`loading` 구성 항목은 페이지 로딩 중에 표시되는 콘텐츠로, 사용자 경험을 향상시킵니다.

### 간단한 문자열 템플릿

가장 간단한 방법은 문자열 템플릿을 사용하는 것입니다:

```javascript
export const loading = "<div class='loading'>로딩 중...</div>";
```

### 함수 동적 생성

함수를 사용하여 더 복잡한 로딩 컴포넌트를 동적으로 생성할 수 있습니다:

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>로딩 중...</span>
  </div>`;
};
```

### 진행률 막대 예제

아래는 아름다운 진행 표시줄 로딩 효과입니다:

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

이 진행률 표시줄 구현:- 페이지 로딩 시 진행 표시줄이 0%에서 98%까지 천천히 증가
- 페이지 로딩이 완료되면 진행 표시줄이 빠르게 100%까지 완료되고 사라짐
- 부드러운 전환 애니메이션 사용

### 사용자 정의 로딩 애니메이션

**회전 로딩 애니메이션:**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**스켈레톤 로딩:**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - 오류 처리

`fail` 설정 항목은 페이지 로드 실패 시 표시할 오류 안내 컴포넌트에 사용됩니다.

### 기본 사용법

`fail` 함수는 객체 인수를 받으며, 여기에는 다음이 포함됩니다:- `src` - 실패 페이지 주소
- `error` - 오류 정보 객체

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>페이지 로드 실패</h3>
    <p>주소: ${src}</p>
    <p>오류: ${error.message}</p>
    <button on:click="back()">이전 페이지로 돌아가기</button>
  </div>`;
};
```

### 완전한 오류 처리 예제

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">페이지 로드 실패</h2>
    <p style="color: #666; margin-bottom: 20px;">페이지를 불러올 수 없습니다: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      오류 메시지: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        이전 페이지로 이동
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        홈으로 이동
      </button>
    </div>
  </div>`;
};
```

### 오류 유형 처리

오류 유형에 따라 다양한 힌트를 표시할 수 있습니다:

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "알 수 없는 오류";
  
  if (error.message.includes("404")) {
    errorMessage = "페이지가 존재하지 않습니다";
  } else if (error.message.includes("timeout")) {
    errorMessage = "로딩 시간 초과, 네트워크 연결을 확인하세요";
  } else if (error.message.includes("network")) {
    errorMessage = "네트워크 오류, 나중에 다시 시도하세요";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>오류가 발생했습니다</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">돌아가기</button>
  </div>`;
};
```

## 전체 예시

<o-playground name="로딩 및 오류 처리 예시" style="--editor-height: 500px">
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>페이지 로딩 실패</h3>
        <p>주소: ${src}</p>
        <p>오류: ${error.message}</p>
        <button on:click="back()">이전 페이지로 돌아가기</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
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

