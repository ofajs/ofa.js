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

Object.assign(LESSONS, {
  "lesson-6": `<template page>
${BASE_STYLE}
  <style>
    .empty { color: #64748b; }
    li { margin: 6px 0; }
  </style>

  <h1>搜索与过滤</h1>
  <p><input sync:value="keyword" placeholder="输入关键字搜索" /></p>

  <o-if :value="filtered.length === 0">
    <p class="empty">没有匹配的结果。</p>
  </o-if>

  <ul>
    <o-fill :value="filtered" fill-key="id">
      <li>{{$data.name}} · {{$data.tag}}</li>
    </o-fill>
  </ul>

  <script>
    export default async () => ({
      data: {
        keyword: "",
        items: [
          { id: 1, name: "ofa.js", tag: "框架" },
          { id: 2, name: "drill", tag: "加载器" },
          { id: 3, name: "stanz", tag: "响应式" },
          { id: 4, name: "xhear", tag: "Web Components" },
        ],
      },
      proto: {
        get filtered() {
          const keyword = this.keyword.trim().toLowerCase();
          if (!keyword) return this.items;
          return this.items.filter(
            (item) =>
              item.name.toLowerCase().includes(keyword) ||
              item.tag.toLowerCase().includes(keyword),
          );
        },
      },
    });
  </script>
</template>`,

  "lesson-7": `<template page>
${BASE_STYLE}
  <style>
    .field { margin: 10px 0; }
    .error { margin: 4px 0 0; color: #dc2626; font-size: 13px; }
    .ok { color: #15803d; }
  </style>

  <h1>表单校验</h1>
  <form on:submit="onSubmit($event)">
    <div class="field">
      <input sync:value="name" placeholder="姓名" />
      <o-if :value="nameError"><p class="error">{{nameError}}</p></o-if>
    </div>

    <div class="field">
      <input sync:value="email" placeholder="邮箱" />
      <o-if :value="emailError"><p class="error">{{emailError}}</p></o-if>
    </div>

    <button attr:disabled="!valid">提交</button>
  </form>

  <p class="ok">{{message}}</p>

  <script>
    export default async () => ({
      data: {
        name: "",
        email: "",
        message: "",
      },
      proto: {
        get nameError() {
          return this.name.trim() ? "" : "请输入姓名";
        },
        get emailError() {
          if (!this.email.trim()) return "请输入邮箱";
          return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.email)
            ? ""
            : "邮箱格式不正确";
        },
        get valid() {
          return !this.nameError && !this.emailError;
        },
        onSubmit(event) {
          event.preventDefault();
          if (!this.valid) return;
          this.message = "提交成功：" + this.name + " / " + this.email;
        },
      },
    });
  </script>
</template>`,

  "lesson-8": `<template page>
${BASE_STYLE}
  <style>
    .row { margin: 10px 0; }
    .total { font-size: 28px; font-weight: 700; color: #0061a4; }
    .log { color: #64748b; }
  </style>

  <h1>计算属性与侦听</h1>

  <p class="row">单价：<strong>{{price}}</strong> 元</p>
  <p class="row">
    数量：
    <button on:click="qty = Math.max(1, qty - 1)">-1</button>
    <strong>{{qty}}</strong>
    <button on:click="qty++">+1</button>
  </p>

  <p>总价：<span class="total">¥{{total}}</span></p>
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
          this.log = "数量从 " + watchers[0].oldValue + " 变成 " + value;
        },
      },
    });
  </script>
</template>`,

  "lesson-9": `<template page>
${BASE_STYLE}

  <h1>使用组件</h1>
  <p>下面的计数器不是本页面写的，而是通过 <code>l-m</code> 引入的组件。</p>

  <l-m src="/components/demo-counter.html"></l-m>
  <demo-counter start="5" reset-label="归零"></demo-counter>

  <p style="margin-top: 16px; color: #64748b">
    组件内部有独立的 data，外部通过 <code>start</code> 和
    <code>reset-label</code> 传入 attrs。
  </p>

  <script>
    export default async () => ({ data: {} });
  </script>
</template>`,

  "lesson-10": `<template page>
${BASE_STYLE}
  <style>
    li { display: flex; gap: 8px; align-items: center; margin: 8px 0; }
  </style>

  <h1>行内编辑列表</h1>
  <p><button on:click="add">添加一行</button></p>

  <o-fill :value="items" fill-key="id">
    <li>
      <input sync:value="$data.name" />
      <button on:click="$host.removeItem($data.id)">删除</button>
    </li>
  </o-fill>

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

  "lesson-11": `<template page>
${BASE_STYLE}
  <style>
    .panel {
      display: inline-block;
      margin: 8px 12px 8px 0;
      padding: 16px 24px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
    }
  </style>

  <h1>全局状态</h1>
  <p>两个面板读取同一份 <code>$.stanz</code> 状态。</p>

  <div class="panel">面板 A：<strong>{{count}}</strong></div>
  <div class="panel">面板 B：<strong>{{count}}</strong></div>

  <p>
    <button on:click="increase">全局 +1</button>
    <button on:click="reset">归零</button>
  </p>

  <script>
    const store = $.stanz({ count: 0 });

    export default async () => ({
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
      proto: {
        increase() {
          store.count += 1;
        },
        reset() {
          store.count = 0;
        },
      },
    });
  </script>
</template>`,

  "lesson-12": `<template page>
${BASE_STYLE}

  <h1>本地持久化</h1>
  <p>写下内容后刷新右侧预览，内容仍然存在。</p>

  <textarea
    sync:value="note"
    rows="6"
    style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px"
    placeholder="写点什么…"
  ></textarea>

  <p style="color: #64748b">已保存 {{note.length}} 个字符</p>

  <script>
    const KEY = "ofa-tutorial-lesson-12-note";

    export default async () => ({
      data: { note: "" },
      ready() {
        try {
          this.note = localStorage.getItem(KEY) || "";
        } catch {}
      },
      watch: {
        note(value) {
          try {
            localStorage.setItem(KEY, value);
          } catch {}
        },
      },
    });
  </script>
</template>`,

  "lesson-13": `<template page>
${BASE_STYLE}
  <style>
    .box {
      max-width: 380px;
      padding: 20px;
      border: 1px solid #dbe3ef;
      border-radius: 12px;
    }
    .muted { color: #64748b; }
  </style>

  <h1>异步与加载态</h1>
  <button on:click="load">重新加载</button>

  <div class="box">
    <o-if :value="loading">
      <p class="muted">加载中…</p>
    </o-if>
    <o-else-if :value="error">
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
        loading: true,
        error: "",
        user: { name: "", role: "" },
      },
      ready() {
        this.load();
      },
      proto: {
        async load() {
          this.loading = true;
          this.error = "";
          try {
            await new Promise((resolve) => setTimeout(resolve, 700));
            this.user = { name: "Yao", role: "正在学习 ofa.js" };
          } catch (e) {
            this.error = "加载失败：" + e.message;
          } finally {
            this.loading = false;
          }
        },
      },
    });
  </script>
