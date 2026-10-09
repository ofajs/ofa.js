# 单页面应用

单页面应用是将 `o-app` 组件与浏览器地址栏绑定，使网页 URL 与应用内的页面路径保持同步。启用单页面应用后：

- 刷新网页可以保持当前的路由状态
- 复制地址栏的 URL，在其他浏览器或标签页打开，同样可以还原应用状态
- 浏览器的前进/后退按钮可以正常使用

## 基本用法

使用官方的 `o-router` 组件包裹 `o-app` 组件，即可实现单页面应用。

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

## fix-body 属性

添加 `fix-body` 属性后，`o-router` 会自动重置 `html` 和 `body` 的样式，消除默认的 margin 和 padding。

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

这在以下场景特别有用：
- 需要 `o-app` 完全填满视口
- 应用作为页面唯一内容时

## 工作原理

单页面应用基于浏览器的 Hash 模式实现：

1. 当应用内发生页面切换时，`o-router` 会自动更新地址栏的 hash 值（如 `#/about.html`）
2. 当用户刷新页面或通过 URL 访问时，`o-router` 会读取 hash 值并加载对应页面
3. 浏览器的前进/后退按钮会触发 hash 变化，进而控制应用的页面导航

## URL 变化示例

假设应用有两个页面 `home.html` 和 `about.html`：

| 用户操作 | 地址栏变化 |
|---------|-----------|
| 打开应用 | `index.html` → `index.html#/home.html` |
| 跳转到关于页 | `index.html#/home.html` → `index.html#/about.html` |
| 点击返回 | `index.html#/about.html` → `index.html#/home.html` |
| 刷新页面 | 保持当前 hash 不变 |

## 使用限制

- 单页面应用只能与**一个** `o-app` 组件配合使用

## 关键要点

- **o-router 组件**：包裹 `o-app` 实现单页面应用
- **fix-body 属性**：自动重置 `html` 和 `body` 样式
- **Hash 模式**：基于浏览器 Hash 实现路由同步
- **路由状态保持**：刷新页面保持当前路由状态
- **浏览器导航**：支持前进/后退按钮
