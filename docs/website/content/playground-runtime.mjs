/**
 * 文档案例预览的默认代码与虚拟页面入口。
 * 独立成模块，避免把 <template> / <script> 字符串嵌在组件 HTML 里。
 */

export const SPACE = "ofa-docs-playground";

export const OFA_CDN =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";

export const STORAGE_KEY = "ofa-docs-playground-code";

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

export const buildIndex = (version) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 案例预览</title>
    <script type="module" src="${OFA_CDN}"><\/script>
    <style>
      html, body { margin: 0; min-height: 100%; }
      o-page { display: block; }
    </style>
  </head>
  <body>
    <o-page src="./page.html?v=${version}"></o-page>
  </body>
</html>`;

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
  "lesson-1": `<template page>
${BASE_STYLE}

  <h1>Hello, {{name}}</h1>
  <p>把 data 里的 name 改成你的名字，再点「运行代码」。</p>

  <script>
    export default async () => ({
      data: {
        name: "世界",
      },
    });
  </script>
</template>`,

  "lesson-2": `<template page>
${BASE_STYLE}

  <h1>计数器</h1>
  <p>当前计数：<strong>{{count}}</strong></p>
  <button on:click="count++">+1</button>
  <button on:click="reset">归零</button>

  <p>
    输入内容：<input sync:value="note" placeholder="写点什么" />
  </p>
  <p>你输入了：{{note}}</p>

  <script>
    export default async () => ({
      data: {
        count: 0,
        note: "",
      },
      proto: {
        reset() {
          this.count = 0;
        },
      },
    });
  </script>
</template>`,

  "lesson-3": `<template page>
${BASE_STYLE}
  <style>
    li {
      margin: 6px 0;
    }
    .empty {
      color: #64748b;
    }
  </style>

  <h1>今天的待办</h1>
  <p>
    <input sync:value="draft" placeholder="输入待办" />
    <button on:click="add">添加</button>
  </p>

  <o-if :value="items.length === 0">
    <p class="empty">还没有待办，先添加一条吧。</p>
  </o-if>

  <ul>
    <o-fill :value="items" fill-key="id">
      <li>
        {{$data.text}}
        <button on:click="$host.removeItem($data.id)">删除</button>
      </li>
    </o-fill>
  </ul>

  <script>
    let nextId = 1;

    export default async () => ({
      data: {
        draft: "",
        items: [{ id: nextId++, text: "学习 ofa.js" }],
      },
      proto: {
        add() {
          const text = this.draft.trim();
          if (!text) return;
          this.items.push({ id: nextId++, text });
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

  "lesson-4": `<template page>
${BASE_STYLE}
  <style>
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .done span {
      color: #94a3b8;
      text-decoration: line-through;
    }
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

  <o-fill :value="items" fill-key="id">
    <li class:done="$data.done">
      <input type="checkbox" sync:checked="$data.done" />
      <span>{{$data.text}}</span>
      <button on:click="$host.removeItem($data.id)">删除</button>
    </li>
  </o-fill>

  <p>还剩 {{remaining}} 项未完成。</p>

  <script>
    let nextId = 1;

    export default async () => ({
      data: {
        draft: "",
        items: [
          { id: nextId++, text: "阅读 ofa.js 文档", done: true },
          { id: nextId++, text: "写一个组件", done: false },
        ],
      },
      proto: {
        get remaining() {
          return this.items.filter((item) => !item.done).length;
        },
        addOnEnter(event) {
          if (event.key !== "Enter") return;
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

  "lesson-5": `<template page>
${BASE_STYLE}
  <style>
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
    .level {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      background: #e8f1fb;
      color: #0061a4;
      font-size: 13px;
    }
  </style>

  <h1>个人卡片</h1>

  <div class="card" class:active="active">
    <span class="level" :style.background="active ? '#0061a4' : '#e8f1fb'" :style.color="active ? '#fff' : '#0061a4'">
      {{levelText}}
    </span>
    <h2>{{name}}</h2>
    <p>{{bio}}</p>
    <button on:click="active = !active">
      {{active ? '取消选中' : '选中卡片'}}
    </button>
  </div>

  <script>
    export default async () => ({
      data: {
        name: "Yao",
        bio: "正在学习 ofa.js。",
        active: false,
      },
      proto: {
        get levelText() {
          return this.active ? "已选中" : "普通卡片";
        },
      },
    });
  </script>
</template>`,
};
