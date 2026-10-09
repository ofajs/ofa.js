import { getErr } from "../ofa-error/main.js";
import Onion from "./onion.mjs";

const getNotHttp = (url) => /^blob:/.test(url) || /^data:/.test(url);

export const caches = new Map();
export const wrapFetch = async (url, params) => {
  let reUrl = url;

  if (!getNotHttp(url)) {
    const d = new URL(url);
    reUrl = params.includes("-direct") ? url : `${d.origin}${d.pathname}`;
  }

  let fetchObj = caches.get(reUrl);

  if (!fetchObj) {
    fetchObj = fetch(reUrl);
    caches.set(reUrl, fetchObj);
  }

  const resp = await fetchObj;

  return resp.clone();
};

export const processor = {};

const addHandler = (name, handler) => {
  const oni = processor[name] || (processor[name] = new Onion());
  oni.use(handler);
};

export const use = (name, handler) => {
  if (name instanceof Function) {
    handler = name;
    name = ["js", "mjs"];
  }

  if (name instanceof Array) {
    name.forEach((name) => {
      addHandler(name, handler);
    });
    return;
  }

  addHandler(name, handler);
};

use(["mjs", "js"], async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;
    const d = new URL(url);

    const notHttp = getNotHttp(url);
    try {
      if (notHttp || params.includes("-direct")) {
        ctx.result = await import(url);
      } else {
        ctx.result = await import(`${d.origin}${d.pathname}`);
      }
    } catch (error) {
      const err = getErr(
        "load_module",
        {
          url: ctx.realUrl || url,
        },
        error
      );

      if (notHttp) {
        console.warn(err, ctx);
      }

      throw err;
    }
  }

  await next();
});

use(["txt", "html", "htm"], async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;

    let resp;
    try {
      resp = await wrapFetch(url, params);
    } catch (error) {
      throw getErr("load_fail", { url }, error);
    }

    if (!/^2.{2}$/.test(resp.status)) {
      throw getErr("load_fail_status", {
        url,
        status: resp.status,
      });
    }

    ctx.result = await resp.text();
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;

    ctx.result = await wrapFetch(url, params).then((e) => e.json());
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;

    const data = await wrapFetch(url, params).then((e) => e.arrayBuffer());

    const module = await WebAssembly.compile(data);
    const instance = new WebAssembly.Instance(module);

    ctx.result = instance.exports;
  }

  await next();
});

use("css", async (ctx, next) => {
  if (!ctx.result) {
    const { url, element, params } = ctx;

    if (element) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;

      const root = element.getRootNode();

      if (root === document) {
        root.head.append(link);
      } else {
        root.appendChild(link);
      }

      let f;
      element.addEventListener(
        "disconnected",
        (f = (e) => {
          link.remove();
          element.removeEventListener("disconnected", f);
        })
      );
    } else {
      ctx.result = await wrapFetch(url, params).then((e) => e.text());
    }
  }

  await next();
});
