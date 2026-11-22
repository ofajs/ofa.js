/**
 * English default code and virtual page entry for the docs playground.
 * Pure data only: keep this module free of DOM/document references so it can
 * be imported in any environment.
 */

export const DEFAULT_CODE_EN = `<template page>
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
  <p>This is an ofa.js page running inside a NoneOS virtual container.</p>
  <button on:click="count++">Clicked {{count}} times</button>

  <script>
    export default async () => ({
      data: {
        name: "ofa.js",
        count: 0,
      },
    });
  </script>
</template>`;

export const LESSONS_EN = {
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
  <p>This is the first ofa.js page for {{name}}.</p>

  <script>
    export default async () => ({
      data: {
        greeting: "Hello, ofa.js",
        name: "World",
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
  <p>Age: {{user.age}}, {{user.age + 1}} next year.</p>
  <p :html="note"></p>

  <script>
    export default async () => ({
      data: {
        user: {
          name: "Yao",
          bio: "Learning ofa.js",
          age: 28,
        },
        note: "<strong>This HTML comes from data.note</strong>",
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

  <h1>Dynamic attributes</h1>
  <p><a attr:href="url" attr:title="linkTitle">Open the ofa.js website</a></p>
  <p><input :value="name" /></p>
  <p>Button state: {{ready ? "Enabled" : "Disabled"}}</p>
  <button attr:disabled="!ready" on:click="ready = true">I have read it</button>

  <script>
    export default async () => ({
      data: {
        url: "https://ofajs.com",
        linkTitle: "Links to the ofa.js website",
        name: "This is the DOM value property",
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

  <h1>Styles and classes</h1>

  <div class="card" class:active="active">
    <span
      class="badge"
      :style.background="active ? '#0061a4' : '#e8f1fb'"
      :style.color="active ? '#fff' : '#0061a4'"
    >{{active ? "Enabled" : "Disabled"}}</span>
    <h2>{{name}}</h2>
    <button on:click="active = !active">Toggle state</button>
  </div>

  <script>
    export default async () => ({
      data: {
        name: "Yao's card",
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

  <h1>Events</h1>
  <p>Count: <strong>{{count}}</strong></p>
  <button on:click="count++">+1 (inline expression)</button>
  <button on:click="decrement">-1 (proto method)</button>
  <button on:click="reset">Reset</button>

  <p>
    <input on:input="onNameInput($event)" placeholder="Enter a name" />
    Hello, {{name}}
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

  <h1>Two-way binding</h1>
  <p><input sync:value="name" placeholder="Name" /></p>
  <p>
    <textarea sync:value="bio" rows="3" placeholder="Bio"></textarea>
  </p>
  <p>
    <label>
      <input type="checkbox" sync:checked="subscribe" />
      Subscribe to updates
    </label>
  </p>
  <p>
    <select sync:value="role">
      <option value="dev">Developer</option>
      <option value="design">Designer</option>
      <option value="reader">Reader</option>
    </select>
  </p>

  <p>Preview: {{name}} / {{role}} / {{subscribe ? "Subscribed" : "Not subscribed"}}</p>
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

  <h1>Conditional rendering</h1>
  <p>Score: <strong>{{score}}</strong></p>
  <p>
    <button on:click="score = 95">95</button>
    <button on:click="score = 72">72</button>
    <button on:click="score = 40">40</button>
  </p>

  <o-if :value="score >= 90">
    <p class="ok">Excellent</p>
  </o-if>
  <o-else-if :value="score >= 60">
    <p class="warn">Pass</p>
  </o-else-if>
  <o-else>
    <p class="bad">Needs work</p>
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

  <h1>List rendering</h1>
  <ul>
    <o-fill :value="items" fill-key="id">
      <li>
        {{$index + 1}}. {{$data.text}}
        <button on:click="$host.removeItem($data.id)">Delete</button>
      </li>
    </o-fill>
  </ul>
  <p>{{items.length}} items total</p>

  <script>
    let nextId = 1;

    export default async () => ({
      data: {
        items: [
          { id: nextId++, text: "Learn ofa.js" },
          { id: nextId++, text: "Build a page" },
          { id: nextId++, text: "Deploy to a static server" },
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

  <h1>Editable list</h1>
  <button on:click="add">Add a row</button>
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
          { id: nextId++, name: "Item one" },
          { id: nextId++, name: "Item two" },
        ],
      },
      proto: {
        add() {
          this.items.push({ id: nextId++, name: "New item" });
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

  <h1>Computed properties and watchers</h1>
  <p>Unit price: {{price}} yuan</p>
  <p>
    Quantity:
    <button on:click="qty = Math.max(1, qty - 1)">-</button>
    <strong>{{qty}}</strong>
    <button on:click="qty++">+</button>
  </p>
  <p>Total: <span class="total">{{total}}</span> yuan</p>
  <p class="log">{{log}}</p>

  <script>
    export default async () => ({
      data: {
        price: 99,
        qty: 1,
        log: "Quantity has not changed yet",
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
            "Quantity changed from " + watchers[0].oldValue + " to " + value;
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

  <h1>Lifecycle</h1>
  <p>Page has been running for <strong>{{seconds}}</strong> seconds</p>
  <p>Status: {{status}}</p>
  <p>
    <button on:click="running = !running">
      {{running ? "Pause" : "Resume"}}
    </button>
  </p>

  <script>
    export default async () => ({
      data: {
        seconds: 0,
        running: true,
        status: "Preparing",
      },
      ready() {
        this.status = "DOM is ready";
      },
      attached() {
        this.status = "Mounted, timer started";
        this._timer = setInterval(() => {
          if (this.running) this.seconds += 1;
        }, 1000);
      },
      detached() {
        clearInterval(this._timer);
        this.status = "Unmounted";
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

  <h1>Components are reusable</h1>
  <p>The two cards below come from the same component, but each keeps its own independent count.</p>

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

  <h2>Hello, component</h2>
  <p>This card has been clicked {{count}} times.</p>
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

  <h1>Passing props to components</h1>
  <p><input sync:value="name" placeholder="Name" /></p>

  <l-m src="./user-chip.html"></l-m>
  <user-chip attr:name="name" role="Reader" start-level="2"></user-chip>
  <user-chip name="Yao" role="Maintainer" start-level="5"></user-chip>

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
        name: "Guest",
        role: "Reader",
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

  <h1>Slots and custom events</h1>

  <l-m src="./confirm-box.html"></l-m>
  <confirm-box on:confirm="onConfirm">
    <strong>Save changes?</strong>
    <span slot="hint">Your draft will not be lost</span>
  </confirm-box>

  <p>Last confirmed: {{message}}</p>

  <script>
    export default {
      data: { message: "Not confirmed yet" },
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
    <small><slot name="hint">Default hint</slot></small>
    <button on:click="emitConfirm">Confirm</button>
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

  <h1>Cross-layer context</h1>
  <p>The first two cards are inside a provider; the last one falls back to the root-provider.</p>

  <l-m src="./profile-card.html"></l-m>

  <o-root-provider
    name="user"
    user-name="Default user"
    user-role="Guest"
  ></o-root-provider>

  <o-provider
    id="user-provider"
    name="user"
    user-name="Yao"
    user-role="Maintainer"
  >
    <profile-card></profile-card>
    <profile-card></profile-card>
  </o-provider>

  <profile-card></profile-card>

  <button on:click="switchUser">Switch provider user</button>

  <script>
    export default {
      data: { alternate: false },
      proto: {
        switchUser() {
          const provider = this.shadow.$("#user-provider");
          this.alternate = !this.alternate;
          provider.userName = this.alternate ? "Ada" : "Yao";
          provider.userRole = this.alternate ? "Reader" : "Maintainer";
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
      data: { name: "Guest", role: "Reader" },
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

  <h1>Global state</h1>
  <p>Both panels reference the same store, so the number always stays in sync.</p>

  <l-m src="./counter-panel.html"></l-m>
  <counter-panel></counter-panel>
  <counter-panel></counter-panel>

  <p>
    <button on:click="increase">+1</button>
    <button on:click="reset">Reset</button>
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
    <span>{{sharedState.label}}</span>
    <strong>{{sharedState.count}}</strong>
  </div>

  <script>
    import { store } from "./store.mjs";

    export default {
      tag: "counter-panel",
      data: { sharedState: {} },
      attached() {
        this.sharedState = store;
      },
      detached() {
        this.sharedState = {};
      },
    };
  </script>
</template>`,
    "store.mjs": `export const store = $.stanz({ label: "Shared panel", count: 0 });`,
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

  <h1>Home</h1>
  <p><a olink href="./about.html?from=home-link">Go to the About page with olink</a></p>
  <button on:click="goto('./about.html?from=home-button')">
    Go to the About page with goto
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

  <h1>About</h1>
  <p>Source parameter: {{from}}</p>
  <button on:click="back">Go back</button>

  <script>
    export default async ({ query }) => ({
      data: {
        from: query.from || "direct visit",
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
    >Home</a>
    <a
      olink
      href="./settings.html"
      class:active="current === 'settings'"
    >Settings</a>
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
  <h1>Home</h1>
  <p>When switching subpages, the navigation and layout are not rebuilt.</p>
  <script>
    export const parent = "./layout.html";
    export default { data: {} };
  </script>
</template>`,
    "settings.html": `<template page>
  <h1>Settings</h1>
  <p>This is another subpage; the parent page is always preserved.</p>
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

  <h1>Async and loading states</h1>
  <p>
    <label>
      <input type="checkbox" sync:checked="failNext" />
      Simulate a failed request
    </label>
  </p>
  <button on:click="fetchUser" attr:disabled="status === 'loading'">
    Reload
  </button>

  <div class="box">
    <o-if :value="status === 'loading'">
      <p>Loading…</p>
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
            if (this.failNext) throw new Error("Network hiccup, please try again");
            this.user = { name: "Yao", role: "Learning ofa.js" };
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

  <h1>Todo list</h1>
  <p>
    <input
      sync:value="draft"
      on:keydown="addOnEnter($event)"
      placeholder="Type and press Enter"
    />
    <button on:click="add">Add</button>
  </p>

  <p class="filters">
    <button class:active="filterMode === 'all'" on:click="filterMode = 'all'">All</button>
    <button class:active="filterMode === 'active'" on:click="filterMode = 'active'">Active</button>
    <button class:active="filterMode === 'done'" on:click="filterMode = 'done'">Completed</button>
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

  <p>{{remaining}} items remaining; data is saved to the browser automatically.</p>

  <script>
    const KEY = "ofa-tutorial-todos";
    let nextId = 1;

    export default async () => ({
      data: {
        draft: "",
        filterMode: "all",
        items: [
          { id: nextId++, text: "Learn ofa.js", done: true },
          { id: nextId++, text: "Build a component", done: false },
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
