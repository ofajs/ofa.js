/**
 * css 存取器：$ele.css 返回一个读写联动的样式代理。
 * 读取顺序：内联 style → CSS 变量（实时取计算值）→ 计算样式兜底。
 */
import { getType } from "../../stanz/src/public.mjs";

const cssHandler = {
  set(target, key, value, receiver) {
    target._ele.style[key] = value;
    Reflect.set(target, key, value, receiver);
    return true;
  },
  get(target, key, receiver) {
    if (key === "length") {
      return 0;
    }

    // CSS 自定义属性（--x）不在 style 对象上直接暴露，走计算值
    if (key.startsWith && key.startsWith("--")) {
      return getComputedStyle(target._ele).getPropertyValue(key);
    }

    const { style } = target._ele;
    if (Array.from(style).includes(key)) {
      return style[key];
    }

    return getComputedStyle(target._ele)[key];
  },
};

class XhearCSS {
  constructor($el) {
    const obj = {};

    Object.defineProperty(obj, "_ele", {
      enumerable: false,
      get: () => $el.ele,
    });

    // 以当前内联样式为初始快照
    const { style } = $el.ele;

    Array.from(style).forEach((key) => {
      obj[key] = style[key];
    });

    return ($el._css = new Proxy(obj, cssHandler));
  }
}

export default {
  get css() {
    return new XhearCSS(this);
  },
  set css(d) {
    // 字符串整体替换，对象做增量合并
    if (getType(d) == "string") {
      this.ele.style = d;
      return;
    }

    let { style } = this;

    let nextKeys = Object.keys(d);

    // 对象里已不存在的旧键清空，保证"整体覆盖"语义
    Array.from(style).forEach((k) => {
      if (!nextKeys.includes(k)) {
        style[k] = "";
      }
    });

    Object.assign(style, d);
  },
};
