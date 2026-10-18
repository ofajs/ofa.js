# 数据、状态与通信

## 状态管理

### 什么是状态

在ofa.js中，**状态**是指组件或页面模块自身的 `data` 属性。这个状态只能在当前组件上使用，用于存储和管理该组件的内部数据。

当有多个组件或页面需要共享同一份数据时，传统的做法是通过事件传递或 props 层层传递，这种方式在复杂应用中会导致代码难以维护。因此需要**状态管理**——通过定义一个共享的状态对象，让多个组件或页面模块都可以访问和修改这份数据，从而实现状态的共享。

> **提示**：状态管理适用于需要跨组件、跨页面共享数据的场景，如用户信息、购物车、主题配置、全局配置等。

### 生成状态对象

通过 `$.stanz({})` 来创建一个响应式的状态对象。这个方法接收一个普通对象作为初始数据，返回一个响应式的状态代理。

#### 基本用法

```javascript
// data.js
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
```

```html
<!-- list.html -->
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
```

```html
<!-- detail.html -->
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
```

### 状态对象的特性

#### 1. 响应式更新

`$.stanz()` 创建的状态对象是响应式的。当状态数据发生变化时，所有引用该数据的组件都会自动更新。

```javascript
const store = $.stanz({ count: 0 });

// 在组件中
export default {
  data: {
    store: {}
  },
  proto:{
    increment() {
        store.count++; // 所有引用了 store.count 的组件都会自动更新
    }
  },
  attached() {
    // 直接引用状态对象的属性
    this.store = store;
  },
  detached(){
    this.store = {}; // 组件销毁时，清空挂载的状态数据
  }
};
```

#### 2. 深度响应式

状态对象支持深度响应式，嵌套对象和数组的变化也会被监听。

```javascript
const store = $.stanz({
  user: {
    name: "张三",
    settings: {
      theme: "dark"
    }
  },
  list: []
});

// 修改嵌套属性也会触发更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任务" });
```

### 最佳实践

#### 1. 在组件 attached 阶段挂载状态

推荐在组件的 `attached` 生命周期中挂载共享状态：

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // 将共享状态挂载到组件的 data 上
    this.list = data.list;
  },
  detached() {
    // 组件销毁时，清空挂载的状态数据，防止内存泄漏
    this.list = [];
  }
};
```

#### 2. 合理管理状态作用域

- **全局状态**：适用于整个应用都需要访问的数据（如用户信息、全局配置）
- **模块状态**：适用于特定功能模块内部共享的数据

```javascript
// 全局调用状态
export const globalStore = $.stanz({ user: null, theme: "light" });

// 模块内使用的状态
const cartStore = $.stanz({ total: 0 });
```

### 模块内状态管理

```html
<!-- page1.html -->
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
```

```html
<!-- demo-comp.html -->
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
```

### 注意事项

1. **状态清理**：在组件的 `detached` 生命周期中，及时清理对状态数据的引用，避免内存泄漏。

2. **避免循环依赖**：状态对象之间不要形成循环引用，这可能导致响应式系统出现问题。

3. **大型数据结构**：对于大型数据结构，考虑使用计算属性或分片管理，避免不必要的性能开销。

4. **状态一致性**：在异步操作中注意状态的一致性，可以使用事务或批量更新来保证数据的完整性。

## 计算属性

计算属性是基于响应式数据派生出新数据的一种方式，它会根据依赖的数据变化而自动更新。在 ofa.js 中，计算属性是定义在 `proto` 对象中的特殊方法，使用 JavaScript 的 `get` 或 `set` 关键字来定义。

### 特性与优势

- **缓存性**：计算属性的结果会被缓存，只有当其依赖的数据发生变化时才会重新计算
- **响应式**：当依赖的数据更新时，计算属性会自动更新
- **声明式**：以声明的方式创建依赖关系，代码更加清晰易懂

### get 计算属性

get 计算属性用于从响应式数据中派生出新的值，它不接受参数，只返回基于其他数据计算得出的值。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
  <p>计算属性 countDouble 的值为：{{countDouble}}</p>
  <script>
    export default async () => {
      return {
        data: {
          count: 1,
        },
        proto: {
          get countDouble() {
            console.log('countDouble 被访问');
            return this.count * 2;
          },
          clickMe() {
            this.count++;
          },
        },
      };
    };
  </script>
</template>
```

