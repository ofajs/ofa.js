import { getRandomId, debounce, dataRevoked } from "./public.mjs";
import { WATCHS } from "./main.mjs";

/**
 * 变更描述对象：watch 回调的入参。
 * target 是实际变更发生的节点；currentTarget 是监听所在节点；
 * path 是两者之间的祖先链（不含 currentTarget）。
 */
class Watcher {
  constructor(opts) {
    Object.assign(this, opts);
    // 冻结保证回调拿到的变更快照不可篡改
    Object.freeze(this);
  }

  /**
   * 判断本次变更是否涉及 key（支持 "a.b" 子链写法）。
   * 冒泡场景下，只要变更发生在 key 对应的子链上即视为命中。
   */
  hasModified(k) {
    if (this.type === "array") {
      return this.path.includes(this.currentTarget[k]);
    }

    const keys = k.split(".");

    // 变更直接发生在监听节点自身
    if (this.currentTarget === this.target && this.name === keys[0]) {
      return true;
    }

    const modifieds = getModifieds(this, keys);
    const positionIndex = modifieds.indexOf(this.target);

    if (positionIndex > -1) {
      const currentKeys = keys.slice(positionIndex + 1);

      if (!currentKeys.length) {
        // 监听的就是变更节点自身
        return true;
      }

      return this.name === currentKeys[0];
    }

    // 变更来自 key 子链下更深的层级
    return this.path.includes(this.currentTarget[k]);
  }
}

// 从监听节点出发，按 key 链逐层取节点，用于定位 target 的位置
const getModifieds = (_this, keys) => {
  const modifieds = [];

  const cloneKeys = keys.slice();
  let target = _this.currentTarget;
  while (cloneKeys.length) {
    const targetKey = cloneKeys.shift();
    if (target) {
      target = target[targetKey];
    }

    modifieds.push(target);
  }

  return modifieds;
};

/** watchTick 回调收到的批量变更列表 */
class Watchers extends Array {
  constructor(arr) {
    super(...arr);
  }

  hasModified(key) {
    return this.some((e) => e.hasModified(key));
  }
}

/**
 * 派发一次变更事件：先通知当前节点的监听者，再沿 _owner 祖先链
 * 逐层向上冒泡；path 用于检测环状引用，防止死循环。
 */
export const emitUpdate = ({
  type,
  currentTarget,
  target,
  name,
  value,
  oldValue,
  args,
  path = [],
}) => {
  if (path.includes(currentTarget)) {
    // 祖先链上已出现自身，说明存在环状引用，终止冒泡
    console.warn("stanz: circular data reference, update stopped", {
      currentTarget,
      target,
      name,
    });
    return;
  }

  if (currentTarget._hasWatchs) {
    currentTarget[WATCHS].forEach((func) => {
      func(
        new Watcher({
          type,
          target,
          name,
          oldValue,
          // 数组事件的变更载体是 args 而非 value
          value: type === "array" ? undefined : value,
          args,
          currentTarget,
          path: [...path],
        })
      );
    });
  }

  const { _owner } = currentTarget;
  if (currentTarget._update && _owner.length) {
    const nextPath = [currentTarget, ...path];

    if (_owner.length === 1) {
      // 单 owner 快路径，避免分配
      emitUpdate({
        type,
        target,
        name,
        value,
        oldValue,
        args,
        currentTarget: _owner[0],
        path: nextPath,
      });
    } else {
      // 同一父级可能被登记多次（如重复 push），需按 Set 去重
      for (const parent of new Set(_owner)) {
        emitUpdate({
          type,
          target,
          name,
          value,
          oldValue,
          args,
          currentTarget: parent,
          path: nextPath,
        });
      }
    }
  }
};

/** 挂到 Stanz 原型上的监听方法集 */
export default {
  /** 注册监听，返回监听 id 供 unwatch 使用 */
  watch(callback) {
    if (!(callback instanceof Function)) {
      throw new TypeError("watch requires a function as its parameter");
    }

    const wid = "w-" + getRandomId();

    this[WATCHS].set(wid, callback);

    return wid;
  },

  unwatch(wid) {
    return this[WATCHS].delete(wid);
  },

  /**
   * 批量监听：同一微任务时钟（或 wait 毫秒内）的多次变更合并成
   * Watchers 列表回调一次；已撤销节点的变更会被自动过滤。
   */
  watchTick(callback, wait) {
    if (!(callback instanceof Function)) {
      throw new TypeError("watchTick requires a function as its parameter");
    }

    return this.watch(
      debounce((arr) => {
        if (dataRevoked(this)) {
          return;
        }

        // 过滤掉祖先链中已被 revoke 的节点
        arr = arr.filter((e) => {
          try {
            e.path.forEach((item) => item.xid);
          } catch (err) {
            return false;
          }

          return true;
        });

        callback(new Watchers(arr));
      }, wait || 0)
    );
  },

  /** 手动派发一次 refresh 事件（不改变数据） */
  refresh(opts) {
    emitUpdate({
      ...opts,
      type: "refresh",
      target: this,
      currentTarget: this,
    });
  },
};
