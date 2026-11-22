/**
 * $.fn 扩展：app 定位、PATH 组件/页面地址、attr 相对资源解析。
 */
import $ from "../../xhear/src/base.mjs";
import { isFunction } from "../../xhear/src/public.mjs";
import { COMPONENT_PATH } from "./comp.mjs";

const oldAttr = $.fn.attr;

function attr(...args) {
  let [name, value, options] = args;

  if (isFunction(value)) {
    value = value();
  }

  const { host } = this;

  // 组件/页面内的相对 href/src 基于 PATH 解析为绝对地址
  if (host && ["href", "src"].includes(name) && /^\./.test(value)) {
    const { PATH } = host;

    if (PATH) {
      const { href } = new URL(value, PATH);

      return oldAttr.call(this, name, href);
    }
  }

  return oldAttr.call(this, ...args);
}

attr.always = oldAttr.always;

$.fn.extend({
  get app() {
    // 沿事件路径向上查找 o-app 元素
    const composed = this.composedPath();

    const app = composed.find((el) => el.tagName === "O-APP");

    if (app) {
      return $(app);
    }
  },
  get PATH() {
    // 组件或页面文件地址
    return this[COMPONENT_PATH] || this.src || null;
  },
  attr,
});
