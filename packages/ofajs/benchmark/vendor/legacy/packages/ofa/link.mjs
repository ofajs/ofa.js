import { nextTick } from "../stanz/public.mjs";
import $ from "../xhear/base.mjs";
import { fixRelate } from "./public.mjs";
import { renderExtends } from "../xhear/render/render.mjs";
import { getErr } from "../ofa-error/main.js";

const oldRender = renderExtends.render;
renderExtends.render = (e) => {
  oldRender && oldRender(e);

  const { step, name, target } = e;

  const { link } = $.extensions;

  if (step === "init") {
    // Renders the component or page only once
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

export const initLink = (_this) => {
  const $ele = $(_this);

  // olink click to amend
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

        // Whether to abort the goto event
        let prevented = false;
        e.preventDefault = () => {
          prevented = true;
        };

        e.__processed = true;

        if (currentTarget.tagName === "A") {
          const originHref = currentTarget.getAttribute("origin-href");
          // Prioritize the use of origin links
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
