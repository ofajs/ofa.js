# 页面路由、应用与同构渲染

## 单页面应用

单页面应用是将 `o-app` 组件与浏览器地址栏绑定，使网页 URL 与应用内的页面路径保持同步。启用单页面应用后：

- 刷新网页可以保持当前的路由状态
- 复制地址栏的 URL，在其他浏览器或标签页打开，同样可以还原应用状态
- 浏览器的前进/后退按钮可以正常使用

### 基本用法

使用官方的 `o-router` 组件包裹 `o-app` 组件，即可实现单页面应用。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <l-m
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs"
    ></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

> **版本线**：上面是 **v5 分支**地址（v5 未合并 `main`、未发布 npm）。
> v4 主线的对应地址是 `.../dist/ofa.mjs` + `.../libs/router/dist/router.min.mjs`。
> 为什么 v5 必须写 `@refs/heads/v5`、`libs/` 与 `packages/` 的区别，见
> [版本与资源地址](./resources.md)。
>
> **加载顺序**：router 是桥接包，挂接页面已加载的全局 `$`，**必须在 ofa.js 之后
> 加载**，否则启动即报 `$ is missing`。用 ESM 时写成
> `import "ofa.js"; import "router";`（monorepo/npm 场景），或按上面的 script 顺序。


### fix-body 属性

添加 `fix-body` 属性后，`o-router` 会自动重置 `html` 和 `body` 的样式，消除默认的 margin 和 padding。

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

这在以下场景特别有用：
- 需要 `o-app` 完全填满视口
- 应用作为页面唯一内容时

### 工作原理

单页面应用基于浏览器的 Hash 模式实现：

1. 当应用内发生页面切换时，`o-router` 会自动更新地址栏的 hash 值（如 `#/about.html`）
2. 当用户刷新页面或通过 URL 访问时，`o-router` 会读取 hash 值并加载对应页面
3. 浏览器的前进/后退按钮会触发 hash 变化，进而控制应用的页面导航

### URL 变化示例

假设应用有两个页面 `home.html` 和 `about.html`：

| 用户操作 | 地址栏变化 |
|---------|-----------|
| 打开应用 | `index.html` → `index.html#/home.html` |
| 跳转到关于页 | `index.html#/home.html` → `index.html#/about.html` |
| 点击返回 | `index.html#/about.html` → `index.html#/home.html` |
| 刷新页面 | 保持当前 hash 不变 |

### 使用限制

- 单页面应用只能与**一个** `o-app` 组件配合使用


## 嵌套页面/路由

在 ofa.js 中，嵌套页面（也称为嵌套路由）是一种强大的功能，允许你创建具有父子层级关系的页面结构。父页面作为一个布局容器，通过 `<slot>` 插槽来渲染子页面的内容。

### 基本概念

- **父页面（Layout）**：作为布局容器的页面，包含了导航栏、侧边栏等公共 UI 元素
- **子页面**：具体的业务页面内容，会被渲染到父页面的 `<slot>` 插槽位置

### 父页面的写法

父页面需要使用 `<slot></slot>` 标签来为子页面预留渲染位置。

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <div class="content">
    <slot></slot>
  </div>
</template>
```

### 子页面的写法

子页面通过导出 `parent` 属性来指定父页面路径。

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
    export const parent = 'layout.html'; // ⚠️ 关键代码

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

### 父页面的路由监听

父页面可以通过 `routerChange` 生命周期钩子来监听路由变化，这在你需要根据当前路由更新导航状态时非常有用。

```html
<template page>
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

### 注意事项

- `parent` 属性值可以是相对路径（如 `./layout.html`）或绝对路径（如 `/pages/layout.html`）
- 父页面必须包含 `<slot></slot>` 标签，否则子页面内容将无法显示
- 父页面的样式会继承到子页面，子页面也可以定义自己的样式
- 使用 `routerChange` 钩子可以监听路由变化，实现导航高亮等功能

### 多级嵌套

父页面也可以拥有自己的父页面，形成多级嵌套结构。

