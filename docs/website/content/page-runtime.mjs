/**
 * 官网中间内容的共享运行时（所有语言共用）。
 *
 * 各语言 index.html 只保留结构与文案，通过：
 *
 *   import { createLandingPage } from "../../website/content/page-runtime.mjs";
 *   export default (args) => createLandingPage(args);
 *
 * 复用这里的交互逻辑。构建时路径会被改写为 ../content/page-runtime.mjs。
 */

let uid = 100;

export const CDN_URL =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";

export const createLandingPage = async ({ url }) => {
  const res = await fetch(new URL("./site.json", url));
  if (!res.ok) {
    throw new Error("Failed to load site.json: " + res.status);
  }
  const site = await res.json();

  const todos = site.demo.todos.map((text, index) => ({
    id: index + 1,
    text,
    done: index === 0,
  }));

  return {
    data: {
      site,
      toastVisible: false,
      toastText: "",
      draft: "",
      todos,
      remaining: todos.filter((item) => !item.done).length,
      doneCount: todos.filter((item) => item.done).length,
      cdnUrl: CDN_URL,
      cdnSnippet: `<script type="module" src="${CDN_URL}"><\/script>`,
    },

    watch: {
      todos() {
        this.refreshStats();
      },
    },

    proto: {
      addTodo() {
        const text = this.draft.trim();
        if (!text) return;
        this.todos.push({ id: ++uid, text, done: false });
        this.draft = "";
        this.refreshStats();
      },

      addOnEnter(event) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        this.addTodo();
      },

      removeTodo(id) {
        const index = this.todos.findIndex((item) => item.id === id);
        if (index > -1) this.todos.splice(index, 1);
        this.refreshStats();
      },

      clearDone() {
        if (!this.doneCount) return;
        this.todos = this.todos.filter((item) => !item.done);
        this.refreshStats();
      },

      refreshStats() {
        const total = this.todos.length;
        let done = 0;
        for (const item of this.todos) {
          if (item.done) done += 1;
        }
        this.doneCount = done;
        this.remaining = total - done;
      },

      showToast(message) {
        this.toastText = message;
        this.toastVisible = true;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
          this.toastVisible = false;
        }, 1800);
      },

      async copySnippet(text) {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            const area = document.createElement("textarea");
            area.value = text;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            document.execCommand("copy");
            area.remove();
          }
          this.showToast(this.site.toast.copied);
        } catch (error) {
          console.warn("[ofa] copy failed", error);
          this.showToast(this.site.toast.failed);
        }
      },
    },

    ready() {
      const root = this.ele.shadowRoot;
      if (!root) return;

      if ("IntersectionObserver" in window) {
        this.ele.classList.add("js-reveal");
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
        );
        root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
        this._observer = observer;
      }

      this.refreshStats();
    },

    detached() {
      if (this._observer) this._observer.disconnect();
      clearTimeout(this._toastTimer);
    },
  };
};
