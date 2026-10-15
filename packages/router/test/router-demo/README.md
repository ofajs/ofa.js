# o-app + o-router 使用案例

o-app（应用容器与路由）+ o-router（hash 路由桥，`packages/router`）的
完整使用案例，以一个带持久布局的迷你应用呈现。页面地址同步到
`location.hash`（`#/pages/xxx.html`），刷新、直达、分享链接无需服务器
重写，浏览器前进/后退由 o-router 接管。

## 运行

```bash
npm run server   # http://localhost:3348
```

打开 <http://localhost:3348/packages/router/test/router-demo/index.html>

## 目录与演示点

| 文件 | 演示点 |
|---|---|
| `index.html` | `<o-router fix-body>` 包裹 `<o-app src>`；设计令牌（`:root` CSS 变量，可穿透 shadow DOM）与顶层页面滚动样式也在这里 |
| `app-config.mjs` | 应用配置模块：`home`（首页）、`allowForward`（开启 forward）、`pageAnime`（进出动画：30px 同向漂移 + 淡入淡出）、`fail`（加载失败页自定义）、`ready`（导航即回顶：包装 goto/replace/back/forward，避免滚动后切页时文档高度塌缩导致视图突跳） |
| `pages/layout.html` | **持久化布局页**：导航栏 + `<slot>`，所有页面 `parent` 指向它——同前缀导航时布局不销毁，仅 slot 内容过渡；`routerChange` 生命周期驱动当前项高亮与导航计数 |
| `pages/home.html` | 导航入口聚合页：程序导航（`goto`）、声明导航（`<a olink>`）、query 直达、.mjs 页面、嵌套路由、404 触发、`forward()` |
| `pages/list.html` | `o-fill` 商品卡片；fill 项内 `olink` 按文档基准用 `attr:href` 表达式拼接 query |
| `pages/detail.html` | **query 读取**：`default` 写成函数，入参 `query` 即页面地址的查询参数 |
| `pages/parent.html` + `child-a/b.html` | **嵌套路由三层链**（layout → parent → child）：子页声明 `export const parent`，子页互换时父页不销毁（计数保留）；父页同样用 `routerChange` 高亮分段控件 |
| `pages/profile.mjs` | **.mjs 页面模块**：`type = $.PAGE`、`default` 函数读 query |

## 样式

按钮与导航的交互态参考 [Bootstrap 6 的 Button 组件](https://getbootstrap.com/docs/6.0/components/button/)：
solid / outline 变体、`sm` 小尺寸、`.375em` 圆角、`0.15s ease-in-out` 状态过渡，
hover/active 用 `color-mix` 加深主色，focus-visible 画软光环。各页面在各自模板里
保留最简版实现，配色沿用 `index.html` 的 `:root` 设计令牌。

## 核心写法速查

```html
<!-- hash 路由：o-router 包裹 o-app -->
<o-router fix-body>
  <o-app src="./app-config.mjs"></o-app>
</o-router>
```

```js
// 应用配置
export const home = "./pages/home.html";
export const allowForward = true;
export const fail = ({ src }) => `...`;      // 加载失败页
export const pageAnime = { ... };            // 进出动画（淡入淡出 + 少量位移）
```

```html
<!-- 持久化布局页（layout.html）：导航 + slot，页面声明 parent 挂进来 -->
<header>…<a olink href="./home.html">首页</a>…</header>
<main><slot></slot></main>
```

```js
// 页面挂到布局页下（嵌套路由：同前缀导航时布局页不销毁）
export const parent = "./layout.html";

// 布局页内监听路由变化：当前项高亮
export default {
  routerChange({ current }) { /* current 为切换后的顶层子页 */ },
};

// 页面模块读 query（default 函数形式）
export default ({ query }) => ({ data: { id: query.id } });
```

```js
// 程序导航（页面内）
this.goto("./detail.html?id=1");
this.replace("./detail.html?id=1");   // 替换栈顶
this.back();
this.app.forward();                   // 需 allowForward
```

## 不用 o-router？

去掉 `<o-router>` 直接 `<o-app>` 即可：路由 API、olink、页面继承全部
照常，区别只是地址不进 hash——刷新后回到配置的 home，浏览器前进/后退
不与页面联动。适合嵌入既有页面、对地址无诉求的场景。
