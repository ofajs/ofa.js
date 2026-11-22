import { clearOwner } from "./accessor.mjs";
import { SELF, PROXY, isxdata } from "./main.mjs";
import { isObject } from "./public.mjs";
import { emitUpdate } from "./watch.mjs";

const native = Array.prototype;

/**
 * 沿 owner 祖先链（含环防护）检查是否存在任何监听者。
 * 全链无监听时，数组变更可跳过备份复制与事件构建，
 * 写入热路径只保留包裹和 owner 登记这些必要工作。
 */
const hasWatchersUpwards = (start) => {
  const seen = new Set();
  const stack = [start];

  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);

    if (node._hasWatchs) return true;

    for (const parent of node._owner) {
      stack.push(parent);
    }
  }

  return false;
};

/** 生成 [from, from + count) 的索引序列 */
const range = (from, count) => Array.from({ length: count }, (_, i) => from + i);

/**
 * 变更收尾：清理被移除项的 owner、为新增项补包裹并登记 owner，
 * 备份存在（即链上有监听）时派发数组事件。
 */
const finishMutation = function (backup, removedItems, addedIndices, args, name) {
  for (const item of removedItems) {
    clearOwner(item, this);
  }

  for (const index of addedIndices) {
    const value = this[index];

    if (isxdata(value)) {
      value._owner.push(this);
    } else if (isObject(value)) {
      // 等值重赋值会走包裹逻辑，__unupdate 抑制多余事件
      this.__unupdate = 1;
      this[index] = value;
      delete this.__unupdate;
    }
  }

  if (backup) {
    emitUpdate({
      type: "array",
      currentTarget: this,
      target: this,
      args,
      name,
      oldValue: backup,
    });
  }
};

const fn = {};

// ---- 解析型方法：变更位置可从参数与返回值直接推算，免去全量差分 ----

fn.push = function (...args) {
  const oldLen = this.length;
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.push.apply(this[SELF], args);

  finishMutation.call(this, backup, [], range(oldLen, args.length), args, "push");
  return reval;
};

fn.unshift = function (...args) {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.unshift.apply(this[SELF], args);

  finishMutation.call(this, backup, [], range(0, args.length), args, "unshift");
  return reval;
};

fn.pop = function () {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.pop.apply(this[SELF]);

  finishMutation.call(this, backup, reval === undefined ? [] : [reval], [], [], "pop");
  return reval;
};

fn.shift = function () {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.shift.apply(this[SELF]);

  finishMutation.call(this, backup, reval === undefined ? [] : [reval], [], [], "shift");
  return reval;
};

fn.splice = function (...args) {
  const oldLen = this.length;
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  // splice 的返回值即被移除项，无需差分
  const removed = native.splice.apply(this[SELF], args);

  // 与 Array.prototype.splice 相同的 start 归一化，推算插入区间
  let start = args.length ? Number(args[0]) : 0;
  start = Number.isNaN(start) ? 0 : Math.trunc(start);
  start = start < 0 ? Math.max(oldLen + start, 0) : Math.min(start, oldLen);
  const insertCount = Math.max(args.length - 2, 0);

  finishMutation.call(this, backup, removed, range(start, insertCount), args, "splice");
  return removed;
};

// ---- 重排型方法：只打乱现有项顺序，不变更成员，owner 无需增删 ----

["reverse", "sort"].forEach((methodName) => {
  fn[methodName] = function (...args) {
    const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

    const reval = native[methodName].apply(this[SELF], args);

    if (backup) {
      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: methodName,
        oldValue: backup,
      });
    }

    return reval === this[SELF] ? this[PROXY] : reval;
  };
});

// ---- 写入型方法：可能引入新成员，走引用计数差分 ----

function diffArrays(oldArray, newArray) {
  // 引用计数式差分：O(n+m)，替代旧版双重 indexOf 扫描的 O(n²)
  const counts = new Map();
  for (const item of oldArray) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  const addedItems = new Map();
  for (let i = 0, len = newArray.length; i < len; i++) {
    const item = newArray[i];
    const count = counts.get(item);
    if (count) {
      counts.set(item, count - 1);
    } else {
      addedItems.set(i, item);
    }
  }

  const deletedItems = [];
  for (const [item, count] of counts) {
    for (let i = 0; i < count; i++) {
      deletedItems.push(item);
    }
  }

  return { deletedItems, addedItems };
}

["fill", "copyWithin"].forEach((methodName) => {
  fn[methodName] = function (...args) {
    const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

    const reval = native[methodName].apply(this[SELF], args);

    if (backup) {
      const { deletedItems, addedItems } = diffArrays(backup, this);

      for (const item of deletedItems) {
        clearOwner(item, this);
      }

      for (const [index] of addedItems) {
        const value = this[index];

        if (isxdata(value)) {
          value._owner.push(this);
        } else if (isObject(value)) {
          this.__unupdate = 1;
          this[index] = value;
          delete this.__unupdate;
        }
      }

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: methodName,
        oldValue: backup,
      });
    }

    return reval === this[SELF] ? this[PROXY] : reval;
  };
});

// 非变更方法在纯数组副本上执行：避免子类 species 语义把结果再包成 stanz
["concat", "filter", "slice", "flatMap", "map"].forEach((methodName) => {
  const oldFunc = native[methodName];
  if (oldFunc instanceof Function) {
    fn[methodName] = function (...args) {
      return oldFunc.call(Array.from(this), ...args);
    };
  }
});

export default fn;
