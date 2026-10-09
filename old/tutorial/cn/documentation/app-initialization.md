# 应用初始化

应用初始化阶段可以执行一些全局性的设置，比如添加自定义方法、监听事件等。`app-config.js` 提供了 `ready` 和 `proto` 两个配置项来处理初始化逻辑。

## ready - 初始化回调

`ready` 是应用配置加载完成后执行的回调函数，可以在这里进行初始化操作。

### 基本用法

```javascript
export const ready = function() {
  console.log("应用已初始化");
  // this 指向 o-app 元素实例
  console.log("当前页面:", this.current);
};
```

> **注意**：`ready` 必须使用函数声明或函数表达式，不能使用箭头函数（因为需要正确的 `this` 绑定）。

### 访问应用实例

在 `ready` 函数中，`this` 指向 `o-app` 元素实例，可以访问应用的所有方法和属性：

```javascript
export const ready = function() {
  // 获取当前页面
  console.log("当前页面:", this.current);
  
  // 获取路由历史
  console.log("路由历史:", this.routers);
  
  // 监听路由变化
  this.on("router-change", (e) => {
    console.log("路由变化:", e.data);
  });
};
```

### 初始化示例

```javascript
export const ready = function() {
  // 初始化全局状态
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // 从本地存储恢复用户信息
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // 监听路由变化
  this.on("router-change", (e) => {
    // 记录页面访问
    console.log("访问页面:", e.data.src);
  });
};
```

## proto - 原型扩展

`proto` 用于向应用实例添加自定义方法和计算属性，这些方法可以在所有页面中通过 `this.app` 访问。

### 添加自定义方法

```javascript
export const proto = {
  // 自定义方法
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // 带参数的方法
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### 添加计算属性

```javascript
export const proto = {
  // 计算属性
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

### 完整示例

```javascript
export const proto = {
  // 导航方法
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
  
  // 计算属性
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // 工具方法
  showMessage(message) {
    alert(message);
  },
};
```

## 在页面中使用

在页面组件中，可以通过 `this.app` 访问应用实例的自定义方法和属性：

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">返回首页</button>
  <button on:click="app.navigateToProfile()">个人中心</button>
  
  <p>是否在首页: {{app.isAtHome}}</p>
  <p>是否已登录: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // 调用应用实例的方法
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## 全局状态管理

结合 `ready` 和 `proto`，可以实现简单的全局状态管理：

```javascript
// app-config.js

export const ready = function() {
  // 初始化全局状态
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // 从本地存储恢复数据
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // 用户相关
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
  
  // 购物车相关
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // 主题相关
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## 完整示例

<o-playground name="应用初始化示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
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
    export const ready = function() {
      console.log("应用已初始化");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("访问次数:", this.visitCount);
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
      <p>是否在首页: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">返回首页</button>
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
      <p>是否在首页: {{app.isAtHome}}</p>
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
