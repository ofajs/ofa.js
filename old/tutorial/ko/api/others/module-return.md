# 모듈 반환 객체 속성

ofa.js에서 페이지 모듈이든 컴포넌트 모듈이든 모두 `export default async () => {}`를 통해 객체를 반환하여 모듈의 구성과 동작을 정의해야 합니다. 이 문서는 반환 객체에 포함될 수 있는 모든 속성을 정리하였습니다.

## async 함수 매개변수

`export default async () => {}`의 async 함수는 다음 속성들을 포함하는 매개변수 객체를 받습니다:

### 매개변수 목록

| 매개변수 | 유형 | 페이지 모듈 | 컴포넌트 모듈 | 설명 |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | 다른 모듈이나 리소스를 로드하는 함수 |
| `url` | `string` | ✅ | ✅ | 현재 페이지 또는 컴포넌트 모듈의 파일 주소 |
| `query` | `object` | ✅ | ❌ | URL 쿼리 매개변수 객체 |### 로드 매개변수

`load`는 다른 모듈, 컴포넌트 또는 리소스를 로드하는 데 사용되는 함수입니다. 컴포넌트 모듈과 페이지 모듈 모두에서 사용할 수 있습니다. `load` 함수의 로드 효과는 `<l-m>` 컴포넌트와 동일하며, 주로 ofa.js 페이지 또는 컴포넌트의 HTML 파일을 로드하는 데 사용됩니다.

