# 应用配置

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

## loading - 加载状态

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

## fail - 错误处理

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

## proto - 原型扩展

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

## ready - 初始化回调

应用配置加载完成后执行的回调函数，可以在这里进行初始化操作。可以通过 `this` 访问应用实例的方法和属性。

```javascript
export const ready() {
  console.log("应用已初始化");
  // 可以访问 this (o-app 元素实例)
  console.log(this.current); // 获取当前页面 o-page 元素实例
}
```

## allowForward - 前进功能

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

## 关键要点

- **loading**：页面加载过程中显示的组件
- **fail**：页面加载失败时显示的组件
- **proto**：向应用实例添加自定义方法和计算属性
- **ready**：应用初始化完成后的回调
- **allowForward**：启用浏览器前进功能
- **编程式导航**：goto、replace、back、forward 方法
- **路由历史**：通过 `routers` 属性获取历史记录