#### 实际应用场景示例

计算属性常用于处理复杂的数据转换逻辑，例如过滤数组、格式化显示文本等：

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      padding: 5px;
      margin: 3px 0;
      background-color: #838383ff;
    }
  </style>
  <input type="text" sync:value="filterText" placeholder="过滤姓名...">
  <ul>
    <o-fill :value="filteredNames">
      <li>{{$data}}</li>
    </o-fill>
  </ul>
  <script>
    export default async () => {
      return {
        data: {
          filterText: '',
          names: ['张3', '李4', '王54']
        },
        proto: {
          get filteredNames() {
            if (!this.filterText) {
              return this.names;
            }
            return this.names.filter(name => 
              name.includes(this.filterText)
            );
          },
        }
      };
    };
  </script>
</template>
```

### set 计算属性

set 计算属性允许你通过赋值操作来修改底层的数据状态。它接收一个参数，通常用于反向更新依赖它的原始数据。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    button {
      margin: 5px;
      padding: 8px 12px;
    }
  </style>
  <div>
    <p>基础数值: {{count}}</p>
    <p>双倍数值: {{countDouble}}</p>
    <button on:click="resetCount">重置计数</button>
    <button on:click="setCountDouble">设置双倍值为 10</button>
    <button on:click="incrementCount">增加基础值</button>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          count: 1,
        },
        proto: {
          get countDouble() {
            return this.count * 2;
          },
          set countDouble(val) {
            this.count = Math.max(0, val / 2); // 确保 count 不为负数
          },
          resetCount() {
            this.count = 0;
          },
          setCountDouble() {
            this.countDouble = 10;
          },
          incrementCount() {
            this.count++;
          }
        },
      };
    };
  </script>
</template>
```

### 计算属性 vs 方法

虽然方法也可以实现类似的功能，但计算属性具有缓存特性，只有在其依赖的数据发生变化时才会重新求值，这使得性能更优。

```javascript
// 使用计算属性（推荐）- 有缓存
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// 使用方法 - 每次调用都会执行
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

### 注意事项

1. **避免异步操作**：计算属性应保持同步且无副作用，禁止在其中进行异步调用或直接修改组件状态。  
2. **依赖追踪**：务必仅依赖响应式数据，否则更新将不可预期。  
3. **错误防护**：若计算属性内部出现循环依赖或异常赋值，可能导致渲染失败甚至死循环，务必提前设定边界条件并做好异常处理。

### 实际应用示例

以下是一个简单的表单验证示例，展示了计算属性的实用性：

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 15px;
      font-family: Arial, sans-serif;
    }
    input {
      margin: 5px 0;
      padding: 8px;
      width: 200px;
    }
    .status {
      margin-top: 10px;
      padding: 8px;
      border-radius: 4px;
    }
    .valid {
      background-color: #d4edda;
      color: green;
    }
    .invalid {
      background-color: #f8d7da;
      color: red;
    }
  </style>
  <h3>简单验证示例</h3>
  <input type="text" sync:value="username" placeholder="输入用户名(至少3字符)">
  <p class="status" class:valid="isValid" class:invalid="!isValid">
    状态: {{statusMessage}}
  </p>
  <script>
    export default async () => {
      return {
        data: {
          username: ''
        },
        proto: {
          get isValid() {
            return this.username.length >= 3;
          },
          get statusMessage() {
            return this.isValid ? '用户名有效' : '用户名长度不足';
          },
        }
      };
    };
  </script>
</template>
```


## 侦听器

侦听器（Watcher）是 ofa.js 中用于监听数据变化并执行相应逻辑的功能。当响应式数据发生变化时，侦听器会自动触发回调函数，允许你执行诸如数据转换、副作用操作或异步处理等任务。

