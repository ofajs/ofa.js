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

### 动画状态

页面切换动画包含三个状态：

| 状态 | 说明 | 触发时机 |
|------|------|----------|
| `current` | 当前页面动画结束后的样式 | 页面切换完成后 |
| `next` | 新页面进入时的起始样式 | 新页面开始进入时 |
| `previous` | 旧页面离开时的目标样式 | 旧页面开始离开时 |

### 默认动画示例

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

这个配置实现了：
- 新页面从右侧滑入（初始位置在右侧 30px，透明度为 0）
- 旧页面向左滑出（最终位置在左侧 -30px，透明度为 0）
- 最终两个页面都回到正常位置（透明度为 1，位置为 0）

### 自定义动画效果

**淡入淡出效果：**

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

**上下滑动效果：**

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

**缩放效果：**

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

### 动画属性说明

`pageAnime` 支持所有 CSS 可动画属性：

- `opacity` - 透明度
- `transform` - 变换（位移、旋转、缩放等）
- `width` / `height` - 宽高
- `margin` / `padding` - 外边距/内边距
- `background-color` - 背景色
- 其他 CSS 可动画属性

> **注意**：动画效果由 CSS `transition` 属性控制，ofa.js 会自动添加过渡效果。

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
