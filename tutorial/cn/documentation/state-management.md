# 状态管理

## 什么是状态

在ofa.js中，**状态**是指组件或页面模块自身的 `data` 属性。这个状态只能在当前组件上使用，用于存储和管理该组件的内部数据。

当有多个组件或页面需要共享同一份数据时，传统的做法是通过事件传递或 props 层层传递，这种方式在复杂应用中会导致代码难以维护。因此需要**状态管理**——通过定义一个共享的状态对象，让多个组件或页面模块都可以访问和修改这份数据，从而实现状态的共享。

> **提示**：状态管理适用于需要跨组件、跨页面共享数据的场景，如用户信息、购物车、主题配置、全局配置等。

## 生成状态对象

通过 `$.stanz({})` 来创建一个响应式的状态对象。这个方法接收一个普通对象作为初始数据，返回一个响应式的状态代理。

### 基本用法（全局状态）

<o-playground name="状态管理示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 应用首页地址
    export const home = "./list.html";
    // 页面切换动画配置
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
        info: "每一天都是新的开始，阳光总在风雨后。",
    },{
        id: 10020,
        name: "迈克",
        info: "生活就像海洋，只有意志坚强的人才能到达彼岸。",
    },{
        id: 10030,
        name: "约翰",
        info: "成功的秘诀在于坚持自己的梦想，永不放弃。",
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
      <h2>通讯录</h2>
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
              this.list = []; // 组件销毁时，清空挂载的状态数据
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
              this.userData = {}; // 组件销毁时，清空挂载的状态数据
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 状态对象的特性

### 1. 响应式更新

`$.stanz()` 创建的状态对象是响应式的。当状态数据发生变化时，所有引用该数据的组件都会自动更新。

```javascript
const store = $.stanz({ count: 0 });

// 在组件中
export default {
  data: {
    store: {},
  },
  proto: {
    increment() {
      store.count++; // 所有引用了 store.count 的组件都会自动更新
    },
  },
  attached() {
    // 直接引用状态对象的属性
    this.store = store;
  },
  detached() {
    this.store = {}; // 组件销毁时，清空挂载的状态数据
  },
};
```

### 2. 深度响应式

状态对象支持深度响应式，嵌套对象和数组的变化也会被监听。

```javascript
const store = $.stanz({
  user: {
    name: "张三",
    settings: {
      theme: "dark",
    },
  },
  list: [],
});

// 修改嵌套属性也会触发更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任务" });
```

## 最佳实践

### 1. 在组件 attached 阶段挂载状态

推荐在组件的 `attached` 生命周期中挂载共享状态：

```javascript
export default {
  data: {
    list: [],
  },
  attached() {
    // 将共享状态挂载到组件的 data 上
    this.list = data.list;
  },
  detached() {
    // 组件销毁时，清空挂载的状态数据，防止内存泄漏
    this.list = [];
  },
};
```

### 2. 合理管理状态作用域

状态的作用域取决于**定义位置和导出方式**：

**独立 JS 文件中 `export` 导出的状态**：全局状态，整个应用都可以访问和修改，通过 `import` 或 `load` 导入后使用。

```javascript
// user-store.js
export const userStore = $.stanz({ user: null, theme: "light" });
```

**页面或组件模块内部定义的状态**：模块状态，仅在该模块内部使用。

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
          // 组件销毁时，清空挂载的状态数据
          this.localStore = {};
        }
      };
    };
  </script>
</template>
```

## 模块内状态管理

<o-playground name="模块内状态管理示例" style="--editor-height: 500px">
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
                this.cartStore = {}; // 组件销毁时，清空挂载的状态数据
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事项

1. **状态清理**：在组件的 `detached` 生命周期中，及时清理对状态数据的引用，避免内存泄漏。

2. **避免循环依赖**：状态对象之间不要形成循环引用，这可能导致响应式系统出现问题。

3. **大型数据结构**：对于大型数据结构，考虑使用计算属性或分片管理，避免不必要的性能开销。

4. **状态一致性**：在异步操作中注意状态的一致性，可以使用事务或批量更新来保证数据的完整性。
