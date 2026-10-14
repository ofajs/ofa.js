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
 * 同步内核在 ./sync.mjs（无标志位的 URL 对比回波抑制，见其模块说明）。
 */
import $ from "../../xhear/src/base.mjs";
import { getRandomId } from "../../stanz/src/public.mjs";
import initRouter from "./sync.mjs";

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
