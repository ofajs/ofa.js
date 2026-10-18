# 应用、路由与页面组织

## o-app 与应用配置（app-config.js）

```html
<o-app src="./app-config.js"></o-app>
```

`<o-app>` 是微应用容器：加载应用配置模块（**只接受配置文件，不能直接指向
页面模块**），管理页面栈、导航与切换动画。

```javascript
// app-config.js
export const home = "./pages/home.html";   // 首页地址（相对/绝对路径）

export const pageAnime = {                 // 页面切换动画（三态，均可省略）
  current: { opacity: 1, transform: "translate(0, 0)" },   // 结束态
  next:    { opacity: 0, transform: "translate(30px, 0)" },// 新页入场起点
  previous:{ opacity: 0, transform: "translate(-30px, 0)" },// 旧页离场终点
};

export const loading = () => "<div class='loading'>加载中...</div>";

export const fail = ({ src, error }) =>
  `<div class='error'>加载失败: ${src}</div>`;   // 自定义错误页

export const allowForward = true;              // 开启 forward()（默认关闭）

export const proto = {                         // 扩展应用实例
  navigateToHome() { this.goto("home.html"); },
  get isAtHome() { return this.current?.src.includes("home.html"); },
};

export const ready = function () {             // 配置加载完成回调，this 为 o-app 实例
  console.log(this.current);
};
```

## 导航 API

```javascript
// 页面模块内（this 即页面实例；back/goto/replace 是页面内置方法）
this.goto("./about.html?id=1");   // 压栈
this.replace("./about.html");     // 替换栈顶（不增历史）
this.back();                      // 等价 this.app.back()
this.forward();                   // 需 allowForward: true

// app 实例（$("o-app") 或页面内 this.app）
const app = $("o-app");
app.routers;      // 路由栈 [{ src }, ...]（嵌套路由的父页不进栈）
app.current;      // 当前页面实例（ofa.js 包装对象）
app.on("router-change", (e) => {
  e.data.name;    // goto / replace / back / forward
  e.data.src;     // 目标页面地址
});
```

- 页面跳转传参用 URL query，目标页 `export default async ({ query }) =>` 接收
- 声明式导航：`<a olink href="./about.html">`（只允许在 o-app 内使用，
  触发应用内路由 + 动画，不刷新页面）

## o-router（hash 路由桥）

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

- 把页面栈同步到地址栏 hash（`#/pages/xxx.html?id=1`）：刷新、直达、分享、
  前进后退全部可用，无需服务器 rewrite
- `fix-body`：重置 html/body 满尺寸（响应式属性，移除即撤销）
- 首次进入带 hash 时自动还原目标页（应用就绪后 replace 过去，home 即目标则跳过）
- 一个页面只配合一个 o-app
- 外部分享链接格式：`location.origin + "/#/pages/xxx.html"`（`#` 后直接
  `/`，不带 pathname 与 `./`）
- router 是桥接包，**必须在 ofa.js 之后加载**；包内 dist 产物与加载顺序见
  [resources.md](./resources.md)

## 嵌套路由（共享布局）

父页是带 `<slot>` 的普通页面；子页通过 `export const parent` 挂入：

```html
<!-- layout.html：布局父页（导航栏等公共 UI + slot） -->
<template page>
  <nav>...</nav>
  <main><slot></slot></main>
  <script>
    export default {
      data: { active: "" },
      attached() { this.syncActive(); },
      routerChange({ current }) { this.syncActive(current); },  // 子页切换时触发
      proto: {
        syncActive(current) {
          const src = (current || this.app?.current)?.src || "";
          this.active = src.split("/").pop().split("?")[0];
        },
      },
    };
  </script>
</template>
```

```html
<!-- 子页面：声明 parent 即挂到父页 slot 下 -->
<template page>
  <div>内容</div>
  <script>
    export const parent = "./layout.html";   // 相对子页自身地址解析
    export default { data: {} };
  </script>
</template>
```

- 同父页的子页互相切换时**父页不销毁**（布局与状态保留），只有 slot 层替换
- 支持多级嵌套（父页也可再声明 parent）
- `routerChange` 只在**父页面**上触发，用于导航高亮等

## 单页拆分：宿主内嵌子页面

一个页面模块同时装下「主列表 + 弹窗表单 + 多个子流程」时，把独立业务单元
（尤其弹窗表单）拆成子页面，宿主用 `<o-page>` 常驻内嵌：

```html
<!-- 宿主 -->
<template page>
  <o-page id="form-page" src="./form.html" on:form-save="onFormSave"></o-page>
  <button on:click="openAdd">新增</button>
  <script>
    export default async () => ({
      data: { items: [] },
      proto: {
        openAdd() {
          this.shadow.$("#form-page").openForm({ count: this.items.length });
        },
        onFormSave(event) {
          const { id, name } = event.data;   // 子页面上抛的结果
          /* 业务归一化、持久化都在宿主 */
        },
      },
    });
  </script>
</template>
```

```html
<!-- form.html：子页面自持表单状态，暴露打开入口 -->
<template page>
  <p-dialog sync:open="dialogOpen" auto-close>...</p-dialog>
  <script>
    export default async () => ({
      data: { dialogOpen: false, editingId: "", form: { name: "" } },
      proto: {
        openForm({ id = "", name = "" } = {}) {
          this.editingId = id;
          this.form.name = name;
          this.dialogOpen = true;
        },
        save() {
          this.emit("form-save", {
            data: { id: this.editingId, name: this.form.name },
            bubbles: true,
            composed: true,   // 必须带：子页面在宿主 Shadow DOM 内
          });
          this.dialogOpen = false;
        },
      },
    });
  </script>
</template>
```

规则：
1. **`<o-page>` 的 src 初始化后不可变**——运行时传参走方法调用，禁止改
   src/query（会抛错）
2. 上抛事件必须 `bubbles: true, composed: true`
3. 分工：子页面只管表单完整性与交互状态；归一化、持久化在宿主
4. 需要每次全新实例时，用 `<o-if>` 包裹 `<o-page>` 销毁重建（更推荐常驻 +
   方法重置状态）

## scsr（真实路径路由 / 同构渲染）

o-router 用 hash 地址；需要**每个 URL 都是可直接访问的真实文档**（SEO、
分享、爬虫）时用 scsr：

```html
<!doctype html>
<html>
<head>
  <script src=".../dist/ofa.min.mjs" type="module"></script>
  <script src=".../packages/scsr/dist/scsr.min.mjs" type="module"></script>
</head>
<body>
  <!-- 服务端投递的完整 HTML：页面内容内联在 o-app 的 template[page] 里
      （首屏静态内容，SEO/无 JS 可见） -->
  <o-app src="./app-config.js">
    <template page>
      <h1>首页内容</h1>
      <button on:click="goto('./page2.html')">下一页</button>
    </template>
  </o-app>
</body>
</html>
```

- scsr 接管后把当前 URL 收编为 `<o-page src>`（同一份 HTML 经
  template[page] 转译为页面模块），站内跳转走 o-app 路由，地址是真实路径
- 应用配置**不声明 home**（首页就是当前 URL 的页面）
- 每个 URL 都是独立文档；`.mjs` 页面模块仅限应用内可达（刷新得到源码）
- 服务端可用任意语言/模板引擎按此结构输出页面（SSG 同理）；返回头需
  `Content-Type: text/html; charset=UTF-8`
- 与 o-router 共用同一同步内核，o-app 路由 API、嵌套路由、动画行为完全
  一致；完整案例见 `packages/scsr/test/scsr-demo/`
