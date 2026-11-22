import { nextTick } from "../stanz/public.mjs";
import { searchEle } from "../xhear/public.mjs";
import { path } from "../drill.js/config.mjs";
import { eleX } from "../xhear/util.mjs";
import { getErr } from "../ofa-error/main.js";
import $ from "../xhear/base.mjs";

export const resolvePath = path;

const isInCode = (el) =>
  $(el)
    .composedPath()
    .some((e) => e.tagName && e.tagName.toLowerCase() === "code");

export function fixRelate(element, basePath) {
  searchEle(element, "[href],[src]").forEach((el) => {
    if (isInCode(el)) {
      return;
    }

    ["href", "src"].forEach((attrName) => {
      const value = el.getAttribute(attrName);

      if (/^#/.test(value)) {
        return;
      }

      if (value && !/^(https?:)?\/\/\S+/.test(value)) {
        el.setAttribute(attrName, resolvePath(value, basePath));
      }
    });
  });

  searchEle(element, "template").forEach((el) => {
    if (isInCode(el)) {
      return;
    }

    fixRelate(el.content, basePath);
  });
}

export function fixRelatePathContent(content, basePath) {
  const template = document.createElement("template");
  template.innerHTML = content;

  fixRelate(template.content, basePath);

  searchEle(template.content, "style").forEach((styleEl) => {
    const html = styleEl.innerHTML;

    styleEl.innerHTML = html.replace(/url\((.+)\)/g, (original, urlPath) => {
      return `url(${resolvePath(urlPath, basePath)})`;
    });
  });

  return template.innerHTML;
}

export const ISERROR = Symbol("loadError");

export const getPagesData = async (src) => {
  const load = lm({
    url: src,
  });
  const pagesData = [];
  let defaults;
  let currentPageSrc = src;
  let previousPageSrc;
  let errorObj;

  while (true) {
    try {
      let lastSrc = currentPageSrc;
      const [realPageSrc] = currentPageSrc.split(" ");
      const pageSrcObj = new URL(realPageSrc);
      if (/\/$/.test(pageSrcObj.pathname)) {
        lastSrc += " .html";
      }

      defaults = await load(lastSrc);
    } catch (error) {
      let err;
      if (previousPageSrc) {
        err = getErr(
          "page_wrap_fetch",
          {
            before: previousPageSrc,
            current: currentPageSrc,
          },
          error,
        );
      } else {
        err = getErr(
          "load_page_module",
          {
            url: currentPageSrc,
          },
          error,
        );
      }
      errorObj = err;

      console.error(errorObj);
    }

    if (errorObj) {
      pagesData.unshift({
        src,
        ISERROR,
        error: errorObj,
      });
      break;
    }

    pagesData.unshift({
      src: currentPageSrc,
      defaults,
    });

    if (!defaults.parent) {
      break;
    }

    previousPageSrc = currentPageSrc;
    currentPageSrc = resolvePath(defaults.parent, currentPageSrc);
  }

  return pagesData;
};

export const createPage = (src, defaults) => {
  const tempCon = document.createElement("div");

  tempCon.innerHTML = `<o-page src="${src}" data-pause-init="1"></o-page>`;

  const targetPage = eleX(tempCon.children[0]);

  nextTick(async () => {
    if (!targetPage._renderDefault) {
      await waitPageReaded(targetPage);
    }

    targetPage._renderDefault(defaults);
    targetPage.attr("data-pause-init", null);
  });

  return targetPage;
};

export const waitPageReaded = (pageElement) => {
  if (pageElement._rendered) {
    return;
  }

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (pageElement._rendered) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
};
