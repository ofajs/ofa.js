/**
 * 文档案例预览的默认代码与虚拟页面入口。
 * 独立成模块，避免把 <template> / <script> 字符串嵌在组件 HTML 里。
 */

export const SPACE = "ofa-docs-playground";

export const OFA_CDN =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";

// 教程结构改版时递增版本，避免旧的本地代码覆盖新示例
export const STORAGE_KEY = "ofa-docs-playground-code:v2";

export const DEFAULT_CODE = `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    button {
      margin-top: 8px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h1>Hello, {{name}}</h1>
  <p>这是一个运行在 NoneOS 虚拟容器里的 ofa.js 页面。</p>
  <button on:click="count++">点了 {{count}} 次</button>

  <script>
    export default async () => ({
      data: {
        name: "ofa.js",
        count: 0,
      },
    });
  </script>
</template>`;

export const buildIndex = (version, entry = "page") => {
  const body =
    entry === "app"
      ? `<o-app src="./app.mjs?v=${version}"></o-app>`
      : `<o-page src="./page.html?v=${version}"></o-page>`;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 案例预览</title>
    <script type="module" src="${OFA_CDN}"><\/script>
    <style>
      html, body { margin: 0; min-height: 100%; }
      o-page { display: block; }
      o-app { display: block; min-height: 100vh; }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;
};

// 一课可以是单文件（页面字符串），也可以是
// { entry: "page" | "app", files: { "page.html": "..." } }。
// entry="app" 时入口写 app.mjs，用 <o-app> 跑多页面/路由课程。
export const getLesson = (lesson) => {
  const raw = LESSONS[lesson] || DEFAULT_CODE;

  if (typeof raw === "string") {
    return { entry: "page", files: { "page.html": raw } };
  }

  return {
    entry: raw.entry || "page",
    files: { ...raw.files },
  };
};

const BASE_STYLE = `  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input {
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
  </style>`;

