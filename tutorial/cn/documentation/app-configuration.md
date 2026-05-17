# 应用配置

`app-config.js` 配置文件用于定义应用的各种行为，包括首页地址、页面切换动画、加载状态、错误处理、初始化逻辑等。

## 完整配置示例

下面是一个包含所有配置项的完整 `app-config.js` 文件示例：

```javascript
// app-config.js

// 【必需】应用首页地址
export const home = "./home.html";

// 【可选】页面切换动画配置
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

// 【可选】加载中显示的内容
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

// 【可选】页面加载失败时显示的组件
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>页面加载失败</h3>
    <p>地址: ${src}</p>
    <p>错误: ${error.message}</p>
    <button on:click="back()">返回上一页</button>
  </div>`;
};

// 【可选】应用初始化完成后的回调
export const ready = function() {
  console.log("应用已初始化");
  // this 指向 o-app 元素实例
  console.log("当前页面:", this.current);
};

// 【可选】添加到应用原型的方法和属性
export const proto = {
  // 自定义方法
  navigateToHome() {
    this.goto("./home.html");
  },
  // 计算属性
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};

// 【可选】是否启用浏览器前进功能
export const allowForward = true;
```

## 配置项详解

### home - 首页地址（必需）

指定应用启动时加载的首页模块路径。

```javascript
export const home = "./pages/home.html";
```

### pageAnime - 页面切换动画（可选）

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

### loading - 加载状态（可选）

在页面加载过程中显示的组件，可以是字符串模板或返回模板的函数。

**简单字符串模板：**

```javascript
export const loading = "<div class='loading'>Loading...</div>";
```

**函数动态生成：**

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>加载中...</span>
  </div>`;
};
```

**完整进度条示例：**

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

### fail - 错误处理（可选）

页面加载失败时显示的组件，函数接收一个对象参数，包含 `src`（失败页面的地址）和 `error`（错误信息）。

```javascript
export const fail = ({ src, error }) => {
  return `<div class='error'>
    <p>页面加载失败</p>
    <p>地址: ${src}</p>
    <p>错误: ${error.message}</p>
    <button on:click="back()">返回</button>
  </div>`;
};
```

### ready - 初始化回调（可选）

应用配置加载完成后执行的回调函数，可以在这里进行初始化操作。

```javascript
export const ready = function() {
  console.log("应用已初始化");
  // this 指向 o-app 元素实例
  console.log("当前页面:", this.current);
};
```

> **注意**：`ready` 必须使用函数声明或函数表达式，不能使用箭头函数（因为需要正确的 `this` 绑定）。

### proto - 原型扩展（可选）

向应用实例添加自定义方法和计算属性，这些方法可以在页面组件中通过 `this.app` 访问。

```javascript
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

**在页面中使用：**

```html
<template page>
  <button on:click="app.navigateToHome()">返回首页</button>
  <p>是否在首页: {{app.isAtHome}}</p>
</template>
```

### allowForward - 前进功能（可选）

控制是否启用浏览器前进功能。设置为 `true` 后，可以使用浏览器的后退和前进按钮进行导航。

```javascript
export const allowForward = true;
```

## 编程式导航

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

## 路由历史

通过 `routers` 属性可以获取浏览历史记录：

```javascript
// 获取所有路由历史
const history = app.routers;
// 返回格式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 获取当前页面
const currentPage = app.current;
```

## 监听路由变化

可以通过监听 `router-change` 事件来响应路由变化：

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("路由变化:", data.name); // goto, replace, forward, back
  console.log("页面地址:", data.src);
});
```

## 在 HTML 中使用配置文件

在 HTML 文件中，通过 `o-app` 标签引入配置文件：

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="应用配置示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" active>
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
  <code path="home.html">
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
