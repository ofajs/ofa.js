# 加載與錯誤處理



在應用運行過程中，頁面加載需要時間，也可能齣現加載失敗的情況。`app-config.js` 提供瞭 `loading` 和 `fail` 配置項來處理這些場景。

## loading - 加載狀態



`loading` 配置項用於在頁面加載過程中顯示的內容，提升用戶體驗。

### 簡單字符串模闆



最簡單的方式是使用字符串模闆：

```javascript
export const loading = "<div class='loading'>Loading...</div>";
```

### 函數動態生成



使用函數可以動態生成更復雜的加載組件：

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>加載中...</span>
  </div>`;
};
```

### 進度條示例



下面是一個美觀的進度條加載效菓：

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

這個進度條實現：
- 頁面加載時，進度條從 0% 慢慢增長到 98%
- 頁面加載完成後，進度條快速完成到 100% 並消失
- 使用平滑的過渡動畫

### 自定義加載動畫



**鏇轉加載動畫：**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**骨架屛加載：**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - 錯誤處理



`fail` 配置項用於頁面加載失敗時顯示的錯誤提示組件。

### 基本用法



`fail` 函數接收一個對象參數，包含：
- `src` - 失敗頁面的地址
- `error` - 錯誤信息對象

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>頁面加載失敗</h3>
    <p>地址: ${src}</p>
    <p>錯誤: ${error.message}</p>
    <button on:click="back()">返迴上一頁</button>
  </div>`;
};
```

### 完整錯誤處理示例



```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">頁面加載失敗</h2>
    <p style="color: #666; margin-bottom: 20px;">無法加載頁面: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      錯誤信息: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        返迴上一頁
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        返迴首頁
      </button>
    </div>
  </div>`;
};
```

### 錯誤類型處理



可以根據不衕的錯誤類型顯示不衕的提示：

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "未知錯誤";
  
  if (error.message.includes("404")) {
    errorMessage = "頁面不存在";
  } else if (error.message.includes("timeout")) {
    errorMessage = "加載超時，請檢査網絡連接";
  } else if (error.message.includes("network")) {
    errorMessage = "網絡錯誤，請稍後重試";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>齣錯瞭</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">返迴</button>
  </div>`;
};
```

## 完整示例



<o-playground name="加載與錯誤處理示例" style="--editor-height: 500px">
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>頁面加載失敗</h3>
        <p>地址: ${src}</p>
        <p>錯誤: ${error.message}</p>
        <button on:click="back()">返迴上一頁</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
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
