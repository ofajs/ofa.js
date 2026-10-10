# 侦听器

侦听器（Watcher）是 ofa.js 中用于监听数据变化并执行相应逻辑的功能。当响应式数据发生变化时，侦听器会自动触发回调函数，允许你执行诸如数据转换、副作用操作或异步处理等任务。

## 基本用法

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

## 回调函数参数

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

## 深度侦听

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

## 监听多个数据源

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

## 实际应用场景

### 1. 表单验证

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

### 2. 设置主题

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

## 注意事项

- **避免修改监听的数据**：在侦听器回调中修改被监听的数据可能导致无限循环。如需修改，请确保有适当的条件判断。
- **可改用计算属性**：如需根据多个数据的变化计算新值，建议使用计算属性而非侦听器。

## 关键要点

- **watch 对象**：在 `watch` 对象中定义侦听器
- **回调参数**：接收 `newValue` 和 `{watchers}` 两个参数
- **深度侦听**：自动对对象和数组进行深度监听
- **多数据源**：支持同时监听多个数据源
- **防抖处理**：数据变更后会进行防抖处理再执行回调
- **适用场景**：表单验证、数据持久化、异步操作等
