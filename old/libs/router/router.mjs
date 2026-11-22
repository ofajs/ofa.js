import { getRandomId } from "../../packages/stanz/public.mjs";
import initRouter from "./init-router.mjs";

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
        const target = document.head.querySelector(FIXBODY);
        if (target) {
          target.remove();
        }
      }
    },
  },
  attached() {
    const app = this.$("o-app");

    if (!history.state && window.location.hash) {
      app.$("o-page")?.remove();
      // app.goto(new URL(location.hash.replace("#", ""), location.href).href);
      app.goto(location.hash.replace("#", ""));
    }

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
        `${location.origin}${location.pathname}#${linkUrlObj.pathname}`
      );
    }
  }
};