```html
<!-- 子页面 -->
<template page>
  <p>子页面内容</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- 父页面 -->
<template page>
  <div class="layout">
    <nav>导航栏</nav>
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


## 应用配置

`app-config.js` 配置文件除了首页地址和页面切换动画外，还支持更多的配置选项，用于控制应用的加载状态、错误处理、初始化逻辑和导航功能。

```javascript
// app-config.js
// 加载中显示的内容
export const loading = () => "<div>Loading...</div>";

// 页面加载失败时显示的组件
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// 应用初始化完成后的回调
export const ready() {
  console.log("App is ready!");
}

// 添加到应用原型的方法和属性
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

### loading - 加载状态

在页面加载过程中显示的组件，可以是字符串模板或返回模板的函数。

```javascript
// 简单字符串模板
export const loading = "<div class='loading'>Loading...</div>";

// 使用函数动态生成
export const loading = () => {
  return `<div class='loading'>
    <span>加载中...</span>
  </div>`;
};
```

### fail - 错误处理

页面加载失败时显示的组件，函数接收一个对象参数，包含 `src`（失败页面的地址）和 `error`（错误信息）。

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>页面加载失败</p>
    <p>地址: ${src}</p>
    <button on:click="back()">返回</button>
  </div>`;
};
```

### proto - 原型扩展

向应用实例添加自定义方法和计算属性，这些方法可以在页面组件中通过 `this.app` 访问。

```javascript
export const proto = {
  // 自定义方法
  navigateToHome() {
    this.goto("home.html");
  },
  // 计算属性
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

在页面中调用：

```html
<template page>
  <button on:click="app.navigateToHome()">返回首页</button>
  <p>是否在首页: {{app.isAtHome}}</p>
</template>
```

### ready - 初始化回调

应用配置加载完成后执行的回调函数，可以在这里进行初始化操作。可以通过 `this` 访问应用实例的方法和属性。

```javascript
export const ready() {
  console.log("应用已初始化");
  // 可以访问 this (o-app 元素实例)
  console.log(this.current); // 获取当前页面 o-page 元素实例
}
```

### allowForward - 前进功能

控制是否启用浏览器前进功能。设置为 `true` 后，可以使用浏览器的后退和前进按钮进行导航。

```javascript
export const allowForward = true;
```

### 编程式导航

除了使用 `olink` 链接，还可以在 JavaScript 中调用导航方法：

```javascript
// 跳转到指定页面（添加到历史记录）
this.goto("./about.html");

// 替换当前页面（不添加到历史记录）
this.replace("./about.html");

// 后退到上一页
this.back();

// 前进到下一页（需要设置 allowForward: true）
this.forward();
```

### 路由历史

通过 `routers` 属性可以获取浏览历史记录：

```javascript
// 获取所有路由历史
const history = app.routers;
// 返回格式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 获取当前页面
const currentPage = app.current;
```

### 监听路由变化

可以通过监听 `router-change` 事件来响应路由变化：

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("路由变化:", data.name); // goto, replace, forward, back
  console.log("页面地址:", data.src);
});
```


## 微应用

使用 `o-app` 进行应用化，这个标签就代表着一个微应用，它会加载 `app-config.js` 配置文件，该文件定义了应用的首页地址和页面切换动画配置。

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
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
```

### home - 首页地址

指定应用启动时加载的首页模块路径，支持相对路径和绝对路径。

```javascript
export const home = "./pages/home.html";
```

### pageAnime - 页面切换动画

控制页面切换时的过渡动画效果，包含三个状态：

| 状态 | 说明 |
|------|------|
| `current` | 当前页面动画结束后的样式 |
| `next` | 新页面进入时的起始样式 |
| `previous` | 旧页面离开时的目标样式 |

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

### 传参方式

在 `o-app` 中，页面跳转支持通过 URL Query 传递参数，目标页面通过模块函数的 `query` 参数接收。

### 页面导航

在 o-app 内，每个页面模块可以使用带有 `olink` 属性的 `<a>` 标签进行页面切换。这个标签会触发应用的路由切换，带上过渡动画，且不会刷新整个页面。

```html
<a href="./about.html" olink>跳转到关于页面</a>
```

在页面组件中，可以使用 `back()` 方法返回上一页：

```html
<template page>
  <button on:click="back()">返回</button>
