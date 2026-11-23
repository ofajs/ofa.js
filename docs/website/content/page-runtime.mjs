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
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5/dist/ofa.min.mjs";

const loadSite = async (url, sitePath = "./site.json") => {
  const res = await fetch(new URL(sitePath, url));

  if (!res.ok) {
    throw new Error("Failed to load site.json: " + res.status);
  }

  return res.json();
};

const getNavUrls = (url, docs = false) => {
  if (docs) {
    return {
      home: new URL("../", url).href,
      docs: new URL("./", url).href,
      tutorial: new URL("../tutorial/", url).href,
      firstLesson: new URL("../tutorial/lesson-1.html", url).href,
      api: new URL("../api/", url).href,
      blog: new URL("../blog/", url).href,
      searchIndex: new URL("../search-index.json", url).href,
      languages: new URL("../../?choose=1", url).href,
    };
  }

  return {
    home: new URL("./", url).href,
    docs: new URL("./docs/", url).href,
    tutorial: new URL("./tutorial/", url).href,
    firstLesson: new URL("./tutorial/lesson-1.html", url).href,
    api: new URL("./api/", url).href,
    blog: new URL("./blog/", url).href,
    searchIndex: new URL("./search-index.json", url).href,
    languages: new URL("../?choose=1", url).href,
  };
};