export const LESSONS = {
  "lesson-1": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
  </style>

  <h1>{{greeting}}</h1>
  <p>这是 {{name}} 的第一个 ofa.js 页面。</p>

  <script>
    export default async () => ({
      data: {
        greeting: "Hello, ofa.js",
        name: "世界",
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-2": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>

  <h1>{{user.name}}</h1>
  <p>{{user.bio}}</p>
  <p>年龄：{{user.age}}，明年 {{user.age + 1}} 岁。</p>
  <p :html="note"></p>

  <script>
    export default async () => ({
      data: {
        user: {
          name: "Yao",
          bio: "正在学习 ofa.js",
          age: 28,
        },
        note: "<strong>这段 HTML 来自 data.note</strong>",
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-3": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>

  <h1>动态属性</h1>
  <p><a attr:href="url" attr:title="linkTitle">打开 ofa.js 官网</a></p>
  <p><input :value="name" /></p>
  <p>按钮状态：{{ready ? "可用" : "禁用"}}</p>
  <button attr:disabled="!ready" on:click="ready = true">我已阅读</button>

  <script>
    export default async () => ({
      data: {
        url: "https://ofajs.com",
        linkTitle: "指向 ofa.js 官网",
        name: "这是 DOM 的 value 属性",
        ready: false,
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-4": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin-top: 8px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    .card {
      max-width: 360px;
      padding: 24px;
      border: 2px solid #dbe3ef;
      border-radius: 20px;
      transition: 0.2s ease;
    }
    .card.active {
      border-color: #0061a4;
      box-shadow: 0 12px 30px rgba(0, 97, 164, 0.18);
      transform: translateY(-3px);
    }
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 13px;
    }
  </style>

  <h1>样式与 class</h1>

  <div class="card" class:active="active">
    <span
      class="badge"
      :style.background="active ? '#0061a4' : '#e8f1fb'"
      :style.color="active ? '#fff' : '#0061a4'"
    >{{active ? "已启用" : "未启用"}}</span>
    <h2>{{name}}</h2>
    <button on:click="active = !active">切换状态</button>
  </div>

  <script>
    export default async () => ({
      data: {
        name: "Yao 的卡片",
        active: false,
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-5": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>

  <h1>事件</h1>
  <p>计数：<strong>{{count}}</strong></p>
  <button on:click="count++">+1（内联表达式）</button>
  <button on:click="decrement">-1（proto 方法）</button>
  <button on:click="reset">归零</button>

  <p>
    <input on:input="onNameInput($event)" placeholder="输入名字" />
    你好，{{name}}
  </p>

  <script>
    export default async () => ({
      data: {
        count: 0,
        name: "",
      },
      proto: {
        decrement() {
          if (this.count > 0) this.count -= 1;
        },
        reset() {
          this.count = 0;
        },
        onNameInput(event) {
          this.name = event.target.value;
        },
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-6": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>

  <h1>双向绑定</h1>
  <p><input sync:value="name" placeholder="名字" /></p>
  <p>
    <textarea sync:value="bio" rows="3" placeholder="简介"></textarea>
  </p>
  <p>
    <label>
      <input type="checkbox" sync:checked="subscribe" />
      订阅更新
    </label>
  </p>
  <p>
    <select sync:value="role">
      <option value="dev">开发者</option>
      <option value="design">设计师</option>
      <option value="reader">读者</option>
    </select>
  </p>

  <p>预览：{{name}} / {{role}} / {{subscribe ? "已订阅" : "未订阅"}}</p>
  <p>{{bio}}</p>

  <script>
    export default async () => ({
      data: {
        name: "Yao",
        bio: "",
        subscribe: false,
        role: "dev",
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-7": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    .ok { color: #15803d; }
    .warn { color: #b45309; }
    .bad { color: #dc2626; }
  </style>

  <h1>条件渲染</h1>
  <p>分数：<strong>{{score}}</strong></p>
  <p>
    <button on:click="score = 95">95</button>
    <button on:click="score = 72">72</button>
    <button on:click="score = 40">40</button>
  </p>

  <o-if :value="score >= 90">
    <p class="ok">优秀</p>
  </o-if>
  <o-else-if :value="score >= 60">
    <p class="warn">及格</p>
  </o-else-if>
  <o-else>
    <p class="bad">需要努力</p>
  </o-else>

  <script>
    export default async () => ({
      data: {
        score: 72,
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-8": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    li { margin: 8px 0; }
  </style>

  <h1>列表渲染</h1>
  <ul>
    <o-fill :value="items" fill-key="id">
      <li>
        {{$index + 1}}. {{$data.text}}
        <button on:click="$host.removeItem($data.id)">删除</button>
      </li>
    </o-fill>
  </ul>
  <p>共 {{items.length}} 项</p>

  <script>
    let nextId = 1;

    export default async () => ({
      data: {
        items: [
          { id: nextId++, text: "学习 ofa.js" },
          { id: nextId++, text: "写一个页面" },
          { id: nextId++, text: "发布到静态服务器" },
        ],
      },
      proto: {
        removeItem(id) {
          const index = this.items.findIndex((item) => item.id === id);
          if (index > -1) this.items.splice(index, 1);
        },
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-9": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    li input { flex: 1; }
  </style>

  <h1>编辑列表</h1>
  <button on:click="add">添加一行</button>
  <ul>
    <o-fill :value="items" fill-key="id">
      <li>
        <input sync:value="$data.name" />
        <button on:click="$host.removeItem($data.id)">×</button>
      </li>
    </o-fill>
  </ul>

  <script>
    let nextId = 1;

    export default async () => ({
      data: {
        items: [
          { id: nextId++, name: "第一项" },
          { id: nextId++, name: "第二项" },
        ],
      },
      proto: {
        add() {
          this.items.push({ id: nextId++, name: "新项目" });
        },
        removeItem(id) {
          const index = this.items.findIndex((item) => item.id === id);
          if (index > -1) this.items.splice(index, 1);
        },
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-10": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    .total { color: #0061a4; font-size: 24px; font-weight: 700; }
    .log { color: #64748b; }
  </style>

  <h1>计算属性与侦听</h1>
  <p>单价：{{price}} 元</p>
  <p>
    数量：
    <button on:click="qty = Math.max(1, qty - 1)">-</button>
    <strong>{{qty}}</strong>
    <button on:click="qty++">+</button>
  </p>
  <p>总价：<span class="total">{{total}}</span> 元</p>
  <p class="log">{{log}}</p>

  <script>
    export default async () => ({
      data: {
        price: 99,
        qty: 1,
        log: "还没有修改数量",
      },
      proto: {
        get total() {
          return (this.price * this.qty).toFixed(2);
        },
      },
      watch: {
        qty(value, { watchers }) {
          if (!watchers) return;
          this.log =
            "数量从 " + watchers[0].oldValue + " 变成 " + value;
        },
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-11": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>

  <h1>生命周期</h1>
  <p>页面已运行 <strong>{{seconds}}</strong> 秒</p>
  <p>状态：{{status}}</p>
  <p>
    <button on:click="running = !running">
      {{running ? "暂停" : "继续"}}
    </button>
  </p>

  <script>
    export default async () => ({
      data: {
        seconds: 0,
        running: true,
        status: "准备中",
      },
      ready() {
        this.status = "DOM 已就绪";
      },
      attached() {
        this.status = "已挂载，开始计时";
        this._timer = setInterval(() => {
          if (this.running) this.seconds += 1;
        }, 1000);
      },
      detached() {
        clearInterval(this._timer);
        this.status = "已卸载";
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-12": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    hello-card { margin: 12px 0; }
  </style>

  <h1>组件是可以复用的</h1>
  <p>下面两张卡片来自同一个组件，但各自有独立的计数。</p>

  <l-m src="./hello-card.html"></l-m>
  <hello-card></hello-card>
  <hello-card></hello-card>

  <script>
    export default { data: {} };
  </script>
</template>`,
    "hello-card.html": `<template component>
  <style>
    :host {
      display: block;
      padding: 16px 18px;
      border: 1px solid #dbe3ef;
      border-radius: 14px;
      background: #f8fafc;
      color: #111827;
      font-family: system-ui, sans-serif;
    }
    h2 { margin: 0 0 6px; font-size: 18px; }
    p { margin: 0 0 10px; color: #475569; }
    button {
      padding: 6px 12px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h2>Hello, 组件</h2>
  <p>这张卡片被点了 {{count}} 次。</p>
  <button on:click="count++">+1</button>

  <script>
    export default {
      tag: "hello-card",
      data: { count: 0 },
    };
  </script>
</template>`,
    },
  },
  "lesson-13": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    input {
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
    user-chip { margin: 10px 0; }
  </style>

  <h1>给组件传参数</h1>
  <p><input sync:value="name" placeholder="名字" /></p>

  <l-m src="./user-chip.html"></l-m>
  <user-chip attr:name="name" role="读者" start-level="2"></user-chip>
  <user-chip name="Yao" role="维护者" start-level="5"></user-chip>

  <script>
    export default {
      data: { name: "Ada" },
    };
  </script>
</template>`,
    "user-chip.html": `<template component>
  <style>
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
    }
    strong { color: #111827; }
    span { color: #64748b; font-size: 14px; }
    .level {
      margin-left: auto;
      padding: 2px 9px;
      border-radius: 999px;
      background: #e8f1fb;
      color: #0061a4;
    }
  </style>

  <div class="chip">
    <strong>{{name}}</strong>
    <span>{{role}}</span>
    <span class="level">Lv.{{level}}</span>
  </div>

  <script>
    export default {
      tag: "user-chip",
      attrs: {
        name: "访客",
        role: "读者",
        startLevel: 1,
      },
      data: {
        level: 1,
      },
      watch: {
        startLevel(value) {
          this.level = Number(value) || 1;
        },
      },
      attached() {
        this.level = Number(this.startLevel) || 1;
      },
    };
  </script>
</template>`,
    },
  },
  "lesson-14": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    p { color: #475569; }
  </style>

  <h1>插槽与自定义事件</h1>

  <l-m src="./confirm-box.html"></l-m>
  <confirm-box on:confirm="onConfirm">
    <strong>保存修改？</strong>
    <span slot="hint">不会丢失草稿</span>
  </confirm-box>

  <p>最后确认：{{message}}</p>

  <script>
    export default {
      data: { message: "还没有确认" },
      proto: {
        onConfirm(event) {
          this.message = new Date(event.data.time).toLocaleTimeString();
        },
      },
    };
  </script>
</template>`,
    "confirm-box.html": `<template component>
  <style>
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }
    .box {
      padding: 16px 18px;
      border: 1px solid #dbe3ef;
      border-radius: 14px;
      background: #f8fafc;
      color: #111827;
    }
    strong { display: block; margin-bottom: 4px; }
    small { display: block; margin-bottom: 12px; color: #64748b; }
    button {
      padding: 6px 14px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <div class="box">
    <slot></slot>
    <small><slot name="hint">默认提示</slot></small>
    <button on:click="emitConfirm">确认</button>
  </div>

  <script>
    export default {
      tag: "confirm-box",
      proto: {
        emitConfirm() {
          this.emit("confirm", { data: { time: Date.now() } });
        },
      },
    };
  </script>
</template>`,
    },
  },
  "lesson-15": {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin-top: 12px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    profile-card { display: block; margin: 10px 0; }
  </style>

  <h1>跨层上下文</h1>
  <p>前两张卡片在 provider 内，最后一张回退到 root-provider。</p>

  <l-m src="./profile-card.html"></l-m>

  <o-root-provider
    name="user"
    user-name="默认用户"
    user-role="游客"
  ></o-root-provider>

  <o-provider
    id="user-provider"
    name="user"
    user-name="Yao"
    user-role="维护者"
  >
    <profile-card></profile-card>
    <profile-card></profile-card>
  </o-provider>

  <profile-card></profile-card>

  <button on:click="switchUser">切换 provider 用户</button>

  <script>
    export default {
      data: { alternate: false },
      proto: {
        switchUser() {
          const provider = this.shadow.$("#user-provider");
          this.alternate = !this.alternate;
          provider.userName = this.alternate ? "Ada" : "Yao";
          provider.userRole = this.alternate ? "读者" : "维护者";
        },
      },
    };
  </script>
</template>`,
      "profile-card.html": `<template component>
  <style>
    :host { display: block; font-family: system-ui, sans-serif; }
    .card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
    }
    strong { color: #111827; }
    span { color: #64748b; font-size: 14px; }
  </style>

  <div class="card">
    <strong>{{name}}</strong>
    <span>{{role}}</span>
  </div>

  <o-consumer
    name="user"
    watch:user-name="name"
    watch:user-role="role"
  ></o-consumer>

  <script>
    export default {
      tag: "profile-card",
      data: { name: "访客", role: "读者" },
    };
  </script>
</template>`,
    },
  },
  "lesson-16": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 12px 8px 0 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h1>全局状态</h1>
  <p>两个面板引用的是同一个 store，所以数字始终同步。</p>

  <l-m src="./counter-panel.html"></l-m>
  <counter-panel label="面板 A"></counter-panel>
  <counter-panel label="面板 B"></counter-panel>

  <p>
    <button on:click="increase">+1</button>
    <button on:click="reset">归零</button>
  </p>

  <script>
    import { store } from "./store.mjs";

    export default {
      data: {},
      proto: {
        increase() {
          store.count += 1;
        },
        reset() {
          store.count = 0;
        },
      },
    };
  </script>
</template>`,
    "counter-panel.html": `<template component>
  <style>
    :host { display: inline-block; font-family: system-ui, sans-serif; }
    .panel {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-right: 10px;
      padding: 12px 18px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
      color: #111827;
    }
    .panel strong { color: #0061a4; font-size: 20px; }
  </style>

  <div class="panel">
    <span>{{label}}</span>
    <strong>{{count}}</strong>
  </div>

  <script>
    import { store } from "./store.mjs";

    export default {
      tag: "counter-panel",
      attrs: { label: "面板" },
      data: { count: 0 },
      attached() {
        this._stop = store.watch(() => {
          this.count = store.count;
        });
        this.count = store.count;
      },
      detached() {
        if (this._stop != null) store.unwatch(this._stop);
      },
    };
  </script>
</template>`,
    "store.mjs": `export const store = $.stanz({ count: 0 });`,
    },
  },
  "lesson-17": {
    entry: "app",
    files: {
    "app.mjs": `export const home = "./home.html";

export const pageAnime = {
  current: { opacity: 1, transform: "none" },
  next: { opacity: 0, transform: "translate3d(30px, 0, 0)" },
  previous: { opacity: 0, transform: "translate3d(-20px, 0, 0)" },
};`,
    "home.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    a { color: #0061a4; }
    button {
      margin-top: 12px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h1>首页</h1>
  <p><a olink href="./about.html?from=home-link">用 olink 去关于页</a></p>
  <button on:click="goto('./about.html?from=home-button')">
    用 goto 去关于页
  </button>

  <script>
    export default { data: {} };
  </script>
</template>`,
    "about.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    p { color: #475569; }
    button {
      margin-top: 12px;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
  </style>

  <h1>关于页</h1>
  <p>来源参数：{{from}}</p>
  <button on:click="back">返回上一页</button>

  <script>
    export default async ({ query }) => ({
      data: {
        from: query.from || "直接访问",
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-18": {
    entry: "app",
    files: {
    "app.mjs": `export const home = "./home.html";`,
    "layout.html": `<template page>
  <style>
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    nav {
      display: flex;
      gap: 8px;
      padding: 16px 24px;
      border-bottom: 1px solid #dbe3ef;
    }
    nav a {
      padding: 6px 12px;
      border-radius: 8px;
      color: #475569;
      text-decoration: none;
    }
    nav a.active {
      background: #e8f1fb;
      color: #0061a4;
    }
    main { padding: 24px; }
    h1 { margin-top: 0; }
  </style>

  <nav>
    <a
      olink
      href="./home.html"
      class:active="current === 'home'"
    >首页</a>
    <a
      olink
      href="./settings.html"
      class:active="current === 'settings'"
    >设置</a>
  </nav>
  <main><slot></slot></main>

  <script>
    export default {
      data: { current: "home" },
      attached() {
        this.syncRoute();
      },
      routerChange() {
        this.syncRoute();
      },
      proto: {
        syncRoute() {
          const file = (this.app?.current?.src || "")
            .split("/")
            .pop()
            .split("?")[0];
          this.current = file.replace(".html", "");
        },
      },
    };
  </script>
</template>`,
    "home.html": `<template page>
  <h1>首页</h1>
  <p>切换子页时，导航和布局不会重建。</p>
  <script>
    export const parent = "./layout.html";
    export default { data: {} };
  </script>
</template>`,
    "settings.html": `<template page>
  <h1>设置</h1>
  <p>这是另一个子页，父页始终保留。</p>
  <script>
    export const parent = "./layout.html";
    export default { data: {} };
  </script>
</template>`,
    },
  },
  "lesson-19": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    .error { color: #dc2626; }
    .box {
      max-width: 420px;
      padding: 20px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
    }
  </style>

  <h1>异步与加载态</h1>
  <p>
    <label>
      <input type="checkbox" sync:checked="failNext" />
      模拟请求失败
    </label>
  </p>
  <button on:click="fetchUser" attr:disabled="status === 'loading'">
    重新加载
  </button>

  <div class="box">
    <o-if :value="status === 'loading'">
      <p>加载中…</p>
    </o-if>
    <o-else-if :value="status === 'error'">
      <p class="error">{{error}}</p>
    </o-else-if>
    <o-else>
      <h2>{{user.name}}</h2>
      <p>{{user.role}}</p>
    </o-else>
  </div>

  <script>
    export default async () => ({
      data: {
        status: "idle",
        error: "",
        failNext: false,
        user: { name: "", role: "" },
      },
      ready() {
        this.fetchUser();
      },
      proto: {
        async fetchUser() {
          this.status = "loading";
          this.error = "";
          try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            if (this.failNext) throw new Error("网络抖动，请重试");
            this.user = { name: "Yao", role: "正在学习 ofa.js" };
            this.status = "done";
          } catch (error) {
            this.error = error.message;
            this.status = "error";
          }
        },
      },
    });
  </script>
</template>`,
    },
  },
  "lesson-20": {
    entry: "page",
    files: {
    "page.html": `<template page>
  <style>
    :host {
      display: block;
      padding: 28px;
      font-family: system-ui, sans-serif;
      color: #111827;
    }
    h1 { margin-top: 0; }
    button {
      margin: 4px 6px 4px 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      background: #0061a4;
      color: #fff;
      cursor: pointer;
    }
    input, textarea, select {
      margin: 4px 6px 4px 0;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font: inherit;
    }
  </style>
  <style>
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    li.done span { color: #94a3b8; text-decoration: line-through; }
    .filters button.active { background: #0061a4; }
    .filters button { background: #94a3b8; }
  </style>

  <h1>待办清单</h1>
  <p>
    <input
      sync:value="draft"
      on:keydown="addOnEnter($event)"
      placeholder="输入后按回车"
    />
    <button on:click="add">添加</button>
  </p>

  <p class="filters">
    <button class:active="filterMode === 'all'" on:click="filterMode = 'all'">全部</button>
    <button class:active="filterMode === 'active'" on:click="filterMode = 'active'">未完成</button>
    <button class:active="filterMode === 'done'" on:click="filterMode = 'done'">已完成</button>
  </p>

  <ul>
    <o-fill :value="visibleItems" fill-key="id">
      <li class:done="$data.done">
        <input type="checkbox" sync:checked="$data.done" />
        <span>{{$data.text}}</span>
        <button on:click="$host.removeItem($data.id)">×</button>
      </li>
    </o-fill>
  </ul>

  <p>还剩 {{remaining}} 项；数据已自动保存到浏览器。</p>

  <script>
    const KEY = "ofa-tutorial-todos";
    let nextId = 1;

    export default async () => ({
      data: {
        draft: "",
        filterMode: "all",
        items: [
          { id: nextId++, text: "学习 ofa.js", done: true },
          { id: nextId++, text: "写一个组件", done: false },
        ],
      },
      ready() {
        try {
          const saved = JSON.parse(localStorage.getItem(KEY) || "null");
          if (Array.isArray(saved) && saved.length) this.items = saved;
        } catch {}
      },
      watch: {
        items() {
          try {
            localStorage.setItem(KEY, JSON.stringify(this.items));
          } catch {}
        },
      },
      proto: {
        get visibleItems() {
          if (this.filterMode === "active") {
            return this.items.filter((item) => !item.done);
          }
          if (this.filterMode === "done") {
            return this.items.filter((item) => item.done);
          }
          return this.items;
        },
        get remaining() {
          return this.items.filter((item) => !item.done).length;
        },
        addOnEnter(event) {
          if (event.key !== "Enter") return;
          event.preventDefault();
          this.add();
        },
        add() {
          const text = this.draft.trim();
          if (!text) return;
          this.items.push({ id: nextId++, text, done: false });
          this.draft = "";
        },
        removeItem(id) {
          const index = this.items.findIndex((item) => item.id === id);
          if (index > -1) this.items.splice(index, 1);
        },
      },
    });
  </script>
</template>`,
    },
  },
};
