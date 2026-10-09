# 應用配置基礎



`app-config.js` 配置文件用於定義應用的各種行爲。本章介紹配置文件的基本結構和所有可用的配置項。

## 配置文件結構



創建 `app-config.js` 文件，使用 ES6 模塊語法導齣配置項：

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

// 加載狀態（可選）
export const loading = () => {
  return "<div>Loading...</div>";
};

// 錯誤處理（可選）
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// 應用初始化（可選）
export const ready = function() {
  console.log("App is ready");
};

// 原型擴展（可選）
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// 啓用前進功能（可選）
export const allowForward = true;
```

## 配置項總覽



`app-config.js` 支持以下配置項：

| 配置項 | 是否必需 | 說明 | 詳細文檔 |
|--------|----------|------|----------|
| `home` | ✅ 必需 | 應用首頁地址 | 本章 |
| `pageAnime` | 可選 | 頁面切換動畫配置 | [頁面切換動畫](./page-transition-animation.md) |
| `loading` | 可選 | 頁面加載時顯示的內容 | [加載與錯誤處理](./app-loading-error.md) |
| `fail` | 可選 | 頁面加載失敗時顯示的內容 | [加載與錯誤處理](./app-loading-error.md) |
| `ready` | 可選 | 應用初始化完成後的迴調 | [應用初始化](./app-initialization.md) |
| `proto` | 可選 | 添加到應用原型的方法和屬性 | [應用初始化](./app-initialization.md) |
| `allowForward` | 可選 | 是否啓用瀏覽器前進功能 | [路由與導航](./app-navigation.md) |

## home - 首頁地址



`home` 是必需配置項，指定應用啓動時加載的首頁模塊路徑。

```javascript
export const home = "./pages/home.html";
```

**路徑規則：**
- 支持相對路徑（相對於 `app-config.js` 文件）
- 支持絕對路徑
- 路徑指向一個頁面模塊文件（`.html` 文件）

## pageAnime - 頁面切換動畫



`pageAnime` 是可選配置項，用於控製頁面切換時的過渡動畫效菓。

### 基本用法



```javascript
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

### 動畫狀態說明



頁面切換動畫包含三個狀態：

| 狀態 | 說明 | 觸發時機 |
|------|------|----------|
| `current` | 當前頁面動畫結束後的樣式 | 頁面切換完成後 |
| `next` | 新頁面進入時的起始樣式 | 新頁面開始進入時 |
| `previous` | 舊頁面離開時的目標樣式 | 舊頁面開始離開時 |

### 更多動畫效菓



頁面切換動畫支持多種效菓，包括：
- 左右滑動（默認）
- 淡入淡齣
- 上下滑動
- 縮放效菓
- 翻轉效菓
- 自定義動畫

詳細的動畫配置和效菓示例，請參考 [頁面切換動畫](./page-transition-animation.md) 章節。

## 在 HTML 中使用配置文件



在 HTML 文件中，通過 `o-app` 標籤引入配置文件：

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

<o-playground name="應用配置基礎示例" style="--editor-height: 500px">
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
      <a href="./about.html" olink>Go to About</a>
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