export const createLandingPage = async ({ url, sitePath }) => {
  const site = await loadSite(url, sitePath);
  const isEnglish =
    document.documentElement.lang.startsWith("en") ||
    document.documentElement.lang.startsWith("ja") ||
    document.documentElement.lang.startsWith("es");

  const codeZh = {
    hero: `<template component>
  <style>
    :host { display: grid; }
  </style>

  <h3>Hello, {{name}}</h3>
  <button on:click="count++">
    点了 {{count}} 次
  </button>

  <script>
    export default {
      tag: "hello-ofa",
      data: {
        name: "ofa.js",
        count: 0,
      },
    };
  <\/script>
</template>`,
    mini: `<template component>
  <h3>Hello, {{name}}</h3>
  <button on:click="count++">
    点了 {{count}} 次
  </button>

  <script>
    export default {
      tag: "hello-ofa",
      data: { name: "ofa.js", count: 0 },
    };
  <\/script>
</template>`,
    page: `<template page>
  <h1>Hello, {{name}}</h1>
  <button on:click="count++">
    点了 {{count}} 次
  </button>

  <script>
    export default async () => ({
      data: { name: "ofa.js", count: 0 },
    });
  <\/script>
</template>`,
    terminal: `$ npx serve .

# 或任意静态服务器
$ python3 -m http.server

# 打开 http://localhost:3000`,
  };

  const codeEn = {
    hero: `<template component>
  <style>
    :host { display: grid; }
  </style>

  <h3>Hello, {{name}}</h3>
  <button on:click="count++">
    Clicked {{count}} times
  </button>

  <script>
    export default {
      tag: "hello-ofa",
      data: {
        name: "ofa.js",
        count: 0,
      },
    };
  <\/script>
</template>`,
    mini: `<template component>
  <h3>Hello, {{name}}</h3>
  <button on:click="count++">
    Clicked {{count}} times
  </button>

  <script>
    export default {
      tag: "hello-ofa",
      data: { name: "ofa.js", count: 0 },
    };
  <\/script>
</template>`,
    page: `<template page>
  <h1>Hello, {{name}}</h1>
  <button on:click="count++">
    Clicked {{count}} times
  </button>

  <script>
    export default async () => ({
      data: { name: "ofa.js", count: 0 },
    });
  <\/script>
</template>`,
    terminal: `$ npx serve .

# or any static server
$ python3 -m http.server

# open http://localhost:3000`,
  };

  const LANDING_CODE = isEnglish ? codeEn : codeZh;

  const todos = site.demo.todos.map((text, index) => ({
    id: index + 1,
    text,
    done: index === 0,
  }));

  return {
    data: {
      site,
      navUrls: getNavUrls(url),
      toastVisible: false,
      toastText: "",
      draft: "",
      todos,
      remaining: todos.filter((item) => !item.done).length,
      doneCount: todos.filter((item) => item.done).length,
      cdnUrl: CDN_URL,
      cdnSnippet: `<script type="module" src="${CDN_URL}"><\/script>`,
      skillUrl:
        "https://raw.githubusercontent.com/ofajs/ofa.js/main/.agents/skills/ofajs-docs.zip",
      githubUrl: "https://github.com/ofajs/ofa.js",

      // st-code 展示用的代码样例（字符串绑定 :code，绕开 ofa 对 {{...}} 的插值编译）
      codeHero: LANDING_CODE.hero,
      codeMini: LANDING_CODE.mini,
      codePage: LANDING_CODE.page,
      codeTerminal: LANDING_CODE.terminal,
    },

    watch: {
      todos() {
        this.refreshStats();
      },
    },

    proto: {
      jump(id) {
        const target = this.ele.shadowRoot?.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },

      openExternal(url) {
        if (url) window.open(url, "_blank", "noopener");
      },

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

      copySkill() {
        return this.copySnippet(this.skillUrl);
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

export const createDocsPage = async ({ url, sitePath }) => {
  const site = await loadSite(url, sitePath);

  return {
    data: {
      site,
      navUrls: getNavUrls(url, true),
    },
    ready() {
      window.scrollTo(0, 0);
    },
  };
};

/**
 * 顶层布局页（layout.html）的页面数据。
 * 由所有内容页通过 export const parent 挂入，负责常驻的 header/footer，
 * 以及文档路由下的左侧文档目录。
 */
export const createTutorialPage = async ({ url, sitePath }) => {
  const site = await loadSite(url, sitePath);

  return {
    data: {
      site,
      navUrls: getNavUrls(url),
    },
    ready() {
      window.scrollTo(0, 0);
    },
  };
};

// 从当前地址推导布局模式。必须在首帧渲染前就得到正确值：若等 attached
// 再同步，文档页会先以 no-nav（整行、左上角）渲染一帧再跳到左侧目录旁。
const readRoute = () => {
  const path = location.pathname;
  const file = path.replace(/\/+$/, "").split("/").pop();
  const apiMode = /\/api(?:\/|$)/.test(path);

  return {
    docsMode: /\/docs(?:\/|$)/.test(path),
    tutorialMode: /\/tutorial(?:\/|$)/.test(path),
    apiMode,
    apiKey: apiMode
      ? path.endsWith("/") || path.endsWith("/api")
        ? "index"
        : file.replace(/\.html$/, "")
      : "",
    current:
      !file || file === "index.html" ? "index" : file.replace(/\.html$/, ""),
  };
};

const SEARCH_HIGHLIGHT = "site-search";
const SEARCH_MARK_CLASS = "site-search-hit";

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTerms = (query) => {
  const terms = [query.trim()];
  for (const part of query.trim().split(/\s+/)) {
    if (part && !terms.includes(part)) terms.push(part);
  }
  return terms.filter(Boolean).sort((a, b) => b.length - a.length);
};

const getSearchTextNodes = (root) => {
  const nodes = [];
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.nodeValue.trim()) nodes.push(child);
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      if (["SCRIPT", "STYLE", "TEXTAREA", "CODE-EDITOR"].includes(child.tagName)) {
        continue;
      }
      walk(child);
    }
  };
  walk(root);
  return nodes;
};

const clearSearchMarks = (pageEl) => {
  const root = pageEl?.shadowRoot;
  if (!root) return;
  for (const mark of [...root.querySelectorAll("mark." + SEARCH_MARK_CLASS)]) {
    mark.replaceWith(document.createTextNode(mark.textContent));
  }
  if (window.CSS?.highlights) CSS.highlights.delete(SEARCH_HIGHLIGHT);
};

const scrollFirstRangeIntoView = (range) => {
  requestAnimationFrame(() => {
    const rect = range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return;
    // 已经出现在可视区中部时不强行滚动，避免把标题滚出屏幕
    if (rect.top >= 80 && rect.top <= window.innerHeight - 160) return;
    const top = rect.top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  });
};

const highlightSearchPage = (pageEl, query) => {
  const root = pageEl?.shadowRoot;
  if (!root) return false;

  clearSearchMarks(pageEl);

  const terms = getSearchTerms(query);
  if (!terms.length) return false;

  const regex = new RegExp("(" + terms.map(escapeRegExp).join("|") + ")", "gi");
  const nodes = getSearchTextNodes(root);

  if (window.CSS?.highlights && typeof Highlight === "function") {
    const ranges = [];
    for (const node of nodes) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(node.nodeValue))) {
        if (!match[0]) {
          regex.lastIndex += 1;
          continue;
        }
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        ranges.push(range);
      }
    }

    if (!ranges.length) return false;
    CSS.highlights.set(SEARCH_HIGHLIGHT, new Highlight(...ranges));
    scrollFirstRangeIntoView(ranges[0]);
    return true;
  }

  let firstMark = null;
  for (const node of nodes) {
    regex.lastIndex = 0;
    if (!regex.test(node.nodeValue)) continue;

    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      if (!match[0]) {
        regex.lastIndex += 1;
        continue;
      }
      fragment.append(text.slice(lastIndex, match.index));
      const mark = document.createElement("mark");
      mark.className = SEARCH_MARK_CLASS;
      mark.textContent = match[0];
      fragment.append(mark);
      if (!firstMark) firstMark = mark;
      lastIndex = match.index + match[0].length;
    }
    fragment.append(text.slice(lastIndex));
    node.replaceWith(fragment);
  }

  if (firstMark) {
    requestAnimationFrame(() => {
      firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  return !!firstMark;
};

export const createLayoutPage = async ({ url, sitePath }) => {
  const site = await loadSite(url, sitePath);
  const navUrls = getNavUrls(url);

  return {
    data: {
      site,
      navUrls,
      ...readRoute(),
    },
    watch: {
      current() {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.scrollActiveDocIntoView());
        });
      },
    },
    attached() {
      this.syncRoute();
      this.applySearchHighlight();
    },
    routerChange() {
      this.syncRoute();
      window.scrollTo(0, 0);
      this.applySearchHighlight();
    },
    proto: {
      syncRoute() {
        const { docsMode, tutorialMode, apiMode, apiKey, current } =
          readRoute();
        this.docsMode = docsMode;
        this.tutorialMode = tutorialMode;
        this.apiMode = apiMode;
        this.apiKey = apiKey;
        this.current = current;
      },
      scrollActiveDocIntoView() {
        const nav = [...(this.ele.shadowRoot?.querySelectorAll(".docs-nav") || [])].find(
          (item) => !item.classList.contains("is-hidden"),
        );
        const active = nav?.querySelector("st-list-item.active");
        if (!nav || !active) return;

        const navRect = nav.getBoundingClientRect();
        const itemRect = active.getBoundingClientRect();
        if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
          nav.scrollTop += itemRect.top - navRect.top - 16;
        }
      },
      navigateDocs(key) {
        const url =
          key === "index"
            ? this.navUrls.docs
            : new URL(`${key}.html`, this.navUrls.docs).href;
        if (!url) return;

        const app = (window.$ ? window.$(this.ele) : this.ele).app;
        if (app?.goto) {
          app.goto(url);
        } else {
          location.href = url;
        }
      },
      applySearchHighlight() {
        const query =
          new URL(location.href).searchParams.get("search") || "";

        clearSearchMarks(this.app?.current?.ele);

        const token = (this._searchHighlightToken || 0) + 1;
        this._searchHighlightToken = token;

        if (!query) return;

        const tryHighlight = (attempt = 0) => {
          if (token !== this._searchHighlightToken) return;
          const current = this.app?.current;
          if (!current?.ele?.shadowRoot || !current.ele.isConnected) {
            if (attempt < 60) {
              requestAnimationFrame(() => tryHighlight(attempt + 1));
            }
            return;
          }
          highlightSearchPage(current.ele, query);
        };

        requestAnimationFrame(() => tryHighlight());
      },
      navigateApi(key) {
        const url =
          key === "index"
            ? this.navUrls.api
            : new URL(`${key}.html`, this.navUrls.api).href;
        if (!url) return;

        const app = (window.$ ? window.$(this.ele) : this.ele).app;
        if (app?.goto) {
          app.goto(url);
        } else {
          location.href = url;
        }
      },
      navigateTutorial(key) {
        const url =
          key === "index"
            ? this.navUrls.tutorial
            : new URL(`${key}.html`, this.navUrls.tutorial).href;
        if (!url) return;

        const app = (window.$ ? window.$(this.ele) : this.ele).app;
        if (app?.goto) {
          app.goto(url);
        } else {
          location.href = url;
        }
      },
    },
  };
};

