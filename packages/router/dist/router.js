//! router - v5.0.2 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

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
   * o-router：o-app 的 hash 路由桥。
   *
   * 用法：<o-router fix-body><o-app src="app-config.mjs"></o-app></o-router>
   *
   * - 把 o-app 的路由事件同步到浏览器 history（URL 形如
   *   `#/path?query`，跨域源记为 `#origin/path?query`）；
   * - 接管 popstate：浏览器前进/后退驱动 o-app 的 goto/back；
   * - 首次进入时若 location.hash 指向页面，等应用就绪后 replace 过去
   *   （home 即目标页则跳过，避免同页双渲染）；
   * - `fix-body` 属性：为 html/body 追加满尺寸重置样式；
   * - 注册 `$.extensions.link`：o-link 的 href 改写为 hash 形式
   *   （o-app 的链接处理器会读取这个扩展点）。
   *
   * 桥接包不自带框架：挂接页面已加载的 ofa.js 运行时（全局 $，即
   * window.$ / globalThis.ofa），避免与 dist ofa.js 并存时出现第二份
   * 框架实例——因此必须在 ofa.js 之后加载，否则直接报错提示。
   * 同步内核在 ./sync.mjs（无标志位的 URL 对比回波抑制，见其模块说明）。
   */
  const $ = window.$;

  if (!$) {
    throw new Error("[ofa-router] ofa.js must be loaded before router (window.$ is missing)");
  }

  // 与 stanz 内部同式的随机 id（只为 FIXBODY 类名唯一，避免为它引入框架源码）
  const getRandomId = () => Math.random().toString(32).slice(2);

  const FIXBODY = `f-${getRandomId()}`;

  $.register({
    tag: "o-router",
    temp: `<style>:host{display:block;width:100%;height:100%;overflow:hidden}::slotted(o-app){width:100%;height:100%}</style><slot></slot>`,
    attrs: {
      fixBody: null,
    },
    watch: {
      fixBody(val) {
        if (val !== null) {
          const styleEle = document.createElement("style");
          styleEle.setAttribute(FIXBODY, "");
          styleEle.innerHTML = `html,body{margin:0;padding:0;width:100%;height:100%;}`;
          document.head.append(styleEle);
        } else {
          const target = document.head.querySelector(`[${FIXBODY}]`);
          if (target) {
            target.remove();
          }
        }
      },
    },
    attached() {
      const app = this.$("o-app");

      // 应用就绪后：为初始条目补建 routerMode 状态（replaceState 不新增
      // 历史），并把无 hash 的初始地址对齐成 hash 地址——此后浏览器
      // 后退/前进的每个条目都有完整状态可供 popstate 对账
      app
        .watchUntil(() => !!app.appIsReady)
        .then(() => {
          const snapshot = {
            routerMode: 1,
            routers: app.routers.map((e) => ({ src: e.src })),
          };

          // 首次进入带 hash：home 即目标页则跳过（避免同页双渲染），
          // 否则 replace 成 hash 页（replace 本身会写入 routerMode 条目）
          if (!history.state?.routerMode && location.hash) {
            const target = new URL(location.hash.replace("#", ""), location.href)
              .href;

            if (app.current && app.current.src !== target) {
              return app.replace(target).then(() => {
                history.replaceState(
                  { routerMode: 1, routers: app.routers.map((e) => ({ src: e.src })) },
                  "",
                  undefined,
                );
              });
            }
          }

          // 无 hash（或 home 即目标）：把当前地址补上 hash 前缀
          const u = new URL(app.current?.src || location.href, location.href);
          const hUrl =
            u.origin === location.origin
              ? `#${u.pathname}${u.search}`
              : `#${u.origin}${u.pathname}${u.search}`;
          history.replaceState(snapshot, "", hUrl);
        })
        .catch(() => {});

      this._popstateFunc = initRouter({
        app,
        fixStateUrl() {
          const urlObj = new URL(location.href);

          if (urlObj.hash) {
            return urlObj.hash.replace("#", "");
          }
        },
      });
    },
    detached() {
      if (this._popstateFunc) {
        window.removeEventListener("popstate", this._popstateFunc);
      }
    },
  });

  $.extensions.link = ($el) => {
    if ($el.attr("olink") === "") {
      const href = $el.attr("href");

      let urlObj;
      try {
        urlObj = new URL(href);
      } catch (err) {
        return;
      }

      if (!/^#\//.test(urlObj.hash)) {
        $el.attr("origin-href", href);

        const linkUrlObj = new URL(href);

        $el.attr(
          "href",
          `${location.origin}${location.pathname}#${linkUrlObj.pathname}`,
        );
      }
    }
  };

}));
