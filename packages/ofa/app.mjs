// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import {
  resolvePath,
  getPagesData,
  ISERROR,
  createPage,
  waitPageReaded,
} from "./public.mjs";
import { getDefault, getFailContent } from "./page.mjs";
import { createXEle } from "../xhear/util.mjs";
import { getErr } from "../ofa-error/main.js";

const HISTORY = "_history";
const FORWARDS = "_forwards";

const appendPage = async ({ src, app }) => {
  const { loading, fail } = app._module || {};

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    if (!loadingEl) {
      const err = getErr("loading_nothing");
      console.warn(err, loading);
      throw err;
    }

    app.push(loadingEl);
  }

  const oriNextPages = await getPagesData(src);

  // Snapshot current pages after await;
  // concurrent navigations (e.g. the initial hash goto racing with a
  // popstate-driven goto) would otherwise both see "no current page"
  // and append the same page twice.
  const currentPages = [];
  {
    const { current } = app;
    if (current) {
      currentPages.push(current);
      for (let page of current.parents) {
        if (page.tag !== "o-page") {
          break;
        }

        currentPages.unshift(page);
      }
    }
  }

  let container = app;

  const publicParents = []; // Public parent pages that have not been cleared
  const finalPages = [];
  let old;

  // Nested routing code
  // Keep the parent page with the same src
  let isSame = true;
  oriNextPages.forEach((e, index) => {
    const current = currentPages[index];

    if (!isSame) {
      finalPages.push(e);
      return;
    }

    if (!current || current.src !== e.src) {
      isSame = false;
      finalPages.push(e);
      old = current;
      return;
    }

    publicParents.push(current);

    container = current;
  });

  // In the case of only the parent page, the old variable needs to be corrected
  if (currentPages.length > oriNextPages.length && !old) {
    currentPages.some((e, index) => {
      const current = oriNextPages[index];

      if (!current || current.src !== e.src) {
        old = e;
        return true;
      }
    });
  }

  let topPage, innerPage;

  finalPages.forEach((pageData) => {
    const { ISERROR: isError } = pageData;

    let page;
    if (isError) {
      const failContent = getFailContent(pageData.src, pageData, fail);

      page = createPage(pageData.src, {
        type: $.PAGE,
        temp: failContent,
      });
    } else {
      page = createPage(pageData.src, pageData.defaults);
    }

    if (!topPage) {
      topPage = page;
      return;
    }

    if (!innerPage) {
      topPage.push(page);
      innerPage = page;
      return;
    }

    innerPage.push(page);
    innerPage = page;
  });

  if (topPage) {
    container.push(topPage);
  }

  loadingEl && loadingEl.remove();

  return { current: topPage, old, publics: publicParents };
};

