//! scsr - v5.0.2 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
/**
 * o-router 的 history 同步内核。
 *
 * 职责只有一个：维持「o-app 路由栈 ↔ 浏览器历史」的双向同步——
 * - 应用路由（router-change）→ 写 history：goto/forward 用 pushState、
 *   replace 用 replaceState、back 用 history.go(-delta)；
 * - 浏览器历史（popstate）→ 驱动应用：按条目里保存的路由栈与当前
 *   路由栈的深度差，驱动 app.back(n) / app.goto(target)；带 ignore
 *   标记的条目直接跳过（scsr 等宿主为锚点定位类条目写入的标记）。
 *
 * 回波抑制不再依赖标志位：应用导航完成后 URL 必然与目标 hash 地址
 * 一致，RC 处理器发现 location.href 已是目标地址时直接跳过写入
 * （popstate 驱动的导航正是如此到达的）。app.goto/back 因同 src
 * 等 reason no-op 时也不会有任何副作用——无标志即无卡死。
 * 桥接包不 import 框架源码（避免与 dist ofa.js 并存时出现第二份框架
 * 实例），依赖全走页面运行时。
 */

// 与 xhear 内部同式的 Safari 判定（内联以免 import 框架源码）
const isSafariBrowser = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function initRouter({ app, getStateUrl, fixStateUrl }) {
  // reload 后 history.state 仍在：同步恢复路由栈（setter 置
  // _settedRouters，app 挂载配置 home 时据此跳过，避免双重挂载）
  if (history.state && history.state.routerMode) {
    app.routers = history.state.routers;
  }

  const isSa = isSafariBrowser();

  const cancelAnime = (app, func) => {
    isSa && (app._noanime = true);
    func();
    isSa && (app._noanime = false);
  };

  /** 页面地址 → hash 地址（跨域源记为 #origin/path?query） */
  const toHashUrl = (src) => {
    const { pathname, search, origin } = new URL(src, location.href);
    if (getStateUrl) {
      return getStateUrl(pathname, search);
    }
    return location.origin === origin
      ? `#${pathname}${search}`
      : `#${origin}${pathname}${search}`;
  };

  const stateSnapshot = () => ({
    routerMode: 1,
    routers: app.routers.map((e) => ({ src: e.src })),
  });

  // popstate 驱动 back 的预期回波 delta（app.back 触发 RC back 时消费；
  // 同 src no-op 不触发时由 driveNav 的 finally 复位）
  let _echoBack = 0;

  // ---- 应用路由 → 浏览器历史 ----

  app.on("router-change", ({ data }) => {
    const { name, delta, src } = data || {};
    const hUrl = toHashUrl(src || app.current?.src || "");

    // URL 已与目标一致：popstate 驱动导航的回波，浏览器已移动过，
    // 只需把状态对象对齐到当前路由栈（不新增条目）
    // popstate 驱动的 back/forward 回波：浏览器已移动过，无需重复 go。
    // 回波判定用 delta（URL 对比对 back 不可用：片段 vs 全址恒不等）
    if (name === "back" || name === "forward") {
      if (delta && delta === _echoBack) {
        _echoBack = 0;
        return;
      }
      cancelAnime(app, () => history.go(name === "back" ? -delta : delta));
      return;
    }

    const method = name === "replace" ? "replaceState" : "pushState";
    if (location.href !== hUrl) {
      history[method](stateSnapshot(), "", hUrl);
    } else {
      history.replaceState(stateSnapshot(), "", hUrl);
    }
  });

  // ---- 浏览器历史 → 应用路由 ----

  window.addEventListener(
    "popstate",
    (e) => {
      // 应用未就绪（配置 home 尚在挂载）时忽略 popstate：此时响应
      // 会与 home 挂载竞态造成双重渲染（旧 first-render 竞态案例）
      if (!app.appIsReady) {
        return;
      }

      // scsr 等宿主会给「锚点定位类」条目补写带 ignore 标记的状态：
      // 这类条目只承载 URL 变化，不驱动应用重渲染
      if (e.state?.ignore) {
        return;
      }

      const hisRouters = e.state?.routerMode ? e.state.routers : null;

      if (hisRouters) {
        const diff = hisRouters.length - app.routers.length;

        if (diff < 0) {
          // history back：记录预期回波 delta，RC 处理器据此跳过重复 go
          _echoBack = -diff;
          return cancelAnime(app, () => app.back(-diff));
        }
        if (diff > 0) {
          // history forward
          const moreRouters = hisRouters.slice();
          const target = moreRouters.pop();

          if (moreRouters.length > app.routers.length) {
            app._history.push(...moreRouters.slice(app.routers.length - 1));
          }

          return cancelAnime(app, () => app.goto(target.src));
        }

        // 同深度但栈不同（replaceState 类导航的前后移动）：按条目恢复
        // 路由栈（setter 会渲染恢复后的当前页）
        if (JSON.stringify(hisRouters) !== JSON.stringify(app.routers)) {
          app.routers = hisRouters;
        }
        return;
      }

      // 无状态条目（初始条目/外部条目）：按当前 hash 恢复页面
      if (fixStateUrl) {
        const newPath = fixStateUrl();

        if (newPath === false) {
          return;
        }

        if (newPath) {
          // 目标与当前页一致（含 query）的 popstate 是伪信号
          // （浏览器初始化/bfcache 恢复期常发），重渲染毫无意义
          const targetUrl = new URL(newPath, location.href).href;
          if (app.current && app.current.src === targetUrl) {
            return;
          }
          return cancelAnime(app, () => app.goto(newPath));
        }
      }

      return cancelAnime(app, () => app.back(app.routers.length - 1));
    },
  );
}

