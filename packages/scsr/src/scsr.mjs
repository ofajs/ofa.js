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
import initRouter from "../../router/src/sync.mjs";

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
