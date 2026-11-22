/**
 * xhear 的通用工具函数（纯函数，无副作用）。
 * 注意：hyphenToUpperCase / toDashCase / searchEle / isFunction 是旧版
 * ofa.js 直接引入的接缝导出，签名不可随意变更。
 */
import { getType } from "../../stanz/src/public.mjs";

export { getType };

export const isFunction = (val) => getType(val).includes("function");

/** "data-name" → "dataName" */
export const hyphenToUpperCase = (str) =>
  str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());

/** "dataName" → "data-name" */
export const toDashCase = (str) =>
  str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());

export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/** 逐项严格相等的数组比较（长度与顺序敏感） */
export const isArrayEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

/** 对象是否有可枚举的自有属性；falsy 入参直接返回 false */
export function isEmptyObject(obj) {
  if (!obj) {
    return false;
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

/** 就地移除数组中首个严格相等的项（找不到则不动） */
export const removeArrayValue = (arr, target) => {
  const index = arr.indexOf(target);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

/**
 * 元素查询：template 元素查其 content，其余等价 querySelectorAll，
 * 返回数组快照（避免渲染过程中的活 NodeList 干扰遍历）。
 */
export const searchEle = (el, expr) => {
  if (el instanceof HTMLTemplateElement) {
    return Array.from(el.content.querySelectorAll(expr));
  }
  return Array.from(el.querySelectorAll(expr));
};

/**
 * 以 obj2 为准同步 obj1：删掉 obj1 多出的键，再覆盖 obj2 的全部键。
 * formData 双向绑定用它把表单数据合并进结果对象。
 */
export function mergeObjects(obj1, obj2) {
  for (let key of Object.keys(obj1)) {
    if (!obj2.hasOwnProperty(key)) {
      delete obj1[key];
    }
  }

  for (let [key, value] of Object.entries(obj2)) {
    obj1[key] = value;
  }
}

/** Safari 判定：replace-temp 自定义内置元素在 Safari 不支持，需走降级路径 */
export const isSafariBrowser = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/**
 * 渲染报错时的补充定位信息：标明 $host/$data 用法提示与来源模块路径。
 * PATH 由上层框架（ofa.js）按需注入，纯 xhear 环境下为空。
 */
export const getRenderErrorSupplementary = (data) => {
  if (!data) {
    return "";
  }

  let supplementary = "";
  if (data.$host || data.$data) {
    supplementary = "Please check the usage of $host or $data, ";
  }

  const fromSrc = data.$host?.PATH || data.PATH;

  if (fromSrc) {
    supplementary += `from file: ${fromSrc}, `;
  }

  return supplementary;
};
