import $ from "../xhear/base.mjs";
import { isFunction } from "../xhear/public.mjs";
import { COMPONENT_PATH } from "./comp.mjs";

const oldAttr = $.fn.attr;

function attr(...args) {
  let [name, value, options] = args;

  if (isFunction(value)) {
    value = value();
  }

  const { host } = this;

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
    // 获取所有上级元素
    const composed = this.composedPath();

    // 查找o-app元素
    const app = composed.find((el) => el.tagName === "O-APP");

    if (app) {
      return $(app);
    }
  },
  get PATH() {
    // component or page file path
    return this[COMPONENT_PATH] || this.src || null;
  },
  attr,
});