### 基本用法

侦听器定义在组件的 `watch` 对象中，其中键名对应需要监听的数据属性名，值是当数据变化时执行的回调函数。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>
    count:{{count}}
    <br />
    doubleCount:{{doubleCount}}
  </p>
  <input sync:value="count" type="number" />
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
          doubleCount: 0,
        },
        watch: {
          count(count) {
            setTimeout(() => {
              this.doubleCount = count * 2;
            }, 500);
          },
        },
      };
    };
  </script>
</template>
```

### 回调函数参数

侦听器回调函数接收两个参数：
- `newValue`：变化后的新值
- `{watchers}`：当前组件的所有侦听器对象

数据变更后会先进行防抖处理，再执行 `watch` 中的回调；`watchers` 参数即为本次防抖周期内所有被合并的变更集合。

`watch` 中的函数会在组件初始化完成后立即被调用，用于建立数据监听。可通过判断 `watchers` 是否有长度来区分是否为首次调用。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .log {
      margin-top: 10px;
      padding: 10px;
      background-color: #7e7e7eff;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
  <p>名字: {{name}}</p>
  <p>年龄: {{age}}</p>
  <input sync:value="name" placeholder="输入名字" />
  <input sync:value="age" type="number" placeholder="输入年龄" />
  <div class="log">{{log}}</div>
  <script>
    export default async () => {
      return {
        data: {
          name: "张三",
          age: 25,
          log: "",
        },
        watch: {
          name(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // 获取其中一个
            this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
          },
          age(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // 获取其中一个
            this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
          },
        },
      };
    };
  </script>
</template>
```

### 深度侦听

对于对象或数组类型的嵌套数据，watch 内会自动进行深度监听。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    button {
      margin: 5px;
      padding: 8px 12px;
    }
    .info {
      margin-top: 10px;
      padding: 10px;
      background-color: gray;
    }
  </style>
  <div>
    <p>用户信息:</p>
    <p>姓名: {{user.name}}</p>
    <p>年龄: {{user.age}}</p>
    <p>爱好: {{user.hobbies.join(', ')}}</p>
  </div>
  <div>
    <button on:click="updateName">修改姓名</button>
    <button on:click="updateAge">修改年龄</button>
    <button on:click="addHobby">添加爱好</button>
    <button on:click="updateHobby">修改爱好</button>
  </div>
  <div class="info" :html="log"></div>
  <script>
    export default async () => {
      return {
        data: {
          user: {
            name: "张三",
            age: 25,
            hobbies: ["篮球", "足球"],
          },
          log: "",
        },
        watch: {
          user(newVal,{watchers}) {
            if(!watchers){
              return;
            }
            const watcher = watchers[0]; // 获取其中一个
            console.log("修改: ",watcher.target);
            if(watcher.type === 'set'){
              this.log += `修改值-> 属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}" <br>`;
            }else{
              this.log += `执行方法${watcher.type}-> 函数名 "${watcher.name}"  参数 "${watcher.args}" <br>`;
            }
          },
        },
        proto: {
          updateName() {
            this.user.name = "李四";
          },
          updateAge() {
            this.user.age = 30;
          },
          addHobby() {
            this.user.hobbies.push("游泳");
          },
          updateHobby() {
            this.user.hobbies[0] = "羽毛球";
          },
        },
      };
    };
  </script>
</template>
```

### 监听多个数据源

你可以同时监听多个数据的变化，并在回调函数中根据多个数据的变化执行相应的逻辑。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    input {
      margin: 5px;
      padding: 5px;
    }
  </style>
  <p>宽度: {{rectWidth}}</p>
  <p>高度: {{rectHeight}}</p>
  <p>面积: {{area}}</p>
  <input sync:value="rectWidth" type="number" placeholder="宽度" />
  <input sync:value="rectHeight" type="number" placeholder="高度" />
  <script>
    export default async () => {
      return {
        data: {
          rectWidth: 10,
          rectHeight: 5,
          area: 0,
        },
        watch: {
          // "rectWidth,rectHeight"(){
          ["rectWidth,rectHeight"](){
            this.area = (this.rectWidth || 0) * (this.rectheight || 0);
          }
        }
      };
    };
  </script>
</template>
```