// 触发父page的 routerChange 事件
const emitRouterChange = (_this, publics, type) => {
  if (publics && publics.length) {
    const { current } = _this;
    publics.forEach((page) => {
      // const { page } = e;
      const { routerChange } = page._defaults;

      if (routerChange) {
        routerChange.call(page, { type, current });
      }
    });
  }
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(*){display:block;width:100%;height:100%;}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {
    [HISTORY]: [],
    appIsReady: null,
    // _forwards: [],
  },
  watch: {
    async src(val) {
      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw getErr("app_src_change");
        }
        return;
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      let selfUrl = val;
      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        selfUrl = resolvePath(val);
      }

      const load = lm();

      const moduleData = await load(selfUrl);

      if (moduleData.allowForward) {
        this[FORWARDS] = [];
      }

      const defaults = await getDefault(moduleData, selfUrl);

      this._module = defaults;

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      if (this._settedRouters) {
        return;
      }

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }
    },
  },
  proto: {
    async forward(delta = 1) {
      if (!this[FORWARDS]) {
        const err = getErr("need_forwards");
        console.warn(err, this);
        return;
      }

      delta = delta < this[FORWARDS].length ? delta : this[FORWARDS].length;

      const forwardHistory = this[FORWARDS].splice(-delta);

      if (!forwardHistory.length) {
        const err = getErr("app_noforward");
        console.warn(err, {
          app: this,
        });
        return;
      }

      return this._navigate({
        type: "forward",
        src: forwardHistory[0].src,
        forwardHistory,
        delta,
      });
    },
    async back(delta = 1) {
      if (!this[HISTORY].length) {
        const err = getErr("app_noback");
        console.warn(err, {
          app: this,
        });
        return;
      }

      const oldRouters = this.routers;

      const { _noanime } = this;

      // Delete historical data for response numbers
      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src: newCurrent.src,
        app: this,
      });

      if (!_noanime && page) {
        await pageInAnime({
          page,
          key: "previous",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      const oldHis = oldRouters.slice(-1 * delta);

      if (this[FORWARDS]) {
        this[FORWARDS].push(...oldHis);
      }

      this.emit("router-change", {
        data: { name: "back", delta, historys: oldHis },
      });

      emitRouterChange(this, publics, "back");

      if (!_noanime && needRemovePage) {
        await pageOutAnime({
          page: needRemovePage,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage.remove();
      }
    },
    async _navigate(options) {
      let { type, src } = options;

      const { _noanime } = this;
      const { current: oldCurrent } = this;
      // src = new URL(src, location.href).href;
      src = resolvePath(src);

      runAccess(this, src);

      if (!oldCurrent) {
        this._initHome = src;
      }

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src,
        app: this,
      });

      if (!page) {
        return;
      }

      if (!_noanime && page) {
        await pageInAnime({
          page,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      const routerData = { name: type, src };

      if (type === "goto" || type === "forward") {
        oldCurrent && this[HISTORY].push({ src: oldCurrent.src });
      }

      if (type === "goto") {
        if (Array.isArray(this[FORWARDS])) {
          this[FORWARDS] = [];
        }
      }

      if (type === "forward") {
        const { forwardHistory } = options;
        const nextHistory = forwardHistory.slice(1).reverse();
        this[HISTORY].push(...nextHistory);
        routerData.delta = options.delta;
      }

      this.emit("router-change", {
        data: routerData,
      });

      emitRouterChange(this, publics, type);

      if (oldCurrent && needRemovePage) {
        if (!_noanime) {
          await pageOutAnime({
            page: needRemovePage,
            key: "previous",
          });
        }
        needRemovePage.remove();
      }
    },
    goto(src) {
      return this._navigate({ type: "goto", src });
    },
    replace(src) {
      return this._navigate({ type: "replace", src });
    },
    get current() {
      return this.all("o-page")
        .reverse()
        .find((page) => {
          let target = page;
          while (target.tag === "o-page") {
            if (target.data.willRemoved) {
              return false;
            }
            target = target.parent;
          }

          return true;
        });
    },
    get routers() {
      let { current } = this;

      if (!current) {
        return [];
      }

      const routers = [
        ...this[HISTORY],
        {
          src: current.src,
        },
      ];

      return routers;
    },
    set routers(_routers) {
      _routers = _routers.map((e) => {
        runAccess(this, e.src);

        return { src: e.src };
      });

      this._settedRouters = 1;

      this.html = "";

      const historyRouters = _routers.slice();

      const currentRouter = historyRouters.pop();

      this[HISTORY].length = 0;
      this[HISTORY].push(...historyRouters);

      this.push({
        tag: "o-page",
        src: currentRouter.src,
      });
    },
  },
});

// Ensure that the page is available, handle cross-domain pages and other operations
const runAccess = (app, src) => {
  const access = app?._module?.access;

  const srcObj = new URL(src);

  if (srcObj.origin !== location.origin && !access) {
    const err = getErr("no_cross_access_func");
    console.warn(err, app.ele, app?._module);
    throw err;
  }

  if (access) {
    const result = access(src);

    if (result !== true) {
      const err = getErr(
        "access_return_error",
        { src },
        result instanceof Error ? result : undefined
      );
      console.warn(err, app);
      throw err;
    }
  }
};

const pageInAnime = async ({ page, key }) => {
  if (!page._rendered) {
    // firefox bug
    await waitPageReaded(page);
  }

  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.css = {
      ...page.css,
      ...targetAnime,
    };

    nextAnimeFrame(() => {
      page.css = {
        ...page.css,
        transition: "all ease .3s",
        ...(pageAnime.current || {}),
      };
    });
  }
};

const pageOutAnime = ({ page, key }) =>
  new Promise((resolve) => {
    const targetAnime = page.pageAnime[key];

    if (targetAnime) {
      nextAnimeFrame(() => {
        let resolved = false;
        const finish = () => {
          if (resolved) {
            return;
          }
          resolved = true;
          clearTimeout(timer);
          resolve();
        };

        const timer = setTimeout(finish, 350);

        page.one("transitionend", finish);

        // Ensure the current style is computed before changing it,
        // so the transition starts reliably on Firefox.
        void page.ele.offsetHeight;

        page.css = {
          ...page.css,
          transition: "all ease .3s",
          ...targetAnime,
        };
      });
    } else {
      resolve();
    }
  });

const nextAnimeFrame = (func) =>
  requestAnimationFrame(() => {
    setTimeout(func, 5);
  });

const resetOldPage = (needRemovePage) => {
  needRemovePage.css = {
    position: "absolute",
    width: `${needRemovePage.width}px`,
    height: `${needRemovePage.height}px`,
  };
  needRemovePage.data.willRemoved = 1;

  return needRemovePage;
};
