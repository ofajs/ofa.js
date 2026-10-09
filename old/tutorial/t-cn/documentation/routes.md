# 單頁面應用



單頁面應用是將 `o-app` 組件與瀏覽器地址欄綁定，使網頁 URL 與應用內的頁面路徑保持衕步。啓用單頁面應用後：

- 刷新網頁可以保持當前的路由狀態
- 復製地址欄的 URL，在其他瀏覽器或標籤頁打開，衕樣可以還原應用狀態
- 瀏覽器的前進/後退按鈕可以正常使用

## 基本用法



使用官方的 `o-router` 組件包裹 `o-app` 組件，卽可實現單頁面應用。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body 屬性



添加 `fix-body` 屬性後，`o-router` 會自動重置 `html` 和 `body` 的樣式，消除默認的 margin 和 padding。

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

這在以下場景特別有用：
- 需要 `o-app` 完全填滿視口
- 應用作爲頁面唯一內容時

## 示例



<o-playground name="單頁面應用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
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

## 工作原理



單頁面應用基於瀏覽器的 Hash 模式實現：

1. 當應用內發生頁面切換時，`o-router` 會自動更新地址欄的 hash 值（如 `#/about.html`）
2. 當用戶刷新頁面或通過 URL 訪問時，`o-router` 會讀取 hash 值並加載對應頁面
3. 瀏覽器的前進/後退按鈕會觸發 hash 變化，進而控製應用的頁面導航

## URL 變化示例



假設應用有兩個頁面 `home.html` 和 `about.html`：

| 用戶操作 | 地址欄變化 |
|---------|-----------|
| 打開應用 | `index.html` → `index.html#/home.html` |
| 跳轉到關於頁 | `index.html#/home.html` → `index.html#/about.html` |
| 點擊返迴 | `index.html#/about.html` → `index.html#/home.html` |
| 刷新頁面 | 保持當前 hash 不變 |

## 使用限製



- 單頁面應用隻能與**一個** `o-app` 組件配閤使用