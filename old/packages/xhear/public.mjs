import { getErr } from "../ofa-error/main.js";
import { getType } from "../stanz/public.mjs";

export const isFunction = (val) => getType(val).includes("function");

export const hyphenToUpperCase = (str) =>
  str.replace(/-([a-z])/g, (match, p1) => {
    return p1.toUpperCase();
  });

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

export const toDashCase = (str) => {
  return str.replace(/[A-Z]/g, function (match) {
    return "-" + match.toLowerCase();
  });
};

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

export const removeArrayValue = (arr, target) => {
  const index = arr.indexOf(target);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

export const searchEle = (el, expr) => {
  if (el instanceof HTMLTemplateElement) {
    return Array.from(el.content.querySelectorAll(expr));
  }
  return Array.from(el.querySelectorAll(expr));
};

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

export const isSafariBrowser = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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
