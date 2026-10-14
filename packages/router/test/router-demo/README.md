# o-app + o-router 使用案例

o-app（应用容器与路由）+ o-router（hash 路由桥，`packages/router`）的
完整使用案例。页面地址同步到 `location.hash`（`#/pages/xxx.html`），
刷新、直达、分享链接无需服务器重写，浏览器前进/后退由 o-router 接管。

## 运行

```bash
npm run server   # http://localhost:3348
```

打开 <http://localhost:3348/packages/router/test/router-demo/index.html>

## 目录与演示点

| 文件 | 演示点 |
|---|---|
| `index.html` | `<o-router fix-body>` 包裹 `<o-app src>`；o-router 把路由同步到 hash 并接管前进/后退 |
| `app-config.mjs` | 应用配置模块：`home`（首页）、`allowForward`（开启 forward）、`pageAnime`（进出动画）、`fail`（加载失败页自定义） |
| `pages/home.html` | 导航入口：程序导航（`goto()`）与声明导航（`<a olink href>`）两种方式 |
| `pages/list.html` | `o-fill` 渲染列表；每项 `olink` 携带 query（`attr:href` 内联表达式拼接） |
| `pages/detail.html` | **query 读取**：`default` 写成函数，入参 `query` 即页面地址的查询参数 |
| `pages/parent.html` + `child-a/b.html` | **嵌套路由**：子页声明 `export const parent`，同父页的子页互相切换时父页不销毁（父页状态保留） |
| `pages/profile.mjs` | **.mjs 页面模块**：`type = $.PAGE`、`default` 函数读 query、`routerChange` 生命周期 |

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
export const pageAnime = { ... };            // 进出动画
```

```js
// 页面模块读 query（default 函数形式）
export default ({ query }) => ({ data: { id: query.id } });
```

```js
// 程序导航（页面内）
this.goto("./detail.html?id=1");
this.replace("./detail.html?id=1");   // 替换栈顶
this.back();
```

## 不用 o-router？

去掉 `<o-router>` 直接 `<o-app>` 即可：路由 API、olink、页面继承全部
照常，区别只是地址不进 hash——刷新后回到配置的 home，浏览器前进/后退
不与页面联动。适合嵌入既有页面、对地址无诉求的场景。