</template>
```


## SSR 与 同构渲染

### 同构渲染

为了在同时保留 CSR 流畅体验、更好的机器爬虫识别（SEO），以及更自由的后端开发语言选择，ofa.js 提供了独特的同构渲染（Symphony Client-Server Rendering）模式。

同构渲染的核心理念是：
- 在服务端渲染初始页面内容，确保 SEO 和首屏加载速度
- 在客户端接管路由处理，保持 CSR 的流畅用户体验
- 适用于任何服务端环境，实现真正的同构渲染

#### 同构渲染实现原理

ofa.js 的 同构渲染模式基于以下机制：

1. 服务端生成带有通用运行结构的完整 HTML 页面
2. 客户端加载 CSR 运行引擎
3. 自动识别当前运行环境，决定渲染策略

#### 同构渲染代码结构

**原始 CSR 页面模块：**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**同构渲染封装后的完整页面：**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html, body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    <!-- 页面模块内容插入位置 -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>
</html>
```

> **版本线**：上面的地址指向 **v5 分支**（scsr 在 v5 中位于 `packages/scsr/dist/`，
> v4 在 `libs/scsr/dist/`）。v5 未合并 `main`、未发布 npm，必须带
> `@refs/heads/v5` 前缀才取到 v5 产物；原因与完整地址表见
> [版本与资源地址](./resources.md)。scsr 是桥接包，**必须在 ofa.js 之后加载**。

所以，你可以使用任意的开发语言（Go、Java、PHP、Nodejs、Python 等），任意的后端模板渲染引擎（如 Go 的 `html/template`、PHP 的 Smarty/Twig/Blade 等），将 ofa.js 的同构渲染代码结构嵌入到模板中，就能实现 SSR。

#### 同构渲染模板结构

要实现 同构渲染模式，只需在服务端使用以下通用模板结构：

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html, body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    <!-- 动态插入对应的页面模块内容 -->
  </o-app>
</body>
</html>
```

**注意：** 服务端返回的 HTML 必须设置正确的 HTTP 头部：`Content-Type: text/html; charset=UTF-8`

`scsr.mjs` 是 ofa.js 提供的 同构渲染运行引擎，它会根据当前页面的运行状态自动判断渲染策略，确保在任何环境下都能提供最佳的用户体验。

同样的，SSG 也可以套用这个结构实现静态站点生成。

### ofa.js 和 SSR 以及其他前端框架的差异

ofa.js 的 Symphony Client-Server Rendering（以下简称 SCSR）本质上也是 SSR 模式。

与 Vue、React、Angular 等现有前端框架的 SSR 方案相比，ofa.js 最大的优势在于**不需要强制绑定 Node.js**。这意味着任意后端模板渲染引擎（如 PHP 的 Smarty、Python 的 Jinja2、Java 的 Thymeleaf 等），都能轻松集成 ofa.js 实现 SSR。

### 网页渲染方式概述

现代网页应用主要有四种渲染方式：传统服务端模板引擎渲染、CSR（Client Side Rendering，客户端渲染）、SSR（Server Side Rendering，服务器端渲染）和 SSG（Static Site Generation，静态站点生成）。每种方式都有其优势和适用场景。

#### CSR（客户端渲染）

在 CSR 模式下，页面内容完全由浏览器端 JavaScript 渲染，ofa.js 的单页面应用就是典型的 CSR 实现。

**优点：**
- 用户体验流畅，页面切换无刷新
- 客户端处理能力强，响应迅速

**缺点：**
- 不利于 SEO，搜索引擎难以索引内容

#### SSR（服务器端渲染）

在保留 CSR 流畅体验的同时，改由服务器实时渲染页面：当用户发起请求时，服务器即时生成完整的 HTML 并返回，实现真正的服务端渲染。

**优点：**
- SEO 友好，首屏加载快
- 支持动态内容

**缺点：**
- 服务器压力大
- 通常需要 Node.js 环境作为运行时

#### SSG（静态站点生成）

在构建阶段将所有页面预先渲染为静态 HTML 文件，部署后可直接由服务器返回给用户。

**优点：**
- 首次加载速度快，SEO 友好
- 服务器负载低，性能稳定
- 安全性高

**缺点：**
- 动态内容更新困难
- 构建时间随页面数量增加而增长

