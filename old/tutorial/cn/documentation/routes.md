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

## 示例

<o-playground name="单页面应用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
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