import { err } from "./error.mjs";
import Onion from "./onion.mjs";

const isBlobLike = (url) => /^(?:blob|data):/.test(url);

/** fetch 缓存池：键为缓存 URL，值为进行中或已完成的 fetch promise */
export const caches = new Map();

/**
 * 带缓存的 fetch。默认把查询串从缓存键中剥掉，使 "./a.json?v=1" 与
 * "./a.json?v=2" 共享同一次请求；传入 -direct 参数则保留查询串，
 * 绕过共享键。
 */
export const wrapFetch = async (url, params = []) => {
  let fetchUrl = url;

  if (!isBlobLike(url)) {
    const { origin, pathname } = new URL(url);
    fetchUrl = params.includes("-direct") ? url : `${origin}${pathname}`;
  }

  // 缓存的是 promise：并发请求天然去重，后续调用拿到同一个响应的克隆
  let fetching = caches.get(fetchUrl);

  if (!fetching) {
    fetching = fetch(fetchUrl);
    caches.set(fetchUrl, fetching);
  }

  // Response 只能读一次，clone 给每个调用方独立消费
  return (await fetching).clone();
};

/**
 * fetch + 状态检查 + 读取响应体，供所有基于文本的处理器复用，
 * 使 json/wasm 与 txt/html 拥有一致的 load_fail_status 错误行为。
 */
const read = async (url, params, readAs) => {
  let resp;

  try {
    resp = await wrapFetch(url, params);
  } catch (e) {
    throw err("load_fail", `Failed to load "${url}"`, e);
  }

  if (resp.status < 200 || resp.status >= 300) {
    throw err("load_fail_status", `Failed to load "${url}", status: ${resp.status}`);
  }

  return resp[readAs]();
};

/** 类型名 -> 处理器中间件链 */
export const processor = {};

const addHandler = (name, handler) => {
  // 同类型多次 use 是追加中间件，而非覆盖
  const oni = processor[name] || (processor[name] = new Onion());
  oni.use(handler);
};

/**
 * 为一个或多个类型注册处理器中间件。
 *
 * @param {string | string[] | Function} name 类型名（或数组）；传裸函数时
 *   默认注册到模块类型 "js" 和 "mjs"
 * @param {Function} handler `(ctx, next) => {}` 中间件
 */
export const use = (name, handler) => {
  if (name instanceof Function) {
    [handler, name] = [name, ["js", "mjs"]];
  }

  (Array.isArray(name) ? name : [name]).forEach((name) => {
    addHandler(name, handler);
  });
};

// ---- 以下为内建处理器 ----

use(["mjs", "js"], async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;
    const { origin, pathname } = new URL(url);

    // 动态 import 按完整 URL 去重，剥掉查询串让同一文件的不同参数
    // 拼写共享浏览器模块缓存；blob/data URL 原样导入
    const importUrl =
      isBlobLike(url) || params.includes("-direct")
        ? url
        : `${origin}${pathname}`;

    try {
      ctx.result = await import(importUrl);
    } catch (e) {
      const error = err(
        "load_module",
        `Failed to import module "${ctx.realUrl || url}"`,
        e
      );

      // blob 模块常来自动态生成场景，失败时附加打印上下文便于排查
      if (isBlobLike(url)) {
        console.warn(error, ctx);
      }

      throw error;
    }
  }

  await next();
});

use(["txt", "html", "htm"], async (ctx, next) => {
  if (!ctx.result) {
    ctx.result = await read(ctx.url, ctx.params, "text");
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    ctx.result = await read(ctx.url, ctx.params, "json");
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const data = await read(ctx.url, ctx.params, "arrayBuffer");

    // compile 预校验字节码，实例化后直接暴露 exports
    const module = await WebAssembly.compile(data);
    ctx.result = new WebAssembly.Instance(module).exports;
  }

  await next();
});

use("css", async (ctx, next) => {
  const { url, element, params } = ctx;

  if (element && !ctx.result) {
    // 元素模式：注入 <link> 生效样式，而不是返回文本
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    // 元素在 shadow DOM 内则注入对应根节点，否则注入 document.head
    const root = element.getRootNode();
    (root === document ? root.head : root).append(link);

    // 元素断开连接时同步移除样式；load-module 会在断开时派发 disconnected 事件
    element.addEventListener(
      "disconnected",
      () => {
        link.remove();
      },
      { once: true }
    );
  } else if (!ctx.result) {
    // 无元素时退化为纯文本加载
    ctx.result = await read(url, params, "text");
  }

  await next();
});
