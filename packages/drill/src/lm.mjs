import { err } from "./error.mjs";
import { processor } from "./processors.mjs";
import { path } from "./path.mjs";

/** load-module 元素的加载完成标记（symbol，避免与用户属性冲突） */
export const LOADED = Symbol("loaded");

/**
 * Content-Type 嗅探表：URL 类型未命中任何处理器时的兜底，
 * 按响应的 Content-Type 反查处理器再执行一次。
 */
const MIME_TYPES = [
  ["application/javascript", "js"],
  ["text/javascript", "js"],
  ["application/json", "json"],
  ["text/html", "html"],
  ["text/xml", "xml"],
];

/** 取出以 prefix 开头的参数并去掉前缀，如 "--real:/a" --real→ "/a" */
const getParam = (params, prefix) => {
  const param = params.find((e) => e.startsWith(prefix));
  return param && param.slice(prefix.length);
};

/** 从路径取扩展名作为类型；无扩展名返回空串 */
const getExtType = (pathname) => {
  const index = pathname.lastIndexOf(".");
  return index === -1 ? "" : pathname.slice(index + 1);
};

/**
 * 加载单个绝对地址 URL：选定处理器链并执行。
 *
 * 类型优先级：`.type` 参数 > 路径扩展名；两者都未命中处理器时，
 * fetch 后按 Content-Type 嗅探，仍无匹配则返回原始 Response。
 *
 * @param {string} url 绝对 URL
 * @param {{params?: string[], element?: LoadModule}} opts
 * @returns 常规返回 ctx.result；带 `-ctx` 参数时返回整个加载上下文
 */
export const agent = async (url, opts) => {
  const { pathname } = new URL(url);
  const params = opts.params ?? [];

  let type = getParam(params, ".");
  if (!type) {
    type = getExtType(pathname);
  }

  // opts 后置展开：允许调用方通过 opts 覆盖默认字段
  const ctx = {
    url,
    result: null,
    realUrl: getParam(params, "--real:"),
    params,
    ...opts,
  };

  const oni = processor[type];

  if (oni) {
    await oni.run(ctx);
  } else {
    const resp = await fetch(url);
    // 无 Content-Type 头时按空串处理，避免 includes 报错
    const contentType = resp.headers.get("Content-Type") || "";

    const matched = MIME_TYPES.find(([mime]) => contentType.includes(mime));

    if (matched && processor[matched[1]]) {
      await processor[matched[1]].run(ctx);
    } else {
      // 无任何处理器命中：交给调用方自行处理原始 Response
      ctx.result = resp;
    }
  }

  // element 模式：标记加载完成并派发 load 事件，供 load-module 使用
  const { element } = opts;
  if (element) {
    element[LOADED] = true;
    element.dispatchEvent(new Event("load"));
  }

  return params.includes("-ctx") ? ctx : ctx.result;
};

/**
 * 创建绑定基准地址的加载器。
 *
 * @param {{url: string}} [meta] 通常传 import.meta；缺省用当前文档地址
 * @param {{element?: LoadModule}} [opts] 附加选项（如关联 load-module 元素）
 * @returns {(url: string) => Promise<unknown>} 加载函数，接受带空格分隔参数
 *   的地址：`.type` 强制类型、`--real:xxx` 记录真实地址、`-ctx` 返回上下文、
 *   `-direct` 保留查询串
 */
export default function lm(meta, opts = {}) {
  if (!meta) {
    meta = { url: document.location.href };
  }

  return (ourl) => {
    // 先拆参数，路径部分解析为绝对 URL 后再连同参数一起加载
    const [url, ...params] = ourl.split(" ");
    return agent(path(url, meta.url), { params, ...opts });
  };
}
