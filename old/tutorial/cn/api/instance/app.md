# app

在 `o-app` 内的元素，包括在 `o-app` 内的 `o-page` 的影子节点内的元素，或者再内部的子组件，它们的 `app` 属性都指向这个 `o-app` 的元素实例。

## 获取应用实例

以下是一个示例，演示了如何在 `o-app` 内的元素中访问 `app` 属性：


<o-playground name="app - 获取应用实例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 应用上的可用方法
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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

## 使用应用实例

获取 `app` 实例后，你可以：

### 1. 访问应用的自定义方法

通过 `app-config.js` 中的 `proto` 配置项添加的自定义方法，可以在任何页面或组件中通过 `this.app` 调用：

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
// 在页面或组件中使用
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("用户已登录");
}
```

### 2. 访问应用属性

```javascript
// 获取当前页面
const currentPage = this.app.current;

// 获取路由历史
const routers = this.app.routers;

// 访问全局数据
const user = this.app.globalData?.user;
```

### 3. 调用导航方法

```javascript
// 页面跳转
this.app.goto("./about.html");

// 返回上一页
this.app.back();

// 替换当前页面
this.app.replace("./login.html");
```

### 4. 监听应用事件

```javascript
// 监听路由变化
this.app.on("router-change", (e) => {
  console.log("路由变化:", e.data);
});
```

## 详细文档

关于如何在 `app-config.js` 中配置应用初始化逻辑和添加自定义方法，请参考：

- **[应用初始化](../../documentation/app-initialization.md)** - 详细介绍 `ready` 和 `proto` 配置项的使用方法
- **[路由与导航](../../documentation/app-navigation.md)** - 详细介绍应用的导航方法和路由监听

## 应用实例的常用属性和方法

| 属性/方法 | 说明 |
|----------|------|
| `current` | 当前页面实例 |
| `routers` | 路由历史记录 |
| `globalData` | 全局数据（需要自己在 `ready` 中初始化） |
| `goto(src)` | 跳转到指定页面 |
| `back()` | 返回上一页 |
| `replace(src)` | 替换当前页面 |
| `forward()` | 前进到下一页 |
| `on(event, callback)` | 监听应用事件 |
| 自定义方法 | 通过 `proto` 配置添加的方法 |
