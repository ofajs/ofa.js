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
  /** 批量判断：任一变更命中 key 即为真 */
  hasModified(key) {
    return this.some((e) => e.hasModified(key));
  }
}

/**
 * 构造 Watchers：不能在类上写自定义构造器并以 super(...arr) 展开——
 * map/filter 等继承方法会按 Array species 契约以"长度数字"为参数构造
 * 结果实例（new Watchers(3)），展开数字会直接 TypeError。
 */
const createWatchers = (arr) => {
  const ws = new Watchers();
  ws.push(...arr);
  return ws;
};

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
  if (currentTarget._update && (_owner.length || currentTarget._bubbleOwners)) {
    const nextPath = [currentTarget, ...path];

    // 衍生库（xhear）可挂 _bubbleOwners() 把宿主链（DOM parentNode）并入
    // 冒泡路径——旧版 owner getter 即含 parentNode，是 shadow 级订阅
    // （如 formData）赖以工作的隐式语义；默认仅沿数据 owner 链
    if (currentTarget._bubbleOwners) {
      for (const parent of currentTarget._bubbleOwners()) {
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
    } else if (_owner.length === 1) {
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
    } else if (_owner.length) {
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

        callback(createWatchers(arr));
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

  /**
   * 监听直到 func() 返回真值，随后自动撤销监听并以自身（代理）兑现。
   * 与旧版一致，仅在数据变更时判定，不做注册即查——需要"已满足则立即
   * 通过"的场景由调用方先自行判断。超时（默认 30 秒）自动撤销并拒绝。
   *
   * @param {() => boolean} func 判定函数
   * @param {number} [outTime] 超时毫秒数，默认 30000
   */
  watchUntil(func, outTime = 30000) {
    if (!(func instanceof Function)) {
      throw new TypeError("watchUntil requires a function as its parameter");
    }

    return new Promise((resolve, reject) => {
      let timer;

      const tid = this.watch(() => {
        if (func()) {
          clearTimeout(timer);
          this.unwatch(tid);
          resolve(this);
        }
      });

      timer = setTimeout(() => {
        this.unwatch(tid);
        reject(new Error("watchUntil timed out"));
      }, outTime);
    });
  },
};
