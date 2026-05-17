# 微應用



`o-app` 是 ofa.js 中的覈心容器組件，用於創建獨立的微應用。牠會加載 `app-config.js` 配置文件，該文件定義瞭應用的各種行爲。

## 基本使用



在 HTML 中使用 `o-app` 標籤創建微應用：

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

## 創建配置文件



創建 `app-config.js` 文件，定義應用的基本配置：

```javascript
// app-config.js

// 應用首頁地址（必需）
export const home = "./home.html";

// 頁面切換動畫配置（可選）
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
```

<o-playground name="微應用示例" style="--editor-height: 500px">
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 頁面導航



### 使用 olink 屬性



在 `o-app` 內，使用帶有 `olink` 屬性的 `<a>` 標籤進行頁面切換：

```html
<a href="./about.html" olink>跳轉到關於頁面</a>
```

`olink` 會觸發應用的路由切換，帶上過渡動畫，且不會刷新整個頁面。

### 編程式導航



在頁面組件中，可以使用導航方法：

```javascript
// 跳轉到指定頁面
this.goto("./about.html");

// 替換當前頁面（不添加到歷史記錄）
this.replace("./about.html");

// 返迴上一頁
this.back();
```

## 頁面傳參



通過 URL Query 傳遞參數，目標頁面通過模塊函數的 `query` 參數接收：

**發送頁面：**

```html
<a href="./detail.html?id=123" olink>査看詳情</a>
```

**接收頁面：**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## 配置文件詳解



`app-config.js` 支持多種配置選項，用於控製應用的行爲：

| 配置項 | 是否必需 | 說明 |
|--------|----------|------|
| `home` | 必需 | 應用首頁地址 |
| `pageAnime` | 可選 | 頁面切換動畫配置 |
| `loading` | 可選 | 頁面加載時顯示的內容 |
| `fail` | 可選 | 頁面加載失敗時顯示的內容 |
| `ready` | 可選 | 應用初始化完成後的迴調 |
| `proto` | 可選 | 添加到應用原型的方法和屬性 |
| `allowForward` | 可選 | 是否啓用瀏覽器前進功能 |

## 微應用特性



### 獨立性



每個 `o-app` 實例都是獨立的微應用，擁有自己的：
- 路由歷史
- 頁面棧
- 狀態管理
- 配置選項

### 嵌套使用



`o-app` 可以嵌套使用，實現復雜的應用結構：

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### 與組件的區別



`o-app` 與普通組件的主要區別：

| 特性 | o-app | 普通組件 |
|------|-------|----------|
| 路由管理 | ✅ 內置路由系統 | ❌ 無 |
| 頁面棧 | ✅ 管理頁面歷史 | ❌ 無 |
| 配置文件 | ✅ 獨立配置 | ❌ 無 |
| 頁面切換動畫 | ✅ 支持 | ❌ 無 |
| 適用場景 | 應用級容器 | 功能組件 |
