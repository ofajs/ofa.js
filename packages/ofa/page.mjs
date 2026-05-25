import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { searchEle, isFunction } from "../xhear/public.mjs";
import {
  fixRelatePathContent,
  resolvePath,
  getPagesData,
  createPage,
  ISERROR,
} from "./public.mjs";
import { initLink } from "./link.mjs";
import { nextTick } from "../stanz/public.mjs";

import { drawUrl } from "./draw-template.mjs";
import { getErr, getErrDesc } from "../ofa-error/main.js";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

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

lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url, realUrl } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, realUrl || url);

  let tempSrc = defaultsData.temp;

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

setTimeout(() => {
  // Let the pod's running time be slower than the `type="module"` time
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

        pagesData.forEach((e, i) => {
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
      // this.css.display = "block";

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
          // 检查是否有key冲突
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
            fromSrc: src,
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

export const dispatchLoad = async (_this, loaded) => {
  const shadow = _this.ele.shadowRoot;

  if (shadow) {
    const srcEles = searchEle(shadow, `l-m,load-module`);
    const pms = srcEles.map(
      (el) =>
        new Promise((res) => {
          el.addEventListener("load", (e) => {
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
