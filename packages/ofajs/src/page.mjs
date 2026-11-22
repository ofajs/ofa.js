/**
 * o-page 页面组件与页面模块加载。
 *
 * 页面模块即 `export const type = PAGE` 的模块（通常由 template[page]
 * 的 HTML 文件转译而来），声明 temp/data/proto/loaded/attached 等。
 * o-page 通过 src 加载页面模块并渲染到自身；页面可声明 parent 形成
 * 继承链（app 的嵌套路由依赖它）。
 */
import lm from "../../drill/src/main.mjs";
import $ from "../../xhear/src/base.mjs";
import { renderElement } from "../../xhear/src/register.mjs";
import { convert } from "../../xhear/src/render/compile.mjs";
import { searchEle, isFunction } from "../../xhear/src/public.mjs";
import { nextTick } from "../../stanz/src/public.mjs";
import {
  fixRelatePathContent,
  resolvePath,
  getPagesData,
  createPage,
  ISERROR,
} from "./public.mjs";
import { initLink } from "./link.mjs";
import { drawUrl } from "./draw-template.mjs";
import { getErr, getErrDesc } from "./error.mjs";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

// ---- 页面模块加载中间件 ----

// html/htm 文件若含 template[page]，转译为页面模块再加载
lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +page *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    try {
      const url = await drawUrl(content, ctx.url);
      ctx.result = await lm()(`${url} .mjs --real:${ctx.url}`);
    } catch (error) {
      throw getErr(
        "load_page_module",
        {
          url: ctx.url,
        },
        error,
      );
    }
    ctx.resultContent = content;
  }

  await next();
});

// type === PAGE 的模块：解析默认值并加载模板内容
lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url, realUrl } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, realUrl || url);

  let tempSrc = defaultsData.temp;

  // temp 为非 HTML 内容时视为模板地址，加载模板内容
  if (!/<.+>/.test(tempSrc)) {
    if (tempSrc) {
      tempSrc = resolvePath(tempSrc, url);
    } else {
      tempSrc = url.replace(/\.m?js.*/, ".html");
    }

    try {
      defaultsData.temp = await fetch(tempSrc).then((e) => e.text());
    } catch (error) {
      const err = getErr(
        "fetch_temp_err",
        {
          url: realUrl || url,
          tempSrc,
        },
        error,
      );
      self.emit("error", { data: { error: err } });
      throw err;
    }
  }

  ctx.result = defaultsData;

  await next();
});