### 实际应用场景

#### 1. 表单验证

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 15px;
    }
    input {
      display: block;
      margin: 10px 0;
      padding: 8px;
      width: 200px;
    }
    .error {
      color: red;
      font-size: 12px;
    }
  </style>
  <input sync:value="username" placeholder="用户名（3-10个字符）" />
  <span class="error">{{usernameError}}</span>
  <input sync:value="email" placeholder="邮箱" />
  <span class="error">{{emailError}}</span>
  <script>
    export default async () => {
      return {
        data: {
          username: "",
          email: "",
          usernameError: "",
          emailError: "",
        },
        watch: {
          username(val) {
            if (val.length < 3 || val.length > 10) {
              this.usernameError = "用户名必须是3-10个字符";
            } else {
              this.usernameError = "";
            }
          },
          email(val) {
            const emailRegex = /^.+@.+\..+$/;
            if (!emailRegex.test(val)) {
              this.emailError = "请输入有效的邮箱地址";
            } else {
              this.emailError = "";
            }
          },
        },
      };
    };
  </script>
</template>
```

#### 2. 设置主题

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    button {
      margin: 5px;
      padding: 8px 12px;
    }
  </style>
  <p>设置: {{settings.theme}}</p>
  <p>保存状态: {{saveStatus}}</p>
  <button on:click="setLight">浅色主题</button>
  <button on:click="setDark">深色主题</button>
  <button on:click="resetSettings">重置</button>
  <script>
    export default async () => {
      return {
        data: {
          settings: {
            theme: "light",
          },
          saveStatus: "已保存",
        },
        watch: {
          settings(){
              this.saveStatus = "保存中...";
              setTimeout(() => {
                this.saveStatus = "已保存";
                console.log("设置已保存:", this.settings);
              }, 500);
          }
        },
        proto: {
          setLight() {
            this.settings.theme = "light";
          },
          setDark() {
            this.settings.theme = "dark";
          },
          resetSettings() {
            this.settings = { theme: "light" };
          },
        },
      };
    };
  </script>
</template>
```

### 注意事项

- **避免修改监听的数据**：在侦听器回调中修改被监听的数据可能导致无限循环。如需修改，请确保有适当的条件判断。
- **可改用计算属性**：如需根据多个数据的变化计算新值，建议使用计算属性而非侦听器。


## 上下文状态

上下文状态是 ofa.js 中用于跨组件数据共享的机制。通过提供者（Provider）和消费者（Consumer）模式，可以实现父子组件、跨层级组件之间的数据传递，而无需通过 props 层层传递。

### 核心概念

- **o-provider**: 数据提供者，定义需要共享的数据
- **o-consumer**: 数据消费者，从最近的提供者获取数据
- **watch:xxx**: 监听消费者数据的变化，并绑定到组件或页面模块的属性上

### o-provider 提供者

`o-provider` 组件用于定义共享数据的提供者。它通过 `name` 属性标识自己的名称，并通过属性（如 `custom-a="value"`）来定义需要共享的数据。

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  ...
</o-provider>
```

#### 属性

- `name`: 提供者的唯一标识名称，用于消费者查找对应的提供者

#### 特性

1. **自动属性传递**: provider 上的所有非保留属性都会作为共享数据
2. **响应式更新**: 当 provider 的数据变化时，消费该 provider 的对应 name 的 consumer 会自动更新
3. **层级查找**: 消费者会从最近的上级 provider 开始查找对应 name 的数据

### o-consumer 消费者

`o-consumer` 组件用于消费（使用）提供者的数据。它通过 `name` 属性指定要消费的提供者名称。

```html
<o-consumer name="userInfo"></o-consumer>
```

#### 属性

- `name`: 要消费的提供者名称

#### 特性

1. **自动数据获取**: consumer 会自动获取最近的上级 provider 中对应 name 的数据
2. **属性合并**: 如果多个同 name 的 provider 都有某个属性，离消费者最近的 provider 的属性优先
3. **属性监听**: 可以通过 `watch:xxx` 监听特定属性的变化

### 监听数据变化

通过 `watch:xxx` 可以监听提供者数据的变化：

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

### 基础示例

```html
<!-- demo.html -->
<template>
  <o-provider name="userInfo" user-id="9527">
    <o-page src="page1.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page1.html -->
