import { getErr, getErrDesc } from "../ofa-error/main.js";
import { getType } from "../stanz/public.mjs";
import {
  hyphenToUpperCase,
  capitalizeFirstLetter,
  toDashCase,
} from "./public.mjs";
import { convert, render } from "./render/render.mjs";
import { eleX } from "./util.mjs";
import $ from "./dollar.mjs";

const COMPS = {};

export const renderElement = ({ defaults, ele, template, temps }) => {
  let $ele;

  try {
    const data = {
      ...deepCopyData(defaults.data, defaults.tag),
      ...defaults.attrs,
    };

    defaults.attrs &&
      Object.keys(defaults.attrs).forEach((name) => {
        const value = ele.getAttribute(toDashCase(name));
        if (value !== null && value !== undefined) {
          data[name] = value;
        }
      });

    $ele = eleX(ele);

    defaults.proto && $ele.extend(defaults.proto, { enumerable: false });

    for (let [key, value] of Object.entries(data)) {
      if (!$ele.hasOwnProperty(key)) {
        $ele[key] = value;
      }
    }

    if (defaults.temp) {
      const root = ele.attachShadow({ mode: "open" });

      root.innerHTML = template.innerHTML;

      render({
        target: root,
        data: $ele,
        temps,
      });
    }

    defaults.ready && defaults.ready.call($ele);
  } catch (error) {
    throw getErr(
      "xhear_reander_err",
      {
        tag: ele.tagName.toLowerCase(),
      },
      error
    );
  }

  if (defaults.watch) {
    const wen = Object.entries(defaults.watch);

    $ele.watchTick((e) => {
      for (let [name, func] of wen) {
        const names = name.split(",");

        if (names.length >= 2) {
          if (names.some((name) => e.hasModified(name))) {
            func.call(
              $ele,
              names.map((name) => $ele[name]),
              {
                watchers: e,
              }
            );
          }
        } else {
          if (e.hasModified(name)) {
            func.call($ele, $ele[name], {
              watchers: e,
            });
          }
        }
      }
    });

    for (let [name, func] of wen) {
      const names = name.split(",");
      if (names.length >= 2) {
        func.call(
          $ele,
          names.map((name) => $ele[name]),
          {}
        );
      } else {
        func.call($ele, $ele[name], {});
      }
    }
  }
};

