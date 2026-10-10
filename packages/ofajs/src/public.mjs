/**
 * ofa.js 公共工具：路径解析、相对资源修正、页面数据加载链。
 */
import lm, { path } from "../../drill/src/main.mjs";
import $ from "../../xhear/src/base.mjs";
import { nextTick } from "../../stanz/src/public.mjs";
import { searchEle } from "../../xhear/src/public.mjs";
import { eleX } from "../../xhear/src/util.mjs";
import { getErr } from "./error.mjs";

/** 路径解析（转发 drill 的 path，旧版从 config.mjs 取） */
export const resolvePath = path;

/** 元素是否处于 code 元素内（code 内的示例代码不做资源修正） */
const isInCode = (el) =>
  $(el)
    .composedPath()
    .some((e) => e.tagName && e.tagName.toLowerCase() === "code");

/**
 * 修正树内所有相对 href/src 为基于 basePath 的绝对地址；
 * code 元素内的内容与锚点链接（#开头）跳过。
 */
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

/** 修正 HTML 字符串里的相对资源地址（含 style 的 url(...)），返回修正后字符串 */
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

/** 页面加载失败的标记（与正常页面数据区分） */
export const ISERROR = Symbol("loadError");

/**
 * 加载页面继承链：页面模块可声明 parent 形成父页链条，
 * 返回值为从根到目标的数组（unshift 逐层插入）。
 */
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
      // 目录形式（/ 结尾）自动补 .html
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

/** 创建一个未挂载的 o-page 元素并渲染指定页面数据 */
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

/** 等待页面完成渲染（优先复用页面自身的 _rendered Promise） */
export const waitPageReaded = (pageElement) => {
  if (pageElement._rendered) {
    return pageElement._rendered;
  }

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (pageElement._rendered) {
        clearInterval(timer);
        resolve(pageElement._rendered);
      }
    }, 500);
  });
};