<template page>
  <l-m src="./user-avatar.html"></l-m>
  <l-m src="./user-name.html"></l-m>
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #007acc;
      padding: 10px;
    }
  </style>
  <user-avatar></user-avatar>
  <div>用户ID: {{userId}}</div>
  <user-name></user-name>
  <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
  <script>
    export default {
      data:{
        userId: 0,
      },
    };
  </script>
</template>
```

```html
<!-- user-avatar.html -->
<template component>
  <style>
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(68, 107, 133, 1);
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  </style>
  {{userId}}头像
  <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
  <script>
    export default async ()=>{
        return {
            tag:"user-avatar",
            data:{
                userId: null,
            }
        };
    }
  </script>
</template>
```

```html
<!-- user-name.html -->
<template component>
  <style>
    :host {
      display: block;
      color: rgba(204, 153, 0, 1);
    }
  </style>
  User-{{userId}}
  <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
  <script>
    export default async ()=>{
        return {
            tag:"user-name",
            data:{
                userId: null,
            }
        };
    }
  </script>
</template>
```

### o-root-provider 根提供者

`o-root-provider` 是根级别的全局提供者，它的作用域是整个文档。即使在没有父级 provider 的情况下，消费者也可以获取到根提供者的数据。

```html
<!-- 定义全局根提供者 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- 在页面的任何位置都可以消费 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

#### 特性

1. **全局作用域**: 根提供者的数据在整个页面都可用
2. **优先级**: 当同时存在同 name 的 provider 和 root-provider 时，离消费者最近的 provider 优先
3. **可移除**: 移除 root-provider 后，消费者会回退到查找其他 provider

### root-provider 示例

```html
<!-- demo.html -->
<template>
  <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
  <o-page src="page.html"></o-page>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./header.html"></l-m>
  <l-m src="./content.html"></l-m>
  <style>
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .info {
      padding: 10px;
      border: 1px solid #007acc;
    }
  </style>
  <div class="info">
    <div>主题: {{theme}}</div>
    <div>语言: {{language}}</div>
  </div>
  <header-com></header-com>
  <content-com></content-com>
  <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
  <script>
    export default {
      data: {
        theme: "",
        language: "",
      },
    };
  </script>
</template>
```

```html
<!-- header.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 10px;
      background-color: #333;
      color: white;
    }
  </style>
  Header - 主题: {{theme}}
  <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
  <script>
    export default {
      tag:"header-com",
      data: {
        theme: "",
      },
    };
  </script>
</template>
```

```html
<!-- content.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 10px;
      background-color: rgba(137, 133, 133, 1);
    }
  </style>
  Content - 语言: {{language}}
  <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
  <script>
    export default {
      tag:"content-com",
      data: {
        language: "",
      },
    };
  </script>
</template>
```

#### 优先级示例

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- 这里👇获取到的custom-value是 "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- 这里👇获取到的custom-value是 "root" -->
<o-consumer name="test"></o-consumer>

