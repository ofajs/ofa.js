# 應用配置



`app-config.js` 配置文件除瞭首頁地址和頁面切換動畫外，還支持更多的配置選項，用於控製應用的加載狀態、錯誤處理、初始化邏輯和導航功能。

```javascript
// app-config.js
// 加載中顯示的內容
export const loading = () => "<div>Loading...</div>";

// 頁面加載失敗時顯示的組件
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// 應用初始化完成後的迴調
export const ready() {
  console.log("App is ready!");
}

// 添加到應用原型的方法和屬性
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="應用配置示例" style="--editor-height: 500px">
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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

## loading - 加載狀態



在頁面加載過程中顯示的組件，可以是字符串模闆或返迴模闆的函數。

```javascript
// 簡單字符串模闆
export const loading = "<div class='loading'>Loading...</div>";

// 使用函數動態生成
export const loading = () => {
  return `<div class='loading'>
    <span>加載中...</span>
  </div>`;
};
```

下面是一個美觀且可直接復製到項目中使用的 loading 實現：

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - 錯誤處理



頁面加載失敗時顯示的組件，函數接收一個對象參數，包含 `src`（失敗頁面的地址）和 `error`（錯誤信息）。

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>頁面加載失敗</p>
    <p>地址: ${src}</p>
    <button on:click="back()">返迴</button>
  </div>`;
};
```

## proto - 原型擴展



向應用實例添加自定義方法和計算屬性，這些方法可以在頁面組件中通過 `this.app` 訪問。

```javascript
export const proto = {
  // 自定義方法
  navigateToHome() {
    this.goto("home.html");
  },
  // 計算屬性
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

在頁面中調用：

```html
<template page>
  <button on:click="app.navigateToHome()">返迴首頁</button>
  <p>是否在首頁: {{app.isAtHome}}</p>
</template>
```

## ready - 初始化迴調



應用配置加載完成後執行的迴調函數，可以在這裏進行初始化操作。可以通過 `this` 訪問應用實例的方法和屬性。

```javascript
export const ready() {
  console.log("應用已初始化");
  // 可以訪問 this (o-app 元素實例)
  console.log(this.current); // 獲取當前頁面 o-page 元素實例
  // this.someMethod();
}
```

## allowForward - 前進功能



控製是否啓用瀏覽器前進功能。設置爲 `true` 後，可以使用瀏覽器的後退和前進按鈕進行導航。

```javascript
export const allowForward = true;
```

當啓用後，用戶可以通過瀏覽器的前進/後退按鈕導航，應用的導航方法 `forward()` 也會生效。

## 編程式導航



除瞭使用 `olink` 鏈接，還可以在 JavaScript 中調用導航方法：

```javascript
// 跳轉到指定頁面（添加到歷史記錄）
this.goto("./about.html");

// 替換當前頁面（不添加到歷史記錄）
this.replace("./about.html");

// 後退到上一頁
this.back();

// 前進到下一頁（需要設置 allowForward: true）
this.forward();
```

## 路由歷史



通過 `routers` 屬性可以獲取瀏覽歷史記錄：

```javascript
// 獲取所有路由歷史
const history = app.routers;
// 返迴格式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 獲取當前頁面
const currentPage = app.current;
```

## 監聽路由變化



可以通過監聽 `router-change` 事件來響應路由變化：

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("路由變化:", data.name); // goto, replace, forward, back
  console.log("頁面地址:", data.src);
});
```
