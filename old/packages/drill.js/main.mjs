import { processor, use } from "./use.mjs";
import { aliasMap, path } from "./config.mjs";
export const LOADED = Symbol("loaded");

const createLoad = (meta, opts) => {
  if (!meta) {
    meta = {
      url: document.location.href,
    };
  }
  const load = (ourl) => {
    let [url, ...params] = ourl.split(" ");

    const reurl = path(url, meta.url);

    return agent(reurl, { params, ...opts });
  };
  return load;
};

export const agent = async (url, opts) => {
  const urldata = new URL(url);
  const { pathname } = urldata;

  let type;
  let realUrl = null;

  opts.params &&
    opts.params.forEach((e) => {
      if (/^\..+/.test(e)) {
        type = e.replace(/^\.(.+)/, "$1");
      } else if (/^\-\-real/.test(e)) {
        realUrl = e.replace(/^\-\-real\:/, "");
      }
    });

  if (!type) {
    type = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  const ctx = {
    url,
    result: null,
    realUrl,
    ...opts,
  };

  const oni = processor[type];

  if (oni) {
    await oni.run(ctx);
  } else {
    const result = await fetch(url);
    const contentType = result.headers.get("Content-Type");

    const targetMapObject = [
      ["application/javascript", "js"],
      ["application/json", "json"],
      ["text/html", "html"],
      ["text/xml", "xml"],
    ].find((e) => contentType.includes(e[0]));

    let newOni;
    if (targetMapObject) {
      newOni = processor[targetMapObject[1]];
    }

    if (newOni) {
      await newOni.run(ctx);
    } else {
      ctx.result = result;
    }
  }

  if (opts && opts.element) {
    const { element } = opts;
    element[LOADED] = true;
    const event = new Event("load");
    element.dispatchEvent(event);
  }

  if (opts.params && opts.params.includes("-ctx")) {
    return ctx;
  }

  return ctx.result;
};

export default function lm(meta, opts) {
  return createLoad(meta, opts);
}

Object.defineProperties(lm, {
  use: {
    value: use,
  },
  alias: {
    get() {
      return { ...aliasMap };
    },
  },
});