/**
 * scsr：Symphony Client-Server Rendering。
 *
 * 服务端（或静态主机）直接投递真实 HTML 文件，页面内容内联在
 * `<o-app>` 的 `<template page>` 里；本模块在 window load 后接管：
 * 把当前 URL 作为 `<o-page src>` 塞回应用（同一份 HTML 经
 * template[page] 转译为页面模块），再用 o-router 的同步内核
 * （packages/router/src/sync.mjs）把应用路由同步到浏览器历史。
 * 效果：多 HTML 文件的站点 behaves like SPA——首屏是服务端渲染的
 * 静态 HTML，站内跳转走 o-app 路由，地址是真实路径（非 hash）。
 *
 * 与 o-router 的分工：o-router 用 `#/path` 哈希地址，无需服务器配合；
 * scsr 用真实路径，每个 URL 都是可以直接访问/分享/被爬虫抓取的页面。
 *
 * 桥接包不自带框架：挂接页面已加载的 ofa.js 运行时（全局 $，即
 * window.$ / globalThis.ofa），避免与 dist ofa.js 并存时出现第二份
 * 框架实例；须在 ofa.js 之后加载（缺失时告警并退出）。唯一的跨包
 * 源码导入是 o-router 的同步内核（经打包进入 dist，见根 rollup 配置）。
 */

(() => {
  const ready = () => {
    const $ = window.$;

    if (!$) {
      console.error(
        "[ofa-scsr] ofa.js must be loaded before scsr (window.$ is missing)",
      );
      return;
    }

    const app = $("o-app");

    if (!app) {
      return;
    }

    // SCSR 契约：页面本体一律由 o-page 从当前 URL 加载，o-app 内联的
    // template[page] 只承载首屏静态内容，接管后移除避免残留
    // （服务端返回的同一份 HTML 不受影响，转译页面模块时仍会读取它）
    $("o-app template[page]")?.remove();

    // 锚点定位的对账：popstate 落在「无状态且带 hash」的条目上时
    // （页内锚点导航、外部条目），只定位不驱动应用，并给随后的
    // hashchange 放行——由它给该条目补写当前路由栈快照，此后前进/
    // 后退跨过该条目时可按深度差正常对账（锚点只动 URL，应用栈不变，
    // 快照即真实状态）。maybeHash 只在 popstate → hashchange 的一个
    // 任务窗口内为真：内核真正处理过的 popstate（前后进对账）不会置位，
    // 其 hashchange 回波不会误盖快照。
    let maybeHash = false;
    window.addEventListener("hashchange", () => {
      if (!maybeHash || !app.routers.length) {
        return;
      }
      maybeHash = false;

      const urlObj = new URL(location.href);

      history.replaceState(
        {
          routerMode: 1,
          routers: app.routers.map((e) => ({ src: e.src })),
        },
        "",
        urlObj.hash,
      );
    });

    // 同步页面标题：页面模块的 title（HTML 转译页取自 <title>，
    // .mjs 页取自 export const title）加载完成后写到 document.title。
    // 只跟随当前页（栈顶）：嵌套路由的父页（如共享布局）晚于子页
    // 加载完成时，其 title 不得覆盖用户正在看的页面标题
    app.on("page-loaded", (e) => {
      const page = $(e.target);

      if (page.ele !== app.current?.ele) {
        return;
      }

      const { _defaults } = page;

      if (typeof _defaults.title === "string") {
        const titleEl = $("head title");
        titleEl && (titleEl.text = _defaults.title);
      }
    });

    // 首次进入（历史无路由状态）：当前 URL 即首页，应用内补载同一份
    // 页面；reload/前进后退恢复的进入自带 routerMode 状态，由
    // initRouter 直接还原路由栈，不重复 push
    const isFreshEntry = !history?.state?.routerMode;

    if (isFreshEntry) {
      app.push(
        `<o-page src="${location.pathname}${location.search}"></o-page>`,
      );
    }

    initRouter({
      app,
      // scsr 用真实路径做历史地址（o-router 缺省是 #path 形式）
      getStateUrl(pathname, search) {
        return `${pathname}${search}`;
      },
      fixStateUrl() {
        const urlObj = new URL(location.href);

        if (urlObj.hash) {
          // 无状态条目带锚点：可能是锚点定位，跳过重渲染
          maybeHash = true;
          setTimeout(() => (maybeHash = false));
          return false;
        }
      },
    });

    // 应用就绪后给初始条目补建 routerMode 状态（replaceState 不新增
    // 历史，与 o-router 同款）：此后后退/前进的每个应用条目都有完整
    // 状态可供 popstate 对账；就绪后页内锚点产生的新条目会克隆到该
    // 状态，回退不再误入「无状态条目」分支
    if (isFreshEntry) {
      app
        .watchUntil(() => !!app.appIsReady)
        .then(() => {
          history.replaceState(
            {
              routerMode: 1,
              routers: app.routers.map((e) => ({ src: e.src })),
            },
            "",
            undefined,
          );
        })
        .catch(() => {});
    }
  };

  if (document.readyState === "complete") {
    ready();
  } else {
    window.addEventListener("load", () => ready(), { once: true });
  }
})();
