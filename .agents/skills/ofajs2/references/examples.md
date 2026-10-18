# 完整示例（可直接保存运行）

三个由小到大的完整例子加一个路由应用，文件内容完整给出，需通过静态服务器
访问（`file://` 下模块脚本与页面 fetch 会被 CORS 拦截，双击打不开）。语法
细节见 [syntax.md](./syntax.md)；仓库内的综合案例：`packages/router/test/router-demo/`
（o-app + o-router）与 `packages/scsr/test/scsr-demo/`（scsr 真实路径多页应用）。

## 例一：最小应用（入口 + 页面模块）

**index.html**（入口：引 ofa.js，放一个 o-page 加载页面模块）

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 最小应用</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./page.html"></o-page>
  </body>
</html>
```

**page.html**（页面模块：template[page] 内包含样式、内容与 script）

```html
<template page>
  <style>
    :host { display: block; padding: 20px; font-family: sans-serif; }
    .btn { padding: 6px 16px; cursor: pointer; }
  </style>
  <h1>{{title}}</h1>
  <p>计数：{{count}}，双倍：{{doubleCount}}</p>
  <button class="btn" on:click="count++">+1</button>
  <button class="btn" on:click="reset">重置</button>

  <script>
    export default async ({ query }) => {
      return {
        data: {
          title: "Hello ofa.js",
          count: 0,
        },
        proto: {
          get doubleCount() {
            return this.count * 2;
          },
          reset() {
            this.count = 0;
          },
        },
        ready() {
          console.log("页面就绪，query：", query);
        },
      };
    };
  </script>
</template>
```

要点：`{{}}` 只写元素文本；`on:click` 可用内联表达式或 proto 方法；计算属性
用 `get`（依赖同步初始值）。

## 例二：自定义组件（attrs / watch / emit / slot）

**index.html** 的 `<o-page>` 之上，页面模板加载并使用组件：

```html
<template page>
  <!-- l-m 放页面模板顶部，异步注册组件 -->
  <l-m src="./my-counter.html"></l-m>

  <my-counter :initial-value="5" on:change="onChange">
    <b>当前计数：</b>
  </my-counter>

  <script>
    export default async () => ({
      data: { log: "" },
      proto: {
        onChange(event) {
          this.log = "change -> " + event.data.value;
        },
      },
    });
  </script>
</template>
```

**my-counter.html**（组件模块：必须有 tag；attrs 接外部标量，data 管内部状态）

```html
<template component>
  <style>
    :host { display: inline-flex; align-items: center; gap: 8px;
            padding: 8px; border: 1px solid #4caf50; border-radius: 8px; }
    button { cursor: pointer; }
  </style>
  <span><slot></slot></span>
  <span>{{currentValue}}</span>
  <button on:click="increment">+</button>
  <button on:click="decrement">-</button>

  <script>
    export default {
      tag: "my-counter",
      attrs: { initialValue: 0 },        // 外部标量属性（HTML attribute 可见）
      data: { currentValue: 0 },         // 内部响应式数据
      watch: {
        initialValue(val) { this.currentValue = val; },
      },
      proto: {
        increment() { this.currentValue++; this.emitChange(); },
        decrement() { this.currentValue--; this.emitChange(); },
        emitChange() {
          this.emit("change", { data: { value: this.currentValue } });
        },
      },
      ready() { this.currentValue = this.initialValue; },
    };
  </script>
</template>
```

要点：attrs 与 data 的 key 不可重复；外部用 `:initial-value="5"` 传值
（短横线形式）；子组件 `this.emit` 上抛，父组件 `on:change` 监听，
`event.data` 取值；`<slot>` 渲染使用方塞入的内容。

## 例三：列表渲染 + 双向绑定（待办清单）

page.html 的模板与逻辑：

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
    .done { text-decoration: line-through; opacity: 0.6; }
    li { display: flex; gap: 8px; align-items: center; margin: 4px 0; }
  </style>

  <h2>待办（{{todos.length}}）</h2>
  <input sync:value="newItem" placeholder="输入待办，回车添加"
         on:keydown="addOnEnter($event)" />
  <ul>
    <o-fill :value="todos" fill-key="id">
      <li class:done="$data.done">
        <input type="checkbox" sync:checked="$data.done" />
        <span>{{$data.text}}</span>
        <button on:click="$host.remove($data.id)">✕</button>
      </li>
    </o-fill>
  </ul>

  <script>
    let uid = 0;
    export default async () => ({
      data: {
        newItem: "",
        todos: [
          { id: ++uid, text: "学习 ofa.js", done: false },
          { id: ++uid, text: "写一个组件", done: true },
        ],
      },
      proto: {
        addOnEnter(event) {
          if (event.key !== "Enter" || !this.newItem.trim()) return;
          this.todos.push({ id: ++uid, text: this.newItem.trim(), done: false });
          this.newItem = "";
        },
        remove(id) {
          const i = this.todos.findIndex((t) => t.id === id);
          if (i > -1) this.todos.splice(i, 1);
        },
      },
    });
  </script>
</template>
```

要点：o-fill 内**只能**用 `$data` / `$index` / `$host`（根级没有它们，直接写
方法名）；`fill-key` 指向唯一字段，增删/排序时正确复用列表项；`sync:checked`
双向勾选；数组 push/splice 自动更新视图。

## 例四：路由应用（o-app + o-router）

**index.html**：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>ofa.js 路由应用</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs"
      type="module"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/router/dist/router.min.mjs"
      type="module"
    ></script>
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      o-app { display: block; height: 100%; }
    </style>
  </head>
  <body>
    <o-router fix-body>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

**app-config.js**（o-app 只加载配置文件，不直接加载页面）：

```javascript
export const home = "./pages/home.html";
export const allowForward = true;
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```

**pages/home.html**（声明式 olink 与程序式 goto 两种跳转）：

```html
<template page>
  <h1>首页</h1>
  <a olink href="./detail.html?id=42">去详情（带 query）</a>
  <button on:click="goto('./detail.html?id=42')">goto 详情</button>

  <script>
    export default async () => ({ data: {} });
  </script>
</template>
```

**pages/detail.html**（函数形式 default 读 query）：

```html
<template page>
  <h1>详情</h1>
  <p>id：<b>{{id}}</b></p>
  <button on:click="back()">返回</button>

  <script>
    export default async ({ query }) => ({
      data: { id: query.id || "(未指定)" },
    });
  </script>
</template>
```

要点：地址同步为 `#/pages/xxx.html?id=42`，刷新/直达/前进后退都由 o-router
接管；需要真实路径（SEO）时改用 scsr——页面文件即完整文档，见
[app-routing.md](./app-routing.md) scsr 一节与 `packages/scsr/test/scsr-demo/`。
