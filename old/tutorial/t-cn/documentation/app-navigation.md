# 路由與導航



應用內的頁面導航是單頁面應用的覈心功能。本章介紹如何使用編程式導航、管理路由歷史，以及監聽路由變化。

## allowForward - 前進功能



默認情況下，應用隻支持後退導航。在 `app-config.js` 中設置 `allowForward` 爲 `true` 後，可以啓用應用的前進功能。

```javascript
// app-config.js
export const allowForward = true;
```

啓用後：

- 用戶可以使用瀏覽器的前進/後退按鈕進行導航
- 應用的 `forward()` 方法可以正常工作

## 編程式導航



除瞭使用 `olink` 屬性的鏈接，還可以在 JavaScript 中調用導航方法。

> **重要說明**：
> - `goto`、`replace`、`back` 方法在**頁面實例（page）**和**應用實例（app）**上都可用
> - `forward` 方法隻在**應用實例（app）**上可用
> - 在頁面中使用：`this.goto()` 或 `this.app.goto()`
> - 在組件中使用：`this.app.goto()`（需要通過 app 實例調用）
> 
> **路徑相對性說明**：
> - 在**頁面模塊**上使用 `goto` 或 `replace`，路徑是相對於**當前頁面模塊**的地址
> - 在**應用實例（app）**上使用 `goto` 或 `replace`，路徑是相對於**當前應用導航**的地址

### goto - 跳轉頁面



跳轉到指定頁面，並添加到歷史記錄：

```javascript
// 跳轉到指定頁面
this.goto("./about.html");

// 帶參數跳轉
this.goto("./detail.html?id=123");
```

### replace - 替換頁面



替換當前頁面，不添加到歷史記錄：

```javascript
// 替換當前頁面
this.replace("./login.html");
```

常用於登錄後跳轉，避免用戶點擊後退按鈕迴到登錄頁。

### back - 後退



返迴到上一頁：

```javascript
this.back();
```

### forward - 前進



前進到下一頁（需要設置 `allowForward: true`）：

```javascript
// 在頁面或組件中調用
this.app.forward();
```

> **註意**：`forward` 方法必須在應用實例（`app`）上調用，而不是在頁面實例上調用。例如使用 `this.app.forward()` 而不是 `this.forward()`。

### 導航方法對比



| 方法      | 歷史記錄     | 使用場景           |
| --------- | ------------ | ------------------ |
| `goto`    | 添加新記錄   | 正常頁面跳轉       |
| `replace` | 替換當前記錄 | 登錄後跳轉、重定向 |
| `back`    | 迴退到上一條 | 返迴操作           |
| `forward` | 前進到下一條 | 前進操作（需啓用） |

## 路由歷史



### 獲取路由歷史



通過 `routers` 屬性獲取所有路由歷史：

```javascript
const history = app.routers;
// 返迴格式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### 獲取當前頁面



通過 `current` 屬性獲取當前頁面實例：

```javascript
const currentPage = app.current;
console.log("當前頁面:", currentPage.src);
```

### 路由歷史示例



```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // 需要配閤 allowForward 使用
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## 監聽路由變化



通過監聽 `router-change` 事件來響應路由變化。

### 基本用法



```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("路由變化:", data.name);
  console.log("頁面地址:", data.src);
});
```

### 事件數據



`router-change` 事件的數據對象包含：

| 屬性   | 說明         | 可能的值                             |
| ------ | ------------ | ------------------------------------ |
| `name` | 導航類型     | `goto`, `replace`, `forward`, `back` |
| `src`  | 目標頁面地址 | 頁面路徑                             |

### 使用示例



```javascript
export const ready = function () {
  // 監聽路由變化
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // 記錄頁面訪問
    console.log(`[${name}] 導航到: ${src}`);

    // 更新頁面標題
    this.updateTitle(src);

    // 發送統計數據
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "首頁",
      "about.html": "關於我們",
      "contact.html": "聯系我們",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "應用";
  },

  trackPageView(src) {
    // 發送頁面訪問統計
    console.log("統計頁面訪問:", src);
  },
};
```

## 頁面導航守衛



結閤路由監聽，可以實現導航守衛功能：

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // 檢査是否需要登錄
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## 完整示例



<o-playground name="路由與導航示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 應用首頁地址
    export const home = "./home.html";
    export const allowForward = true;
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
      this.on("router-change", (e) => {
        console.log("路由變化:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
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
      <p>路由歷史數量: {{app.routerCount}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="gotoAbout">編程式跳轉</button>
      <br><br>
      <button on:click="goForward()">前進</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
              goForward() {
                this.app.forward();
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">後退</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>路由歷史數量: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">提示：點擊"後退"後，在首頁可以點擊"前進"迴到這裏</p>
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