</template>`,

  "lesson-14": `<template page>
${BASE_STYLE}
  <style>
    .profile {
      max-width: 520px;
      padding: 24px;
      border: 1px solid #dbe3ef;
      border-radius: 20px;
      transition: 0.2s ease;
    }
    .profile.active {
      border-color: #0061a4;
      box-shadow: 0 16px 36px rgba(0, 97, 164, 0.16);
    }
    .skill {
      display: inline-block;
      margin: 4px 6px 4px 0;
      padding: 3px 10px;
      border-radius: 999px;
      background: #e8f1fb;
      color: #0061a4;
      font-size: 13px;
    }
  </style>

  <h1>个人主页</h1>

  <div class="profile" class:active="active">
    <h2>{{name}}</h2>
    <p>{{bio}}</p>

    <p>
      <o-fill :value="skills">
        <span class="skill">{{$data}}</span>
      </o-fill>
    </p>

    <button on:click="active = !active">
      {{active ? '取消选中' : '选中主页'}}
    </button>
  </div>

  <p style="margin-top: 16px">
    <input sync:value="name" placeholder="名字" />
    <input sync:value="bio" placeholder="简介" />
    <button on:click="addSkill">添加技能</button>
  </p>

  <script>
    export default async () => ({
      data: {
        name: "Yao",
        bio: "正在用 ofa.js 写页面。",
        active: false,
        skills: ["HTML", "CSS", "ofa.js"],
      },
      proto: {
        addSkill() {
          this.skills.push("新技能 " + (this.skills.length + 1));
        },
      },
    });
  </script>
</template>`,
});
