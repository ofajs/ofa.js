/**
 * API 文档各页的默认可运行示例。
 * 结构与 playground-runtime 的 LESSONS 一致：{ entry, files }。
 */
import { API_EXAMPLES_EN } from "./api-examples-en.mjs";
import { API_EXAMPLES_TCN } from "./api-examples-t-cn.mjs";

export const API_EXAMPLES = {
  globalBody: {
    entry: "raw",
    files: {
      "index.html": `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>用全局 $ 操作 body</title>
    <style>
      body { margin: 0; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
      h1 { margin-top: 0; }
      #target { margin: 16px 0; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; }
      button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    </style>
  </head>
  <body>
    <h1>用全局 $ 操作 body</h1>
    <p>这些元素直接写在 body 里，没有 page 模块，也没有模板语法。</p>
    <div id="target">原始内容</div>
    <button id="change">点我用 $ 修改</button>

    <script
      type="module"
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5/dist/ofa.min.mjs"
    ></script>
    <script type="module">
      const target = $("#target");
      const change = $("#change");

      change.on("click", () => {
        target.text = "全局 $ 选中了 body 上的元素";
        target.css = { background: "#15803d", color: "#fff", padding: "12px" };
      });
    </script>
  </body>
</html>`,
    },
  },
  instance:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>实例基础</h1>
  <button class="demo" on:click="inspect">检查这个按钮</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "点击按钮，读取实例属性" },
      proto: {
        inspect() {
          const btn = this.shadow.$(".demo");
          this.info = [
            "tag=" + btn.tag,
            "index=" + btn.index,
            "xid=" + btn.xid,
            "PATH=" + (this.PATH || "").split("/").pop(),
          ].join(" · ");
          btn.ele.style.outline = "2px solid #0061a4";
        },
      },
    };
  </script>
</template>`,
    },
  },
  traverse:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>选择与遍历</h1>
  <ul id="list">
    <li>第一项</li>
    <li>第二项</li>
    <li>第三项</li>
  </ul>
  <button on:click="mark">遍历并标记</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "点击按钮查看兄弟节点" },
      proto: {
        mark() {
          const items = this.shadow.$("#list").all("li");
          const second = items[1];
          second.prev.class("hit", true);
          second.next.class("hit", true);
          this.info =
            "第二项前一个：" + second.prev.text +
            "；后一个：" + second.next.text;
        },
      },
    };
  </script>
  <style>
    .hit { color: #0061a4; font-weight: 700; }
  </style>
</template>`,
    },
  },
  structure:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>结构操作</h1>
  <ul id="list"><li>原有项</li></ul>
  <button on:click="addItem">新增</button>
  <button on:click="removeFirst">删除第一项</button>
  <button on:click="wrapSecond">包裹第二项</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { count: 0, info: "用方法直接操作 DOM" },
      proto: {
        addItem() {
          this.count += 1;
          this.shadow.$("#list").push("<li>新增项 " + this.count + "</li>");
          this.info = "push 后共有 " + this.shadow.$("#list").length + " 项";
        },
        removeFirst() {
          const first = this.shadow.$("#list")[0];
          if (first) first.remove();
          this.info = "remove 后共有 " + this.shadow.$("#list").length + " 项";
        },
        wrapSecond() {
          const second = this.shadow.$("#list")[1];
          if (!second) return;
          second.wrap("<div class='wrap' style='border:1px dashed #0061a4;padding:6px'></div>");
          this.info = "第二项已被 wrap 包裹";
        },
      },
    };
  </script>
</template>`,
    },
  },
  props:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <style>
    .box { padding: 16px; border: 1px solid #cbd5e1; border-radius: 10px; }
    .box.active { box-shadow: 0 0 0 2px #0061a4; }
  </style>

  <h1>内容、属性与样式</h1>
  <div id="box" class="box">原始内容</div>
  <button on:click="apply">更新内容与样式</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "等待操作" },
      proto: {
        apply() {
          const box = this.shadow.$("#box");
          box.text = "文本被 el.text 改写了";
          box.attr("data-state", "done");
          box.css = { background: "#e8f1fb", borderColor: "#0061a4" };
          box.class("active", true);
          this.info =
            "data-state=" + box.attr("data-state") +
            "，class 已加：" + box.class("active");
        },
      },
    };
  </script>
</template>`,
    },
  },
  events:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>事件</h1>
  <button id="btn" on:click="fire">发自定义事件</button>
  <p>{{log}}</p>

  <script>
    export default {
      data: { count: 0, log: "等待事件" },
      attached() {
        this._handler = (event) => {
          this.log = "收到事件：n=" + event.data.n;
        };
        this.shadow.$("#btn").on("custom", this._handler);
      },
      detached() {
        this.shadow.$("#btn").off("custom", this._handler);
      },
      proto: {
        fire() {
          this.count += 1;
          this.shadow.$("#btn").emit("custom", {
            data: { n: this.count },
            bubbles: true,
          });
        },
      },
    };
  </script>