**동기 로딩**: `await` 키워드를 사용하면 모듈 로딩이 완료될 때까지 실행이 차단됩니다.

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**비동기 로딩**: `await` 키워드를 사용하지 않고 Promise 객체를 반환하며 실행을 차단하지 않습니다. 필요에 따라 로딩하는 시나리오에 적합합니다.

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('모듈 로딩 완료:', someModule);
  });
  
  return {
    data: {}
  };
};
```

사용 시나리오:- 구성 요소를 동기적으로 로드하여 사용 전 등록 보장
- 공유 데이터 모듈 로드
- 구성 파일 로드
- 필요에 따라 로드하는 시나리오에 적합한 비동기 로드

> 참고:
> - `await`를 사용한 동기 로딩은 실행을 차단하므로, 실제 필요에 따라 동기 또는 비동기 방식을 선택하는 것을 권장합니다.
> - 지연 로딩(lazy loading)이 필요하지 않다면 `<l-m>` 태그를 직접 사용하여 컴포넌트를 로드하는 것을 권장합니다.

### url 매개변수

`url` 매개변수는 페이지 모듈과 컴포넌트 모듈에서 모두 사용할 수 있으며, 현재 모듈의 파일 주소를 나타냅니다.

```javascript
export default async ({ url }) => {
  console.log('현재 모듈 주소:', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

### 쿼리 매개변수

`query` 매개변수는 페이지 모듈에서만 사용할 수 있으며, URL의 쿼리 매개변수를 포함합니다. `query` 객체를 통해 URL의 쿼리 문자열 매개변수에 직접 접근할 수 있습니다.

```javascript
export default async ({ query }) => {
  console.log('쿼리 파라미터:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

사용 예시:

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
  </style>
  <div>
    <h1>사용자 상세</h1>
    <p>사용자 ID: {{userId}}</p>
    <p>페이지: {{page}}</p>
  </div>
  <script>
    export default async ({ query }) => {
      return {
        data: {
          userId: query.id || '알 수 없음',
          page: query.page || '1'
        }
      };
    };
  </script>
</template>
```

접속 방법:```html
<o-page src="./user.html?id=123&page=2"></o-page>
```

> 중요: Vue의 `this.$route.query`와 같은 방식으로 쿼리 매개변수를 가져오지 마세요, ofa.js는 함수 매개변수를 통해서만 가져오기를 지원합니다

### 전체 매개변수 예제

```javascript
export default async ({ load, url, query }) => {
  const { config } = await load("./config.js");
  
  return {
    data: {
      configData: config,
      moduleUrl: url,
      queryParams: query
    },
    ready() {
      console.log('모듈 주소:', url);
      console.log('조회 매개변수:', query);
    }
  };
};
```

## 반환 속성 개요

| 속성 | 타입 | 페이지 모듈 | 컴포넌트 모듈 | 설명 | 관련 문서 |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ 필수 | 컴포넌트 태그 이름 | [컴포넌트 생성](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | 반응형 데이터 객체 | [속성 반응](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | 컴포넌트 속성 정의 | [특성 속성 전달](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | 메서드와 계산된 속성 | [계산된 속성](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | 감시자 | [감시자](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | DOM 생성 완료 시 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | DOM에 마운트될 때 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | DOM에서 제거될 때 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | 완전히 로드 완료 시 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ 부모 페이지 | ❌ | 라우트 변경 시 호출 | [중첩 페이지/라우트](../../documentation/nested-routes.md) |> **특수 내보내기**: `export const parent = "./layout.html"` - 중첩 라우팅에 사용되며, 부모 페이지 경로를 지정합니다 (반환 객체에 포함되지 않음). 자세한 내용은 [중첩 페이지/라우팅](../../documentation/nested-routes.md)을 참조하세요.

## 핵심 속성

### tag



`tag`는 컴포넌트의 태그 이름이며, **컴포넌트 모듈은 반드시 이 속성을 정의해야 합니다**. 페이지 모듈은 `tag`를 정의할 필요가 없습니다.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> 주의: `tag`의 값은 구성 요소를 사용할 때의 태그 이름과 일치해야 합니다.

### data



`data`는 반응형 데이터 객체로, 컴포넌트나 페이지의 상태 데이터를 저장하는 데 사용됩니다. 데이터가 변경되면 자동으로 뷰가 업데이트됩니다.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "장삼",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> 주의: `data`는 함수가 아닌 객체이며, Vue 프레임워크와 다릅니다.

### attrs



`attrs`는 컴포넌트 속성을 정의하는 데 사용되며, 외부에서 전달된 데이터를 수신합니다. 컴포넌트 모듈만 `attrs`를 정의하면 됩니다.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // 기본값 없음
      disabled: "",     // 기본값 있음
      size: "medium"    // 기본값 있음
    }
  };
};
```

컴포넌트 사용 시 속성 전달:

```html
<my-component title="제목" disabled size="large"></my-component>
```

> 중요 규칙:
> - 전달되는 attribute 값은 반드시 문자열이어야 하며, 문자열이 아닌 경우 자동으로 문자열로 변환됩니다.
> - 네이밍 변환: `fullName` → `full-name` (kebab-case 형식)
> - `attrs`와 `data`의 key는 중복될 수 없습니다.

### proto



`proto`는 메서드와 계산된 속성을 정의하는 데 사용됩니다. 계산된 속성은 JavaScript의 `get`과 `set` 키워드를 사용하여 정의됩니다.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // 메서드 정의
      increment() {
        this.count++;
      },
      
      // 계산된 속성 (getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // 계산된 속성
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

참고: ofa.js는 Vue의 `computed` 옵션 대신 `get`/`set` 키워드를 사용하여 계산된 속성을 정의합니다.

### watch



`watch`는 감시자를 정의하는 데 사용되며, 데이터 변경을 모니터링하고 해당 로직을 실행합니다.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // 단일 속성 감시
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // 여러 속성 감시
      "count,name"() {
        console.log('count 또는 name이 변경되었습니다');
      }
    }
  };
};
```

리스너 콜백 함수는 두 개의 매개변수를 받습니다:- `newValue`：변경된 새로운 값
- `{ watchers }`：현재 컴포넌트의 모든 감시자 객체

## 생명주기 훅

라이프사이클 훅을 사용하면 컴포넌트의 다양한 단계에서 특정 로직을 실행할 수 있습니다.

### ready



`ready` 훅은 컴포넌트가 준비될 때 호출되며, 이때 컴포넌트의 템플릿이 렌더링 완료되고 DOM 요소가 생성되었지만 아직 문서에 삽입되지 않았을 수 있습니다.

```javascript
ready() {
  console.log('DOM이 생성되었습니다');
  this.initDomElements();
}
```

### attached



`attached` 훅은 컴포넌트가 문서에 삽입될 때 호출되며, 컴포넌트가 페이지에 마운트되었음을 나타냅니다.

```javascript
attached() {
  console.log('DOM에 마운트됨');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached` 훅은 구성 요소가 문서에서 제거될 때 호출되며, 구성 요소가 곧 마운트 해제됨을 나타냅니다.

```javascript
detached() {
  console.log('DOM에서 제거됨');
  clearInterval(this._timer);
}
```

### loaded



`loaded` 훅은 컴포넌트와 모든 하위 컴포넌트, 비동기 리소스가 모두 로드된 후 트리거됩니다.

```javascript
loaded() {
  console.log('완전히 로드 완료');
}
```

### routerChange



`routerChange` 훅은 라우트 변경 시 호출되며, 부모 페이지에서 자식 페이지 전환을 감지하는 데만 사용됩니다.

```javascript
routerChange() {
  this.refreshActive();
}
```

## 생명 주기 실행 순서

```
ready → attached → loaded
                 ↓
              detached（분리 시）
```

## 특수 내보내기: parent

`parent`는 중첩 라우팅에 사용되며, 현재 페이지의 상위 페이지 경로를 지정합니다. 이는 독립적인 내보내기로, 반환 객체에 포함되지 않습니다.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>하위 페이지 내용</div>
  <script>
    // 부모 페이지 지정
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## 전체 예시

### 컴포넌트 모듈

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>카운트: {{count}}</p>
    <p>두 배: {{doubleCount}}</p>
    <button on:click="increment">증가</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "기본 제목"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count 변경됨:', newVal);
          }
        },
        ready() {
          console.log('컴포넌트 준비 완료');
        },
        attached() {
          console.log('컴포넌트 마운트됨');
        },
        detached() {
          console.log('컴포넌트 언마운트됨');
        }
      };
    };
  </script>
</template>
```

### 페이지 모듈

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('페이지 준비 완료');
        },
        
        attached() {
          console.log('페이지가 마운트됨');
          console.log('쿼리 매개변수:', query);
        },
        
        detached() {
          console.log('페이지가 언마운트됨');
        }
      };
    };
  </script>
</template>
```

## 흔한 실수

### 1. attrs와 data의 키 중복

```javascript
// ❌ 오류
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // attrs와 중복됨
};

// ✅ 올바름
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // 다른 키 사용
};
```

### 2. Vue 스타일로 계산 속성 정의하기

```javascript
// ❌ 오류
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ 올바름
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data는 함수로 정의

```javascript
// ❌ 잘못됨
return {
  data() {
    return { count: 0 };
  }
};

// ✅ 올바름
return {
  data: {
    count: 0
  }
};
```

### 4. 메서드 정의 위치 오류

```javascript
// ❌ 오류
return {
  methods: {
    handleClick() {}
  }
};

// ✅ 올바름
return {
  proto: {
    handleClick() {}
  }
};
```