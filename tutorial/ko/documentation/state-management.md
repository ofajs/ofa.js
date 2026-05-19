# 상태 관리

## 상태란 무엇인가

ofa.js에서 **상태**는 컴포넌트 또는 페이지 모듈 자체의 `data` 속성을 의미합니다. 이 상태는 현재 컴포넌트에서만 사용할 수 있으며, 해당 컴포넌트의 내부 데이터를 저장하고 관리하는 데 사용됩니다.

여러 컴포넌트나 페이지에서 동일한 데이터를 공유해야 할 경우, 전통적인 방법은 이벤트 전달이나 props를 계층적으로 전달하는 방식입니다. 그러나 이 방식은 복잡한 애플리케이션에서 코드 유지보수를 어렵게 만듭니다. 따라서 **상태 관리**가 필요합니다. 이는 공유 상태 객체를 정의하여 여러 컴포넌트나 페이지 모듈이 해당 데이터에 접근하고 수정할 수 있게 함으로써 상태 공유를 실현하는 것입니다.

> **힌트**: 상태 관리는 컴포넌트 간, 페이지 간 데이터를 공유해야 하는 시나리오(예: 사용자 정보, 장바구니, 테마 설정, 전역 설정 등)에 적합합니다.

## 상태 객체 생성

`$.stanz({})`를 사용하여 반응형 상태 객체를 생성합니다. 이 메서드는 일반 객체를 초기 데이터로 받아 반응형 상태 프록시를 반환합니다.

### 기본 사용법(전역 상태)

<o-playground name="상태 관리 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 애플리케이션 홈 페이지 주소
    export const home = "./list.html";
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
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "피트",
        info: "매일이 새로운 시작이며, 비 온 뒤에 항상 햇빛이 있습니다.",
    },{
        id: 10020,
        name: "마이크",
        info: "인생은 바다와 같아서, 의지가 강한 사람만이 저편에 도달할 수 있습니다.",
    },{
        id: 10030,
        name: "존",
        info: "성공의 비결은 자신의 꿈을 포기하지 않고 계속하는 것입니다.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>연락처</h2>
      <ul>
        <o-fill :value="list">
          <li>
          이름: {{$data.name}} <button on:click="$host.gotoDetail($data)">상세</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // 컴포넌트가 소멸될 때, 마운트된 상태 데이터를 비웁니다.
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">뒤로</button> </div>
      <div class="user-info">
        <div class="avatar">아바타</div>
        <div style="font-size: 24px;">
        사용자 이름: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">사용자 ID: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // 컴포넌트가 소멸될 때, 마운트된 상태 데이터를 비웁니다.
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 상태 객체의 특성

### 1. 반응형 업데이트

`$.stanz()`로 생성한 상태 객체는 반응형입니다. 상태 데이터가 변경되면 해당 데이터를 참조하는 모든 컴포넌트가 자동으로 업데이트됩니다.

```javascript
const store = $.stanz({ count: 0 });

// 컴포넌트 내에서
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // store.count를 참조하는 모든 컴포넌트가 자동으로 업데이트됩니다.
    },
  },
  attached() {
    // 상태 객체의 속성을 직접 참조합니다.
    this.store = store;
  },
  detached() {
    this.store = {}; // 컴포넌트 소멸 시, 마운트된 상태 데이터를 비웁니다.
  },
};
```

### 2. 깊은 반응성

상태 객체는 깊은 반응형을 지원하며, 중첩된 객체와 배열의 변화도 감지됩니다.

```javascript
const store = $.stanz({
  user: {
    name: "장삼",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// 중첩 속성을 수정해도 업데이트가 트리거됩니다
store.user.name = "리쓰";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "새 작업" });
```

## 모범 사례

### 1. 컴포넌트 attached 단계에서 상태 마운트

컴포넌트의 `attached` 라이프사이클에서 공유 상태를 마운트하는 것을 권장합니다.

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // 공유 상태를 컴포넌트의 data에 마운트합니다.
    this.list = data.list;
  },
  detached() {
    // 컴포넌트가 제거될 때, 마운트된 상태 데이터를 초기화하여 메모리 누수를 방지합니다.
    this.list = [];
  },
};
```

### 2. 상태 범위를 합리적으로 관리하기

상태의 스코프는 **정의 위치와 내보내기 방식**에 따라 결정됩니다:

**독립 JS 파일에서 `export`로 내보낸 상태**: 전역 상태로, 전체 애플리케이션에서 접근 및 수정이 가능하며, `import` 또는 `load`를 통해 가져와 사용합니다.

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**페이지 또는 컴포넌트 모듈 내부에 정의된 상태**: 모듈 상태, 해당 모듈 내부에서만 사용됩니다.

```html
<template component>
  ...
  <script>
    const localStore = $.stanz({ total: 0 });

    export default async () => {
      return {
        data: {
          localStore: {}
        },
        attached() {
          this.localStore = localStore;
        },
        detached() {
          // 컴포넌트가 소멸될 때, 마운트된 상태 데이터를 비웁니다
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## 모듈 내 상태 관리

<o-playground name="모듈 내 상태 관리 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">항목 추가</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">스토어 총합 추가</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // 컴포넌트가 소멸될 때, 마운트된 상태 데이터를 비웁니다
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

1. **상태 정리**: 컴포넌트의 `detached` 라이프사이클에서 상태 데이터에 대한 참조를 적시에 정리하여 메모리 누수를 방지하세요.

2. **순환 참조 방지**: 상태 객체 간에 순환 참조가 발생하지 않도록 하세요. 이는 반응형 시스템에 문제를 일으킬 수 있습니다.

3. **대규모 데이터 구조**: 대규모 데이터 구조의 경우 계산된 속성을 사용하거나 분할 관리를 고려하여 불필요한 성능 오버헤드를 방지하세요.

4. **상태 일관성**: 비동기 작업 시 상태의 일관성에 주의하고, 트랜잭션 또는 배치 업데이트를 사용하여 데이터의 무결성을 보장할 수 있습니다.