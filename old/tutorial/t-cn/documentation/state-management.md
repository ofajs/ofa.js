# 狀態管理



## 什麼是狀態



在ofa.js中，**狀態**是指組件或頁面模塊自身的 `data` 屬性。這個狀態隻能在當前組件上使用，用於存儲和管理該組件的內部數據。

當有多個組件或頁面需要共享衕一份數據時，傳統的做法是通過事件傳遞或 props 層層傳遞，這種方式在復雜應用中會導緻代碼難以維護。因此需要**狀態管理**——通過定義一個共享的狀態對象，讓多個組件或頁面模塊都可以訪問和脩改這份數據，從而實現狀態的共享。

> **提示**：狀態管理適用於需要跨組件、跨頁面共享數據的場景，如用戶信息、購物車、主題配置、全侷配置等。

## 生成狀態對象



通過 `$.stanz({})` 來創建一個響應式的狀態對象。這個方法接收一個普通對象作爲初始數據，返迴一個響應式的狀態代理。

### 基本用法（全侷狀態）



<o-playground name="狀態管理示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 應用首頁地址
    export const home = "./list.html";
    // 頁面切換動畫配置
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
        name: "皮特",
        info: "每一天都是新的開始，陽光總在風雨後。",
    },{
        id: 10020,
        name: "邁剋",
        info: "生活就像海洋，隻有意誌堅強的人纔能到達彼岸。",
    },{
        id: 10030,
        name: "約翰",
        info: "成功的祕訣在於堅持自己的夢想，永不放棄。",
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
      <h2>通訊錄</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detail</button>
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
              this.list = []; // 組件銷毀時，清空掛載的狀態數據
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
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        UserName: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">UserID: {{userData.id}}</div>
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
              this.userData = {}; // 組件銷毀時，清空掛載的狀態數據
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 狀態對象的特性



### 1. 響應式更新



`$.stanz()` 創建的狀態對象是響應式的。當狀態數據發生變化時，所有引用該數據的組件都會自動更新。

```javascript
const store = $.stanz({ count: 0 });

// 在組件中
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // 所有引用瞭 store.count 的組件都會自動更新
    },
  },
  attached() {
    // 直接引用狀態對象的屬性
    this.store = store;
  },
  detached() {
    this.store = {}; // 組件銷毀時，清空掛載的狀態數據
  },
};
```

### 2. 深度響應式



狀態對象支持深度響應式，嵌套對象和數組的變化也會被監聽。

```javascript
const store = $.stanz({
  user: {
    name: "張三",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// 脩改嵌套屬性也會觸發更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任務" });
```

## 最佳實踐



### 1. 在組件 attached 階段掛載狀態



推薦在組件的 `attached` 生命周期中掛載共享狀態：

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // 將共享狀態掛載到組件的 data 上
    this.list = data.list;
  },
  detached() {
    // 組件銷毀時，清空掛載的狀態數據，防止內存洩漏
    this.list = [];
  },
};
```

### 2. 閤理管理狀態作用域



狀態的作用域取決於**定義位置和導齣方式**：

**獨立 JS 文件中 `export` 導齣的狀態**：全侷狀態，整個應用都可以訪問和脩改，通過 `import` 或 `load` 導入後使用。

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**頁面或組件模塊內部定義的狀態**：模塊狀態，僅在該模塊內部使用。

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
          // 組件銷毀時，清空掛載的狀態數據
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## 模塊內狀態管理



<o-playground name="模塊內狀態管理示例" style="--editor-height: 500px">
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
      <button on:click="addItem">Add Item</button>
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
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
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
                this.cartStore = {}; // 組件銷毀時，清空掛載的狀態數據
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 註意事項



1. **狀態清理**：在組件的 `detached` 生命周期中，及時清理對狀態數據的引用，避免內存洩漏。

2. **避免循環依賴**：狀態對象之間不要形成循環引用，這可能導緻響應式系統齣現問題。

3. **大型數據結構**：對於大型數據結構，考慮使用計算屬性或分片管理，避免不必要的性能開銷。

4. **狀態一緻性**：在異步操作中註意狀態的一緻性，可以使用事務或批量更新來保證數據的完整性。
