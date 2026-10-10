/**
 * o-link 与渲染期的链接修正。
 *
 * - renderExtends.render 钩子：init 时对组件/页面内的 a 元素做 olink
 *   初始化；attr 刷新时对 olink 元素基于页面地址修正相对链接。
 * - initLink：拦截 shadow 内 a[olink] 的点击，转成 o-app 的 goto 路由
 *   跳转（保留新标签打开、下载链接等原生行为）。
 * - $.extensions.link 是更高层框架注册自定义链接处理器的扩展点。
 */
import { nextTick } from "../../stanz/src/public.mjs";
import $ from "../../xhear/src/base.mjs";
import { fixRelate } from "./public.mjs";
import { renderExtends } from "../../xhear/src/render/render.mjs";
import { getErr } from "./error.mjs";

const oldRender = renderExtends.render;
renderExtends.render = (e) => {
  oldRender && oldRender(e);

  const { step, name, target } = e;

  const { link } = $.extensions;

  if (step === "init") {
    // 组件/页面只渲染一次
    if (target.host && link) {
      $(target)
        .all("a")
        .forEach((e) => link(e));
    }
  } else if (
    name === "attr" &&
    step === "refresh" &&
    target.attr("olink") === ""
  ) {
    // olink 元素的属性刷新后，基于页面地址修正相对链接
    const top = target.parents.pop() || target;

    if (top.__fixLinkTimer) {
      return;
    }

    top.__fixLinkTimer = nextTick(() => {
      const { host } = target;

      if (host && host.tag === "o-page") {
        fixRelate(top.ele, host.src);
      }

      if (link) {
        $(top)
          .all("a")
          .forEach((e) => link(e));
      }
      delete top.__fixLinkTimer;
    });
  }
};

/** 初始化容器内的 olink 点击拦截 */
export const initLink = (_this) => {
  const $ele = $(_this);

  $ele.on("click", (e) => {
    if (e.__processed) {
      return;
    }

    const $tar = $(e.target);
    const all = [$tar, ...$tar.parents];

    let currentTarget = all.find((e) => e.tag === "a");
    if (currentTarget) {
      currentTarget = currentTarget.ele;
    }

    if (!currentTarget) {
      return;
    }

    // 新标签打开与下载链接保持原生行为
    const targetVal = currentTarget.getAttribute("target");
    if (targetVal || currentTarget.getAttribute("download")) {
      return;
    }

    if (currentTarget.attributes.hasOwnProperty("olink")) {
      if ($ele.app) {
        if (e.metaKey || e.shiftKey) {
          return;
        }

        if (e.defaultPrevented) {
          return;
        }

        e.preventDefault();

        // 允许 goto 前的拦截取消跳转
        let prevented = false;
        e.preventDefault = () => {
          prevented = true;
        };

        e.__processed = true;

        if (currentTarget.tagName === "A") {
          const originHref = currentTarget.getAttribute("origin-href");
          // 优先使用 origin-href（原始相对地址）
          setTimeout(() => {
            const finalHref = originHref || currentTarget.href;
            finalHref && !prevented && $ele.app.goto(finalHref);
          });
        }
      } else {
        console.warn(getErr("olink_out_app"), _this);
      }
    }
  });
};
