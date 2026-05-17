# 应用配置基础

`app-config.js` 配置文件用于定义应用的基本行为。本章介绍最基础的配置项：首页地址和页面切换动画。

## 配置文件结构

创建 `app-config.js` 文件，使用 ES6 模块语法导出配置项：

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

## home - 首页地址

`home` 是必需配置项，指定应用启动时加载的首页模块路径。

```javascript
export const home = "./pages/home.html";
```

**路径规则：**
- 支持相对路径（相对于 `app-config.js` 文件）
- 支持绝对路径
- 路径指向一个页面模块文件（`.html` 文件）

## pageAnime - 页面切换动画

`pageAnime` 是可选配置项，用于控制页面切换时的过渡动画效果。

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

### 动画状态说明

页面切换动画包含三个状态：

| 状态 | 说明 | 触发时机 |
|------|------|----------|
| `current` | 当前页面动画结束后的样式 | 页面切换完成后 |
| `next` | 新页面进入时的起始样式 | 新页面开始进入时 |
| `previous` | 旧页面离开时的目标样式 | 旧页面开始离开时 |

### 更多动画效果

页面切换动画支持多种效果，包括：
- 左右滑动（默认）
- 淡入淡出
- 上下滑动
- 缩放效果
- 翻转效果
- 自定义动画

详细的动画配置和效果示例，请参考 [页面切换动画](./page-transition-animation.md) 章节。

## 在 HTML 中使用配置文件

在 HTML 文件中，通过 `o-app` 标签引入配置文件：

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

<o-playground name="应用配置基础示例" style="--editor-height: 500px">
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