</template>`,
    },
  },
  reactive:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>数据与侦听</h1>
  <p>计数：<strong>{{count}}</strong></p>
  <button on:click="bump">+1</button>
  <p>{{log}}</p>

  <script>
    export default {
      data: { count: 0, log: "等待变更" },
      attached() {
        this._tid = this.watch(() => {
          this.log = "watch 看到 count=" + this.count;
        });
      },
      detached() {
        if (this._tid != null) this.unwatch(this._tid);
      },
      proto: {
        bump() {
          this.count += 1;
        },
      },
    };
  </script>
</template>`,
    },
  },
  app:   {
    entry: "app",
    files: {
      "home.html": `<template page>
  <style>
    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }
    h1 { margin-top:0; }
    a { color:#0061a4; }
    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }
  </style>
  <h1>o-app 实例</h1>
  <p>当前页面：{{pageFile}}</p>
  <p><a olink href="./about.html?from=home">用 olink 去关于页</a></p>
  <button on:click="go">用 page.goto 跳转</button>

  <script>
    export default {
      data: { pageFile: "" },
      ready() {
        this.pageFile = this.src.split("/").pop();
      },
      proto: {
        go() {
          this.goto("./about.html?from=page-goto");
        },
      },
    };
  </script>
</template>`,
      "app.mjs": `export const home = "./home.html";`,
      "about.html": `<template page>
  <style>
    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }
    h1 { margin-top:0; }
    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }
  </style>
  <h1>关于页</h1>
  <p>来源参数：{{from}}</p>
  <p>应用当前页：{{appFile}}</p>
  <button on:click="back">返回上一页</button>

  <script>
    export default async ({ query }) => ({
      data: { from: query.from || "直接访问", appFile: "" },
      ready() {
        this.appFile = this.app.current.src.split("/").pop();
      },
    });
  </script>
</template>`,
    },
  },
  context:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }
    h1 { margin-top:0; }
    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }
    user-badge { display:block; margin:8px 0; }
  </style>

  <h1>上下文通信</h1>
  <l-m src="./user-badge.html"></l-m>

  <o-provider id="team" name="team" team-name="前端组" team-lead="Yao">
    <user-badge></user-badge>
    <user-badge></user-badge>
  </o-provider>

  <button on:click="rename">切换团队</button>

  <script>
    export default {
      data: { alternate: false },
      proto: {
        rename() {
          const provider = this.shadow.$("#team");
          this.alternate = !this.alternate;
          provider.teamName = this.alternate ? "设计组" : "前端组";
          provider.teamLead = this.alternate ? "Ada" : "Yao";
        },
      },
    };
  </script>
</template>`,
      "user-badge.html": `<template component>
  <style>
    :host { display:block; font-family:system-ui,sans-serif; }
    .badge { display:flex; gap:10px; padding:10px 14px; border:1px solid #dbe3ef; border-radius:10px; }
    strong { color:#111827; }
    span { color:#64748b; }
  </style>
  <div class="badge"><strong>{{name}}</strong><span>负责人：{{lead}}</span></div>
  <o-consumer
    name="team"
    watch:team-name="name"
    watch:team-lead="lead"
  ></o-consumer>
  <script>
    export default {
      tag: "user-badge",
      data: { name: "未分组", lead: "—" },
    };
  </script>
</template>`,
    },
  },
  global:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>

  <h1>全局 $ 静态成员</h1>
  <p>版本：{{version}}</p>
  <p>{{info}}</p>
  <button on:click="inspect">读取 $.all / $.Stanz</button>
  <button on:click="tick">$.nextTick</button>
  <ul><li>列表项 A</li><li>列表项 B</li></ul>

  <script>
    export default {
      data: {
        version: $.version,
        info: "点击按钮读取全局成员",
      },
      proto: {
        inspect() {
          const items = $.all("li");
          this.info =
            "$.all('li') 找到 " + items.length + " 项；" +
            "$.Stanz 类型：" + typeof $.Stanz;
        },
        tick() {
          $.nextTick(() => {
            this.info = "$.nextTick 回调已执行";
          });
        },
      },
    };
  </script>
</template>`,
    },
  },
  extend:   {
    entry: "page",
    files: {
      "page.html": `<template page>
  <style>
    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
    h1 { margin-top: 0; }
    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    p { line-height: 1.6; }
  </style>
  <h1>扩展实例</h1>
  <button id="btn" on:click="useCustom">调用扩展方法</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "等待调用" },
      ready() {
        this.shadow.$("#btn").extend({
          mark(text) {
            this.attr("data-mark", text);
            return "实例扩展方法被调用";
          },
        });
        $.fn.extend({
          get demoCount() {
            return $.all("*").length;
          },
        });
      },
      proto: {
        useCustom() {
          const btn = this.shadow.$("#btn");
          this.info = btn.mark("done") + "；全局实例数：" + btn.demoCount;
        },
      },
    };
  </script>
</template>`,
    },
  },
};

export const getApiExample = (
  key,
  english = document.documentElement.lang.startsWith("en"),
  traditional = document.documentElement.lang.startsWith("zh-Hant"),
) =>
  (english
    ? API_EXAMPLES_EN
    : traditional
      ? API_EXAMPLES_TCN
      : API_EXAMPLES)[key];