export const register = (opts = {}) => {
  const defaults = {
    // Registered component name
    tag: "",
    // Body content string
    temp: "",
    // Initialization data after element creation
    data: {},
    // Values that will not be traversed
    proto: {},
    // Keys bound to attributes
    // attrs: {},
    // The listener function for the element
    // watch: {},
    // Function triggered when the component is created (data initialization complete)
    // created() { },
    // Function triggered after component data initialization is complete (initial rendering completed)
    // ready() { },
    // Functions that are added to the document trigger
    // attached() { },
    // Functions triggered by moving out of the document
    // detached() { },
    // The container element is changed
    // slotchange() { }
    ...opts,
  };

  const { fn, extensions } = $;
  if (fn) {
    // 检查 proto 和 data 上的key，是否和fn上的key冲突
    Object.keys(defaults.data).forEach((name) => {
      if (fn.hasOwnProperty(name)) {
        throw getErr("invalid_key", {
          compName: defaults.tag,
          targetName: "data",
          name,
        });
      }
    });
    Object.keys(defaults.proto).forEach((name) => {
      if (fn.hasOwnProperty(name)) {
        console.warn(
          getErrDesc("invalid_key", {
            compName: defaults.tag,
            targetName: "proto",
            name,
          }),
          opts
        );
      }
    });
  }

  let template, temps, name;

  try {
    validateTagName(defaults.tag);

    defaults.data = deepCopyData(defaults.data, defaults.tag);

    name = capitalizeFirstLetter(hyphenToUpperCase(defaults.tag));

    if (COMPS[name]) {
      throw getErr("xhear_register_exists", { name });
    }

    template = document.createElement("template");
    template.innerHTML = defaults.temp;
    temps = convert(template);
  } catch (error) {
    throw getErr("xhear_register_err", { tag: defaults.tag }, error);
  }

  const getAttrKeys = (attrs) => {
    let attrKeys;

    if (attrs instanceof Array) {
      attrKeys = [...attrs];
    } else {
      attrKeys = Object.keys(attrs);
    }

    return attrKeys;
  };

  const XElement = (COMPS[name] = class extends HTMLElement {
    constructor(...args) {
      super(...args);

      const $ele = eleX(this);

      defaults.created && defaults.created.call($ele);

      if (defaults.attrs) {
        const attrKeys = getAttrKeys(defaults.attrs);

        // fix self attribule value
        $ele.watchTick((e) => {
          attrKeys.forEach((key) => {
            if (e.hasModified(key)) {
              const val = $ele[key];
              const attrName = toDashCase(key);
              const oldVal = this.getAttribute(attrName);
              if (val === null || val === undefined) {
                this.removeAttribute(attrName);
              } else if (oldVal !== val) {
                let reval = val;

                const valType = getType(val);

                if (valType === "number" && oldVal === String(val)) {
                  // Setting the number will cause an infinite loop
                  return;
                }
                if (valType === "object") {
                  // Setting the object will cause an infinite loop
                  reval = JSON.stringify(reval);
                  if (reval === oldVal) {
                    return;
                  }
                }

                this.setAttribute(attrName, reval);
              }
            }
          });
        });

        // The data set before initialization needs to be reflected in attrs
        attrKeys.forEach((key) => {
          if (
            $ele[key] !== null &&
            $ele[key] !== undefined &&
            $ele[key] !== defaults.attrs[key]
          ) {
            this.setAttribute(toDashCase(key), $ele[key]);
          }
        });
      }

      renderElement({
        defaults,
        ele: this,
        template,
        temps,
      });
    }

    connectedCallback() {
      if (isInternal(this)) {
        return;
      }

      const $ele = eleX(this);
      defaults.attached && defaults.attached.call($ele);
      $ele.emit("attached", { bubbles: false });
      extensions.afterAttached && extensions.afterAttached($ele);
    }

    disconnectedCallback() {
      if (isInternal(this)) {
        return;
      }

      const $ele = eleX(this);
      defaults.detached && defaults.detached.call($ele);
      $ele.emit("detached", { bubbles: false });
      extensions.afterDetached && extensions.afterDetached($ele);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const $ele = eleX(this);

      if (!/[^\d.]/.test(newValue) && typeof $ele[name] === "number") {
        newValue = Number(newValue);
      }

      $ele[hyphenToUpperCase(name)] = newValue;
    }

    static get observedAttributes() {
      return getAttrKeys(defaults.attrs || {}).map((e) => toDashCase(e));
    }
  });

  if (document.readyState !== "loading") {
    customElements.define(defaults.tag, XElement);
  } else {
    const READYSTATE = "readystatechange";
    let f;
    document.addEventListener(
      READYSTATE,
      (f = () => {
        customElements.define(defaults.tag, XElement);
        document.removeEventListener(READYSTATE, f);
      })
    );
  }
};

// 判断元素是否临时脱离节点，防止数组操作导致元素触发detached问题
function isInternal(ele) {
  let target = ele;

  while (target) {
    if (target.__internal) {
      return true;
    }

    target = target.parentNode || target.host;

    if (!target || (target.tagName && target.tagName === "BODY")) {
      break;
    }
  }

  return false;
}

function validateTagName(str) {
  // Check if the string has at least one '-' character
  if (!str.includes("-")) {
    throw getErr("xhear_tag_noline", { str });
  }

  // Check if the string starts or ends with '-'
  if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
    throw getErr("xhear_validate_tag", { str });
  }

  // Check if the string has consecutive '-' characters
  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
      throw getErr("xhear_validate_tag", { str });
    }
  }

  return true;
}

function deepCopyData(obj, tag = "", keyName) {
  if (obj instanceof Set || obj instanceof Map) {
    throw getErr("xhear_regster_data_noset", { tag });
  }

  if (obj instanceof Function) {
    throw getErr("xhear_regster_data_nofunc", { tag, key: keyName });
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (/^_/.test(key) && obj[key] instanceof Function) {
        // 直接赋值私有属性
        copy[key] = obj[key];
      } else {
        copy[key] = deepCopyData(obj[key], tag, key);
      }
    }
  }

  return copy;
}
