import Xhear from "./main.mjs";
import { getType } from "../stanz/public.mjs";

export const eleX = (ele) => {
  if (!ele) return null;

  if (ele.__xhear__) {
    return ele.__xhear__;
  }

  return new Xhear({ ele });
};

export const objToXEle = (obj) => {
  const data = { ...obj };

  if (!obj.tag) {
    return null;
  }

  const ele = document.createElement(obj.tag);
  delete data.tag;
  const $ele = eleX(ele);

  Object.assign($ele, data);

  return $ele;
};

const temp = document.createElement("template");

export const strToXEle = (str) => {
  temp.innerHTML = str;
  const ele = temp.content.children[0] || temp.content.childNodes[0];
  temp.innerHTML = "";

  return eleX(ele);
};

export const createXEle = (expr, exprType) => {
  if (expr instanceof Xhear) {
    return expr;
  }

  if (expr instanceof Node || expr === window) {
    return eleX(expr);
  }

  const type = getType(expr);

  switch (type) {
    case "object":
      return objToXEle(expr);
    case "string":
      return strToXEle(expr);
  }
};

export const revokeAll = (target) => {
  if (target.__revokes) {
    Array.from(target.__revokes).forEach((f) => f && f());
  }
  target.childNodes &&
    Array.from(target.childNodes).forEach((el) => {
      revokeAll(el);
    });

  const revokes = target?.shadowRoot?.__revokes;

  if (revokes) {
    [...revokes].forEach((f) => f());
  }
};
