# app



在 `o-app` 內的元素，包括在 `o-app` 內的 `o-page` 的影子節點內的元素，或者再內部的子組件，牠們的 `app` 屬性都指向這個 `o-app` 的元素實例。

## 獲取應用實例



以下是一個示例，演示瞭如何在 `o-app` 內的元素中訪問 `app` 屬性：


<o-playground name="app - 獲取應用實例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 應用首頁地址
    export const home = "./home.html";
    // 應用上的可用方法
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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

## 使用應用實例



獲取 `app` 實例後，妳可以：

### 1. 訪問應用的自定義方法



通過 `app-config.js` 中的 `proto` 配置項添加的自定義方法，可以在任何頁面或組件中通過 `this.app` 調用：

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
// 在頁面或組件中使用
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("用戶已登錄");
}
```

### 2. 訪問應用屬性



```javascript
// 獲取當前頁面
const currentPage = this.app.current;

// 獲取路由歷史
const routers = this.app.routers;

// 訪問全侷數據
const user = this.app.globalData?.user;
```

### 3. 調用導航方法



```javascript
// 頁面跳轉
this.app.goto("./about.html");

// 返迴上一頁
this.app.back();

// 替換當前頁面
this.app.replace("./login.html");
```

### 4. 監聽應用事件



```javascript
// 監聽路由變化
this.app.on("router-change", (e) => {
  console.log("路由變化:", e.data);
});
```

## 詳細文檔



關於如何在 `app-config.js` 中配置應用初始化邏輯和添加自定義方法，請參考：

- **[應用初始化](../../documentation/app-initialization.md)** - 詳細介紹 `ready` 和 `proto` 配置項的使用方法
- **[路由與導航](../../documentation/app-navigation.md)** - 詳細介紹應用的導航方法和路由監聽

## 應用實例的常用屬性和方法



| 屬性/方法 | 說明 |
|----------|------|
| `current` | 當前頁面實例 |
| `routers` | 路由歷史記錄 |
| `globalData` | 全侷數據（需要自己在 `ready` 中初始化） |
| `goto(src)` | 跳轉到指定頁面 |
| `back()` | 返迴上一頁 |
| `replace(src)` | 替換當前頁面 |
| `forward()` | 前進到下一頁 |
| `on(event, callback)` | 監聽應用事件 |
| 自定義方法 | 通過 `proto` 配置添加的方法 |
