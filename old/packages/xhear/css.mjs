import { getType } from "../stanz/public.mjs";

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
    if (getType(d) == "string") {
      this.ele.style = d;
      return;
    }

    let { style } = this;

    // Covering the old style
    let nextKeys = Object.keys(d);

    // Clear the unused key
    Array.from(style).forEach((k) => {
      if (!nextKeys.includes(k)) {
        style[k] = "";
      }
    });

    Object.assign(style, d);
  },
};
