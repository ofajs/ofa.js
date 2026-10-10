/**
 * $ 函数本体：字符串且非 HTML → 页面选择器；其余交给 createXEle 归一化。
 * $.extensions 是上层框架（ofa.js）注册生命周期钩子的容器。
 */
import { eleX, createXEle } from "./util.mjs";
import { getType } from "../../stanz/src/public.mjs";

export default function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

Object.defineProperties($, {
  // 供上层框架挂载扩展（如 ofa.js 的 afterAttached/afterDetached）
  extensions: {
    value: {},
  },
});
