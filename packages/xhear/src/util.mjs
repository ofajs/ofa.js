/**
 * 元素包装与释放工具。
 * eleX 是整个库的入口转换器：任意 Node → Xhear 代理实例（幂等）。
 */
import Xhear from "./main.mjs";
import { getType } from "../../stanz/src/public.mjs";

export const eleX = (ele) => {
  if (!ele) return null;

  // 已包装过的元素直接复用实例，保证同一元素全库单例
  if (ele.__xhear__) {
    return ele.__xhear__;
  }

  return new Xhear({ ele });
};

/** { tag, ...attrs } 形式的对象描述 → 元素实例 */
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

// 共享一个 template 做字符串解析，避免反复创建节点
const parseTemp = document.createElement("template");

/** HTML 字符串 → 首个顶层节点（含文本节点）的 Xhear 实例 */
export const strToXEle = (str) => {
  parseTemp.innerHTML = str;
  const ele = parseTemp.content.children[0] || parseTemp.content.childNodes[0];
  parseTemp.innerHTML = "";

  return eleX(ele);
};

/**
 * 万能元素工厂：Xhear 实例 / Node / {tag} 对象 / HTML 字符串 → Xhear 实例。
 * xfill 列表项、$ele.before/after/wrap 都经由它归一化入参。
 */
export const createXEle = (expr) => {
  if (expr instanceof Xhear) {
    return expr;
  }

  if (expr instanceof Node || expr === window) {
    return eleX(expr);
  }

  switch (getType(expr)) {
    case "object":
      return objToXEle(expr);
    case "string":
      return strToXEle(expr);
  }
};

/**
 * 深度释放一个节点树上的全部渲染副作用（监听、数据绑定、watch 订阅）。
 *
 * 约定：render 过程把每个副作用的撤销函数登记在宿主节点的 __revokes
 * 数组上（FakeNode/组件根/shadowRoot 同样适用），revokeAll 沿树递归执行。
 * x-if 清空内容、x-fill 删项、组件销毁都依赖这个统一出口。
 */
export const revokeAll = (target) => {
  if (target.__revokes) {
    Array.from(target.__revokes).forEach((f) => f && f());
  }
  target.childNodes &&
    Array.from(target.childNodes).forEach((el) => {
      revokeAll(el);
    });

  const shadowRevokes = target?.shadowRoot?.__revokes;

  if (shadowRevokes) {
    [...shadowRevokes].forEach((f) => f());
  }
};
