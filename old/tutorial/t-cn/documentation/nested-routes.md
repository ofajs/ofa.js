# 嵌套頁面/路由



在 ofa.js 中，嵌套頁面（也稱爲嵌套路由）是一種強大的功能，允許妳創建具有父子層級關系的頁面結構。父頁面作爲一個佈侷容器，通過 `<slot>` 插槽來渲染子頁面的內容。

## 基本槪唸



- **父頁面（Layout）**：作爲佈侷容器的頁面，包含瞭導航欄、側邊欄等公共 UI 元素
- **子頁面**：具體的業務頁面內容，會被渲染到父頁面的 `<slot>` 插槽位置

## 父頁面的寫法



父頁面需要使用 `<slot></slot>` 標籤來爲子頁面預留渲染位置。

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
    ...
  </style>
  ...
  <div class="content">
    <slot></slot>
  </div>
  ...
</template>
```

## 子頁面的寫法



子頁面通過導齣 `parent` 屬性來指定父頁面路徑。

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export const parent = 'layout.html'; // ⚠️ 關鍵代碼

    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

## 嵌套頁面示例



下面是一個完整的嵌套路由示例，包含根佈侷、父頁面和子頁面：

<o-playground name="嵌套頁面示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 應用首頁地址
    export const home = "./sub-page01.html";
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
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>頁面1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>頁面2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>我是子頁面 1</h1>
      <p>當前路由：{{src}}</p>
      <a href="./sub-page02.html" olink>跳轉到頁面2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>我是子頁面 2</h1>
      <p>當前路由：{{src}}</p>
      <a href="./sub-page01.html" olink>跳轉到頁面1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>



## 父頁面的路由監聽



父頁面可以通過 `routerChange` 生命周期鉤子來監聽路由變化，這在妳需要根據當前路由更新導航狀態時非常有用。

```html
<template page>
  ...
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## 註意事項



- `parent` 屬性值可以是相對路徑（如 `./layout.html`）或絕對路徑（如 `/pages/layout.html`）
- 父頁面必須包含 `<slot></slot>` 標籤，否則子頁面內容將無法顯示
- 父頁面的樣式會繼承到子頁面，子頁面也可以定義自己的樣式
- 使用 `routerChange` 鉤子可以監聽路由變化，實現導航高亮等功能

## 多級嵌套



父頁面也可以擁有自己的父頁面，形成多級嵌套結構。

```html
<!-- 子頁面 -->
<template page>
  <p>子頁面內容</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- 父頁面 -->
<template page>
  <div class="layout">
    <nav>導航欄</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## 多級嵌套示例




<o-playground name="嵌套路由完整示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 應用首頁地址
    export const home = "./sub-page01.html";
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
  <code path="root-layout.html">
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
          border: 1px dashed gray;
        }
        .root {
          height: 100%;
          word-break: break-word;
          padding: 10px;
        }
      </style>
      <div style="text-align: center;font-weight: bold;">Root Layout</div>
      <div class="root">
        <slot></slot>
      </div>
      <script>
        export default () => {
          return { data: {} };
        };
      </script>
    </template>
  </code>
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>頁面1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>頁面2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export const parent = "./root-layout.html";
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>我是子頁面 1</h1>
      <p>當前路由：{{src}}</p>
      <a href="./sub-page02.html" olink>跳轉到頁面2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>我是子頁面 2</h1>
      <p>當前路由：{{src}}</p>
      <a href="./sub-page01.html" olink>跳轉到頁面1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>
