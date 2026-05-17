# 應用初始化



應用初始化階段可以執行一些全侷性的設置，比如添加自定義方法、監聽事件等。`app-config.js` 提供瞭 `ready` 和 `proto` 兩個配置項來處理初始化邏輯。

## ready - 初始化迴調



`ready` 是應用配置加載完成後執行的迴調函數，可以在這裏進行初始化操作。

### 基本用法



```javascript
export const ready = function() {
  console.log("應用已初始化");
  // this 指向 o-app 元素實例
  console.log("當前頁面:", this.current);
};
```

> **註意**：`ready` 必須使用函數聲明或函數錶達式，不能使用箭頭函數（因爲需要正確的 `this` 綁定）。

### 訪問應用實例



在 `ready` 函數中，`this` 指向 `o-app` 元素實例，可以訪問應用的所有方法和屬性：

```javascript
export const ready = function() {
  // 獲取當前頁面
  console.log("當前頁面:", this.current);
  
  // 獲取路由歷史
  console.log("路由歷史:", this.routers);
  
  // 監聽路由變化
  this.on("router-change", (e) => {
    console.log("路由變化:", e.data);
  });
};
```

### 初始化示例



```javascript
export const ready = function() {
  // 初始化全侷狀態
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // 從本地存儲恢復用戶信息
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // 監聽路由變化
  this.on("router-change", (e) => {
    // 記錄頁面訪問
    console.log("訪問頁面:", e.data.src);
  });
};
```

## proto - 原型擴展



`proto` 用於向應用實例添加自定義方法和計算屬性，這些方法可以在所有頁面中通過 `this.app` 訪問。

### 添加自定義方法



```javascript
export const proto = {
  // 自定義方法
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // 帶參數的方法
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### 添加計算屬性



```javascript
export const proto = {
  // 計算屬性
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
  // 導航方法
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
  
  // 計算屬性
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

## 在頁面中使用



在頁面組件中，可以通過 `this.app` 訪問應用實例的自定義方法和屬性：

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">返迴首頁</button>
  <button on:click="app.navigateToProfile()">個人中心</button>
  
  <p>是否在首頁: {{app.isAtHome}}</p>
  <p>是否已登錄: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // 調用應用實例的方法
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## 全侷狀態管理



結閤 `ready` 和 `proto`，可以實現簡單的全侷狀態管理：

```javascript
// app-config.js

export const ready = function() {
  // 初始化全侷狀態
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // 從本地存儲恢復數據
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // 用戶相關
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
  
  // 購物車相關
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // 主題相關
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



<o-playground name="應用初始化示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 應用首頁地址
    export const home = "./home.html";
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
    export const ready = function() {
      console.log("應用已初始化");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("訪問次數:", this.visitCount);
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
      <p>是否在首頁: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">返迴首頁</button>
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
      <p>是否在首頁: {{app.isAtHome}}</p>
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
