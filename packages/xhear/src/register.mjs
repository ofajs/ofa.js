/**
 * 组件注册：$.register({ tag, temp, data, attrs, proto, watch,
 * created, ready, attached, detached })。
 *
 * 时序（与自定义元素升级语义对齐）：
 * - constructor：created → attrs 初始反射 → renderElement
 *   （数据默认值 + proto 扩展 + shadow 渲染 + ready）→ watch 接线；
 * - connectedCallback / disconnectedCallback：attached / detached
 *   （__internal 标记的内部搬动不触发）；
 * - attributeChangedCallback：外部属性写入 → 实例数据（数字串自动转数值）。
 */
import { getErr, getErrDesc } from "./error.mjs";
import { getType } from "../../stanz/src/public.mjs";
import {
  hyphenToUpperCase,
  capitalizeFirstLetter,
  toDashCase,
} from "./public.mjs";
import { convert } from "./render/compile.mjs";
import { render as renderFn } from "./render/render.mjs";
import { eleX } from "./util.mjs";
import $ from "./dollar.mjs";

const COMPS = {};

/**
 * 组件渲染核心（ofa.js 的接缝导出）：装配数据、扩展 proto、
 * 渲染 shadow、触发 ready，最后接通 watch。
 */
export const renderElement = ({ defaults, ele, template, temps }) => {
  let $ele;

  try {
    const data = {
      ...deepCopyData(defaults.data, defaults.tag),
      ...defaults.attrs,
    };

    // attrs 默认值：元素上已有同名属性（解析器创建时）则以其为准
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
      // 元素上已存在的值（如升级前外部已赋值）不覆盖
      console.debug(
        "[xt-data]",
        key,
        "has=" + $ele.hasOwnProperty(key),
        "set=" + JSON.stringify(value),
      );
      if (!$ele.hasOwnProperty(key)) {
        $ele[key] = value;
      }
    }

    if (defaults.temp) {
      const root = ele.attachShadow({ mode: "open" });

      // render 内部克隆编译产物并按描述符绑定（旧版 innerHTML 重解析已废）
      renderFn({
        target: root,
        data: $ele,
        temps,
        template,
      });
    }

    defaults.ready && defaults.ready.call($ele);
  } catch (error) {
    throw getErr(
      "xhear_reander_err",
      {
        tag: ele.tagName.toLowerCase(),
      },
      error,
    );
  }

  if (defaults.watch) {
    const wen = Object.entries(defaults.watch);

    // 批量变更统一走 watchTick；"a,b" 多键监听任一命中即触发
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
              },
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

    // watch 回调在初始化时先跑一遍（以当前值触发）
    for (let [name, func] of wen) {
      const names = name.split(",");
      if (names.length >= 2) {
        func.call(
          $ele,
          names.map((name) => $ele[name]),
          {},
        );
      } else {
        func.call($ele, $ele[name], {});
      }
    }
  }
};

export const register = (opts = {}) => {
  const defaults = {
    // 注册的组件名
    tag: "",
    // 组件模板字符串
    temp: "",
    // 元素创建后的初始数据
    data: {},
    // 不参与数据遍历的原型扩展（方法等）
    proto: {},
    // ...opts 支持的其余字段：attrs / created / ready / attached / detached
    ...opts,
  };

  const { fn, extensions } = $;
  if (fn) {
    // proto/data 的键与元素原型能力冲突时提前报错/警告
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
          opts,
        );
      }
    });
  }

  let template, temps, name;

  try {
    validateTagName(defaults.tag);

    console.debug(
      "[xt-register]",
      defaults.tag,
      "dataKeys=" + Object.keys(defaults.data || {}).join(","),
      "protoKeys=" + Object.keys(defaults.proto || {}).join(","),
    );

    defaults.data = deepCopyData(defaults.data, defaults.tag);

    name = capitalizeFirstLetter(hyphenToUpperCase(defaults.tag));

    if (COMPS[name]) {
      throw getErr("xhear_register_exists", { name });
    }

    // 注册期完成一次模板编译，所有实例共享编译产物
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

        // 数据 → 属性反射：数据变化同步到 dash-case 属性上
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
                  // 数字回写会与 attributeChangedCallback 形成循环，跳过
                  return;
                }
                if (valType === "object") {
                  reval = JSON.stringify(reval);
                  if (reval === oldVal) {
                    // 同上，序列化后等值则跳过
                    return;
                  }
                }

                this.setAttribute(attrName, reval);
              }
            }
          });
        });

        // 升级前外部已设置的数据要反射到属性上
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

      // 纯数字字符串且目标属性是数值时自动转换
      if (!/[^\d.]/.test(newValue) && typeof $ele[name] === "number") {
        newValue = Number(newValue);
      }

      $ele[hyphenToUpperCase(name)] = newValue;
    }

    static get observedAttributes() {
      return getAttrKeys(defaults.attrs || {}).map((e) => toDashCase(e));
    }
  });

  // 文档解析中先挂起定义，readyState 就绪后再 define
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
      }),
    );
  }
};

/** 是否处于内部搬动中（自身或祖先带 __internal 标记） */
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

/**
 * 校验自定义元素命名：必须含 '-'；首尾不得是 '-'；
 * 不得出现连续 '--'（与旧版校验口径一致）。
 */
function validateTagName(str) {
  if (!str.includes("-")) {
    throw getErr("xhear_tag_noline", { str });
  }

  if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
    throw getErr("xhear_validate_tag", { str });
  }

  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
      throw getErr("xhear_validate_tag", { str });
    }
  }

  return true;
}

/** 注册数据的深拷贝：Set/Map/函数直接抛错（函数应放 proto 或 _ 前缀） */
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
        // _ 前缀函数为系统自用，直接引用不拷贝
        copy[key] = obj[key];
      } else {
        copy[key] = deepCopyData(obj[key], tag, key);
      }
    }
  }

  return copy;
}