```

### getProvider(name) 方法

`getProvider(name)` 是一个实例方法，用于获取对应 name 的提供者元素。它会沿着 DOM 向上查找最近的上级 provider，如果没找到则返回 root-provider。

#### 组件或页面模块内使用 getProvider(name) 方法

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

### getProvider 示例

```html
<!-- demo.html -->
<template>
  <o-provider name="userInfo" custom-name="张三" custom-age="25">
    <o-page src="page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <button on:click="getProviderData">获取 Provider 数据</button>
  <div>当前名称: {{currentName}}</div>
  <div>当前年龄: {{currentAge}}</div>
  <div style="margin-top: 10px;">
    <button on:click="updateProvider">修改 Provider 数据</button>
  </div>
  <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
  <script>
    export default {
      data: {
        currentName: "",
        currentAge: 0,
      },
      proto: {
        getProviderData() {
          const provider = this.getProvider("userInfo");
          if (provider) {
            console.log("找到 Provider:", provider);
            console.log("名称:", provider.customName);
            console.log("年龄:", provider.customAge);
            alert(`Provider 数据: ${provider.customName}, ${provider.customAge}岁`);
          }
        },
        updateProvider() {
          const provider = this.getProvider("userInfo");
          if (provider) {
            provider.customName = "李四";
            provider.customAge = 30;
          }
        },
      },
    };
  </script>
</template>
```

#### 通过元素上获取 provider

```javascript
// 获取当前元素上级的 provider
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("找到提供者:", provider.customName);
}

// 直接获取全局 root-provider
const globalProvider = $.getRootProvider("globalConfig");
```

#### 使用场景

1. **手动获取数据**: 在需要直接访问提供者数据的场景下使用
2. **跨 Shadow DOM**: 在 Shadow DOM 内部查找上层 provider
3. **事件处理**: 在事件回调中获取对应的提供者

### dispatch 事件派发

provider 可以派发事件给所有消费它的 consumer：

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// 派发事件
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

### 事件派发示例

```html
<!-- demo.html -->
<template>
  <o-provider name="chat" custom-messages='["欢迎来到聊天室"]' id="chatProvider">
    <o-page src="page.html"></o-page>
  </o-provider>
</template>
```

```html
<!-- page.html -->
<template page>
  <l-m src="./chat-list.html"></l-m>
  <l-m src="./chat-input.html"></l-m>
  <style>
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
    }
  </style>
  <h3>聊天室</h3>
  <chat-list></chat-list>
  <chat-input></chat-input>
</template>
```

```html
<!-- chat-list.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid #007acc;
      padding: 10px;
      max-height: 200px;
      overflow-y: auto;
    }
    .message {
      padding: 5px;
      margin: 5px 0;
      background: gray;
      border-radius: 4px;
    }
  </style>
  <div class="messages">
    <o-fill :value="messages">
      <div class="message">{{$data}}</div>
    </o-fill>
  </div>
  <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
  <script>
    export default {
      tag:"chat-list",
      data: {
        messages: [],
      },
      proto: {
        addMessage(event) {
          this.messages.push(event.data.text);
        },
      },
    };
  </script>
</template>
```

```html
<!-- chat-input.html -->
<template component>
  <style>
    :host {
      display: flex;
      gap: 10px;
    }
    input {
      flex: 1;
      padding: 8px;
    }
    button {
      padding: 8px 16px;
      background: #007acc;
      color: white;
      border: none;
      cursor: pointer;
    }
  </style>
  <input type="text" sync:value="inputText" placeholder="输入消息...">
  <button on:click="sendMessage">发送</button>
  <script>
    export default {
      tag:"chat-input",
      data: {
        inputText: "",
      },
      proto: {
        sendMessage() {
          const provider = this.getProvider("chat");
          if (provider && this.inputText.trim()) {
            provider.dispatch("new-message", {
              data: { text: this.inputText }
            });
            this.inputText = "";
          }
        },
      },
    };
  </script>
</template>
```

### 最佳实践

1. **合理命名**: 为 provider 和 consumer 使用有意义的 name，便于追踪和维护
2. **避免过度使用**: 上下文状态适用于跨组件共享数据，普通父子组件建议使用 props
3. **根提供者用于全局配置**: 主题、语言、全局状态等适合使用 root-provider
4. **及时清理**: 当 provider 被移除时，consumer 会自动清除数据，无需手动处理
