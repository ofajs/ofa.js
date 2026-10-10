/**
 * Xhear 实例的代理 handler：在 stanz 观察语义之上叠加"子元素即数组项"。
 *
 * - 数字键读写直接映射到 ele.children[i]（ownKeys 同步合并子元素索引，
 *   使 spread / Object.keys 能枚举出子元素）；
 * - 其余键委托给 stanz 的 handler（数据观察、_ 前缀旁路等）；
 * - 同值赋值短路，避免 text 等属性重设引发焦点丢失类的无谓更新。
 */
import { eleX } from "./util.mjs";
import { handler as stanzHandler } from "../../stanz/src/accessor.mjs";

/** 字符串是否为十进制数字键（空串不算，避免误伤） */
const isIndexKey = (key) => typeof key === "string" && /^\d+$/.test(key);

export const handler = {
  set(target, key, value, receiver) {
    if (isIndexKey(key)) {
      // 子元素不支持通过索引直接赋值，维持原生行为
      return Reflect.set(target, key, value, receiver);
    }

    if (target[key] === value) {
      // 同值短路：修复 'text' 被重设导致焦点重映射的问题
      return true;
    }

    if (key === "html") {
      // 含单引号的 HTML 经 innerHTML 归一化后双引号互换，会引发无限更新；
      // 且塞入自定义元素时归一化结果可能不等值，故直写不做归一化
      return Reflect.set(target, key, value, receiver);
    }

    return stanzHandler.set(target, key, value, receiver);
  },
  get(target, key, receiver) {
    if (isIndexKey(key)) {
      return eleX(target.ele.children[key]);
    }

    return Reflect.get(target, key, receiver);
  },
  ownKeys(target) {
    let keys = Reflect.ownKeys(target);
    let len = target.ele.children.length;
    for (let i = 0; i < len; i++) {
      keys.push(String(i));
    }
    return keys;
  },
  getOwnPropertyDescriptor(target, key) {
    if (isIndexKey(key)) {
      return {
        enumerable: true,
        configurable: true,
      };
    }
    return Reflect.getOwnPropertyDescriptor(target, key);
  },
};
