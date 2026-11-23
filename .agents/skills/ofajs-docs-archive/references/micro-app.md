# 微应用

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

## home - 首页地址

指定应用启动时加载的首页模块路径，支持相对路径和绝对路径。

```javascript
export const home = "./pages/home.html";
```

## pageAnime - 页面切换动画

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

## 传参方式

在 `o-app` 中，页面跳转支持通过 URL Query 传递参数，目标页面通过模块函数的 `query` 参数接收。

## 页面导航

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

## 关键要点

- **o-app 标签**：代表一个微应用，加载配置文件
- **app-config.js**：定义首页地址和页面切换动画
- **home 配置**：指定应用启动时加载的首页
- **pageAnime 配置**：控制页面切换过渡动画
- **olink 属性**：使用 `<a olink>` 进行页面切换
- **back() 方法**：返回上一页
