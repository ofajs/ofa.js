/**
 * Default runnable examples for the API documentation pages.
 * Structure matches LESSONS in playground-runtime: { entry, files }.
 */
export const API_EXAMPLES_EN = {
  globalBody: {
    entry: "raw",
    files: {
      "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manipulate body with the global $</title>
    <style>
      body { margin: 0; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }
      h1 { margin-top: 0; }
      #target { margin: 16px 0; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; }
      button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }
    </style>
  </head>
  <body>
    <h1>Manipulate body with the global $</h1>
    <p>These elements live directly in body — there is no page module and no template syntax.</p>
    <div id="target">Original content</div>
    <button id="change">Click me to modify with $</button>

    <script
      type="module"
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5/dist/ofa.min.mjs"
    ></script>
    <script type="module">
      const target = $("#target");
      const change = $("#change");

      change.on("click", () => {
        target.text = "The global $ selected an element on body";
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
  <h1>Instance basics</h1>
  <button class="demo" on:click="inspect">Inspect this button</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "Click the button to read instance properties" },
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
  <h1>Selecting and traversing</h1>
  <ul id="list">
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
  <button on:click="mark">Traverse and mark</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "Click the button to inspect sibling nodes" },
      proto: {
        mark() {
          const items = this.shadow.$("#list").all("li");
          const second = items[1];
          second.prev.class("hit", true);
          second.next.class("hit", true);
          this.info =
            "Before the second item: " + second.prev.text +
            "; after it: " + second.next.text;
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
  <h1>Structural operations</h1>
  <ul id="list"><li>Existing item</li></ul>
  <button on:click="addItem">Add item</button>
  <button on:click="removeFirst">Remove first item</button>
  <button on:click="wrapSecond">Wrap second item</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { count: 0, info: "Manipulate the DOM directly with methods" },
      proto: {
        addItem() {
          this.count += 1;
          this.shadow.$("#list").push("<li>New item " + this.count + "</li>");
          this.info = "After push there are " + this.shadow.$("#list").length + " items";
        },
        removeFirst() {
          const first = this.shadow.$("#list")[0];
          if (first) first.remove();
          this.info = "After remove there are " + this.shadow.$("#list").length + " items";
        },
        wrapSecond() {
          const second = this.shadow.$("#list")[1];
          if (!second) return;
          second.wrap("<div class='wrap' style='border:1px dashed #0061a4;padding:6px'></div>");
          this.info = "The second item is now wrapped by wrap";
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

  <h1>Content, attributes, and styles</h1>
  <div id="box" class="box">Original content</div>
  <button on:click="apply">Update content and styles</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "Waiting for an action" },
      proto: {
        apply() {
          const box = this.shadow.$("#box");
          box.text = "The text was rewritten by el.text";
          box.attr("data-state", "done");
          box.css = { background: "#e8f1fb", borderColor: "#0061a4" };
          box.class("active", true);
          this.info =
            "data-state=" + box.attr("data-state") +
            ", class added: " + box.class("active");
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
  <h1>Events</h1>
  <button id="btn" on:click="fire">Emit a custom event</button>
  <p>{{log}}</p>

  <script>
    export default {
      data: { count: 0, log: "Waiting for an event" },
      attached() {
        this._handler = (event) => {
          this.log = "Received event: n=" + event.data.n;
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
  <h1>Data and watchers</h1>
  <p>Count: <strong>{{count}}</strong></p>
  <button on:click="bump">+1</button>
  <p>{{log}}</p>

  <script>
    export default {
      data: { count: 0, log: "Waiting for changes" },
      attached() {
        this._tid = this.watch(() => {
          this.log = "watch saw count=" + this.count;
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
  <h1>o-app instance</h1>
  <p>Current page: {{pageFile}}</p>
  <p><a olink href="./about.html?from=home">Go to About with olink</a></p>
  <button on:click="go">Navigate with page.goto</button>

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
  <h1>About</h1>
  <p>Source parameter: {{from}}</p>
  <p>Current app page: {{appFile}}</p>
  <button on:click="back">Go back</button>

  <script>
    export default async ({ query }) => ({
      data: { from: query.from || "Direct visit", appFile: "" },
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

  <h1>Context communication</h1>
  <l-m src="./user-badge.html"></l-m>

  <o-provider id="team" name="team" team-name="Frontend team" team-lead="Yao">
    <user-badge></user-badge>
    <user-badge></user-badge>
  </o-provider>

  <button on:click="rename">Switch team</button>

  <script>
    export default {
      data: { alternate: false },
      proto: {
        rename() {
          const provider = this.shadow.$("#team");
          this.alternate = !this.alternate;
          provider.teamName = this.alternate ? "Design team" : "Frontend team";
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
  <div class="badge"><strong>{{name}}</strong><span>Lead: {{lead}}</span></div>
  <o-consumer
    name="team"
    watch:team-name="name"
    watch:team-lead="lead"
  ></o-consumer>
  <script>
    export default {
      tag: "user-badge",
      data: { name: "Ungrouped", lead: "—" },
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

  <h1>Global $ static members</h1>
  <p>Version: {{version}}</p>
  <p>{{info}}</p>
  <button on:click="inspect">Read $.all / $.Stanz</button>
  <button on:click="tick">$.nextTick</button>
  <ul><li>List item A</li><li>List item B</li></ul>

  <script>
    export default {
      data: {
        version: $.version,
        info: "Click the button to read global members",
      },
      proto: {
        inspect() {
          const items = $.all("li");
          this.info =
            "$.all('li') found " + items.length + " items; " +
            "$.Stanz type: " + typeof $.Stanz;
        },
        tick() {
          $.nextTick(() => {
            this.info = "$.nextTick callback executed";
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
  <h1>Extending instances</h1>
  <button id="btn" on:click="useCustom">Call the extended method</button>
  <p>{{info}}</p>

  <script>
    export default {
      data: { info: "Waiting for a call" },
      ready() {
        this.shadow.$("#btn").extend({
          mark(text) {
            this.attr("data-mark", text);
            return "Instance extension method called";
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
          this.info = btn.mark("done") + "; global instance count: " + btn.demoCount;
        },
      },
    };
  </script>
</template>`,
    },
  },
};
