/**
 * LikeArray：让 Xhear 实例的子元素可以直接用数组方法操作。
 *
 * 可变方法（push/splice/reverse…）真实搬动 DOM，并向 stanz 派发
 * type:"array" 的更新事件，让 register 的 watch 与 watchTick 感知到
 * DOM 结构变化；非可变方法（map/filter/slice…）先物化成 Xhear 实例
 * 数组再套用原生实现。
 *
 * 私有搬动以 __internal 标记，register 的 isInternal 据此抑制
 * 移动过程中的 attached/detached 误触发。
 */
import { isFunction } from "./public.mjs";
import { createXEle, eleX } from "./util.mjs";
import { emitUpdate } from "../../stanz/src/watch.mjs";

/** 在 ele 的 children 上执行一段原生 splice 语义的结构调整 */
const originSplice = (ele, start, count, ...items) => {
  const { children } = ele;
  if (start < 0) {
    start += ele.children.length;
  }

  if (count === undefined) {
    count = ele.children.length - start;
  }

  const removes = [];
  for (let i = start, len = start + count; i < len; i++) {
    const target = children[i];
    removes.push(target);
  }

  removes.forEach((el) => el && el.remove());

  if (items.length) {
    const frag = document.createDocumentFragment();
    items.forEach((e) => frag.append(createXEle(e).ele));

    const positionEle = children[start];
    if (positionEle) {
      ele.insertBefore(frag, positionEle);
    } else {
      ele.appendChild(frag);
    }
  }

  return removes;
};

const mutatingMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
  "fill",
  "copyWithin",
];

const likeArrayFn = {
  push(...args) {
    const { ele } = this;

    originSplice(ele, ele.children.length, 0, ...args);

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name: "push",
    });

    return ele.children.length;
  },

  pop() {
    const { ele } = this;

    const targets = originSplice(ele, ele.children.length - 1, 1);

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args: [],
      name: "pop",
    });

    return eleX(targets[0]);
  },

  shift() {
    const { ele } = this;

    const targets = originSplice(ele, 0, 1);

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args: [],
      name: "shift",
    });

    return eleX(targets[0]);
  },

  unshift(...args) {
    const { ele } = this;

    originSplice(ele, 0, 0, ...args);

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name: "unshift",
    });

    return ele.children.length;
  },

  splice(...args) {
    const reVal = originSplice(this.ele, ...args);

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name: "splice",
    });

    return reVal.map(eleX);
  },

  reverse(...args) {
    // 反转需带上文本节点，保证节点间文本的相对位置一同翻转
    const childs = Array.from(this.ele.childNodes);

    arrayFn.reverse.call(childs, ...args);

    const frag = document.createDocumentFragment();

    childs.forEach((ele) => {
      // 内部搬动标记，防止触发 detached 修正
      ele.__internal = 1;
      frag.append(ele);
    });

    this.ele.append(frag);

    childs.forEach((ele) => {
      delete ele.__internal;
    });

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name: "reverse",
    });

    return this;
  },

  sort(...args) {
    // 排序在 Xhear 实例上进行，文本节点不参与
    const childs = Array.from(this.ele.children).map(eleX);

    arrayFn.sort.call(childs, ...args);

    const frag = document.createDocumentFragment();

    childs.forEach((e) => {
      e.ele.__internal = 1;
      frag.append(e.ele);
    });

    this.ele.append(frag);

    childs.forEach((e) => {
      delete e.ele.__internal;
    });

    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name: "sort",
    });

    return this;
  },
};

const arrayFn = Array.prototype;

// 其余非可变方法（map/filter/slice…）：先物化为实例数组再套用原生实现
Object.keys(Object.getOwnPropertyDescriptors(arrayFn)).forEach((key) => {
  if (
    key === "constructor" ||
    key === "length" ||
    mutatingMethods.includes(key)
  ) {
    return;
  }

  const targetFunc = arrayFn[key];

  if (isFunction(targetFunc)) {
    likeArrayFn[key] = function (...args) {
      return targetFunc.apply(Array.from(this.ele.children).map(eleX), args);
    };
  }
});

export default class LikeArray {}

for (let [name, value] of Object.entries(likeArrayFn)) {
  Object.defineProperty(LikeArray.prototype, name, {
    value,
  });
}