// 延迟到 type="module" 脚本执行完再注册，避免初始化次序问题
setTimeout(() => {
  $.register({
    tag: "o-page",
    attrs: {
      src: null,
    },
    data: {
      pageIsReady: null,
    },
    watch: {
      async src(src) {
        if (!src) {
          return;
        }

        if (!src.startsWith("//") && !/[a-z]+:\/\//.test(src)) {
          // 相对地址先解析为绝对地址
          src = resolvePath(src);
          this.src = src;
          return;
        }

        if (this.__init_src) {
          if (this.__init_src !== src) {
            throw Error(
              "A page that has already been initialized cannot be set with the src attribute",
            );
          }
          return;
        }

        this.__init_src = src;

        if (this._defaults || this.attr("data-pause-init")) {
          return;
        }

        const pagesData = await getPagesData(src);

        if (this._defaults) {
          return;
        }

        const target = pagesData.pop();

        // 父页链条：逐层包裹父页（本页在最内层）
        pagesData.forEach((e) => {
          const parentPage = createPage(e.src, e.defaults);

          if (this.parent) {
            this.wrap(parentPage);
          } else {
            const needWraps = this.__need_wraps || (this.__need_wraps = []);
            needWraps.push(parentPage);
          }
        });

        if (target.ISERROR === ISERROR) {
          const failContent = getFailContent(
            src,
            target,
            this?.app?._module?.fail,
          );

          this._renderDefault({
            type: PAGE,
            temp: failContent,
          });
        } else {
          this._renderDefault(target.defaults);
        }
      },
    },
    attached() {
      const needWraps = this.__need_wraps;
      if (needWraps) {
        needWraps.forEach((page) => {
          this.wrap(page);
        });
        delete this.__need_wraps;
      }

      if (this.__not_run_attached) {
        if (this._defaults.attached) {
          this._defaults.attached.call(this);
        }
        delete this.__not_run_attached;
      }
    },
    detached() {
      const { _defaults } = this;

      if (_defaults && _defaults.detached) {
        _defaults.detached.call(this);
      }
    },
    proto: {
      async _renderDefault(defaults) {
        const { src } = this;

        if (defaults.data) {
          // 页面保留字段与元素原型能力不可被 data 占用
          Object.keys(defaults.data).forEach((name) => {
            if (
              [
                "src",
                "goto",
                "replace",
                "back",
                "pageAnime",
                "pageIsReady",
              ].includes(name) ||
              name in $.fn
            ) {
              throw getErr("page_invalid_key", {
                src,
                targetName: "data",
                name,
              });
            }
          });
        }

        if (defaults.proto) {
          Object.keys(defaults.proto).forEach((name) => {
            if (name in this) {
              console.warn(
                getErrDesc("page_invalid_key", {
                  src,
                  targetName: "proto",
                  name,
                }),
                defaults,
              );
            }
          });
        }

        if (this._defaults) {
          const err = getErr("page_no_defaults", { src });
          console.warn(err, this);
          throw err;
        }

        this._defaults = defaults;

        if (defaults.pageAnime) {
          this._pageAnime = defaults.pageAnime;
        }

        if (!defaults || defaults.type !== PAGE) {
          const err = getErr("not_page_module", { src });
          console.warn(err, this);
          this.emit("error", { data: { error: err } });
          this.__reject(err);
          throw err;
        }

        const template = document.createElement("template");
        template.innerHTML = fixRelatePathContent(defaults.temp, src);
        const temps = convert(template);

        try {
          renderElement({
            defaults,
            ele: this.ele,
            template,
            temps,
          });
        } catch (error) {
          const err = getErr("page_failed", { src }, error);
          console.error(err);
          console.warn(err, this);
        }

        await dispatchLoad(this, defaults.loaded);

        initLink(this.shadow);

        this.emit("page-loaded");

        this.__resolve();

        this.pageIsReady = 1;

        const { app } = this;
        if (app && !app.appIsReady) {
          nextTick(() => {
            app.appIsReady = 1;
          });
        }

        if (this.ele.isConnected) {
          if (defaults.attached) {
            defaults.attached.call(this);
          }
        } else {
          this.__not_run_attached = 1;
        }
      },
      back() {
        this.app.back();
      },
      goto(src) {
        this.app.goto(resolvePath(src, this.src));
      },
      replace(src) {
        this.app.replace(resolvePath(src, this.src));
      },
      get pageAnime() {
        const { app, _pageAnime } = this;

        const { pageAnime } = app?._module || {};

        return clone({ ...pageAnime, ...(_pageAnime || {}) });
      },
      set pageAnime(val) {
        this._pageAnime = val;
      },
    },

    ready() {
      this._rendered = new Promise((resolve, reject) => {
        this.__resolve = () => {
          delete this.__resolve;
          delete this.__reject;
          resolve();
        };
        this.__reject = () => {
          delete this.__resolve;
          delete this.__reject;
          reject();
        };
      });
    },
  });
});

/** 等待 shadow 内的 l-m 与样式链接加载完成，再触发 loaded */
export const dispatchLoad = async (_this, loaded) => {
  const shadow = _this.ele.shadowRoot;

  if (shadow) {
    const srcEles = searchEle(shadow, `l-m,load-module`);
    const pms = srcEles.map(
      (el) =>
        new Promise((res) => {
          el.addEventListener("load", () => {
            res();
          });
        }),
    );

    const links = searchEle(shadow, `link`);

    links.forEach((link) => {
      if (link.rel === "stylesheet") {
        pms.push(
          new Promise((res) => {
            let resolve = () => {
              clearInterval(timer);
              link.removeEventListener("load", resolve);
              link.removeEventListener("error", resolve);
              res();
            };
            const timer = setInterval(() => {
              // 链接被移除（如 inject-host 收编）也视为完成
              if (!link.parentNode) {
                resolve();
              }
            }, 100);

            if (link.sheet) {
              resolve();
            } else {
              link.addEventListener("load", resolve);
              link.addEventListener("error", resolve);
            }
          }),
        );
      }
    });

    await Promise.all(pms);
  }

  if (loaded) {
    loaded.call(_this);
  }
};

/** 合并模块默认值（default 可为函数，入参提供 load 与 query） */
export const getDefault = async (moduleData, url) => {
  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  const relateLoad = lm({
    url,
  });

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: relateLoad,
      url,
      get query() {
        const urlObj = new URL(url);
        return Object.fromEntries(Array.from(urlObj.searchParams.entries()));
      },
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = { ...defaultData };
  }

  const defaults = {
    proto: {},
    ...moduleData,
    ...finnalDefault,
  };

  return defaults;
};

/** 生成加载失败页的内容（优先使用 app 的 fail 自定义） */
export const getFailContent = (src, target, fail) => {
  let failContent;

  if (fail) {
    failContent = fail({
      src,
      error: target.error,
    });
  } else {
    failContent = `<div style="padding:20px;color:red;">${(
      target.error.stack || target.error.toString()
    )
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")}</div>`;
  }

  return failContent;
};
