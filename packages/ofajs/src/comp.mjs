/**
 * 组件模块系统：组件即文件。
 *
 * 组件模块即 `export const type = COMP` 的模块（通常由 template[component]
 * 的 HTML 文件转译而来），声明 tag/temp/data/proto/loaded 等。comp 中间件
 * 负责把这类模块注册成自定义元素；同名 tag 重复注册（不同地址）直接报错。
 */
import lm from "../../drill/src/main.mjs";
import $ from "../../xhear/src/base.mjs";
import { isFunction, toDashCase } from "../../xhear/src/public.mjs";
import { dispatchLoad } from "./page.mjs";
import { drawUrl } from "./draw-template.mjs";
import { fixRelatePathContent, resolvePath } from "./public.mjs";
import { initLink } from "./link.mjs";
import { getErr } from "./error.mjs";

const COMP = Symbol("Component");

// 组件文件地址（供 PATH 相对资源解析使用）
export const COMPONENT_PATH = Symbol("PATH");

Object.defineProperty($, "COMP", {
  value: COMP,
});

const cacheComps = {};

// html/htm 文件若含 template[component]，转译为组件模块再加载
lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +component *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    try {
      const url = await drawUrl(content, ctx.url, false);
      ctx.result = await lm()(`${url} .mjs --real:${ctx.url}`);
    } catch (err) {
      throw getErr(
        "load_comp_module",
        {
          url: ctx.url,
        },
        err,
      );
    }
    ctx.resultContent = content;
  }

  await next();
});

// type === COMP 的模块：注册为自定义元素
lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url, realUrl } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    next();
    return;
  }

  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  console.debug(
    "[xt-comp]",
    "modKeys=" + Object.keys(moduleData).join(","),
    "defaultType=" + typeof defaultData,
    "defaultKeys=" + (defaultData ? Object.keys(defaultData).join(",") : "-"),
  );

  const path = realUrl || url;

  // default 支持函数形态，入参提供相对加载器与文件地址
  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: lm({
        url: path,
      }),
      url: path,
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = { ...defaultData };
  }

  const { tag, temp } = { ...moduleData, ...finnalDefault };

  // 未声明 tag 时，从文件名推断（驼峰转 dash-case）
  let tagName = tag;
  const matchName = path.match(/\/([^/]+)\.m?(js|htm|html)$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  const cacheUrl = cacheComps[tagName];
  if (cacheUrl) {
    if (path !== cacheUrl) {
      throw getErr("comp_registered", {
        tag: tagName,
      });
    }

    // 同地址重复加载视为幂等
    await next();
    return;
  }

  cacheComps[tagName] = path;

  let tempUrl;
  let tempContent = "";

  if (/<.+>/.test(temp)) {
    // temp 为内联 HTML
    tempUrl = path;
    tempContent = temp;
  } else if (temp !== "") {
    // 空字符串表示不需要 shadow root；非空字符串视为模板地址
    if (!temp) {
      tempUrl = resolvePath(`${matchName[1]}.html`, path);
    } else {
      tempUrl = resolvePath(temp, path);
    }

    tempContent = await fetch(tempUrl).then((e) => e.text());
  }

  const registerOpts = {
    ...moduleData,
    ...finnalDefault,
  };

  // ready 前置注入：loaded 事件派发 + link 初始化
  const oldReady = registerOpts.ready;
  const { loaded } = registerOpts;
  registerOpts.ready = async function (...args) {
    oldReady && oldReady.apply(this, args);
    loaded && dispatchLoad(this, loaded);
    this.shadow && initLink(this.shadow);
  };

  // created 注入组件文件地址（PATH 的数据来源）
  const oldCreated = registerOpts.created;
  registerOpts.created = function (...args) {
    this[COMPONENT_PATH] = path;
    oldCreated && oldCreated.call(this, ...args);
  };

  const regTemp = fixRelatePathContent(tempContent, path || tempUrl);

  $.register({
    ...registerOpts,
    tag: tagName,
    temp: regTemp,
  });

  await next();
});
