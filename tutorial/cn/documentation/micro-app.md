# 微应用

`o-app` 是 ofa.js 中的核心容器组件，用于创建独立的微应用。它会加载 `app-config.js` 配置文件，该文件定义了应用的各种行为。

## 基本使用

在 HTML 中使用 `o-app` 标签创建微应用：

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

## 创建配置文件

创建 `app-config.js` 文件，定义应用的基本配置：

```javascript
// app-config.js

// 应用首页地址（必需）
export const home = "./home.html";

// 页面切换动画配置（可选）
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

<o-playground name="微应用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
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

## 页面导航

### 使用 olink 属性

在 `o-app` 内，使用带有 `olink` 属性的 `<a>` 标签进行页面切换：

```html
<a href="./about.html" olink>跳转到关于页面</a>
```

`olink` 会触发应用的路由切换，带上过渡动画，且不会刷新整个页面。

### 编程式导航

在页面组件中，可以使用导航方法：

```javascript
// 跳转到指定页面
this.goto("./about.html");

// 替换当前页面（不添加到历史记录）
this.replace("./about.html");

// 返回上一页
this.back();
```

## 页面传参

通过 URL Query 传递参数，目标页面通过模块函数的 `query` 参数接收：

**发送页面：**

```html
<a href="./detail.html?id=123" olink>查看详情</a>
```

**接收页面：**

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

## 配置文件详解

`app-config.js` 支持多种配置选项，用于控制应用的行为：

| 配置项 | 是否必需 | 说明 |
|--------|----------|------|
| `home` | 必需 | 应用首页地址 |
| `pageAnime` | 可选 | 页面切换动画配置 |
| `loading` | 可选 | 页面加载时显示的内容 |
| `fail` | 可选 | 页面加载失败时显示的内容 |
| `ready` | 可选 | 应用初始化完成后的回调 |
| `proto` | 可选 | 添加到应用原型的方法和属性 |
| `allowForward` | 可选 | 是否启用浏览器前进功能 |

## 微应用特性

### 独立性

每个 `o-app` 实例都是独立的微应用，拥有自己的：
- 路由历史
- 页面栈
- 状态管理
- 配置选项

### 嵌套使用

`o-app` 可以嵌套使用，实现复杂的应用结构：

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### 与组件的区别

`o-app` 与普通组件的主要区别：

| 特性 | o-app | 普通组件 |
|------|-------|----------|
| 路由管理 | ✅ 内置路由系统 | ❌ 无 |
| 页面栈 | ✅ 管理页面历史 | ❌ 无 |
| 配置文件 | ✅ 独立配置 | ❌ 无 |
| 页面切换动画 | ✅ 支持 | ❌ 无 |
| 适用场景 | 应用级容器 | 功能组件 |
