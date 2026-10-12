//! ofa.js - v5.0.0 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
const getRandomId = () => Math.random().toString(32).slice(2);

const objectToString = Object.prototype.toString;

/** 取数据的内部类型标签（如 "object"、"array"），供 xhear 等高频调用 */
const getType = (value) => objectToString.call(value).slice(8, -1).toLowerCase();

/**
 * 是否为可包裹的数据（plain object 或数组）。
 * 直接比对 toString 标签，语义与旧版正则清洗一致但开销小得多。
 */
const isObject = (obj) => {
  const tag = objectToString.call(obj);
  return tag === "[object Object]" || tag === "[object Array]";
};

/** 微任务时机的下一帧回调，是 watchTick 批量合并的基础 */
const nextTick = (callback) => {
  Promise.resolve().then(callback);
};

/**
 * 防抖：wait > 0 用定时器合并；否则按微任务时钟合并，
 * 触发时以参数数组的形式一次性回调。
 */
function debounce(func, wait = 0) {
  let timeout = null;
  let hisArgs = [];

  return function (...args) {
    hisArgs.push(...args);

    if (wait > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const merged = hisArgs;
        hisArgs = [];
        timeout = null;
        func.call(this, merged);
      }, wait);
    } else if (timeout === null) {
      // 占位标记，保证同一微任务时钟只调度一次
      timeout = 1;
      nextTick(() => {
        timeout = null;
        const merged = hisArgs;
        hisArgs = [];
        func.call(this, merged);
      });
    }
  };
}

/**
 * 把 proto 上的方法（含 symbol 键）扩展到目标对象上；
 * descriptor 可覆盖属性描述符（如 enumerable: false）。
 */
const extend = (_this, proto, descriptor = {}) => {
  [
    ...Object.getOwnPropertyNames(proto),
    ...Object.getOwnPropertySymbols(proto),
  ].forEach((k) => {
    const result = Object.getOwnPropertyDescriptor(proto, k);
    const { configurable, enumerable, writable, get, set, value } = result;

    if ("value" in result) {
      if (_this.hasOwnProperty(k)) {
        _this[k] = value;
      } else {
        Object.defineProperty(_this, k, {
          enumerable,
          configurable,
          writable,
          ...descriptor,
          value,
        });
      }
    } else {
      Object.defineProperty(_this, k, {
        enumerable,
        configurable,
        ...descriptor,
        get,
        set,
      });
    }
  });

  return _this;
};

// 检测 Proxy 是否已被 revoke：撤销后任何操作都会抛 TypeError
function dataRevoked(proxyToCheck) {
  try {
    Object.getPrototypeOf(proxyToCheck);
    return false;
  } catch (error) {
    return error instanceof TypeError;
  }
}

/**
 * xhear 的通用工具函数（纯函数，无副作用）。
 * 注意：hyphenToUpperCase / toDashCase / searchEle / isFunction 是旧版
 * ofa.js 直接引入的接缝导出，签名不可随意变更。
 */

const isFunction = (val) => getType(val).includes("function");

/** "data-name" → "dataName" */
const hyphenToUpperCase = (str) =>
  str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());

/** "dataName" → "data-name" */
const toDashCase = (str) =>
  str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/** 对象是否有可枚举的自有属性；falsy 入参直接返回 false */
function isEmptyObject(obj) {
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
const removeArrayValue = (arr, target) => {
  const index = arr.indexOf(target);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

/**
 * 元素查询：template 元素查其 content，其余等价 querySelectorAll，
 * 返回数组快照（避免渲染过程中的活 NodeList 干扰遍历）。
 */
const searchEle = (el, expr) => {
  if (el instanceof HTMLTemplateElement) {
    return Array.from(el.content.querySelectorAll(expr));
  }
  return Array.from(el.querySelectorAll(expr));
};

/**
 * 渲染报错时的补充定位信息：标明 $host/$data 用法提示与来源模块路径。
 * PATH 由上层框架（ofa.js）按需注入，纯 xhear 环境下为空。
 */
const getRenderErrorSupplementary = (data) => {
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

/**
 * 变更描述对象：watch 回调的入参。
 * target 是实际变更发生的节点；currentTarget 是监听所在节点；
 * path 是两者之间的祖先链（不含 currentTarget）。
 */
class Watcher {
  constructor(
    type,
    target,
    name,
    oldValue,
    value,
    args,
    currentTarget,
    path,
  ) {
    this.type = type;
    this.target = target;
    this.name = name;
    this.oldValue = oldValue;
    this.value = value;
    this.args = args;
    this.currentTarget = currentTarget;
    this.path = path;
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
 *
 * 内部走位置参数的 _emit：热路径上每次冒泡省去 opts 对象分配与
 * 8 变量解构；对外仍保留对象签名的 emitUpdate（xhear 的 form/array
 * 与 refresh 在用）。
 */
const emitUpdate = (opts) => {
  _emit(
    opts.type,
    opts.target,
    opts.name,
    opts.value,
    opts.oldValue,
    opts.args,
    opts.currentTarget,
    opts.path || [],
  );
};

const _emit = (
  type,
  target,
  name,
  value,
  oldValue,
  args,
  currentTarget,
  path,
) => {
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
    // 同一节点上的全部监听共享同一份快照（Watcher 构造后即冻结）
    const watcher = new Watcher(
      type,
      target,
      name,
      oldValue,
      type === "array" ? undefined : value,
      args,
      currentTarget,
      path,
    );
    currentTarget[WATCHS].forEach((func) => {
      func(watcher);
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
        _emit(type, target, name, value, oldValue, args, parent, nextPath);
      }
    } else if (_owner.length === 1) {
      // 单 owner 快路径，避免分配
      _emit(type, target, name, value, oldValue, args, _owner[0], nextPath);
    } else if (_owner.length === 2) {
      // 双 owner 是常态（数据同时挂在父数据和行渲染数据上）：
      // O(1) 比较去重，省掉 Set 分配
      const ownerA = _owner[0];
      const ownerB = _owner[1];

      _emit(type, target, name, value, oldValue, args, ownerA, nextPath);

      if (ownerB !== ownerA) {
        _emit(type, target, name, value, oldValue, args, ownerB, nextPath);
      }
    } else if (_owner.length) {
      // 同一父级可能被登记多次（如重复 push），需按 Set 去重
      for (const parent of new Set(_owner)) {
        _emit(type, target, name, value, oldValue, args, parent, nextPath);
      }
    }
  }
};

/** 挂到 Stanz 原型上的监听方法集 */
var watchFn = {
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

const fn$1 = {};

// ---- 解析型方法：变更位置可从参数与返回值直接推算，免去全量差分 ----

fn$1.push = function (...args) {
  const oldLen = this.length;
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.push.apply(this[SELF], args);

  finishMutation.call(this, backup, [], range(oldLen, args.length), args, "push");
  return reval;
};

fn$1.unshift = function (...args) {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.unshift.apply(this[SELF], args);

  finishMutation.call(this, backup, [], range(0, args.length), args, "unshift");
  return reval;
};

fn$1.pop = function () {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.pop.apply(this[SELF]);

  finishMutation.call(this, backup, reval === undefined ? [] : [reval], [], [], "pop");
  return reval;
};

fn$1.shift = function () {
  const backup = hasWatchersUpwards(this) ? Array.from(this) : null;

  const reval = native.shift.apply(this[SELF]);

  finishMutation.call(this, backup, reval === undefined ? [] : [reval], [], [], "shift");
  return reval;
};

fn$1.splice = function (...args) {
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
  fn$1[methodName] = function (...args) {
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
  fn$1[methodName] = function (...args) {
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
    fn$1[methodName] = function (...args) {
      return oldFunc.call(Array.from(this), ...args);
    };
  }
});

const { defineProperties: defineProperties$2, getOwnPropertyDescriptor, entries } = Object;

const SELF = Symbol("self");
const PROXY = Symbol("proxy");
const WATCHS = Symbol("watchs");
const ISXDATA = Symbol("isxdata");

/** 判断数据是否为 stanz 实例（经代理或原始 self 均可命中） */
const isxdata = (val) => val && !!val[ISXDATA];

/**
 * 实例构造核心：在 this 上套一层可撤销代理并初始化内部字段。
 * 独立导出是为了让衍生库（如 xhear 的 XData）能传入自定义 handler 复用
 * 整套构造逻辑，这是本库对外的关键扩展缝。
 */
function constructor(data, handler = handler$1) {
  const { proxy: proxySelf, revoke } = Proxy.revocable(this, handler);

  // 更新事件是否向祖先冒泡；_ 前缀属性可直接写，不走代理观察逻辑
  proxySelf._update = 1;

  let watchs;

  defineProperties$2(this, {
    xid: { value: data.xid || getRandomId() },
    // 全部父级引用（被挂载到谁身上），事件冒泡的依据
    _owner: {
      value: [],
    },
    // 对外只读快照，内部冒泡直接遍历 _owner 避免每次分配 Set
    owner: {
      configurable: true,
      get() {
        return new Set(this._owner);
      },
    },
    [ISXDATA]: {
      value: true,
    },
    [SELF]: {
      configurable: true,
      // 闭包指向原始 self，而非代理；访问时的 receiver 是代理
      get: () => this,
    },
    [PROXY]: {
      configurable: true,
      get: () => proxySelf,
    },
    // 监听函数表，首个 watch 时才创建
    [WATCHS]: {
      get: () => watchs || (watchs = new Map()),
    },
    _hasWatchs: {
      get: () => !!watchs,
    },
    _revoke: {
      value: revoke,
    },
    // 初始数据是否为数组，toJSON 还原形状时使用
    __init_is_array: {
      value: Array.isArray(data),
    },
  });

  Object.keys(data).forEach((key) => {
    const desc = getOwnPropertyDescriptor(data, key);

    if (desc.get || desc.set) {
      // 访问器属性原样保留；getter/setter 内的 this 会绑定到代理实例
      defineProperties$2(this, {
        [key]: desc,
      });
    } else {
      // 普通值走代理赋值，嵌套对象会在 set 陷阱中完成包裹
      proxySelf[key] = desc.value;
    }
  });

  return proxySelf;
}

class Stanz extends Array {
  constructor(data, options) {
    // options 是衍生类库使用的参数，stanz 本身不消费
    super();

    return constructor.call(this, data);
  }

  // 注销实例：清空监听、解除双向引用并撤销代理，之后实例不可再操作
  revoke() {
    const self = this[SELF];

    // 衍生库可预先挂载清理钩子
    if (self._onrevokes) {
      self._onrevokes.forEach((f) => f());
      self._onrevokes.length = 0;
    }

    self.__unupdate = 1;

    self[WATCHS].clear();

    entries(this).forEach(([name, value]) => {
      if (isxdata(value)) {
        this[name] = null;
      }
    });

    self._owner.forEach((parent) => {
      entries(parent).forEach(([name, value]) => {
        if (value === this) {
          parent[name] = null;
        }
      });
    });

    delete self[SELF];
    delete self[PROXY];
    self._revoke();
  }

  toJSON() {
    let obj = {};

    let isPureArray = true;
    let maxId = -1;

    const initIsArray = this.__init_is_array;

    Object.keys(this).forEach((k) => {
      let val = this[k];

      if (!/\D/.test(k)) {
        // 纯数字键按数组索引还原
        k = parseInt(k);
        if (k > maxId) {
          maxId = k;
        }
      } else {
        isPureArray = false;
      }

      if (isxdata(val)) {
        val = val.toJSON();
      }

      obj[k] = val;
    });

    if (isPureArray) {
      obj.length = maxId + 1;
      obj = Array.from(obj);

      if (!obj.length && !initIsArray) {
        // 初始不是数组却为空时，按对象还原
        obj = {};
      }
    }

    // 结果保留 xid，便于与原实例对应
    const xid = this.xid;
    defineProperties$2(obj, {
      xid: {
        get: () => xid,
      },
    });

    return obj;
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  extend(obj, desc) {
    return extend(this, obj, desc);
  }
}

Stanz.prototype.extend(
  { ...watchFn, ...fn$1 },
  {
    enumerable: false,
  }
);

const { defineProperties: defineProperties$1 } = Object;

/**
 * 赋值核心：处理 stanz 值的 owner 登记、普通对象的自动包裹、
 * 旧值的 owner 清理，以及变更事件的派发。
 */
const setData = ({ target, key, value, receiver, type, succeed }) => {
  const oldValue = receiver[key];

  let data = value;
  if (isxdata(data)) {
    // 同一个 stanz 重复赋值无需任何处理
    if (oldValue === value) {
      return true;
    }
    data._owner.push(receiver);
  } else if (isObject(value)) {
    // 普通对象/数组先包裹成 stanz 再挂载；
    // 目标属性已有访问器描述时不包裹，交给访问器自行处理
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (!desc || "value" in desc) {
      // __OriginStanz 允许衍生库指定包裹用的类
      data = new (target.__OriginStanz || Stanz)(value, {
        owner: receiver,
      });

      data._owner.push(receiver);
    }
  }

  const isSame = oldValue === value;

  // 值被替换时，解除旧 stanz 值与本实例的 owner 关系
  if (!isSame && isxdata(oldValue)) {
    clearOwner(oldValue, receiver);
  }

  const reval = succeed(data);

  if (!isSame && !target.__unupdate) {
    // __unupdate: 系统内部操作（如数组包裹新项）时临时抑制事件
    emitUpdate({
      type: type || "set",
      target: receiver,
      currentTarget: receiver,
      name: key,
      value,
      oldValue,
    });
  }

  return reval;
};

// 数据从宿主移除时，反向清理 owner 登记
const clearOwner = (targetData, owner) => {
  if (isxdata(targetData)) {
    const index = targetData._owner.indexOf(owner);
    if (index > -1) {
      targetData._owner.splice(index, 1);
    } else {
      console.warn("stanz: clearing owner mismatch", {
        owner,
        mismatch: targetData,
      });
    }
  }
};

const handler$1 = {
  set(target, key, value, receiver) {
    // symbol 键不参与数据观察
    if (typeof key === "symbol") {
      return Reflect.set(target, key, value, receiver);
    }

    // _ 前缀属性为系统自用：直接落到 target，不触发观察逻辑
    if (key.charCodeAt(0) === 95 /* "_" */) {
      if (!target.hasOwnProperty(key)) {
        defineProperties$1(target, {
          [key]: {
            writable: true,
            configurable: true,
            value,
          },
        });
      } else {
        Reflect.set(target, key, value, receiver);
      }
      return true;
    }

    return setData({
      target,
      key,
      value,
      receiver,
      succeed(data) {
        return Reflect.set(target, key, data, receiver);
      },
    });
  },
  deleteProperty(target, key) {
    if (typeof key === "symbol" || key.charCodeAt(0) === 95 /* "_" */) {
      return Reflect.deleteProperty(target, key);
    }

    return setData({
      target,
      key,
      value: undefined,
      receiver: target[PROXY],
      type: "delete",
      succeed() {
        return Reflect.deleteProperty(target, key);
      },
    });
  },
};

/**
 * Xhear 实例的代理 handler：在 stanz 观察语义之上叠加"子元素即数组项"。
 *
 * - 数字键读写直接映射到 ele.children[i]（ownKeys 同步合并子元素索引，
 *   使 spread / Object.keys 能枚举出子元素）；
 * - 其余键委托给 stanz 的 handler（数据观察、_ 前缀旁路等）；
 * - 同值赋值短路，避免 text 等属性重设引发焦点丢失类的无谓更新。
 */

/** 字符串是否为十进制数字键（空串不算，避免误伤） */
const isIndexKey = (key) => typeof key === "string" && /^\d+$/.test(key);

const handler = {
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

    return handler$1.set(target, key, value, receiver);
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

/**
 * xhear 的统一错误机制：本地错误码描述表 + 轻量 Error 类。
 *
 * 旧版依赖 ofa-error：会把错误码表放在远端，运行时在线 fetch 本地化文案——
 * 引入网络依赖与失败路径，属于被废弃的设计。本表只收录 xhear 自己用到的
 * 错误码，文案随源码走，离线可用。
 */

/** xhear 的统一错误类型：携带稳定的机器可读错误码（code） */
class XhearError extends Error {
  /**
   * @param {string} code 稳定的错误码（如 xhear_register_err）
   * @param {string} message 人类可读的描述
   * @param {{cause?: unknown}} [options] 底层错误，经 super 传入形成错误链
   */
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
  }
}

/** 错误码 → 描述模板；{name} 等占位符由 getErr 用 options 填充 */
const errorDescs$1 = {
  failed_to_get_data: "Error in getting {key}",
  invalid_key:
    "The parameters for registering the '{compName}' component are incorrect. The '{name}' on '{targetName}' is already occupied. Please change '{name}' to another name.",
  xhear_wrap_no_parent:
    "The target element has no parent element, the wrap method cannot be used",
  xhear_unwrap_has_siblings:
    "The target element contains adjacent nodes, the unwrap method cannot be used",
  xhear_eval: "Template syntax '{name}' error, expression {name}:{arg0}=\"{arg1}\"",
  xhear_listen_already:
    "An old listener already exists, and this element is rendering incorrectly.",
  xhear_reander_err: "Failed to render the tag '{tag}'",
  xhear_register_exists:
    "The component '{name}' already exists, and this component cannot be registered repeatedly",
  xhear_register_err: "Error in registering the '{tag}' component",
  xhear_validate_tag:
    "The registered component name '{str}' is incorrect. For the Web Components naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_tag_noline:
    "The registered component name '{str}' is incorrect and must contain at least one '-' character; Web Components naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_regster_data_noset:
    "Error in registering component {tag}, custom data cannot have data of type 'Set' or 'Map'",
  xhear_regster_data_nofunc:
    "Registration component {tag} error, functions cannot appear in custom data, please put the function in 'proto'; or change '{key}' to '_{key}'",
  temp_multi_child:
    "The template has multiple root elements; they have been wrapped in a display:contents container. It is recommended to wrap them manually",
  fill_type:
    "'value' of 'o-fill' must be of type Array, the current value is of type {type}",
};

/** 按错误码 + 占位符生成描述文本（未知码原样提示去查表） */
const getErrDesc$1 = (key, options) => {
  let desc = errorDescs$1[key];

  if (!desc) {
    return `Unknown error code: "${key}"`;
  }

  if (options) {
    for (let k in options) {
      desc = desc.replace(new RegExp(`\\{${k}\\}`, "g"), options[k]);
    }
  }

  return desc;
};

/** 快捷工厂：生成带 code 的 XhearError，cause 可选 */
const getErr$1 = (key, options, cause) =>
  new XhearError(key, getErrDesc$1(key, options), { cause });

/**
 * 点路径取值 / 赋值："a.b.c" 形式的键寻址。
 *
 * 旧版由 stanz 原生的 get/set 方法承担；stanz 9 重构时把它从公共 API
 * 中裁剪（数据层保持最小面），路径寻址是应用层便利，归属 xhear。
 * 模板语法的 sync:prop="a.b.c"、watch:prop="a.b.c" 及组件 API
 * $ele.get / $ele.set 都依赖这里。
 */

/** 沿点路径逐层取值；途中访问失败时抛出带定位信息的错误 */
const getPath = (target, key) => {
  if (!/\./.test(key)) {
    return target[key];
  }

  const keys = key.split(".");
  let current = target;

  for (let i = 0, len = keys.length; i < len; i++) {
    try {
      current = current[keys[i]];
    } catch (error) {
      const err = getErr$1(
        "failed_to_get_data",
        { key: keys.slice(0, i).join(".") },
        error,
      );
      console.warn(err, { key, self: target });
      throw err;
    }
  }

  return current;
};

/** 沿点路径逐层定位后赋值，返回被赋的值；定位失败同 getPath 抛错 */
const setPath = (target, key, value) => {
  if (!/\./.test(key)) {
    return (target[key] = value);
  }

  const keys = key.split(".");
  const lastKey = keys.pop();

  return (getPath(target, keys.join("."))[lastKey] = value);
};

/**
 * 模板表达式编译器：把模板里写的表达式字符串编译成可重复执行的函数。
 *
 * 与旧实现的本质区别：编译产物**不绑定数据**——模板是每个组件只编译
 * 一次的共享产物，表达式函数在编译期创建一次，运行期通过 call 注入
 * 具体实例的 { data, errCall }。旧版每个实例每个绑定都 new Function
 * 一次，fill 类场景（千项列表）编译开销是实例创建的主要成本。
 *
 * 编译产物用 `with(data)` 注入数据作用域——模板表达式按数据属性名直接
 * 书写（如 {{count * 2}}），这是模板语法的一部分，不能改成解构或前缀
 * 访问（会改变用户的书写语义）。$event 供内联事件表达式使用
 * （如 on:click="count = $event.x"）。
 */

/**
 * @param {string} expr 模板里的表达式原文
 * @returns {Function} 共享渲染函数；调用时 fn.call({ data, errCall }, ...$args)
 */
const compileExpr = (expr) => {
  const funcStr = `
const dataRevoked = ${dataRevoked.toString()};
const [$event] = $args;
const {data, errCall} = this;
if(dataRevoked(data)){
  return;
}
try{
  with(data){
    return ${expr};
  }
}catch(error){
  // 宿主元素已脱离文档的报错属于正常回收过程，静默忽略
  if(data.ele && !data.ele.isConnected){
    return;
  }
  if(errCall){
    const result = errCall(error);
    if(result !== false){
      console.error(error);
    }
  }else{
    console.error(error);
  }
}
`;
  return new Function("...$args", funcStr);
};

/**
 * x-if / x-else-if / x-else / x-fill 弃用提示。
 *
 * v5 起条件与列表渲染统一为 o-if / o-else-if / o-else / o-fill，x- 系
 * 元素不再注册。两条检测路径：
 * 1. 编译期扫描：compileTemplate 发现模板里有 x- 系标签时调用 warnXTag；
 * 2. stub 元素：未经编译的裸用（静态 HTML、第三方 cloneNode）在元素
 *    升级接入文档时也会报错。
 * 同名标签只报一次，避免刷屏。
 */
const warned = new Set();

const warnXTag = (tag) => {
  if (warned.has(tag)) {
    return;
  }
  warned.add(tag);

  console.error(
    `[ofa.js] "${tag}" 已在新版弃用 / deprecated in v5+：` +
      `条件与列表渲染请改用 o-if / o-else-if / o-else / o-fill` +
      ` (use the "o-" tags instead)`,
  );
};

// stub 元素保持惰性（无渲染逻辑），只负责在接入文档时报弃用提示
if (typeof customElements !== "undefined") {
  ["x-if", "x-else-if", "x-else", "x-fill"].forEach((tag) => {
    customElements.define(
      tag,
      class extends HTMLElement {
        connectedCallback() {
          warnXTag(tag);
        }
      },
    );
  });
}

/**
 * 模板编译器：把模板 HTML 一次性编译成"绑定描述符"。
 *
 * 设计核心：**编译一次、实例化万次**。注册期对模板做一次纯 DOM 遍历，
 * 产出路径化的绑定描述符（binder，含预编译的共享表达式函数）挂在模板
 * 上（template.__xt）；实例渲染期只需 content.cloneNode(true) + 按路径
 * 取节点。旧管线每个实例要重新解析 innerHTML、重新 new Function、重新
 * JSON.parse 指令表，fill 类场景（千项列表）的实例化开销主要是这三样。
 *
 * 全程纯 DOM 操作、零 innerHTML 序列化往返：旧版靠序列化 + 正则做
 * {{}} 拆分，序列化会把 & 转义成 &amp;（&& 表达式必炸），且每种包装
 * 都要重新解析字符串——这里全部改为节点移动，问题从根上不存在。
 *
 * convert(template) 的管线（顺序敏感，不可调换）：
 *  0. replace-temp 解包 —— 编译期就是 DOM 操作，table/select 的解析器
 *     位置限制已不存在，把内容移回原位即可，运行时机制随之退役；
 *  1. code 标签保护 —— 摘走 code 内容（元素引用直接留表，不需要按
 *     属性回查），其中的示例语法不被编译；
 *  2. {{expr}} 文本预分裂 —— 文本节点拆成 [文本, 空标记节点, 文本…]，
 *     标记节点就是渲染目标本身（路径即定位），不再需要占位元素换入换出；
 *  3. 自身带 name 属性 → 登记为命名模板并从树中摘除（供 o-fill 按名
 *     引用）；多子元素时包一层 display:contents 的 div；
 *  4. 递归编译：content 内所有 template 子孙逐个 convert()；命名模板
 *     在这一步收集进 temps 并从树中摘除，重名抛错；
 *  5. afterConvert 钩子 —— o-if/o-fill 的内容保护层（inner-code）在
 *     这一步包裹内容，必须先于描述符构建（路径依赖结构）；
 *  6. 绑定描述符 —— 遍历 content 子树（childNodes 索引定位），登记
 *     文本标记 / 属性指令 / 样式 data() 三类 binder，表达式在此编译
 *     一次（旧版是每个实例每个绑定各编译一次）。
 *
 * 另：模板中出现 x-if / x-else-if / x-else / x-fill（v5 已弃用）会在
 * 控制台报错提示改用 o- 系标签。
 *
 * binder 结构（render 消费的稳定契约）：
 *   { t:"text",  path, expr, fn }                          文本插值
 *   { t:"style", path, origin, items:[{dataExpr, fn}] }    样式 data()
 *   { t:"bind",  path, actions:[{name, items:[{key, expr, fn}]}] } 指令
 * path 以 content.childNodes 的索引为基准；实例克隆后结构不变，
 * 写入只发生在节点内容上，路径永远有效。
 */

// XML 保留命名空间前缀：xmlns:xlink、xlink:href、xml:space 这类属性
// 是命名空间声明，不是模板指令（SVG 场景的修复）
const nsAttrPrefixes = new Set(["xmlns", "xml", "xlink"]);

const DIRECTIVE_RE = /(.*):(.+)/;
const STYLE_DATA_RE = /data\(.+?\)/g;

/** 在 template.content 内查询元素（可选逐个执行回调） */
const searchTemp = (template, expr, func) => {
  const rearr = Array.from(template.content.querySelectorAll(expr));

  if (func) {
    rearr.forEach(func);
  }

  return rearr;
};

/** 把一个元素的内容整体搬进另一个元素/片段（保持顺序，纯 DOM 移动）。
 * 上层框架（ofa 的 wrapTemp）也依赖它绕开 innerHTML 的上下文解析限制 */
const moveChildren = (from, to) => {
  // 两端都要归一化：template 元素的内容在 content 片段里，
  // 光子层（firstChild/childNodes）不承载内容，append 也不写入 content
  const src = from.tagName === "TEMPLATE" ? from.content : from;
  const dst = to.tagName === "TEMPLATE" ? to.content : to;

  while (src.firstChild) {
    dst.append(src.firstChild);
  }
};

/** replace-temp 解包：内容原位展开，元素移除；反复执行直到清干净 */
const unwrapReplaceTemps = (template) => {
  while (true) {
    const temps = searchTemp(template, 'template[is="replace-temp"]');

    if (!temps.length) {
      return;
    }

    for (const el of temps) {
      const parent = el.parentNode;

      if (!parent) {
        continue;
      }

      const frag = document.createDocumentFragment();
      moveChildren(el, frag);
      parent.insertBefore(frag, el);
      el.remove();
    }
  }
};

/**
 * {{expr}} 文本预分裂：文本节点拆成 [文本, 空标记, 文本…]
 * （不进入 TEMPLATE 子树，命名模板由递归处理）。
 * 返回 标记节点 → 表达式 的映射，供最终遍历登记 text binder。
 */
const splitInsertionTexts = (parent, markers) => {
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === 3 /* text */) {
      if (!node.data.includes("{{")) {
        continue;
      }

      const parts = node.data.split(/{{([\s\S]+?)}}/g);
      const frag = document.createDocumentFragment();

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // 偶数位是普通文本段（空段丢弃）
          if (parts[i]) {
            frag.append(document.createTextNode(parts[i]));
          }
        } else {
          // 标记用注释节点：表达式原文编码后存入，序列化可存活
          //（内容保护层经序列化读取内容，依赖这一点），渲染不产生输出
          const marker = document.createComment(
            "xt:" + encodeURIComponent(parts[i]),
          );
          markers.set(marker, parts[i]);
          frag.append(marker);
        }
      }

      node.replaceWith(frag);
    } else if (node.nodeType === 1 && node.tagName !== "TEMPLATE") {
      splitInsertionTexts(node, markers);
    }
  }
};

/** 提取元素上的属性指令，返回有序动作数组（不影响 DOM 结构） */
const extractDirectives = (el) => {
  const obj = {};

  Array.from(el.attributes).forEach((attr) => {
    const matchData = DIRECTIVE_RE.exec(attr.name);

    if (!matchData) {
      return;
    }

    let [, actionName, param0] = matchData;

    if (nsAttrPrefixes.has(actionName)) {
      return;
    }

    if (!actionName) {
      actionName = "prop";
    }

    const targetActions = obj[actionName] || (obj[actionName] = []);

    targetActions.push([param0, attr.value]);

    el.removeAttribute(attr.name);
  });

  // JSON 键序即动作序，展开为有序数组
  return Object.keys(obj).map((name) => ({ name, items: obj[name] }));
};

/** 预编译样式里的 data(expr)（旧版在渲染期对每个实例重新正则 + 编译） */
const compileStyleItems = (origin) => {
  const items = [];
  for (const dataExpr of new Set(origin.match(STYLE_DATA_RE) || [])) {
    const expr = dataExpr.replace(/data\((.+)\)/, "$1");
    items.push({ dataExpr, expr, fn: compileExpr(expr) });
  }
  return items;
};

/**
 * 最终遍历：登记绑定描述符。
 * path 以 content.childNodes 的索引为基准；标记节点按编译期留存的
 * 引用识别（节点引用跨 DOM 移动有效）。
 */
const buildBinders = (parent, path, binders, markers) => {
  const nodes = parent.childNodes;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const childPath = path.concat(i);

    if (node.nodeType === 8 /* comment */) {
      // xt: 前缀的注释节点是文本插值标记
      if (node.data.startsWith("xt:")) {
        const expr = decodeURIComponent(node.data.slice(3));
        binders.push({ t: "text", path: childPath, expr, fn: compileExpr(expr) });
      }
      continue;
    }

    if (node.nodeType !== 1) {
      continue;
    }

    if (node.tagName === "TEMPLATE") {
      // 嵌套模板由递归 convert 负责（否则会二次处理）
      continue;
    }

    if (node.tagName === "STYLE") {
      const origin = node.innerHTML;
      const items = compileStyleItems(origin);

      if (items.length) {
        binders.push({ t: "style", path: childPath, origin, items });
      }
      continue;
    }

    const actions = extractDirectives(node);

    if (actions.length) {
      binders.push({
        t: "bind",
        path: childPath,
        actions: actions.map((action) => ({
          name: action.name,
          items: action.items.map(([key, expr]) => ({
            key,
            expr,
            fn: compileExpr(expr),
          })),
        })),
      });
    }

    buildBinders(node, childPath, binders);
  }
};

/**
 * 编译一个模板元素：产出 temps（命名模板集合）并在模板上挂
 * __xt 绑定描述符。convert 是它的对外别名（$ API 兼容）。
 */
const compileTemplate = (template, markers = new Map()) => {
  let temps = {};
  const codeEls = [];
  // 多子元素警告每次编译只提示一次，避免反复刷屏
  let isWarned = false;

  // markers 映射必须整棵编译树共享：{{}} 预分裂发生在根级（fill/条件
  // 内容当时还不是 template），标记节点随后随 DOM 移动进入子模板，
  // 子模板的最终遍历要靠同一张映射才能识别它们

  renderExtends.beforeConvert({
    template,
  });

  // 0. replace-temp 解包
  unwrapReplaceTemps(template);

  // 0.5 弃用标签检测：x- 系元素在 v5 已移除，出现即报错提示迁移
  searchTemp(template, "x-if,x-else-if,x-else,x-fill", (el) => {
    warnXTag(el.tagName.toLowerCase());
  });

  // 1. code 标签保护：内容摘走（引用留表，恢复时无需回查），
  //    跳过已被外层保护过的 code，防止嵌套模板递归编译时置空丢失
  searchTemp(template, "code:not([code-id])", (code) => {
    code.setAttribute("code-id", "");
    codeEls.push({ el: code, html: code.innerHTML });
    code.innerHTML = "";
  });

  // 2. {{expr}} 文本预分裂（纯 DOM，不进入 TEMPLATE 子树）
  splitInsertionTexts(template.content, markers);

  // 3. 命名模板：登记并从树中摘除；多子元素时包一层 display:contents 的 div
  const tempName = template.getAttribute("name");

  if (tempName) {
    const tempChilds = template.content.children;
    if (tempChilds.length > 1) {
      if (!isWarned) {
        const err = getErr$1("temp_multi_child");
        console.warn(err, {
          content: template.content,
        });
        isWarned = true;
      }

      const wrapName = `wrapper-${tempName}`;
      const wrapDiv = document.createElement("div");
      wrapDiv.setAttribute(wrapName, "");
      wrapDiv.style.display = "contents";
      moveChildren(template.content, wrapDiv);
      template.content.append(wrapDiv);
      console.warn(
        getErr$1("temp_wrap_child", {
          tempName,
          len: tempChilds.length,
          wrapName,
        }),
      );
    }
    temps[tempName] = template;
    template.remove();
  }

  // 4. 递归编译全部后代模板（命名模板在此收集合并）。
  //    必须跳过 template[inner-code]：那是 o-if/o-fill 的内容保护层，
  //    其中的指令要在分支/列表项渲染时才绑定渲染数据——若在此处编译，
  //    extractDirectives 会把属性剥进一个无人消费的描述符，内容静默失活
  //    （嵌套条件/列表场景，如 o-if 内 o-fill 项内再嵌 o-if）
  searchTemp(template, "template:not([inner-code])", (e) => {
    const newTemps = compileTemplate(e, markers);

    Object.keys(newTemps).forEach((name) => {
      if (temps[name]) {
        throw getErr$1("xhear_temp_exist", {
          name,
        });
      }
    });

    temps = { ...temps, ...newTemps };
  });

  // 5. afterConvert 钩子：结构变换必须先于描述符构建（路径依赖结构）
  renderExtends.afterConvert({
    template,
    temps,
  });

  // 6. 绑定描述符
  const binders = [];
  buildBinders(template.content, [], binders);
  template.__xt = binders;


  // 恢复 code 内容（元素引用跨移动有效，直接回填）
  for (const { el, html } of codeEls) {
    el.removeAttribute("code-id");
    el.innerHTML = html;
  }

  return temps;
};

/** $ API 兼容出口：编译模板，返回命名模板集合 */
const convert = compileTemplate;

/**
 * 渲染编排器：把编译期产出的绑定描述符绑定到具体实例的数据上。
 *
 * 设计核心：**实例期零解析、零编译、零扫描**。
 * - 内容就位用 content.cloneNode(true)（旧版 innerHTML 重解析是实例化
 *   的主要开销之一）；
 * - 描述符按 childNodes 路径直取节点；{{}} 标记是注释节点，绑定时
 *   替换为文本节点（一次性结构变更），其余路径不受影响；
 * - 表达式函数是编译期生成的共享函数，实例期通过 call 注入
 *   { data, errCall }（旧版每个实例每个绑定都 new Function 一次，
 *   always 动作更是每次刷新都重新编译）；
 * - always 动作登记为任务，数据更新（watchTick 防抖）时批量重跑；
 * - 每个副作用登记撤销函数（__revokes 约定），节点树销毁时由
 *   revokeAll 统一执行；
 * - 绑定完成后派发 binding-rendered，o-if/o-fill 等组件据此初始化。
 *
 * 对外保留 renderExtends 四钩子（上层框架捕获重赋介入编译与渲染）与
 * 兼容回退路径（处理未经本版编译器处理的模板/DOM）。
 */

/** 模板渲染的扩展钩子：上层框架（ofa.js）捕获重赋以介入编译与渲染 */
const renderExtends = {
  beforeConvert() {},
  afterConvert() {},
  beforeRender() {},
  render() {},
};

/** 取目标节点上的撤销函数登记表（惰性创建） */
const getRevokes = (target) => target.__revokes || (target.__revokes = []);

/**
 * 按描述符路径解析节点：path 以编译产物 content.childNodes 的索引为基准。
 * baseIndex > 0 表示渲染根是内容中的某个子节点（如 fill 列表项），
 * 首段必须指向它，其余段相对渲染根解析。
 */
const resolvePath$1 = (root, path, baseIndex) => {
  let node = root;
  let start = 0;

  if (baseIndex) {
    // 渲染根是内容中的某个子节点（如 fill 列表项）：首段必须指向它，
    // 其余段相对渲染根解析
    if (path[0] !== baseIndex) {
      return null;
    }
    node = root.childNodes[baseIndex];
    start = 1;
  }

  for (let i = start; i < path.length; i++) {
    node = node.childNodes[path[i]];
  }
  return node;
};

/** 登记一个撤销函数到指定节点 */
const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

/**
 * 渲染入口。
 *
 * @param {object} opts
 * @param {object} opts.data 渲染数据（stanz 实例）
 * @param {Element|DocumentFragment} opts.target 绑定宿主与数据挂载点
 * @param {HTMLTemplateElement} [opts.template] 编译过的模板：克隆内容到 target
 * @param {Array} [opts.binders] 绑定描述符（缺省回退到全量扫描）
 * @param {Node} [opts.bindRoot] 描述符路径的解析基准（默认克隆片段）
 * @param {number} [opts.baseIndex=0] 渲染根在描述符路径首段的索引
 * @param {object} [opts.temps] 命名模板集合
 * @param {boolean} [opts.isRenderSelf] 回退路径：target 自身含指令时一并处理
 */
function render({
  data,
  target,
  template,
  temps,
  isRenderSelf,
  binders: bindersOpt,
  bindRoot: bindRootOpt,
  baseIndex = 0,
  ...otherOpts
}) {
  try {
    data.watchTick;
  } catch (e) {
    // data 已经被回收，不需要继续操作
    return;
  }

  // 内容就位：原生克隆编译产物
  let binders = bindersOpt;
  let bindRoot = bindRootOpt;
  // 插入前按路径预解析的节点表（append 会搬空片段，但节点引用持续有效）
  let resolvedNodes = null;

  if (template) {
    const frag = template.content.cloneNode(true);
    binders = binders || template.__xt;

    if (binders) {
      bindRoot = frag;
      resolvedNodes = binders.map((b) => resolvePath$1(frag, b.path, 0));
    }

    target.append(frag);
  }

  renderExtends.beforeRender({
    target,
  });

  const tasks = [];
  const revokes = getRevokes(target);

  if (binders && bindRoot) {
    // ---- 快路径：描述符直取节点，克隆后结构不变、写入不改结构 ----
    const nodeFor = (b, index) =>
      resolvedNodes ? resolvedNodes[index] : resolvePath$1(bindRoot, b.path, baseIndex);

    let binderIndex = -1;

    for (const b of binders) {
      binderIndex++;

      if (b.t === "text") {
        // 标记是注释节点：渲染时替换为文本节点，后续刷新只写内容
        const marker = nodeFor(b, binderIndex);

        if (!marker) {
          continue;
        }

        const textEl = document.createTextNode("");
        marker.replaceWith(textEl);

        // 上下文一次性构建：刷新期间零分配
        const ctx = {
          data,
          errCall: (error) => {
            const supplementary = getRenderErrorSupplementary(data);

            const err = new Error(
              `Error evaluating text expression: '${b.expr}', ${supplementary}`,
              {
                cause: error,
              },
            );

            console.error(err, {
              element: textEl,
              parent: textEl.parentNode,
            });

            return false;
          },
        };

        const renderFunc = () => {
          const content = b.fn.call(ctx);
          if (textEl.textContent !== String(content)) {
            textEl.textContent = content;
          }
        };
        tasks.push(renderFunc);

        const textRevoke = () => {
          removeArrayValue(revokes, textRevoke);
          removeArrayValue(tasks, renderFunc);
        };
        revokes.push(textRevoke);
        addRevoke(textEl, textRevoke);
        continue;
      }

      if (b.t === "style") {
        const el = nodeFor(b, binderIndex);

        if (!el) {
          continue;
        }

        const ctxs = b.items.map((item) => ({
          fn: item.fn,
          dataExpr: item.dataExpr,
          ctx: {
            data,
            errCall: (error) => {
              const supplementary = getRenderErrorSupplementary(data);

              const err = new Error(
                `Error evaluating data() expression in style: "${item.expr}", ${supplementary}`,
                {
                  cause: error,
                },
              );

              console.error(err, {
                style: b.origin,
                target,
              });
            },
          },
        }));

        const renderStyle = () => {
          let afterStyle = b.origin;

          ctxs.forEach(({ fn, dataExpr, ctx }) => {
            // 同名 data() 可在样式中出现多次（如 min-width 与 width 同式），逐处替换
            afterStyle = afterStyle.replaceAll(dataExpr, fn.call(ctx));
          });

          if (el.innerHTML !== afterStyle) {
            el.innerHTML = afterStyle;
          }
        };
        tasks.push(renderStyle);

        const styleRevoke = () => {
          removeArrayValue(revokes, styleRevoke);
          removeArrayValue(tasks, renderStyle);
        };
        revokes.push(styleRevoke);
        addRevoke(el, styleRevoke);
        continue;
      }

      // t === "bind"：属性指令
      const el = nodeFor(b, binderIndex);

      if (!el) {
        continue;
      }

      const $el = eleX(el);

      for (const action of b.actions) {
        for (const item of action.items) {
          try {
            // 动作元数据（always/revoke）直接挂在方法函数上，
            // 这是上层框架包装动作时的扩展缝，不可改为注册表
            const { always } = $el[action.name];

            const key = item.key;
            // 动作层的契约是"求值函数无 this 可直调"（getVal 裸调），
            // 用闭包把共享编译函数与实例上下文绑在一起——
            // 每实例每绑定只创建一次，刷新重跑零重编译
            const ctx = {
              data,
              errCall: (error) => {
                const errorExpr = `${action.name === "prop" ? "" : action.name}:${key}="${item.expr}"`;
                const supplementary = getRenderErrorSupplementary(data);

                const err = new Error(
                  `Error evaluating element expression: '${errorExpr}', ${supplementary}`,
                  {
                    cause: error,
                  },
                );

                console.error(err, {
                  element: $el.ele,
                });

                return false;
              },
            };
            // 透传参数：内联事件表达式依赖 $event（监听器入参）
            const fn = (...callArgs) => item.fn.call(ctx, ...callArgs);
            const afterArgs = [key, fn];
            const options = {
              actionName: action.name,
              target: $el,
              data,
              beforeArgs: [key, item.expr],
              args: afterArgs,
            };

            let workResult;

            const work = () => {
              const reval = $el[action.name](key, fn, options);

              renderExtends.render({
                step: "refresh",
                args: [key, item.expr],
                name: action.name,
                target: $el,
              });

              return reval;
            };

            let clearRevs = () => {
              const { revoke: methodRevoke } = $el[action.name];

              if (methodRevoke) {
                methodRevoke({
                  actionName: action.name,
                  target: $el,
                  data,
                  beforeArgs: [key, item.expr],
                  args: afterArgs,
                  result: workResult,
                });
              }

              removeArrayValue(revokes, clearRevs);
              removeArrayValue(tasks, work);
              clearRevs = null;
            };

            if (always) {
              // 展示型绑定（prop/attr/class）：每次数据更新重跑
              tasks.push(work);
            } else {
              // 自管理型绑定（on/sync/watch）：初始化一次，撤销凭据存 result
              workResult = work();
            }

            revokes.push(clearRevs);
            addRevoke(el, clearRevs);
          } catch (error) {
            // catch 与 try 不同作用域，key 在 try 内声明——此处只能取 item.key，
            // 否则真错误会被这里的 ReferenceError 掩盖
            const err = getErr$1(
              "xhear_eval",
              {
                name: action.name,
                arg0: item.key,
                arg1: item.expr,
              },
              error,
            );
            console.warn(err, el);
            throw err;
          }
        }
      }

      // 就绪握手：通知条件/列表组件可以开始初始化
      el._bindingRendered = true;
      el.dispatchEvent(new Event("binding-rendered"));
    }
  } else {
    // ---- 兼容回退：处理未经本版编译器处理的模板/DOM ----

    // 样式里的 data(expr) 语法
    searchEle(target, "style").forEach((el) => {
      const originStyle = el.innerHTML;

      if (/data\(.+\)/.test(originStyle)) {
        const matchs = Array.from(new Set(originStyle.match(/data\(.+?\)/g))).map(
          (dataExpr) => {
            const expr = dataExpr.replace(/data\((.+)\)/, "$1");
            const fn = compileExpr(expr);
            const ctx = {
              data,
              errCall: (error) => {
                const supplementary = getRenderErrorSupplementary(data);

                const err = new Error(
                  `Error evaluating data() expression in style: "${expr}", ${supplementary}`,
                  {
                    cause: error,
                  },
                );

                console.error(err, {
                  style: originStyle,
                  target,
                });
              },
            };

            return { dataExpr, fn, ctx };
          },
        );

        const renderStyle = () => {
          let afterStyle = originStyle;

          matchs.forEach(({ dataExpr, fn, ctx }) => {
            // 同名 data() 可在样式中出现多次（如 min-width 与 width 同式），逐处替换
            afterStyle = afterStyle.replaceAll(dataExpr, fn.call(ctx));
          });

          if (el.innerHTML !== afterStyle) {
            el.innerHTML = afterStyle;
          }
        };
        tasks.push(renderStyle);

        const styleRevoke = () => {
          removeArrayValue(tasks, renderStyle);
          removeArrayValue(getRevokes(el), styleRevoke);
          removeArrayValue(revokes, styleRevoke);
        };

        addRevoke(el, styleRevoke);
        revokes.push(styleRevoke);
      }
    });

    // 文本节点：xtext 占位（旧编译产物的兼容形态）
    searchEle(target, "xtext").forEach((el) => {
      const textEl = document.createTextNode("");
      const { parentNode } = el;
      parentNode.insertBefore(textEl, el);
      parentNode.removeChild(el);

      let expr = el.getAttribute("expr");
      try {
        expr = decodeURIComponent(expr);
      } catch (e) {
        // 非编码表达式原样使用
      }

      const fn = compileExpr(expr);
      const ctx = {
        data,
        errCall: (error) => {
          const supplementary = getRenderErrorSupplementary(data);

          const err = new Error(
            `Error evaluating text expression: '${expr}', ${supplementary}`,
            {
              cause: error,
            },
          );

          console.error(err, {
            element: textEl,
            parent: parentNode,
          });

          return false;
        },
      };

      const renderFunc = () => {
        const content = fn.call(ctx);
        if (textEl.textContent !== String(content)) {
          textEl.textContent = content;
        }
      };
      tasks.push(renderFunc);

      const textRevoke = () => {
        removeArrayValue(revokes, textRevoke);
        removeArrayValue(tasks, renderFunc);
        removeArrayValue(getRevokes(textEl), textRevoke);
      };
      revokes.push(textRevoke);
      addRevoke(textEl, textRevoke);
    });

    const eles = searchEle(target, `[x-bind-data]`);

    if (isRenderSelf && target.matches(`[x-bind-data]`)) {
      eles.unshift(target);
    }

    // 属性绑定：解析 x-bind-data，逐条调用元素上同名动作方法
    eles.forEach((el) => {
      const bindData = JSON.parse(el.getAttribute("x-bind-data"));

      const $el = eleX(el);

      for (let [actionName, arr] of Object.entries(bindData)) {
        arr.forEach((args) => {
          try {
            const { always } = $el[actionName];
            let afterArgs = [];

            let workResult;

            const work = () => {
              const [key, expr] = args;

              const fn = compileExpr(expr);
              const ctx = {
                data,
                errCall: (error) => {
                  const errorExpr = `${actionName === "prop" ? "" : actionName}:${key}="${expr}"`;
                  const supplementary = getRenderErrorSupplementary(data);

                  const err = new Error(
                    `Error evaluating element expression: '${errorExpr}', ${supplementary}`,
                    {
                      cause: error,
                    },
                  );

                  console.error(err, {
                    element: $el.ele,
                  });

                  return false;
                },
              };

              afterArgs = [key, fn];

              const reval = $el[actionName](...afterArgs, {
                actionName,
                target: $el,
                data,
                beforeArgs: args,
                args: afterArgs,
              });

              renderExtends.render({
                step: "refresh",
                args,
                name: actionName,
                target: $el,
              });

              return reval;
            };

            let clearRevs = () => {
              const { revoke: methodRevoke } = $el[actionName];

              if (methodRevoke) {
                methodRevoke({
                  actionName,
                  target: $el,
                  data,
                  beforeArgs: args,
                  args: afterArgs,
                  result: workResult,
                });
              }

              removeArrayValue(revokes, clearRevs);
              removeArrayValue(getRevokes(el), clearRevs);
              removeArrayValue(tasks, work);
              clearRevs = null;
            };

            if (always) {
              tasks.push(work);
            } else {
              workResult = work();
            }

            revokes.push(clearRevs);
            if (el !== target) {
              addRevoke(el, clearRevs);
            }
          } catch (error) {
            const err = getErr$1(
              "xhear_eval",
              {
                name: actionName,
                arg0: args[0],
                arg1: args[1],
              },
              error,
            );
            console.warn(err, el);
            throw err;
          }
        });
      }

      el.removeAttribute("x-bind-data");

      el._bindingRendered = true;
      el.dispatchEvent(new Event("binding-rendered"));
    });
  }

  if (!target.__render_temps && !isEmptyObject(temps)) {
    target.__render_temps = temps;
  }

  if (target.__render_data && target.__render_data !== data) {
    const err = getErr$1("xhear_listen_already");

    console.warn(err, {
      element: target,
      old: target.__render_data,
      new: data,
    });

    throw err;
  }

  target.__render_data = data;

  if (tasks.length) {
    tasks.forEach((f) => f());

    // 数据更新后重跑全部渲染任务；任务清空（绑定全部释放）则退订
    const wid = data.watchTick((e) => {
      if (tasks.length) {
        tasks.forEach((f) => f());
      } else {
        data.unwatch(wid);
      }
    });
  }

  renderExtends.render({ step: "init", target });
}

// ==== 模板绑定动作集（prop/attr/class/watch）====
// 以 "$el[actionName](key, exprFunc, options)" 的形式被 render 调用，
// 同时也是元素实例的公开方法。always/revoke 元数据挂在函数上，
// 上层框架包装这些方法时需原样保留元数据（ofa.js 的 extend 即如此）。

/** 取值：函数类型的值现场调用求值 */
const getVal = (val) => (isFunction(val) ? val() : val);

const defaultData = {
  /** :prop="expr" —— 组件数据属性绑定（等价 $ele.prop(key, value)） */
  prop(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = getVal(value);
    name = hyphenToUpperCase(name);

    setPath(this, name, value);
  },
  /** attr:name="expr" —— HTML 属性绑定；true→""、false/null/undefined→移除 */
  attr(...args) {
    let [name, value] = args;

    const { ele } = this;

    if (args.length === 1) {
      return ele.getAttribute(name);
    }

    value = getVal(value);

    if (value === false) {
      value = null;
    } else if (value === true) {
      value = "";
    }

    if (value === null || value === undefined) {
      ele.removeAttribute(name);
    } else if (ele.getAttribute(name) != value) {
      ele.setAttribute(name, value);
    }
  },
  /** class:name="expr" —— 类名开关绑定 */
  class(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this.ele.classList.contains(name);
    }

    value = getVal(value);

    if (value) {
      this.ele.classList.add(name);
    } else {
      this.ele.classList.remove(name);
    }
  },
  /**
   * watch:prop="data.path" —— 数据到数据的单向拷贝。
   * 模板形式（3 参）：把自身 prop 值同步到渲染数据的指定路径；
   * 直接调用形式（<3 参）透传给 stanz 原生 watch。
   */
  watch(...args) {
    if (args.length < 3) {
      return watchFn.watch.apply(this, args);
    }

    const options = args[2];
    const { beforeArgs, data: target } = options;
    const [selfPropName, targetPropName] = beforeArgs;
    const propName = hyphenToUpperCase(selfPropName);

    const setData = () => {
      let val = getPath(this, propName);
      setPath(target, targetPropName, val);
    };

    const wid = this.watch((e) => {
      if (e.hasModified(propName)) {
        setData();
      }
    });

    // 初始化先同步一次
    setData();

    return () => {
      this.unwatch(wid);
    };
  },
};

// prop/attr/class 是展示型绑定，需要随数据更新重跑
defaultData.prop.always = true;
defaultData.attr.always = true;
defaultData.class.always = true;

// 释放元数据：prop 绑定的值若是 stanz 对象，置空以断开 owner 引用链
defaultData.prop.revoke = ({ target, args }) => {
  const propName = args[0];

  const oldVal = getPath(target, propName);
  if (isxdata(oldVal)) {
    setPath(target, propName, {});
  }
};

defaultData.watch.revoke = (e) => {
  e.result();
  const propName = e.beforeArgs[1];

  const oldVal = getPath(e.data, propName);
  if (isxdata(oldVal)) {
    setPath(e.data, propName, {});
  }
};

/**
 * sync 动作：sync:prop="data.path" —— 元素属性与渲染数据间的双向同步。
 *
 * 仅限模板绑定使用（render 传入 options）：本方 prop 变化写回数据，
 * 数据变化写入本方 prop，两侧 watch 互为驱动。撤销时成对解绑。
 */

const syncFn = {
  sync(propName, targetName, options) {
    if (!options) {
      throw getErr$1("xhear_sync_no_options");
    }

    // 模板属性名可能是 dash-case，统一转驼峰
    [propName, targetName] = options.beforeArgs;

    propName = hyphenToUpperCase(propName);
    targetName = hyphenToUpperCase(targetName);

    const { data } = options;

    const val = getPath(data, targetName);

    if (val instanceof Object) {
      // 对象值双向同步会造成引用混乱，禁止
      const err = getErr$1("xhear_sync_object_value", { targetName });
      console.warn(err, data);
      throw err;
    }

    this[propName] = val;

    // 本方 → 数据
    const wid1 = this.watch((e) => {
      if (e.hasModified(propName)) {
        try {
          const value = getPath(this, propName);
          setPath(data, targetName, value);
        } catch (err) {
          // 数据已被回收时报错属正常回收过程，忽略
        }
      }
    });

    // 数据 → 本方
    const wid2 = data.watch((e) => {
      if (e.hasModified(targetName)) {
        try {
          const value = getPath(data, targetName);
          setPath(this, propName, value);
        } catch (err) {
          // 同上
        }
      }
    });

    return () => {
      this.unwatch(wid1);
      if (!dataRevoked(data)) {
        data.unwatch(wid2);
      }
    };
  },
};

syncFn.sync.revoke = (e) => {
  e.result();
};

/**
 * 事件能力：on / one / off / emit，直接挂在原生 EventTarget 语义上。
 *
 * 模板事件绑定（on:click="handler"）的约定：render 层调用 $el.on 时会
 * 末尾追加 options 参数；on 据此把"表达式"解析为 data 上的方法引用，
 * 并返回撤销函数（render 释放时经 .revoke 元数据回调 e.result() 执行）。
 */

/**
 * 解析模板事件绑定的处理函数。
 * 表达式为纯标识符（如 "submit"）时，从渲染数据上查同名方法并绑定 this；
 * 复杂表达式（如 "count++"）则由 render 层编译好的函数直接充当处理体。
 */
function getBindOptions(name, func, options) {
  let revoker;

  if (options) {
    const beforeValue = options.beforeArgs[1];

    if (!/[^\d\w_\$\.]/.test(beforeValue)) {
      func = getPath(options.data, beforeValue);
      if (!func) {
        const supplementary = getRenderErrorSupplementary(options.data);

        const err = new Error(
          `Event binding error: function "${beforeValue}" not found in expression on:${name}="${beforeValue}", ${supplementary}`,
        );

        console.error(err, {
          target: options.data,
        });
        // 找不到方法不中断渲染，仅报错（与旧版行为一致）
      } else {
        func = func.bind(options.data);
      }
    }

    revoker = () => this.ele.removeEventListener(name, func);
  }

  return { revoker, name, func };
}

const eventFn = {
  /** 绑定事件；模板绑定场景返回撤销函数，普通调用返回 this 便于链式 */
  on(...args) {
    const { revoker, name, func } = getBindOptions.call(this, ...args);

    this.ele.addEventListener(name, func);

    if (revoker) {
      return revoker;
    }

    return this;
  },

  /** 单次绑定：触发一次后自动解绑 */
  one(...args) {
    const { revoker, name, func } = getBindOptions.call(this, ...args);

    let callback = (e) => {
      this.off(name, callback);
      func(e);
    };

    this.ele.addEventListener(name, callback);

    if (revoker) {
      return revoker;
    }

    return this;
  },

  off(name, func) {
    this.ele.removeEventListener(name, func);
    return this;
  },

  /**
   * 派发事件；opts.data 会挂到 event.data 上传递给监听方，
   * 其余字段（bubbles 等）作为 Event 初始化参数。
   */
  emit(name, opts) {
    const options = { ...opts };

    let data;
    if (options.hasOwnProperty("data")) {
      data = options.data;
      delete options.data;
    }

    let event;

    if (name instanceof Event) {
      event = name;
    } else if (name) {
      event = new Event(name, { bubbles: true, ...options });
    }

    event.data = data;

    this.ele.dispatchEvent(event);

    return this;
  },
};

// 模板绑定的撤销元数据：result 即 on/one 在模板场景返回的撤销函数
eventFn.on.revoke = (e) => {
  e.result();
};

eventFn.one.revoke = (e) => {
  e.result();
};

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

class LikeArray {}

for (let [name, value] of Object.entries(likeArrayFn)) {
  Object.defineProperty(LikeArray.prototype, name, {
    value,
  });
}

/**
 * 表单元素支持（核心部分）：initFormEle 把 input/textarea/select 等
 * 原生表单属性接入数据观察（如 $input.value = x 会触发更新事件，
 * watchers 与模板能感知）。
 *
 * 容器级双向绑定 formData 使用频率低，拆分到独立的可选插件模块
 * formdata.mjs（不随默认构建加载，按需引入）。
 */

const { defineProperty } = Object;

const hasValueEleNames = ["input", "textarea", "select"];

/** 把原生属性映射为带观察的实例属性；纯数字字符串自动转 number */
const setKeys = (keys, $ele) => {
  const { ele } = $ele;

  keys.forEach((k) => {
    if (k in ele) {
      let isNum = false;
      defineProperty($ele, k, {
        enumerable: true,
        get: () => {
          let val = ele[k];
          if (isNum) {
            if (/\D/.test(val)) {
              isNum = false;
            } else {
              val = Number(val);
            }
          }
          return val;
        },
        set: (val) => {
          isNum = typeof val === "number";
          ele[k] = val;
        },
      });
    }
  });
};

const formEleNames = new Set([
  ...hasValueEleNames,
  "option",
  "button",
  "label",
  "fieldset",
  "legend",
  "form",
]);

/** 用户输入 → 数据：在对应事件里派发一次 set 更新事件 */
const bindProp = ($ele, opts = {}) => {
  const { name: keyName, type } = opts;

  const { ele } = $ele;
  let old = ele[keyName];

  $ele.on(type, () => {
    emitUpdate({
      type: "set",
      target: $ele,
      currentTarget: $ele,
      name: keyName,
      value: ele[keyName],
      oldValue: old,
    });

    old = ele[keyName];
  });
};

const initFormEle = ($ele) => {
  const { tag } = $ele;

  if (!formEleNames.has(tag)) {
    return;
  }

  setKeys(["type", "name", "disabled"], $ele);

  switch (tag) {
    case "input":
      initInput($ele);
      break;
    case "textarea":
      setKeys(["value"], $ele);
      bindProp($ele, { name: "value", type: "input" });
      break;
    case "option":
      setKeys(["selected", "value"], $ele);
      break;
    case "select":
      {
        const { ele } = $ele;
        // 初始化时同步一次原生值，__unupdate 抑制这次回填产生的事件
        $ele.__unupdate = 1;
        $ele.value = ele.value;
        delete $ele.__unupdate;

        // 数据 → 原生选中项；用户操作 → 数据
        $ele.watch(() => {
          ele.value = $ele.value;
        });
        $ele.on("change", () => {
          $ele.value = ele.value;
        });
      }
      break;
  }
};

const initInput = ($ele) => {
  const type = $ele.attr("type");

  switch (type) {
    case "file":
      setKeys(["multiple", "files"], $ele);
      bindProp($ele, { name: "files", type: "change" });
      break;
    case "checkbox":
      setKeys(["checked", "multiple", "value"], $ele);
      bindProp($ele, { name: "checked", type: "change" });
      break;
    case "radio":
      setKeys(["checked", "value"], $ele);
      bindProp($ele, { name: "checked", type: "change" });
      break;
    case "text":
    default:
      setKeys(["placeholder", "value"], $ele);
      bindProp($ele, { name: "value", type: "input" });
      break;
  }
};

/**
 * css 存取器：$ele.css 返回一个读写联动的样式代理。
 * 读取顺序：内联 style → CSS 变量（实时取计算值）→ 计算样式兜底。
 */

const cssHandler = {
  set(target, key, value, receiver) {
    target._ele.style[key] = value;
    Reflect.set(target, key, value, receiver);
    return true;
  },
  get(target, key, receiver) {
    if (key === "length") {
      return 0;
    }

    // CSS 自定义属性（--x）不在 style 对象上直接暴露，走计算值
    if (key.startsWith && key.startsWith("--")) {
      return getComputedStyle(target._ele).getPropertyValue(key);
    }

    const { style } = target._ele;
    if (Array.from(style).includes(key)) {
      return style[key];
    }

    return getComputedStyle(target._ele)[key];
  },
};

class XhearCSS {
  constructor($el) {
    const obj = {};

    Object.defineProperty(obj, "_ele", {
      enumerable: false,
      get: () => $el.ele,
    });

    // 以当前内联样式为初始快照
    const { style } = $el.ele;

    Array.from(style).forEach((key) => {
      obj[key] = style[key];
    });

    return ($el._css = new Proxy(obj, cssHandler));
  }
}

var cssFn = {
  get css() {
    return new XhearCSS(this);
  },
  set css(d) {
    // 字符串整体替换，对象做增量合并
    if (getType(d) == "string") {
      this.ele.style = d;
      return;
    }

    let { style } = this;

    let nextKeys = Object.keys(d);

    // 对象里已不存在的旧键清空，保证"整体覆盖"语义
    Array.from(style).forEach((k) => {
      if (!nextKeys.includes(k)) {
        style[k] = "";
      }
    });

    Object.assign(style, d);
  },
};

/**
 * $ 函数本体：字符串且非 HTML → 页面选择器；其余交给 createXEle 归一化。
 * $.extensions 是上层框架（ofa.js）注册生命周期钩子的容器。
 */

function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

Object.defineProperties($, {
  // 供上层框架挂载扩展（如 ofa.js 的 afterAttached/afterDetached）
  extensions: {
    value: {},
  },
});

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

const COMPS = {};

/**
 * 组件渲染核心（ofa.js 的接缝导出）：装配数据、扩展 proto、
 * 渲染 shadow、触发 ready，最后接通 watch。
 */
const renderElement = ({ defaults, ele, template, temps }) => {
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
      render({
        target: root,
        data: $ele,
        temps,
        template,
      });
    }

    defaults.ready && defaults.ready.call($ele);
  } catch (error) {
    throw getErr$1(
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

const register$1 = (opts = {}) => {
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
        throw getErr$1("invalid_key", {
          compName: defaults.tag,
          targetName: "data",
          name,
        });
      }
    });
    Object.keys(defaults.proto).forEach((name) => {
      if (fn.hasOwnProperty(name)) {
        console.warn(
          getErrDesc$1("invalid_key", {
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
      throw getErr$1("xhear_register_exists", { name });
    }

    // 注册期完成一次模板编译，所有实例共享编译产物
    template = document.createElement("template");
    template.innerHTML = defaults.temp;
    temps = convert(template);
  } catch (error) {
    throw getErr$1("xhear_register_err", { tag: defaults.tag }, error);
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
    throw getErr$1("xhear_tag_noline", { str });
  }

  if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
    throw getErr$1("xhear_validate_tag", { str });
  }

  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
      throw getErr$1("xhear_validate_tag", { str });
    }
  }

  return true;
}

/** 注册数据的深拷贝：Set/Map/函数直接抛错（函数应放 proto 或 _ 前缀） */
function deepCopyData(obj, tag = "", keyName) {
  if (obj instanceof Set || obj instanceof Map) {
    throw getErr$1("xhear_regster_data_noset", { tag });
  }

  if (obj instanceof Function) {
    throw getErr$1("xhear_regster_data_nofunc", { tag, key: keyName });
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

/**
 * o-if / o-fill 的内容保护层。
 *
 * 条件与列表组件的内容必须被宿主编译"隔离"——它们应在分支/列表项渲染
 * 时才绑定各自的渲染数据（$data/$index/…），而不是被宿主编译提前消费。
 * wrapTemp 把这类组件的内容搬进 template[inner-code]（纯 DOM 搬运，禁止
 * innerHTML 往返：innerHTML 解析受上下文元素影响，表格/表单位置的
 * tr/option 会被解析器丢弃）；宿主编译的最终遍历跳过 TEMPLATE 子树，
 * inner-code 内的文本标记与指令得以幸存，分支渲染时按需编译并全局缓存
 * （同一份内容跨实例只编译一次）。
 */

/** 需要 inner-code 内容保护的组件 */
const needWrapTags = ["o-fill", "o-if", "o-else-if", "o-else"];

/** 内容编译缓存：内容原文 → 编译模板（o-if 与 o-fill 共享一张表） */
const compiledContents = new Map();

/**
 * 按内容原文取编译模板（跨实例共享，编译一次）。
 *
 * @param {string} html 内容原文，同时作为缓存键
 * @param {HTMLTemplateElement} [sourceEl] 内容所在的 template[inner-code]
 *  元素引用。首编译优先从元素搬运内容：内容含表格位置的 o-if/o-fill 时
 * （如 replace-temp 展开进 tbody 的行），字符串重解析会被解析器 foster
 *  parenting 提出 table（自定义元素不在表格解析白名单），元素搬运则
 *  原样保留。多实例共享缓存，仅首次编译用到该引用。
 */
const getCompiledContent = (html, sourceEl) => {
  let compiled = compiledContents.get(html);

  if (!compiled) {
    compiled = document.createElement("template");

    // 调用方可能传入 xhear 代理（如元素子项访问器），归一化到原生元素
    const rawEl = sourceEl && sourceEl.ele ? sourceEl.ele : sourceEl;

    if (rawEl && rawEl.content) {
      moveChildren(rawEl, compiled);
    } else {
      compiled.innerHTML = html;
    }

    compileTemplate(compiled);
    compiledContents.set(html, compiled);
  }

  return compiled;
};

/**
 * 把 template 内所有 o-fill/条件组件的内容包进 template[inner-code]，
 * 并解开既有 inner-code 的嵌套（避免重复包裹导致渲染失败）。
 */
const wrapTemp = (template) => {
  const eles = Array.from(
    template.content.querySelectorAll(needWrapTags.join(",")),
  );

  eles.forEach((e) => {
    while (true) {
      const innerCodeTempEl = e.querySelector("template[inner-code]");

      if (!innerCodeTempEl) {
        break;
      }

      // 解开已有的 inner-code 包裹
      const childs = innerCodeTempEl.content.childNodes;

      childs.forEach((child) => {
        innerCodeTempEl.parentNode.insertBefore(
          child.cloneNode(true),
          innerCodeTempEl,
        );
      });

      innerCodeTempEl.remove();
    }

    // 包裹必须走纯 DOM 搬运，禁止 innerHTML 往返：innerHTML 的解析受
    // 上下文元素影响（o-if/o-fill 属 body 上下文），表格/表单位置的
    // 内容会被解析器丢弃
    const innerCode = document.createElement("template");
    innerCode.setAttribute("inner-code", "");
    moveChildren(e, innerCode);
    e.append(innerCode);
    wrapTemp(innerCode);
  });
};

// afterConvert 钩子：结构变换必须先于宿主的描述符构建（路径依赖结构）
const oldAfterConvert = renderExtends.afterConvert;
renderExtends.afterConvert = (e) => {
  oldAfterConvert(e);
  const { template, temps } = e;
  wrapTemp(template);
  Object.values(temps).forEach((temp) => wrapTemp(temp));
};

/**
 * 条件渲染：o-if / o-else-if / o-else（light DOM 版，唯一实现）。
 *
 * 内容以 light children 渲染在 o-if 元素内部（shadow 为
 * display:contents + slot，视觉上无额外层级）；内容在编译期被
 * wrapTemp 包进 template[inner-code] 保护（不参与宿主编译），首次
 * 渲染时才按需编译并对当前渲染数据绑定，编译结果全局缓存。
 *
 * 条件链：以首个 o-if 为头，收集其后相邻的 o-else-if / o-else；
 * value 变化重判异步执行（setTimeout 0 合并同拍变更），从头到尾取
 * 第一个满足条件（value 为真或 o-else）的分支渲染，其余清空，保证
 * 同链同时只有一个分支存活。
 *
 * 组件初始化依赖 render 的就绪握手：等 _bindingRendered（或
 * binding-rendered 事件）后才刷新——此时自身 :value 绑定已生效。
 */

const refreshCondition = (conditionEl) => {
  const conditionEls = [conditionEl];

  // 收集同链的兄弟条件元素
  if (conditionEl.tag === "o-if") {
    conditionEls.push(...getNexts(conditionEl.next));
  } else if (conditionEl.tag === "o-else-if") {
    conditionEls.push(...getNexts(conditionEl.next));
    conditionEls.unshift(...getPrevs(conditionEl.prev));
  }

  // 一条链只在首个 o-if 上做合并刷新
  const firstEl = conditionEls[0];
  if (firstEl.tag === "o-if") {
    clearTimeout(firstEl.__refreshTimer);
    firstEl.__refreshTimer = setTimeout(() => {
      // 按顺序找到第一个成立的条件；o-else 兜底
      let targetCondition = null;
      for (let i = 0; i < conditionEls.length; i++) {
        const el = conditionEls[i];
        if (el.tag === "o-if" || el.tag === "o-else-if") {
          if (el.value) {
            targetCondition = el;
            break;
          }
        } else {
          targetCondition = el;
        }
      }

      if (targetCondition) {
        renderContent(targetCondition);
        targetCondition.attr("actived", "");
      }

      // 其余分支清空内容
      conditionEls.forEach((el) => {
        if (el !== targetCondition) {
          el.attr("actived", null);
          clearContent(el);
        }
      });

      // 内容变更后唤醒父级监听（shadow 级订阅如 formData 依赖此约定）
      const { parentNode } = firstEl.ele;
      if (parentNode) {
        eleX(parentNode).refresh();
      }
    }, 0);
  } else {
    console.error("o-if must be the first element", conditionEls);
  }
};

// 渲染分支内容：按需编译 + 克隆绑定（渲染期零解析零编译）
const renderContent = (conditionEl) => {
  if (conditionEl.__rendered) {
    return;
  }

  const result = getRenderData(conditionEl.ele);

  if (!result) {
    return;
  }

  const { target, data, temps } = result;

  render({
    target: conditionEl.ele,
    data,
    temps,
    template: getCompiledContent(
      conditionEl.__originHTML,
      conditionEl.__originEl,
    ),
  });

  conditionEl.__rendered = true;

  conditionEl.emit("rendered", {
    bubbles: false,
  });
};

// 清空分支内容
const clearContent = (conditionEl) => {
  if (!conditionEl.__rendered) {
    return;
  }

  conditionEl.ele.childNodes?.forEach((el) => revokeAll(el));

  conditionEl.html = "";

  conditionEl.__rendered = false;

  conditionEl.emit("clear", {
    bubbles: false,
  });
};

// 获取后方兄弟条件元素（到 o-else 为止）
const getNexts = (next) => {
  const nexts = [];
  while (next && (next.tag === "o-else-if" || next.tag === "o-else")) {
    nexts.push(next);
    if (next.tag === "o-else") {
      break;
    }
    next = next.next;
  }
  return nexts;
};

// 获取前方兄弟条件元素（到 o-if 为止）
const getPrevs = (prev) => {
  const prevs = [];
  while (prev && (prev.tag === "o-if" || prev.tag === "o-else-if")) {
    prevs.unshift(prev);
    if (prev.tag === "o-if") {
      break;
    }
    prev = prev.prev;
  }
  return prevs;
};

const createdFunc = function () {
  // 元素可能先于子内容构造（如 createElement 或第三方库 cloneNode），
  // 此时首个子元素不存在，需要回退到自身内容
  const firstEle = this[0];
  if (firstEle && firstEle.is("template[inner-code]")) {
    this.__originHTML = firstEle.html.trim();
    // 保留元素引用：首次编译优先从元素搬运（表格位置的内容不可字符串
    // 重解析，见 getCompiledContent）
    this.__originEl = firstEle;
  } else {
    this.__originHTML = this.html.trim();
  }
  this.html = "";
};

const temp$1 = `<style>:host{display:contents;}</style><slot></slot>`;

const conditionOptions = {
  temp: temp$1,
  data: {
    value: null,
    // 分支渲染标记必须是注册数据：代理内部状态（__ 前缀直设）在
    // 条件元素上不保证持久，用它记 __rendered 会丢、clear 事件全灭
    __rendered: false,
  },
  watch: {
    value() {
      refreshCondition(this);
    },
  },
  created() {
    createdFunc.call(this);
  },
};

register$1({
  tag: "o-if",
  ...conditionOptions,
});

register$1({
  tag: "o-else-if",
  ...conditionOptions,
});

register$1({
  tag: "o-else",
  temp: temp$1,
  data: {
    value: null,
    __rendered: false,
  },
  created() {
    createdFunc.call(this);
  },
});

/**
 * 从目标节点向上找最近的渲染宿主（带 __render_data 的节点），
 * 返回 { target, data, temps }；o-if/o-fill 的内容渲染数据来源于此。
 */
const getRenderData = (target) => {
  while (target && !target.__render_data) {
    target = target.parentNode;
  }

  if (target) {
    return {
      target,
      data: target.__render_data,
      temps: target.__render_temps,
    };
  }

  return null;
};

/**
 * 列表渲染：o-fill（light DOM 版，唯一实现，列表项直接作为子元素渲染）。
 *
 * 支持两种模板来源：`name` 属性引用宿主的命名模板；未声明 name 时使用
 * 元素自身内容（编译期被 wrapTemp 包进 template[inner-code] 保护，首次
 * 渲染时按需编译并全局缓存）。列表项数据上下文为 $data/$index/$host/
 * $parent，与命名模板引用一致。
 *
 * 更新采用基于 key 的对账（fill-key 或 xid 或引用）+ LIS 最小移动：
 * 复用项只换绑 $data/$index，缺失则删除，新增则插入，乱序部分按最长
 * 递增子序列保证每个元素至多移动一次。触发面上只有 value 的结构变更
 * （整体替换、数组增删/重排/换元素）才整表对账；item 内部变更经
 * itemData 冒泡到行内绑定任务粒度消化，不为内容改动付出全量 diff。
 */

/**
 * LIS（最长递增子序列）：入参为新序列到旧元素的映射（null = 新建项），
 * 返回无需移动的新序列下标数组。patience 算法 + 前驱回溯，O(n log n)。
 */
const getSequence = (reused) => {
  const p = [];
  const seq = [];

  for (let i = 0; i < reused.length; i++) {
    const found = reused[i];

    if (!found) {
      continue;
    }

    const val = found.index;
    const last = seq[seq.length - 1];

    if (last === undefined || reused[last].index < val) {
      p[i] = last === undefined ? -1 : last;
      seq.push(i);
    } else {
      // 二分找 seq 中最后一个 index < val 的槽位替换
      let lo = 0;
      let hi = seq.length - 1;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (reused[seq[mid]].index < val) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      if (reused[seq[lo]].index > val) {
        p[i] = lo > 0 ? seq[lo - 1] : -1;
        seq[lo] = i;
      }
    }
  }

  // 回溯还原下标链
  const res = new Array(seq.length);
  let cursor = seq.length - 1;
  let idx = seq[cursor];

  while (cursor >= 0) {
    res[cursor] = idx;
    cursor--;
    idx = p[idx];
  }

  return res;
};

register$1({
  tag: "o-fill",
  temp: `<style>:host{display:contents;}</style><slot></slot>`,
  data: {
    value: null,
  },
  proto: {
    refreshView() {
      const arr = this.value;
      const tempName = this.attr("name");

      if (
        !arr ||
        !arr.length ||
        (this.__oldTempName && this.__oldTempName !== tempName)
      ) {
        // 没有值或模板来源已切换，清空内容
        Array.from(this.ele.childNodes).forEach((e) => {
          revokeAll(e);
          e.remove();
        });
        return;
      }

      if (!(arr instanceof Array)) {
        // 非数组值：告警并清空（如字符串恰好带 length，不能当列表用）
        console.warn(getErr$1("fill_type", { type: getType(arr) }));

        Array.from(this.ele.childNodes).forEach((e) => {
          revokeAll(e);
          e.remove();
        });
        return;
      }

      const { data, target, temps = {} } = getRenderData(this.ele);

      const keyName = this.attr("fill-key") || "xid";

      let targetTemp = temps[tempName];

      if (!targetTemp) {
        // 未声明 name 或找不到命名模板时，使用自身内容（编译缓存）
        if (this.__originHTML) {
          targetTemp = getCompiledContent(this.__originHTML, this.__originEl);
        } else {
          throw new Error("o-fill - Template not found: " + tempName);
        }
      }

      this.__oldTempName = tempName;

      if (!this.length) {
        // 首建：逐项创建后一次性挂载
        const frag = document.createDocumentFragment();

        for (let i = 0, len = arr.length; i < len; i++) {
          const item = arr[i];

          const $ele = createItem(
            item,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName,
            this._$parent,
          );

          frag.appendChild($ele.ele);
        }

        this.ele.appendChild(frag);
        return;
      }

      // 对账 key：fill-key → xid → "索引-引用" 兜底
      const getKeyVal = (e, i) => {
        const key = e[keyName];

        if (key === undefined || key === null) {
          if (e.xid) {
            return e.xid;
          }

          return `${i}-${e}`;
        }

        return key;
      };

      const selfEl = this.ele;

      // 旧子元素按 key 建索引（首现优先；重复 key 只复用一次，
      // 第二个实例走新建，避免两个位置争抢同一元素）
      const oldEls = Array.from(selfEl.children);
      const oldByKey = new Map();
      oldEls.forEach((e, i) => {
        const key = getKeyVal(e.__render_data.$data, i);
        if (!oldByKey.has(key)) {
          oldByKey.set(key, { el: e, index: i });
        }
      });

      // 新序列逐位取复用：取得到旧元素就复用，取不到就新建
      const reused = [];
      for (let i = 0, len = arr.length; i < len; i++) {
        const key = getKeyVal(arr[i], i);
        const found = oldByKey.get(key);

        if (found) {
          oldByKey.delete(key);
          reused.push(found);
        } else {
          reused.push(null);
        }
      }

      // 未被消费的旧元素 = 已删除项
      for (const { el } of oldByKey.values()) {
        el.remove();
        revokeAll(el);
      }

      // 复用项数据对齐：$data 换绑、$index 修正，由行内绑定任务粒度消化
      for (let i = 0, len = arr.length; i < len; i++) {
        const found = reused[i];

        if (!found) {
          continue;
        }

        const $ele = eleX(found.el);
        const item = arr[i];

        if ($ele.__item.$data !== item) {
          $ele.__item.$data = item;
        }
        if ($ele.__item.$index !== i) {
          $ele.__item.$index = i;
        }
      }

      // 免移动快速通道：无新增且旧位置整体递增（如批量删除、原地过滤）
      // 时连 LIS 都不必算
      let needMoves = false;
      let prevIndex = -1;
      for (const found of reused) {
        if (!found || found.index <= prevIndex) {
          needMoves = true;
          break;
        }
        prevIndex = found.index;
      }

      if (needMoves) {
        // LIS 最小移动：旧位置的最长递增子序列原地不动，其余元素各移动
        // 一次；从右往左以锚点落位（与 Vue 3 / inferno 同族算法），
        // 取代逐位对账——后者一次交换会级联约 n/2 次 DOM 移动
        const lis = new Set(getSequence(reused));

        let anchor = null;
        for (let i = arr.length - 1; i >= 0; i--) {
          const found = reused[i];
          let el;

          if (found) {
            if (lis.has(i)) {
              anchor = found.el;
              continue;
            }
            el = found.el;
          } else {
            el = createItem(
              arr[i],
              temps,
              targetTemp,
              data.$host || data,
              i,
              keyName,
              this._$parent,
            ).ele;
          }

          // 免插入检查只对已挂载的复用元素成立；新建元素是 detached 的
          // （nextSibling 恒为 null），必须无条件插入
          if (!found || el.nextSibling !== anchor) {
            selfEl.insertBefore(el, anchor);
          }
          anchor = el;
        }
      }

      // 列表变更后唤醒父级监听（shadow 级订阅如 formData 依赖此约定）
      const { parentNode } = selfEl;
      if (parentNode) {
        eleX(parentNode).refresh();
      }
    },
  },
  ready() {
    this.watchTick((watchers) => {
      // 只有 value 的结构变更（整体替换、数组增删/重排/换元素）才整表
      // 对账。结构判定依据 stanz 事件形态：数组方法与索引赋值的 target
      // 就是 value 数组，整体替换的 target 是 o-fill 自身（name="value"）；
      // item 内部变更的 target 是 item，跳过后由行内绑定任务粒度刷新。
      const structural = watchers.some(
        (w) =>
          (w.target === w.currentTarget && w.name === "value") ||
          w.target === w.currentTarget.value,
      );

      if (structural) {
        this.refreshView();
      }
    });
  },
  attached() {
    if (this.value) {
      this.refreshView();
    }
  },
  created() {
    let originHTML = "";

    const firstEle = this[0];
    if (firstEle && firstEle.is("template[inner-code]")) {
      originHTML = firstEle.html.trim();
      // 保留元素引用：首次编译优先从元素搬运内容（表格位置的内容不可
      // 字符串重解析，见 getCompiledContent）；内容随后被清掉。
      // this[0] 是 xhear 代理，存原生元素避免搬运时语义漂移
      this.__originEl = firstEle.ele;
    } else {
      originHTML = this.html.trim();
    }

    // 多根检测：直接数 template.content 的根节点——template 内容不受解析器
    // 位置限制，tr/option 等受限位置的内容原样保留。不能套 div 探测：解析器
    // 会把 div 里的 tr 整体丢弃、只留下浮的注释标记，造成"多根"误判
    const probeTemp = document.createElement("template");
    probeTemp.innerHTML = originHTML;
    const probeContent = probeTemp.content;

    const rootCount = probeContent.children.length;
    const hasStrayText = Array.from(probeContent.childNodes).some(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );

    if (rootCount > 1 || (rootCount === 0 && hasStrayText)) {
      // 多根时包一层 display:contents 的容器，保证列表项为单根
      // （注意：多根的表格行内容无法用 div 包裹，需在模板里自行包一层）
      const err = getErr$1("temp_multi_child");
      console.warn(err, this.ele, {
        content: this.html.trim(),
      });

      originHTML = `<div style="display: contents;">${originHTML}</div>`;
    }

    this.__originHTML = originHTML;

    this.html = "";
  },
});

/**
 * 为 o-fill 渲染创建列表项元素。
 *
 * @param {Object} $data - 列表项的数据对象
 * @param {Object} temps - 宿主可用的全部命名模板
 * @param {HTMLTemplateElement} targetTemp - 本列表项使用的模板
 * @param {Object} $host - 宿主数据（o-fill 所在组件实例），$host 供模板引用
 * @param {number} $index - 列表项索引
 * @param {string} keyName - 对账键名
 * @param {Object} $parent - 父级数据（上层 o-fill 嵌套时由外部传入）
 * @returns {Object} 列表项的 Xhear 实例（__item 上挂绑定数据）
 */
const createItem = (
  $data,
  temps,
  targetTemp,
  $host,
  $index,
  keyName,
  $parent,
) => {
  // 编译过的模板走克隆 + 描述符绑定（每项 innerHTML 解析已废）
  const binders = targetTemp && targetTemp.__xt;
  let $ele;
  let bindRoot;
  let baseIndex = 0;

  if (binders) {
    const frag = targetTemp.content.cloneNode(true);
    const rootEle = frag.children[0] || frag.firstChild;
    $ele = eleX(rootEle);
    bindRoot = frag;
    // 索引必须相对 frag 自身的 childNodes 求（rootEle 是克隆节点，
    // 在原 content 里查不到，会得到 -1 使全部绑定被跳过）
    baseIndex = Array.prototype.indexOf.call(frag.childNodes, rootEle);
  } else {
    $ele = createXEle(targetTemp.innerHTML);
  }

  const itemData = new Stanz({
    $data,
    $host,
    $index,
  });

  // $ele 若成为 item 的子属性，其内自定义组件的改动会反向冒泡，
  // 导致列表内元素不停重渲染的死循环；故 $ele 只读且不入观察
  Object.defineProperties(itemData, {
    $ele: {
      get() {
        return $ele;
      },
    },
  });

  if ($parent) {
    itemData.$parent = $parent;
  }

  render({
    target: $ele.ele,
    data: itemData,
    temps,
    binders,
    bindRoot,
    baseIndex,
    isRenderSelf: true,
  });

  // 项销毁时连带撤销 itemData，断开对源数据的引用
  const revokes = $ele.ele.__revokes;

  const revoke = () => {
    removeArrayValue(revokes, revoke);
    itemData.revoke();
  };

  revokes.push(revoke);

  $ele.__item = itemData;
  $ele.ele._data_xid = $data?.[keyName] || $data;

  return $ele;
};

/**
 * Xhear 类：把任意 Node 包装成"数据即元素"的代理实例。
 *
 * 结构上三合一：
 * - LikeArray —— 子元素当数组操作（push/splice 会真实搬动 DOM）；
 * - stanz —— 数据观察（构造时经 stanz 的 constructor 缝注入 xhear
 *   自己的 handler，数字键映射子元素）；
 * - 本类 —— 元素导航（parent/next/shadow…）与读写助手（text/html/attr…）。
 *
 * constructor 返回 proxySelf（代理），因此 eleX(el) 每次拿到同一实例。
 */

const { defineProperties } = Object;

const GET_COMPOSE_PATH = `get-${Math.random()}`;

/** 实例初始化：注入 ele/owner/tag 等元素侧字段，并接通表单支持 */
const init = ({ _this, ele, proxySelf }) => {
  const descs = {
    owner: {
      get() {
        const { parentNode } = ele;
        const { _owner } = _this;
        const arr = parentNode ? [eleX(parentNode), ..._owner] : [..._owner];
        return new Set(arr);
      },
    },
    ele: {
      get: () => ele,
    },
  };

  const tag = ele.tagName && ele.tagName.toLowerCase();

  if (tag) {
    descs.tag = {
      enumerable: true,
      value: tag,
    };
  }

  defineProperties(_this, descs);

  initFormEle(proxySelf);
};

class Xhear extends LikeArray {
  constructor({ ele }) {
    super();

    // 复用 stanz 的构造缝：同一套代理/观察/撤销机制，换用 xhear handler
    const proxySelf = constructor.call(this, {}, handler);

    init({
      _this: this,
      ele,
      proxySelf,
    });

    // 元素与实例双向锚定，eleX 据此保证单例
    ele.__xhear__ = proxySelf;

    return proxySelf;
  }

  get length() {
    return this.ele && this.ele.children.length;
  }

  $(expr) {
    let { ele } = this;
    if (ele instanceof HTMLTemplateElement) {
      ele = ele.content;
    }

    const target = ele.querySelector(expr);
    return target ? eleX(target) : null;
  }

  all(expr) {
    return searchEle(this.ele, expr).map(eleX);
  }

  extend(obj, desc) {
    return extend(this, obj, desc);
  }

  /** 点路径取值（"a.b.c"），单键退化为直接访问 */
  get(key) {
    return getPath(this, key);
  }

  /** 点路径赋值（"a.b.c"），单键退化为直接赋值 */
  set(key, value) {
    return setPath(this, key, value);
  }

  get text() {
    return this.ele.textContent;
  }

  set text(val) {
    this.ele.textContent = val;
  }

  get html() {
    return this.ele.innerHTML;
  }

  set html(val) {
    this.ele.innerHTML = val;
  }

  get classList() {
    return this.ele.classList;
  }

  get data() {
    return this.ele.dataset;
  }

  get shadow() {
    return eleX(this.ele.shadowRoot);
  }

  get root() {
    const rootNode = this.ele.getRootNode();
    return rootNode ? eleX(rootNode) : null;
  }
  get host() {
    let root = this.ele.getRootNode();
    let { host } = root;
    return host instanceof Node ? eleX(host) : null;
  }

  get parent() {
    let { parentNode } = this.ele;
    return !parentNode || parentNode === document ? null : eleX(parentNode);
  }

  get parents() {
    const parents = [];
    let target = this;
    while (target.parent) {
      target = target.parent;
      parents.push(target);
    }
    return parents;
  }

  /** 收集祖先直到匹配 expr 的节点为止（不含该节点） */
  parentsUntil(expr) {
    const allParents = this.parents;
    const parents = [];

    const exprIsObj = typeof expr === "object";

    while (allParents.length) {
      const target = allParents.shift();

      if (exprIsObj) {
        if (target === expr || target.ele === expr) {
          break;
        }
      } else if (target.ele.matches(expr)) {
        break;
      }

      parents.push(target);
    }

    return parents;
  }

  /** shadow host 祖先链（嵌套组件时逐层向上） */
  get hosts() {
    const hosts = [];
    let target = this;
    while (target.host) {
      target = target.host;
      hosts.push(target);
    }
    return hosts;
  }

  /** 借一次内部事件拿到事件系统的 composedPath */
  composedPath() {
    let paths = [];
    this.one(GET_COMPOSE_PATH, (e) => {
      paths = e.composedPath();
      e.stopPropagation();
    });
    this.emit(GET_COMPOSE_PATH, {
      composed: true,
    });
    return paths;
  }

  get next() {
    const nextEle = this.ele.nextElementSibling;
    return nextEle ? eleX(nextEle) : null;
  }

  /** 插到目标元素之后；没有下一个兄弟时等价 push 到父级末尾 */
  after(val) {
    const { next: nextEl } = this;

    if (nextEl) {
      nextEl.before(val);
    } else {
      this.parent.push(val);
    }
  }

  get nexts() {
    const { parent } = this;
    const selfIndex = this.index;
    return parent.filter((e, i) => i > selfIndex);
  }

  get prev() {
    const prevEle = this.ele.previousElementSibling;
    return prevEle ? eleX(prevEle) : null;
  }

  before(val) {
    const $el = createXEle(val);
    this.parent.ele.insertBefore($el.ele, this.ele);
  }

  get prevs() {
    const { parent } = this;
    const selfIndex = this.index;
    return parent.filter((e, i) => i < selfIndex);
  }

  get siblings() {
    return this.parent.filter((e) => e !== this);
  }

  get index() {
    let { parentNode } = this.ele;

    if (!parentNode) {
      return null;
    }

    return Array.prototype.indexOf.call(parentNode.children, this.ele);
  }

  get style() {
    return this.ele.style;
  }

  is(expr) {
    if (typeof expr === "string") {
      return this.ele.matches(expr);
    }

    if (expr instanceof Xhear) {
      return this.ele === expr.ele;
    }

    if (expr instanceof Node) {
      return this.ele === expr;
    }
  }

  contains(expr) {
    if (typeof expr === "string") {
      return this.ele.querySelector(expr) !== null;
    }

    if (expr instanceof Xhear) {
      return this.ele.contains(expr.ele);
    }

    if (expr instanceof Node) {
      return this.ele.contains(expr);
    }
  }

  /** 从父级数组中移除自身（走 splice 保证事件语义） */
  remove() {
    const { parent } = this;
    if (parent) {
      parent.splice(parent.indexOf(this), 1);
    }
  }

  clone(bool = true) {
    return eleX(this.ele.cloneNode(bool));
  }

  /** 用 content 包裹自身（wrap 元素插到原位置，自身移入其中） */
  wrap(content) {
    const $el = createXEle(content);

    const { ele } = this;

    if (!ele.parentNode) {
      throw getErr$1("xhear_wrap_no_parent");
    }

    ele.parentNode.insertBefore($el.ele, ele);

    // __internal 抑制搬动过程中的 attached/detached 误触发
    ele.__internal = 1;

    $el.ele.appendChild(ele);

    delete ele.__internal;

    return this;
  }

  /** 解包：把唯一子元素提升到父级后删掉包装层 */
  unwrap() {
    const { ele } = this;

    const target = ele.parentNode;

    if (target.children.length > 1) {
      throw getErr$1("xhear_unwrap_has_siblings");
    }

    ele.__internal = 1;

    target.parentNode.insertBefore(ele, target);

    target.remove();

    delete ele.__internal;

    return this;
  }
}

// ==== 能力组装 ====
// stanz 的 get/set（点路径）已由本类的 get/set 承担；
// 其余 stanz 原型能力（toJSON/toString）+ watch + 事件 + 渲染动作 +
// sync + 表单，全部以非枚举方式挂上原型，避免污染 spread/JSON。
const sfn = Stanz.prototype;
const fn = Xhear.prototype;

fn.extend(
  {
    toJSON: sfn.toJSON,
    toString: sfn.toString,
    ...watchFn,
    ...eventFn,
    ...defaultData,
    ...syncFn,
    // stanz 冒泡钩子：数据事件沿 DOM 宿主链上浮（shadow 级订阅依赖）
    _bubbleOwners() {
      return this.owner;
    },
  },
  {
    enumerable: false,
  }
);

fn.extend(cssFn);

/**
 * 元素包装与释放工具。
 * eleX 是整个库的入口转换器：任意 Node → Xhear 代理实例（幂等）。
 */

const eleX = (ele) => {
  if (!ele) return null;

  // 已包装过的元素直接复用实例，保证同一元素全库单例
  if (ele.__xhear__) {
    return ele.__xhear__;
  }

  return new Xhear({ ele });
};

/** { tag, ...attrs } 形式的对象描述 → 元素实例 */
const objToXEle = (obj) => {
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
const strToXEle = (str) => {
  parseTemp.innerHTML = str;
  const ele = parseTemp.content.children[0] || parseTemp.content.childNodes[0];
  parseTemp.innerHTML = "";

  return eleX(ele);
};

/**
 * 万能元素工厂：Xhear 实例 / Node / {tag} 对象 / HTML 字符串 → Xhear 实例。
 * xfill 列表项、$ele.before/after/wrap 都经由它归一化入参。
 */
const createXEle = (expr) => {
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
 * 数组上（组件根/shadowRoot 同样适用），revokeAll 沿树递归执行。
 * o-if 清空内容、o-fill 删项、组件销毁都依赖这个统一出口。
 */
const revokeAll = (target) => {
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

/** 工厂入口：stanz(data) 创建响应式数据 */
const stanz = (data) => {
  return new Stanz(data);
};

Object.assign(stanz, { is: isxdata });

/**
 * xhear 入口：组装 $ 对象。
 *
 * $ 本体是元素工厂/选择器（dollar.mjs），这里把 stanz 工厂、注册器、
 * 渲染底层、原型引用等挂为 $ 的静态能力，构成完整的对外 API 面。
 */

Object.assign($, {
  stanz,
  Stanz,
  // render/convert 是模板编译与绑定的底层入口（上层框架直接复用）
  render,
  convert,
  register: register$1,
  nextTick,
  fn: Xhear.prototype,
  all: (expr) => searchEle(document, expr).map(eleX),
  frag: () => $(document.createDocumentFragment()),
});

/**
 * ofa.js 的统一错误机制：本地错误码描述表 + XhearError。
 * 旧版依赖 ofa-error 在线加载文案（被认定的失败设计），现随源码走。
 */

/** 错误码 → 描述模板；{name} 等占位符由 getErr 用 options 填充 */
const errorDescs = {
  loading_nothing: "Loading function has no return content",
  not_page_module:
    "{src} is not a page module and cannot be set as the src of the page component",
  page_no_defaults:
    "The current page ({src}) has been rendered and cannot be rendered again",
  page_invalid_key:
    "The registration parameters of page {src} are incorrect. '{name}' on '{targetName}' is already taken. Please change '{name}' to another name.",
  load_page_module: "Loading page module {url} failed",
  page_failed: "Loading page failed: {src}",
  fetch_temp_err: "Page module {url} failed to load template {tempSrc}",
  page_wrap_fetch: "Page {before} failed to get the parent page ({current})",
  app_src_change:
    "The app element that has been initialized cannot modify the src attribute",
  app_noback:
    "This is already the first page, and the 'back' operation cannot be performed again",
  app_noforward:
    "This is the last page, you can no longer perform the 'forward' operation",
  need_forwards:
    "The target o-app does not allow forward operations, please add the '_forwards' attribute to the target; or in the app config file, add 'export const allowForward = true'",
  no_cross_access_func:
    "To jump to a page across domains, you must set the access function",
  access_return_error: "Jumping to {src} is not allowed",
  comp_registered:
    "Component '{tag}' has been registered, and the component cannot be registered again",
  load_comp_module: "Error loading component module, wrong module address: {url}",
  "inject-link-rel":
    "The rel attribute value of the link element in the inject-host component can only be 'stylesheet'",
  "use-data-inject":
    "Please do not use data() on the style element in the inject-host, because it will cause serious performance crisis",
  invalidated_inject_host: "This element will be invalidated in 'inject-host'",
  olink_out_app: "The element of [olink] is only allowed in o-app",
  no_provider:
    "The consumer named '{name}' was not captured by the corresponding provider",
  root_provider_exist:
    "An exception occurred in the root provider named '{name}'. The root provider component can only appear once",
  root_provider_name_change:
    "An exception occurred in the root provider named '{name}'. The root provider component cannot change the 'name' attribute",
};

/** 按错误码 + 占位符生成描述文本 */
const getErrDesc = (key, options) => {
  let desc = errorDescs[key];

  if (!desc) {
    return `Unknown error code: "${key}"`;
  }

  if (options) {
    for (let k in options) {
      desc = desc.replace(new RegExp(`\\{${k}\\}`, "g"), options[k]);
    }
  }

  return desc;
};

/** 快捷工厂：生成带 code 的 XhearError，cause 可选 */
const getErr = (key, options, cause) =>
  new XhearError(key, getErrDesc(key, options), { cause });

/**
 * inject-host：把 shadow 内的 link/style 收编到宿主根节点。
 *
 * 组件内放置 link[rel=stylesheet] 或 style，inject-host 会将它们提升到
 * 宿主根（document.head 或 shadowRoot），按内容 hash 去重共享，并在
 * 元素移除时自动回收；o-if/o-fill 等渲染型组件不参与处理。
 */

$.register({
  tag: "inject-host",
  temp: `<slot></slot>`,
  data: {},
  proto: {
    init() {
      if (!this.ele.isConnected) {
        return;
      }

      this.forEach((e) => this._init(e));
    },

    _init(e) {
      if (e.ele.__inited) {
        return;
      }

      switch (e.tag) {
        case "link":
          this._initLink(e);
          break;
        case "style":
          this._initStyle(e);
          break;
        case "o-if":
        case "o-else-if":
        case "o-else":
        case "o-fill":
          // Components of a rendered nature do not need to be alerted
          break;
        default:
          const err = getErr("invalidated_inject_host");
          console.warn(err, e);
      }
    },

    _initLink(e) {
      const href = e.attr("href");

      const rel = e.attr("rel");

      if (rel !== "stylesheet" && rel !== "host") {
        throw getErr("inject-link-rel");
      }

      let { ele } = e;

      if (rel !== "host") {
        e.attr("rel", "host");
        // It needs to be reset or it will contaminate itself
        e.attr("href", href);
      }

      ele.__inited = true;

      ele._revoke = () => {
        revokeLink(ele);
        ele._revoke = null;
      };

      initInjectEle(
        this,
        href,
        () => {
          const newEl = e.clone();
          newEl.attr("rel", "stylesheet");
          return newEl;
        },
        ele
      );
    },
    async _initStyle(e) {
      if (/data\(.+?\)/.test(e.html)) {
        const err = getErr("use-data-inject");
        console.warn(err, e.ele);
        throw err;
      }

      // Use only the text inside the style to prevent contaminating yourself
      const com = new Comment(e.html);
      com.__inited = true;

      com._revoke = () => {
        revokeLink(e.ele);
        delete com.__inited;
        delete e.ele.__inited;
        com._revoke = null;
        e.ele._revoke = null;
      };

      e.html = "";
      e.push(com);
      e.ele.__inited = true;
      e.ele._revoke = com._revoke;

      // const hash = await getHash(com.data);
      const hash = getStringHash(com.data);

      initInjectEle(this, hash, () => $(`<style>${com.data}</style>`), e.ele);
    },
  },
  attached() {
    const observer = (this._obs = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "x-bind-data") {
            // x component render
            continue;
          }

          // Logic for handling attribute changes
          const { target } = mutation;

          if (target.__inited) {
            target._revoke();
            this._init(eleX(target));
          }
        } else if (mutation.type === "childList") {
          mutation.removedNodes.forEach((e) => {
            if (e.__inited) {
              e._revoke();
            }
          });

          mutation.addedNodes.forEach((e) => {
            if (!e.__inited) {
              if (e instanceof Text) {
                if (e.parentElement.tagName === "STYLE") {
                  // change style text
                  this.init(e.parentNode);
                }
              }

              if (e.__inited) {
                // Don't get involved if you've been initialized.
                return;
              }

              if (e instanceof Text || e instanceof Comment) {
                // Invalid content
                return;
              }

              this._init(eleX(e));
            }
          });
        }
      }
    }));

    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(this.ele, config);

    this.init();
  },
  detached() {
    this.forEach((e) => revokeLink(e.ele));

    this._obs.disconnect();
  },
});

function getStringHash(str) {
  let hash = 0;
  let len = str.length;
  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i);
    hash = ((hash << 5) - hash) ^ charCode;
    hash = (hash << 13) | (hash >>> 19);
    hash = hash * 7 - hash * 3;
  }
  return hash.toString(36) + "--" + len;
}

function initInjectEle(injectEl, mark, cloneFunc, item) {
  const hostRoot = injectEl.host.root;

  let clink = hostRoot.$(`[inject-host="${mark}"]`);

  if (clink) {
    clink.ele.__items.add(item);
    item.__host_link = clink;
    return;
  }

  clink = cloneFunc();

  clink.attr("inject-host", mark);

  clink.ele.__items = new Set([item]);
  item.__host_link = clink;

  const { root } = injectEl.host;
  if (root.ele === document) {
    document.head.appendChild(clink.ele);
  } else {
    root.root.push(clink);
  }
}

function revokeLink(item) {
  if (item.__inited && item.__host_link) {
    const items = item.__host_link.ele.__items;
    items.delete(item);

    if (!items.size) {
      item.__host_link.remove();
    }

    delete item.__inited;
  }
}

/**
 * drill 的统一错误类型：携带稳定的机器可读错误码（code），
 * 并通过 ES2022 cause 保留底层错误的完整链路。
 */
class DrillError extends Error {
  /**
   * @param {string} code 稳定的错误码（如 load_fail_status）
   * @param {string} message 人类可读的描述
   * @param {{cause?: unknown}} [options] 底层错误，经 super 传入形成错误链
   */
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
  }
}

/** 快捷工厂：new DrillError(code, message, { cause }) */
const err = (code, message, cause) =>
  new DrillError(code, message, { cause });

let seed = 0;

/**
 * 极简洋葱模型中间件链：处理器按注册顺序执行，
 * 每个处理器自行决定何时（是否）调用 next() 放行到下一层。
 */
class Onion {
  constructor() {
    // 有序 Map：插入顺序即执行顺序，id 用于卸载
    this._middlewares = new Map();
  }

  /** 注册处理器，@returns {number} 处理器 id，可用于 unuse 卸载 */
  use(middleware) {
    const id = ++seed;
    this._middlewares.set(id, middleware);
    return id;
  }

  /** 按 id 卸载处理器，@returns 是否卸载成功 */
  unuse(id) {
    return this._middlewares.delete(id);
  }

  /** 顺序执行整条链；next() 走到链尾后自然结束 */
  async run(context) {
    // 复制一份快照：运行期间新注册的处理器不影响本次执行
    const middlewares = [...this._middlewares.values()];
    let index = -1;

    const next = async () => {
      const middleware = middlewares[++index];
      if (middleware) {
        await middleware(context, next);
      }
    };

    await next();
  }
}

const isBlobLike = (url) => /^(?:blob|data):/.test(url);

/** fetch 缓存池：键为缓存 URL，值为进行中或已完成的 fetch promise */
const caches = new Map();

/**
 * 带缓存的 fetch。默认把查询串从缓存键中剥掉，使 "./a.json?v=1" 与
 * "./a.json?v=2" 共享同一次请求；传入 -direct 参数则保留查询串，
 * 绕过共享键。
 */
const wrapFetch = async (url, params = []) => {
  let fetchUrl = url;

  if (!isBlobLike(url)) {
    const { origin, pathname } = new URL(url);
    fetchUrl = params.includes("-direct") ? url : `${origin}${pathname}`;
  }

  // 缓存的是 promise：并发请求天然去重，后续调用拿到同一个响应的克隆
  let fetching = caches.get(fetchUrl);

  if (!fetching) {
    fetching = fetch(fetchUrl);
    caches.set(fetchUrl, fetching);
  }

  // Response 只能读一次，clone 给每个调用方独立消费
  return (await fetching).clone();
};

/**
 * fetch + 状态检查 + 读取响应体，供所有基于文本的处理器复用，
 * 使 json/wasm 与 txt/html 拥有一致的 load_fail_status 错误行为。
 */
const read = async (url, params, readAs) => {
  let resp;

  try {
    resp = await wrapFetch(url, params);
  } catch (e) {
    throw err("load_fail", `Failed to load "${url}"`, e);
  }

  if (resp.status < 200 || resp.status >= 300) {
    throw err("load_fail_status", `Failed to load "${url}", status: ${resp.status}`);
  }

  return resp[readAs]();
};

/** 类型名 -> 处理器中间件链 */
const processor = {};

const addHandler = (name, handler) => {
  // 同类型多次 use 是追加中间件，而非覆盖
  const oni = processor[name] || (processor[name] = new Onion());
  oni.use(handler);
};

/**
 * 为一个或多个类型注册处理器中间件。
 *
 * @param {string | string[] | Function} name 类型名（或数组）；传裸函数时
 *   默认注册到模块类型 "js" 和 "mjs"
 * @param {Function} handler `(ctx, next) => {}` 中间件
 */
const use = (name, handler) => {
  if (name instanceof Function) {
    [handler, name] = [name, ["js", "mjs"]];
  }

  (Array.isArray(name) ? name : [name]).forEach((name) => {
    addHandler(name, handler);
  });
};

// ---- 以下为内建处理器 ----

use(["mjs", "js"], async (ctx, next) => {
  if (!ctx.result) {
    const { url, params } = ctx;
    const { origin, pathname } = new URL(url);

    // 动态 import 按完整 URL 去重，剥掉查询串让同一文件的不同参数
    // 拼写共享浏览器模块缓存；blob/data URL 原样导入
    const importUrl =
      isBlobLike(url) || params.includes("-direct")
        ? url
        : `${origin}${pathname}`;

    try {
      ctx.result = await import(importUrl);
    } catch (e) {
      const error = err(
        "load_module",
        `Failed to import module "${ctx.realUrl || url}"`,
        e
      );

      // blob 模块常来自动态生成场景，失败时附加打印上下文便于排查
      if (isBlobLike(url)) {
        console.warn(error, ctx);
      }

      throw error;
    }
  }

  await next();
});

use(["txt", "html", "htm"], async (ctx, next) => {
  if (!ctx.result) {
    ctx.result = await read(ctx.url, ctx.params, "text");
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    ctx.result = await read(ctx.url, ctx.params, "json");
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const data = await read(ctx.url, ctx.params, "arrayBuffer");

    // compile 预校验字节码，实例化后直接暴露 exports
    const module = await WebAssembly.compile(data);
    ctx.result = new WebAssembly.Instance(module).exports;
  }

  await next();
});

use("css", async (ctx, next) => {
  const { url, element, params } = ctx;

  if (element && !ctx.result) {
    // 元素模式：注入 <link> 生效样式，而不是返回文本
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    // 元素在 shadow DOM 内则注入对应根节点，否则注入 document.head
    const root = element.getRootNode();
    (root === document ? root.head : root).append(link);

    // 元素断开连接时同步移除样式；load-module 会在断开时派发 disconnected 事件
    element.addEventListener(
      "disconnected",
      () => {
        link.remove();
      },
      { once: true }
    );
  } else if (!ctx.result) {
    // 无元素时退化为纯文本加载
    ctx.result = await read(url, params, "text");
  }

  await next();
});

/**
 * 将模块标识符（可携带空格分隔的加载参数，如 "./data.json .txt"）
 * 解析为绝对 URL，并原样保留尾部参数。
 *
 * @param {string} moduleName 模块标识符
 * @param {string} [baseURI] 解析基准；缺省时用当前文档地址
 */
const path = (moduleName, baseURI) => {
  // 拆出 URL 与加载参数，解析后需原样拼回
  const [url, ...params] = moduleName.split(" ");

  let lastUrl = url;

  // http(s) 绝对地址不参与拼接；无 location 的环境（如 node）跳过解析
  if (!/^https?:/.test(url) && typeof location !== "undefined") {
    const base = baseURI ? new URL(baseURI, location.href) : location.href;
    lastUrl = new URL(url, base).href;
  }

  if (params.length) {
    return `${lastUrl} ${params.join(" ")}`;
  }

  return lastUrl;
};

/** load-module 元素的加载完成标记（symbol，避免与用户属性冲突） */
const LOADED = Symbol("loaded");

/**
 * Content-Type 嗅探表：URL 类型未命中任何处理器时的兜底，
 * 按响应的 Content-Type 反查处理器再执行一次。
 */
const MIME_TYPES = [
  ["application/javascript", "js"],
  ["text/javascript", "js"],
  ["application/json", "json"],
  ["text/html", "html"],
  ["text/xml", "xml"],
];

/** 取出以 prefix 开头的参数并去掉前缀，如 "--real:/a" --real→ "/a" */
const getParam = (params, prefix) => {
  const param = params.find((e) => e.startsWith(prefix));
  return param && param.slice(prefix.length);
};

/** 从路径取扩展名作为类型；无扩展名返回空串 */
const getExtType = (pathname) => {
  const index = pathname.lastIndexOf(".");
  return index === -1 ? "" : pathname.slice(index + 1);
};

/**
 * 加载单个绝对地址 URL：选定处理器链并执行。
 *
 * 类型优先级：`.type` 参数 > 路径扩展名；两者都未命中处理器时，
 * fetch 后按 Content-Type 嗅探，仍无匹配则返回原始 Response。
 *
 * @param {string} url 绝对 URL
 * @param {{params?: string[], element?: LoadModule}} opts
 * @returns 常规返回 ctx.result；带 `-ctx` 参数时返回整个加载上下文
 */
const agent = async (url, opts) => {
  const { pathname } = new URL(url);
  const params = opts.params ?? [];

  let type = getParam(params, ".");
  if (!type) {
    type = getExtType(pathname);
  }

  // opts 后置展开：允许调用方通过 opts 覆盖默认字段
  const ctx = {
    url,
    result: null,
    realUrl: getParam(params, "--real:"),
    params,
    ...opts,
  };

  const oni = processor[type];

  if (oni) {
    await oni.run(ctx);
  } else {
    const resp = await fetch(url);
    // 无 Content-Type 头时按空串处理，避免 includes 报错
    const contentType = resp.headers.get("Content-Type") || "";

    const matched = MIME_TYPES.find(([mime]) => contentType.includes(mime));

    if (matched && processor[matched[1]]) {
      await processor[matched[1]].run(ctx);
    } else {
      // 无任何处理器命中：交给调用方自行处理原始 Response
      ctx.result = resp;
    }
  }

  // element 模式：标记加载完成并派发 load 事件，供 load-module 使用
  const { element } = opts;
  if (element) {
    element[LOADED] = true;
    element.dispatchEvent(new Event("load"));
  }

  return params.includes("-ctx") ? ctx : ctx.result;
};

/**
 * 创建绑定基准地址的加载器。
 *
 * @param {{url: string}} [meta] 通常传 import.meta；缺省用当前文档地址
 * @param {{element?: LoadModule}} [opts] 附加选项（如关联 load-module 元素）
 * @returns {(url: string) => Promise<unknown>} 加载函数，接受带空格分隔参数
 *   的地址：`.type` 强制类型、`--real:xxx` 记录真实地址、`-ctx` 返回上下文、
 *   `-direct` 保留查询串
 */
function lm(meta, opts = {}) {
  if (!meta) {
    meta = { url: document.location.href };
  }

  return (ourl) => {
    // 先拆参数，路径部分解析为绝对 URL 后再连同参数一起加载
    const [url, ...params] = ourl.split(" ");
    return agent(path(url, meta.url), { params, ...opts });
  };
}

class LoadModule extends HTMLElement {
  static observedAttributes = ["src", "pause"];

  // 首次加载使用的 src，同时作为"已初始化"标记
  #initSrc;

  get loaded() {
    return !!this[LOADED];
  }

  #init() {
    // 已初始化或处于 pause 状态时跳过
    if (this.#initSrc || this.hasAttribute("pause")) {
      return;
    }

    const src = this.getAttribute("src");

    if (!src) {
      return;
    }

    this.#initSrc = src;

    // element 选项把元素关联进加载流程：完成后置位 LOADED 并派发 load 事件
    lm(undefined, { element: this })(src);

    // 初始化后锁定 src：实例属性遮蔽原型反射属性，后续赋值在严格模式下抛错
    Object.defineProperty(this, "src", {
      configurable: true,
      value: src,
    });
  }

  connectedCallback() {
    // root 供消费方定位所属文档或 shadow 根
    const event = new CustomEvent("connected");
    event.root = this._root = this.getRootNode();
    this.dispatchEvent(event);
  }

  disconnectedCallback() {
    // css 处理器依赖 disconnected 事件清理注入的 <link>
    const event = new CustomEvent("disconnected");
    event.root = this._root;
    delete this._root;
    this.dispatchEvent(event);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      // 升级已有元素时会以 (name, null, value) 重放回调，
      // 这正是解析器创建的 <l-m src="..."> 的初始化入口
      if (newValue && oldValue === null) {
        this.#init();
      } else if (this.#initSrc && oldValue && newValue !== this.#initSrc) {
        // 初始化后不允许换 src：回写原值并抛错，保证已加载内容与地址一致
        this.setAttribute("src", this.#initSrc);

        throw err(
          "change_lm_src",
          `The "src" of <${this.tagName.toLowerCase()}> cannot be changed after initialization`
        );
      }
    } else if (name === "pause" && newValue === null) {
      // pause 被移除时，补做被延迟的初始化
      this.#init();
    }
  }
}

// 同一自定义元素构造器只能注册一次，<l-m> 通过空子类复用全部行为
class LM extends LoadModule {}

const register = () => {
  customElements.define("load-module", LoadModule);
  customElements.define("l-m", LM);
};

// 文档尚未加载完成时等待 load，避免与解析中的 DOM 竞争
if (document.readyState === "complete") {
  register();
} else {
  window.addEventListener("load", register);
}

// 把处理器注册与路径解析挂到加载器上，形成完整对外 API
lm.use = use;
lm.path = path;

// 冻结后消费方（如 ofa）只能扩展处理器，不能篡改核心方法
Object.freeze(lm);

// 供 CDN 直引 ESM 源码的场景使用全局 lm（与 UMD 构建行为一致）
if (typeof window !== "undefined") {
  window.lm = lm;
}

/**
 * ofa.js 公共工具：路径解析、相对资源修正、页面数据加载链。
 */

/** 路径解析（转发 drill 的 path，旧版从 config.mjs 取） */
const resolvePath = path;

/** 元素是否处于 code 元素内（code 内的示例代码不做资源修正） */
const isInCode = (el) =>
  $(el)
    .composedPath()
    .some((e) => e.tagName && e.tagName.toLowerCase() === "code");

/**
 * 修正树内所有相对 href/src 为基于 basePath 的绝对地址；
 * code 元素内的内容与锚点链接（#开头）跳过。
 */
function fixRelate(element, basePath) {
  searchEle(element, "[href],[src]").forEach((el) => {
    if (isInCode(el)) {
      return;
    }

    ["href", "src"].forEach((attrName) => {
      const value = el.getAttribute(attrName);

      if (/^#/.test(value)) {
        return;
      }

      if (value && !/^(https?:)?\/\/\S+/.test(value)) {
        el.setAttribute(attrName, resolvePath(value, basePath));
      }
    });
  });

  searchEle(element, "template").forEach((el) => {
    if (isInCode(el)) {
      return;
    }

    fixRelate(el.content, basePath);
  });
}

/** 修正 HTML 字符串里的相对资源地址（含 style 的 url(...)），返回修正后字符串 */
function fixRelatePathContent(content, basePath) {
  const template = document.createElement("template");
  template.innerHTML = content;

  fixRelate(template.content, basePath);

  searchEle(template.content, "style").forEach((styleEl) => {
    const html = styleEl.innerHTML;

    styleEl.innerHTML = html.replace(/url\((.+)\)/g, (original, urlPath) => {
      return `url(${resolvePath(urlPath, basePath)})`;
    });
  });

  return template.innerHTML;
}

/** 页面加载失败的标记（与正常页面数据区分） */
const ISERROR = Symbol("loadError");

/**
 * 加载页面继承链：页面模块可声明 parent 形成父页链条，
 * 返回值为从根到目标的数组（unshift 逐层插入）。
 */
const getPagesData = async (src) => {
  const load = lm({
    url: src,
  });
  const pagesData = [];
  let defaults;
  let currentPageSrc = src;
  let previousPageSrc;
  let errorObj;

  while (true) {
    try {
      let lastSrc = currentPageSrc;
      const [realPageSrc] = currentPageSrc.split(" ");
      const pageSrcObj = new URL(realPageSrc);
      // 目录形式（/ 结尾）自动补 .html
      if (/\/$/.test(pageSrcObj.pathname)) {
        lastSrc += " .html";
      }

      defaults = await load(lastSrc);
    } catch (error) {
      let err;
      if (previousPageSrc) {
        err = getErr(
          "page_wrap_fetch",
          {
            before: previousPageSrc,
            current: currentPageSrc,
          },
          error,
        );
      } else {
        err = getErr(
          "load_page_module",
          {
            url: currentPageSrc,
          },
          error,
        );
      }
      errorObj = err;

      console.error(errorObj);
    }

    if (errorObj) {
      pagesData.unshift({
        src,
        ISERROR,
        error: errorObj,
      });
      break;
    }

    pagesData.unshift({
      src: currentPageSrc,
      defaults,
    });

    if (!defaults.parent) {
      break;
    }

    previousPageSrc = currentPageSrc;
    currentPageSrc = resolvePath(defaults.parent, currentPageSrc);
  }

  return pagesData;
};

/** 创建一个未挂载的 o-page 元素并渲染指定页面数据 */
const createPage = (src, defaults) => {
  const tempCon = document.createElement("div");

  tempCon.innerHTML = `<o-page src="${src}" data-pause-init="1"></o-page>`;

  const targetPage = eleX(tempCon.children[0]);

  nextTick(async () => {
    if (!targetPage._renderDefault) {
      await waitPageReaded(targetPage);
    }

    targetPage._renderDefault(defaults);
    targetPage.attr("data-pause-init", null);
  });

  return targetPage;
};

/** 等待页面完成渲染（优先复用页面自身的 _rendered Promise） */
const waitPageReaded = (pageElement) => {
  if (pageElement._rendered) {
    return pageElement._rendered;
  }

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (pageElement._rendered) {
        clearInterval(timer);
        resolve(pageElement._rendered);
      }
    }, 500);
  });
};

/**
 * o-link 与渲染期的链接修正。
 *
 * - renderExtends.render 钩子：init 时对组件/页面内的 a 元素做 olink
 *   初始化；attr 刷新时对 olink 元素基于页面地址修正相对链接。
 * - initLink：拦截 shadow 内 a[olink] 的点击，转成 o-app 的 goto 路由
 *   跳转（保留新标签打开、下载链接等原生行为）。
 * - $.extensions.link 是更高层框架注册自定义链接处理器的扩展点。
 */

const oldRender = renderExtends.render;
renderExtends.render = (e) => {
  oldRender && oldRender(e);

  const { step, name, target } = e;

  const { link } = $.extensions;

  if (step === "init") {
    // 组件/页面只渲染一次
    if (target.host && link) {
      $(target)
        .all("a")
        .forEach((e) => link(e));
    }
  } else if (
    name === "attr" &&
    step === "refresh" &&
    target.attr("olink") === ""
  ) {
    // olink 元素的属性刷新后，基于页面地址修正相对链接
    const top = target.parents.pop() || target;

    if (top.__fixLinkTimer) {
      return;
    }

    top.__fixLinkTimer = nextTick(() => {
      const { host } = target;

      if (host && host.tag === "o-page") {
        fixRelate(top.ele, host.src);
      }

      if (link) {
        $(top)
          .all("a")
          .forEach((e) => link(e));
      }
      delete top.__fixLinkTimer;
    });
  }
};

/** 初始化容器内的 olink 点击拦截 */
const initLink = (_this) => {
  const $ele = $(_this);

  $ele.on("click", (e) => {
    if (e.__processed) {
      return;
    }

    const $tar = $(e.target);
    const all = [$tar, ...$tar.parents];

    let currentTarget = all.find((e) => e.tag === "a");
    if (currentTarget) {
      currentTarget = currentTarget.ele;
    }

    if (!currentTarget) {
      return;
    }

    // 新标签打开与下载链接保持原生行为
    const targetVal = currentTarget.getAttribute("target");
    if (targetVal || currentTarget.getAttribute("download")) {
      return;
    }

    if (currentTarget.attributes.hasOwnProperty("olink")) {
      if ($ele.app) {
        if (e.metaKey || e.shiftKey) {
          return;
        }

        if (e.defaultPrevented) {
          return;
        }

        e.preventDefault();

        // 允许 goto 前的拦截取消跳转
        let prevented = false;
        e.preventDefault = () => {
          prevented = true;
        };

        e.__processed = true;

        if (currentTarget.tagName === "A") {
          const originHref = currentTarget.getAttribute("origin-href");
          // 优先使用 origin-href（原始相对地址）
          setTimeout(() => {
            const finalHref = originHref || currentTarget.href;
            finalHref && !prevented && $ele.app.goto(finalHref);
          });
        }
      } else {
        console.warn(getErr("olink_out_app"), _this);
      }
    }
  });
};

/**
 * HTML 页面/组件文件 → 可执行 JS 模块 的转换器。
 *
 * ofa.js 的开发形态是"组件即 HTML 文件"：文件内 `<template component|page>`
 * 声明组件/页面，`<script>` 承载逻辑，其余内容为模板。drawUrl 把这样的
 * 文件转译成一个 data URI 的 ES 模块（导出 type/temp/title 与原逻辑），
 * 由 drill 加载执行——无构建步骤，浏览器即所见即所得。
 *
 * 转译保持行号对齐（生成代码的前半部分与原文件逐行对应），并可选生成
 * sourcemap（debugMode）把行号映射回原文件，方便断点与报错定位。
 */

const strToBase64DataURI = async (str, mime, isb64 = true) => {
  const file = new File([str], "genfile", { type: mime });

  if (!isb64) {
    return URL.createObjectURL(file);
  }

  return await new Promise((resolve) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      resolve(e.target.result);
    };

    fr.readAsDataURL(file);
  });
};

/**
 * 生成把生成代码映射回源文件行号的 sourcemap data URI。
 * 生成代码与源码逻辑完全一致、只差行号，因此只需把生成行映射回源行。
 */
const getSourcemapUrl = async (
  filePath,
  originStarRowIndex,
  originEndRowIndex,
  originContent,
  startLine,
) => {
  const originLineArr = originContent.split("\n");

  let mappings = "";

  for (let i = 0; i <= startLine; i++) {
    mappings += ";";
  }

  let beforeRowIndex = 0;
  let beforeColIndex = 0;

  for (let rowId = originStarRowIndex + 1; rowId < originEndRowIndex; rowId++) {
    const target = originLineArr[rowId] || "";

    let rowStr = "";

    Array.from(target).forEach((e, colId) => {
      const currentStr = `AA${vlcEncode(rowId - beforeRowIndex)}${vlcEncode(
        colId - beforeColIndex,
      )}`;

      if (!rowStr) {
        rowStr = currentStr;
      } else {
        rowStr += `,${currentStr}`;
      }

      beforeRowIndex = rowId;
      beforeColIndex = colId;
    });

    mappings += `${rowStr};`;
  }

  const sourcesContent = JSON.stringify([originContent])
    .replace(/^\[/, "")
    .replace(/\]$/, "");

  const str = `{"version": 3,
    "sources": ["${filePath.replace(/\?.+/, "")}"],
    "sourcesContent":[${sourcesContent}],
    "mappings": "${mappings}"}`;

  return await strToBase64DataURI(str, "application/json");
};

// 将 style 映射为 sourcemap 的 base64 link 标签，方便调试
const addStyleSourcemap = async (temp, originContent, filePath) => {
  let reTemp = temp;

  // 备份一份可修改的原始内容（已处理过的部分替换为等量换行，保持行号）
  let backupOriginContent = originContent;

  const tempEl = document.createElement("template");
  tempEl.innerHTML = temp;

  const styleEls = tempEl.content.querySelectorAll("style");

  for (let e of Array.from(styleEls)) {
    const styleContent = e.innerHTML;
    const { outerHTML } = e;

    // 编译后开始的行数
    let startLine = 0;

    // 拆分原内容
    const matchArr = backupOriginContent.split(outerHTML);

    // 编译前开始的行数
    const originStarRowIndex = matchArr[0].split("\n").length - 1;

    // 编译前结束的行数
    const originEndRowIndex =
      originStarRowIndex + styleContent.split("\n").length - 1;

    // 已处理部分替换为换行，保证后续 style 的行号计算仍正确
    let middleStr = "";
    for (let i = 0, len = outerHTML.split("\n").length - 1; i < len; i++) {
      middleStr += "\n";
    }
    backupOriginContent = [matchArr[0], middleStr, matchArr[1]].join("");

    const sourceMapJSONURL = await getSourcemapUrl(
      filePath,
      originStarRowIndex,
      originEndRowIndex,
      originContent,
      startLine,
    );

    const sourcemapStr = `/*# sourceMappingURL=${sourceMapJSONURL}*/`;

    reTemp = reTemp.replace(
      outerHTML,
      `${outerHTML.replace("</style>", "")}\n${sourcemapStr}</style>`,
    );
  }

  return reTemp;
};

const cacheLink = new Map();

const isIdChar = (char) => /[A-Za-z0-9_$]/.test(char);

/** 跳过带引号字符串（含转义），返回结束引号后的下标 */
const skipString = (code, start) => {
  const quote = code[start];
  let i = start + 1;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (code[i] === quote) {
      return i + 1;
    }
    i++;
  }
  return i;
};

/** 跳过模板字符串（含 ${} 插值嵌套），返回结束反引号后的下标 */
const skipTemplate = (code, start) => {
  let i = start + 1;
  let depth = 0;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (depth === 0) {
      if (code[i] === "`") {
        return i + 1;
      }
      if (code[i] === "$" && code[i + 1] === "{") {
        depth = 1;
        i += 2;
        continue;
      }
    } else {
      if (code[i] === "{") {
        depth++;
      } else if (code[i] === "}") {
        depth--;
      }
    }
    i++;
  }
  return i;
};

/** 跳过正则字面量，返回结束斜杠后的下标 */
const skipRegExp = (code, start) => {
  let i = start + 1;
  let inClass = false;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (code[i] === "\n") {
      break;
    }
    if (inClass) {
      if (code[i] === "]") {
        inClass = false;
      }
    } else if (code[i] === "[") {
      inClass = true;
    } else if (code[i] === "/") {
      return i + 1;
    }
    i++;
  }
  return i;
};

/**
 * 扫描脚本代码，把每个顶层 import 声明的模块说明符用 resolvePath 重写
 * 为基于文件地址的绝对路径。注释、字符串、模板字符串与正则字面量原样
 * 透过，因此被注释包裹或后随注释的 import 也能正确重写；import() 与
 * import.meta 不属于静态声明，保持原样。
 */
const rewriteImportPaths = (code, url) => {
  let output = "";
  let i = 0;
  let prev = ""; // 上一个有效代码字符，用于区分正则与除法

  while (i < code.length) {
    const char = code[i];

    // 行注释
    if (char === "/" && code[i + 1] === "/") {
      let end = code.indexOf("\n", i);
      if (end === -1) {
        end = code.length;
      }
      output += code.slice(i, end);
      i = end;
      continue;
    }

    // 块注释
    if (char === "/" && code[i + 1] === "*") {
      let end = code.indexOf("*/", i + 2);
      end = end === -1 ? code.length : end + 2;
      output += code.slice(i, end);
      i = end;
      continue;
    }

    // 字符串
    if (char === '"' || char === "'") {
      const end = skipString(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 模板字符串
    if (char === "`") {
      const end = skipTemplate(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 正则字面量（无法成为除法的斜杠）
    if (
      char === "/" &&
      !isIdChar(prev) &&
      !")]}".includes(prev) &&
      prev !== '"' &&
      prev !== "'" &&
      prev !== "`"
    ) {
      const end = skipRegExp(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 顶层 import 关键字
    if (
      char === "i" &&
      !isIdChar(prev) &&
      code.startsWith("import", i) &&
      !isIdChar(code[i + 6])
    ) {
      // 定位关键字后的第一个字符串 token；import( 与 import.meta 不是
      // 静态声明，保持原样
      let j = i + 6;
      let specifierStart = -1;
      let specifierEnd = -1;
      let quote = "";
      while (j < code.length) {
        const cj = code[j];
        if (/\s/.test(cj)) {
          j++;
          continue;
        }
        if (cj === "/" && code[j + 1] === "/") {
          const end = code.indexOf("\n", j);
          j = end === -1 ? code.length : end;
          continue;
        }
        if (cj === "/" && code[j + 1] === "*") {
          const end = code.indexOf("*/", j + 2);
          j = end === -1 ? code.length : end + 2;
          continue;
        }
        if (cj === "(" || cj === ".") {
          break;
        }
        if (cj === '"' || cj === "'") {
          specifierStart = j + 1;
          specifierEnd = skipString(code, j) - 1;
          quote = cj;
          break;
        }
        j++;
      }

      if (specifierStart !== -1) {
        const pathStr = code.slice(specifierStart, specifierEnd);
        output += code.slice(i, specifierStart - 1);
        output += `${quote}${resolvePath(pathStr, url)}${quote}`;
        i = specifierEnd + 1;
        continue;
      }
    }

    if (!/\s/.test(char)) {
      prev = char;
    }
    output += char;
    i++;
  }

  return output;
};

/**
 * 把页面/组件 HTML 文件转译为 data URI 模块地址（带缓存）。
 *
 * @param {string} content HTML 文件内容
 * @param {string} url 文件地址
 * @param {boolean} isPage true 为页面（template[page]），false 为组件
 */
async function drawUrl(content, url, isPage = true) {
  let targetUrl = cacheLink.get(url);
  if (targetUrl) {
    return targetUrl;
  }

  const isDebug = $.debugMode;

  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  // 除 script 外没有其他内容时，不设置 shadow root
  const hasTemp = !!targetTemp.html
    .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, "")
    .trim();
  let temp = "";

  if (hasTemp) {
    temp = targetTemp.html
      .replace(/\s+$/, "")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");

    if (isDebug) {
      temp = await addStyleSourcemap(temp, content, url);
    }

    // 未定义前隐藏，防止自定义元素升级前的闪烁
    temp = "<style>*:not(:defined){display:none;}</style>" + temp;
  }

  // 生成代码的前半部分（后半部分是原 script 内容）
  const beforeContent = `
  export const type = ${isPage ? "ofa.PAGE" : "ofa.COMP"};
  ${
    isPage && titleEl
      ? `export const title = '${titleEl.text.replace(/\'/g, "\\'")}';`
      : ""
  }
  export const temp = \`${temp}\`;`;

  let scriptContent = "";
  if (scriptEl) {
    scriptContent = rewriteImportPaths(scriptEl.html, url);
  }

  const fileContent = `${beforeContent};
${scriptContent}`;

  let sourcemapStr = "";

  if (isDebug) {
    const originLineArr = content.split("\n");

    // 定位源文件中 script 的起止行
    const originStarRowIndex = originLineArr.findIndex((lineContent) => {
      const trimmed = lineContent.trim();
      return trimmed === "<script>" || trimmed.startsWith("<script ");
    });

    const originEndRowIndex = originLineArr.findIndex(
      (lineContent) => lineContent.trim() === "</script>",
    );

    sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
      url,
      originStarRowIndex,
      originEndRowIndex,
      content,
      beforeContent.split("\n").length,
    )}`;
  }

  const finalContent = `${fileContent}\n${sourcemapStr}`;


  // Firefox 对 data URI 模块的模块图有限制，改走 blob URL
  const isFirefox = navigator.userAgent.includes("Firefox");

  targetUrl = await strToBase64DataURI(
    finalContent,
    "text/javascript",
    isFirefox ? false : true,
  );

  cacheLink.set(url, targetUrl);

  return targetUrl;
}

const base64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toVLQSigned(value) {
  return value < 0 ? (-value << 1) + 1 : (value << 1) + 0;
}

function vlcEncode(value) {
  let encoded = "";
  let vlq = toVLQSigned(value);

  do {
    let digit = vlq & 0b11111;
    vlq >>>= 5;
    if (vlq > 0) {
      digit |= 0b100000;
    }
    encoded += base64[digit];
  } while (vlq > 0);

  return encoded;
}

/**
 * o-page 页面组件与页面模块加载。
 *
 * 页面模块即 `export const type = PAGE` 的模块（通常由 template[page]
 * 的 HTML 文件转译而来），声明 temp/data/proto/loaded/attached 等。
 * o-page 通过 src 加载页面模块并渲染到自身；页面可声明 parent 形成
 * 继承链（app 的嵌套路由依赖它）。
 */

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

// ---- 页面模块加载中间件 ----

// html/htm 文件若含 template[page]，转译为页面模块再加载
lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +page *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    try {
      const url = await drawUrl(content, ctx.url);
      ctx.result = await lm()(`${url} .mjs --real:${ctx.url}`);
    } catch (error) {
      throw getErr(
        "load_page_module",
        {
          url: ctx.url,
        },
        error,
      );
    }
    ctx.resultContent = content;
  }

  await next();
});

// type === PAGE 的模块：解析默认值并加载模板内容
lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url, realUrl } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, realUrl || url);

  let tempSrc = defaultsData.temp;

  // temp 为非 HTML 内容时视为模板地址，加载模板内容
  if (!/<.+>/.test(tempSrc)) {
    if (tempSrc) {
      tempSrc = resolvePath(tempSrc, url);
    } else {
      tempSrc = url.replace(/\.m?js.*/, ".html");
    }

    try {
      defaultsData.temp = await fetch(tempSrc).then((e) => e.text());
    } catch (error) {
      const err = getErr(
        "fetch_temp_err",
        {
          url: realUrl || url,
          tempSrc,
        },
        error,
      );
      self.emit("error", { data: { error: err } });
      throw err;
    }
  }

  ctx.result = defaultsData;

  await next();
});

// 延迟到 type="module" 脚本执行完再注册，避免初始化次序问题
setTimeout(() => {
  $.register({
    tag: "o-page",
    attrs: {
      src: null,
    },
    data: {
      pageIsReady: null,
    },
    watch: {
      async src(src) {
        if (!src) {
          return;
        }

        if (!src.startsWith("//") && !/[a-z]+:\/\//.test(src)) {
          // 相对地址先解析为绝对地址
          src = resolvePath(src);
          this.src = src;
          return;
        }

        if (this.__init_src) {
          if (this.__init_src !== src) {
            throw Error(
              "A page that has already been initialized cannot be set with the src attribute",
            );
          }
          return;
        }

        this.__init_src = src;

        if (this._defaults || this.attr("data-pause-init")) {
          return;
        }

        const pagesData = await getPagesData(src);

        if (this._defaults) {
          return;
        }

        const target = pagesData.pop();

        // 父页链条：逐层包裹父页（本页在最内层）
        pagesData.forEach((e) => {
          const parentPage = createPage(e.src, e.defaults);

          if (this.parent) {
            this.wrap(parentPage);
          } else {
            const needWraps = this.__need_wraps || (this.__need_wraps = []);
            needWraps.push(parentPage);
          }
        });

        if (target.ISERROR === ISERROR) {
          const failContent = getFailContent(
            src,
            target,
            this?.app?._module?.fail,
          );

          this._renderDefault({
            type: PAGE,
            temp: failContent,
          });
        } else {
          this._renderDefault(target.defaults);
        }
      },
    },
    attached() {
      const needWraps = this.__need_wraps;
      if (needWraps) {
        needWraps.forEach((page) => {
          this.wrap(page);
        });
        delete this.__need_wraps;
      }

      if (this.__not_run_attached) {
        if (this._defaults.attached) {
          this._defaults.attached.call(this);
        }
        delete this.__not_run_attached;
      }
    },
    detached() {
      const { _defaults } = this;

      if (_defaults && _defaults.detached) {
        _defaults.detached.call(this);
      }
    },
    proto: {
      async _renderDefault(defaults) {
        const { src } = this;

        if (defaults.data) {
          // 页面保留字段与元素原型能力不可被 data 占用
          Object.keys(defaults.data).forEach((name) => {
            if (
              [
                "src",
                "goto",
                "replace",
                "back",
                "pageAnime",
                "pageIsReady",
              ].includes(name) ||
              name in $.fn
            ) {
              throw getErr("page_invalid_key", {
                src,
                targetName: "data",
                name,
              });
            }
          });
        }

        if (defaults.proto) {
          Object.keys(defaults.proto).forEach((name) => {
            if (name in this) {
              console.warn(
                getErrDesc("page_invalid_key", {
                  src,
                  targetName: "proto",
                  name,
                }),
                defaults,
              );
            }
          });
        }

        if (this._defaults) {
          const err = getErr("page_no_defaults", { src });
          console.warn(err, this);
          throw err;
        }

        this._defaults = defaults;

        if (defaults.pageAnime) {
          this._pageAnime = defaults.pageAnime;
        }

        if (!defaults || defaults.type !== PAGE) {
          const err = getErr("not_page_module", { src });
          console.warn(err, this);
          this.emit("error", { data: { error: err } });
          this.__reject(err);
          throw err;
        }

        const template = document.createElement("template");
        template.innerHTML = fixRelatePathContent(defaults.temp, src);
        const temps = convert(template);

        try {
          renderElement({
            defaults,
            ele: this.ele,
            template,
            temps,
          });
        } catch (error) {
          const err = getErr("page_failed", { src }, error);
          console.error(err);
          console.warn(err, this);
        }

        await dispatchLoad(this, defaults.loaded);

        initLink(this.shadow);

        this.emit("page-loaded");

        this.__resolve();

        this.pageIsReady = 1;

        const { app } = this;
        if (app && !app.appIsReady) {
          nextTick(() => {
            app.appIsReady = 1;
          });
        }

        if (this.ele.isConnected) {
          if (defaults.attached) {
            defaults.attached.call(this);
          }
        } else {
          this.__not_run_attached = 1;
        }
      },
      back() {
        this.app.back();
      },
      goto(src) {
        this.app.goto(resolvePath(src, this.src));
      },
      replace(src) {
        this.app.replace(resolvePath(src, this.src));
      },
      get pageAnime() {
        const { app, _pageAnime } = this;

        const { pageAnime } = app?._module || {};

        return clone({ ...pageAnime, ...(_pageAnime || {}) });
      },
      set pageAnime(val) {
        this._pageAnime = val;
      },
    },

    ready() {
      this._rendered = new Promise((resolve, reject) => {
        this.__resolve = () => {
          delete this.__resolve;
          delete this.__reject;
          resolve();
        };
        this.__reject = () => {
          delete this.__resolve;
          delete this.__reject;
          reject();
        };
      });
    },
  });
});

/** 等待 shadow 内的 l-m 与样式链接加载完成，再触发 loaded */
const dispatchLoad = async (_this, loaded) => {
  const shadow = _this.ele.shadowRoot;

  if (shadow) {
    const srcEles = searchEle(shadow, `l-m,load-module`);
    const pms = srcEles.map(
      (el) =>
        new Promise((res) => {
          el.addEventListener("load", () => {
            res();
          });
        }),
    );

    const links = searchEle(shadow, `link`);

    links.forEach((link) => {
      if (link.rel === "stylesheet") {
        pms.push(
          new Promise((res) => {
            let resolve = () => {
              clearInterval(timer);
              link.removeEventListener("load", resolve);
              link.removeEventListener("error", resolve);
              res();
            };
            const timer = setInterval(() => {
              // 链接被移除（如 inject-host 收编）也视为完成
              if (!link.parentNode) {
                resolve();
              }
            }, 100);

            if (link.sheet) {
              resolve();
            } else {
              link.addEventListener("load", resolve);
              link.addEventListener("error", resolve);
            }
          }),
        );
      }
    });

    await Promise.all(pms);
  }

  if (loaded) {
    loaded.call(_this);
  }
};

/** 合并模块默认值（default 可为函数，入参提供 load 与 query） */
const getDefault = async (moduleData, url) => {
  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  const relateLoad = lm({
    url,
  });

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: relateLoad,
      url,
      get query() {
        const urlObj = new URL(url);
        return Object.fromEntries(Array.from(urlObj.searchParams.entries()));
      },
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = { ...defaultData };
  }

  const defaults = {
    proto: {},
    ...moduleData,
    ...finnalDefault,
  };

  return defaults;
};

/** 生成加载失败页的内容（优先使用 app 的 fail 自定义） */
const getFailContent = (src, target, fail) => {
  let failContent;

  if (fail) {
    failContent = fail({
      src,
      error: target.error,
    });
  } else {
    failContent = `<div style="padding:20px;color:red;">${(
      target.error.stack || target.error.toString()
    )
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")}</div>`;
  }

  return failContent;
};

/**
 * 组件模块系统：组件即文件。
 *
 * 组件模块即 `export const type = COMP` 的模块（通常由 template[component]
 * 的 HTML 文件转译而来），声明 tag/temp/data/proto/loaded 等。comp 中间件
 * 负责把这类模块注册成自定义元素；同名 tag 重复注册（不同地址）直接报错。
 */

const COMP = Symbol("Component");

// 组件文件地址（供 PATH 相对资源解析使用）
const COMPONENT_PATH = Symbol("PATH");

Object.defineProperty($, "COMP", {
  value: COMP,
});

const cacheComps = {};

// html/htm 文件若含 template[component]，转译为组件模块再加载
lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +component *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    try {
      const url = await drawUrl(content, ctx.url, false);
      ctx.result = await lm()(`${url} .mjs --real:${ctx.url}`);
    } catch (err) {
      throw getErr(
        "load_comp_module",
        {
          url: ctx.url,
        },
        err,
      );
    }
    ctx.resultContent = content;
  }

  await next();
});

// type === COMP 的模块：注册为自定义元素
lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url, realUrl } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    next();
    return;
  }

  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  console.debug(
    "[xt-comp]",
    "modKeys=" + Object.keys(moduleData).join(","),
    "defaultType=" + typeof defaultData,
    "defaultKeys=" + (defaultData ? Object.keys(defaultData).join(",") : "-"),
  );

  const path = realUrl || url;

  // default 支持函数形态，入参提供相对加载器与文件地址
  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: lm({
        url: path,
      }),
      url: path,
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = { ...defaultData };
  }

  const { tag, temp } = { ...moduleData, ...finnalDefault };

  // 未声明 tag 时，从文件名推断（驼峰转 dash-case）
  let tagName = tag;
  const matchName = path.match(/\/([^/]+)\.m?(js|htm|html)$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  const cacheUrl = cacheComps[tagName];
  if (cacheUrl) {
    if (path !== cacheUrl) {
      throw getErr("comp_registered", {
        tag: tagName,
      });
    }

    // 同地址重复加载视为幂等
    await next();
    return;
  }

  cacheComps[tagName] = path;

  let tempUrl;
  let tempContent = "";

  if (/<.+>/.test(temp)) {
    // temp 为内联 HTML
    tempUrl = path;
    tempContent = temp;
  } else if (temp !== "") {
    // 空字符串表示不需要 shadow root；非空字符串视为模板地址
    if (!temp) {
      tempUrl = resolvePath(`${matchName[1]}.html`, path);
    } else {
      tempUrl = resolvePath(temp, path);
    }

    tempContent = await fetch(tempUrl).then((e) => e.text());
  }

  const registerOpts = {
    ...moduleData,
    ...finnalDefault,
  };

  // ready 前置注入：loaded 事件派发 + link 初始化
  const oldReady = registerOpts.ready;
  const { loaded } = registerOpts;
  registerOpts.ready = async function (...args) {
    oldReady && oldReady.apply(this, args);
    loaded && dispatchLoad(this, loaded);
    this.shadow && initLink(this.shadow);
  };

  // created 注入组件文件地址（PATH 的数据来源）
  const oldCreated = registerOpts.created;
  registerOpts.created = function (...args) {
    this[COMPONENT_PATH] = path;
    oldCreated && oldCreated.call(this, ...args);
  };

  const regTemp = fixRelatePathContent(tempContent, path || tempUrl);

  $.register({
    ...registerOpts,
    tag: tagName,
    temp: regTemp,
  });

  await next();
});

/**
 * o-app：应用容器与路由。
 *
 * src 指向应用配置模块（可声明 home/allowForward/access/fail/pageAnime
 * 等）；路由 API：goto/replace/back/forward；支持嵌套路由（页面继承链
 * 中同前缀的父页保持不销毁）、前进后退历史、页面进出动画与跨域访问控制。
 */

const HISTORY = "_history";
const FORWARDS = "_forwards";

const appendPage = async ({ src, app }) => {
  const { loading, fail } = app._module || {};

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    if (!loadingEl) {
      const err = getErr("loading_nothing");
      console.warn(err, loading);
      throw err;
    }

    app.push(loadingEl);
  }

  const oriNextPages = await getPagesData(src);

  // Snapshot current pages after await;
  // concurrent navigations (e.g. the initial hash goto racing with a
  // popstate-driven goto) would otherwise both see "no current page"
  // and append the same page twice.
  const currentPages = [];
  {
    const { current } = app;
    if (current) {
      currentPages.push(current);
      for (let page of current.parents) {
        if (page.tag !== "o-page") {
          break;
        }

        currentPages.unshift(page);
      }
    }
  }

  let container = app;

  const publicParents = []; // Public parent pages that have not been cleared
  const finalPages = [];
  let old;

  // Nested routing code
  // Keep the parent page with the same src
  let isSame = true;
  oriNextPages.forEach((e, index) => {
    const current = currentPages[index];

    if (!isSame) {
      finalPages.push(e);
      return;
    }

    if (!current || current.src !== e.src) {
      isSame = false;
      finalPages.push(e);
      old = current;
      return;
    }

    publicParents.push(current);

    container = current;
  });

  // In the case of only the parent page, the old variable needs to be corrected
  if (currentPages.length > oriNextPages.length && !old) {
    currentPages.some((e, index) => {
      const current = oriNextPages[index];

      if (!current || current.src !== e.src) {
        old = e;
        return true;
      }
    });
  }

  let topPage, innerPage;

  finalPages.forEach((pageData) => {
    const { ISERROR: isError } = pageData;

    let page;
    if (isError) {
      const failContent = getFailContent(pageData.src, pageData, fail);

      page = createPage(pageData.src, {
        type: $.PAGE,
        temp: failContent,
      });
    } else {
      page = createPage(pageData.src, pageData.defaults);
    }

    if (!topPage) {
      topPage = page;
      return;
    }

    if (!innerPage) {
      topPage.push(page);
      innerPage = page;
      return;
    }

    innerPage.push(page);
    innerPage = page;
  });

  if (topPage) {
    container.push(topPage);
  }

  loadingEl && loadingEl.remove();

  return { current: topPage, old, publics: publicParents };
};

// 触发父page的 routerChange 事件
const emitRouterChange = (_this, publics, type) => {
  if (publics && publics.length) {
    const { current } = _this;
    publics.forEach((page) => {
      // const { page } = e;
      const { routerChange } = page._defaults;

      if (routerChange) {
        routerChange.call(page, { type, current });
      }
    });
  }
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(*){display:block;width:100%;height:100%;}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {
    [HISTORY]: [],
    appIsReady: null,
    // _forwards: [],
  },
  watch: {
    async src(val) {
      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw getErr("app_src_change");
        }
        return;
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      let selfUrl = val;
      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        selfUrl = resolvePath(val);
      }

      const load = lm();

      const moduleData = await load(selfUrl);

      if (moduleData.allowForward) {
        this[FORWARDS] = [];
      }

      const defaults = await getDefault(moduleData, selfUrl);

      this._module = defaults;

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      if (this._settedRouters) {
        return;
      }

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }
    },
  },
  proto: {
    async forward(delta = 1) {
      if (!this[FORWARDS]) {
        const err = getErr("need_forwards");
        console.warn(err, this);
        return;
      }

      delta = delta < this[FORWARDS].length ? delta : this[FORWARDS].length;

      const forwardHistory = this[FORWARDS].splice(-delta);

      if (!forwardHistory.length) {
        const err = getErr("app_noforward");
        console.warn(err, {
          app: this,
        });
        return;
      }

      return this._navigate({
        type: "forward",
        src: forwardHistory[0].src,
        forwardHistory,
        delta,
      });
    },
    async back(delta = 1) {
      if (!this[HISTORY].length) {
        const err = getErr("app_noback");
        console.warn(err, {
          app: this,
        });
        return;
      }

      const oldRouters = this.routers;

      const { _noanime } = this;

      // Delete historical data for response numbers
      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src: newCurrent.src,
        app: this,
      });

      if (!_noanime && page) {
        await pageInAnime({
          page,
          key: "previous",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      const oldHis = oldRouters.slice(-1 * delta);

      if (this[FORWARDS]) {
        this[FORWARDS].push(...oldHis);
      }

      this.emit("router-change", {
        data: { name: "back", delta, historys: oldHis },
      });

      emitRouterChange(this, publics, "back");

      if (!_noanime && needRemovePage) {
        await pageOutAnime({
          page: needRemovePage,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage.remove();
      }
    },
    async _navigate(options) {
      let { type, src } = options;

      const { _noanime } = this;
      const { current: oldCurrent } = this;
      // src = new URL(src, location.href).href;
      src = resolvePath(src);

      runAccess(this, src);

      if (!oldCurrent) {
        this._initHome = src;
      }

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src,
        app: this,
      });

      if (!page) {
        return;
      }

      if (!_noanime && page) {
        await pageInAnime({
          page,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      const routerData = { name: type, src };

      if (type === "goto" || type === "forward") {
        oldCurrent && this[HISTORY].push({ src: oldCurrent.src });
      }

      if (type === "goto") {
        if (Array.isArray(this[FORWARDS])) {
          this[FORWARDS] = [];
        }
      }

      if (type === "forward") {
        const { forwardHistory } = options;
        const nextHistory = forwardHistory.slice(1).reverse();
        this[HISTORY].push(...nextHistory);
        routerData.delta = options.delta;
      }

      this.emit("router-change", {
        data: routerData,
      });

      emitRouterChange(this, publics, type);

      if (oldCurrent && needRemovePage) {
        if (!_noanime) {
          await pageOutAnime({
            page: needRemovePage,
            key: "previous",
          });
        }
        needRemovePage.remove();
      }
    },
    goto(src) {
      return this._navigate({ type: "goto", src });
    },
    replace(src) {
      return this._navigate({ type: "replace", src });
    },
    get current() {
      return this.all("o-page")
        .reverse()
        .find((page) => {
          let target = page;
          while (target.tag === "o-page") {
            if (target.data.willRemoved) {
              return false;
            }
            target = target.parent;
          }

          return true;
        });
    },
    get routers() {
      let { current } = this;

      if (!current) {
        return [];
      }

      const routers = [
        ...this[HISTORY],
        {
          src: current.src,
        },
      ];

      return routers;
    },
    set routers(_routers) {
      _routers = _routers.map((e) => {
        runAccess(this, e.src);

        return { src: e.src };
      });

      this._settedRouters = 1;

      this.html = "";

      const historyRouters = _routers.slice();

      const currentRouter = historyRouters.pop();

      this[HISTORY].length = 0;
      this[HISTORY].push(...historyRouters);

      this.push({
        tag: "o-page",
        src: currentRouter.src,
      });
    },
  },
});

// Ensure that the page is available, handle cross-domain pages and other operations
const runAccess = (app, src) => {
  const access = app?._module?.access;

  const srcObj = new URL(src);

  if (srcObj.origin !== location.origin && !access) {
    const err = getErr("no_cross_access_func");
    console.warn(err, app.ele, app?._module);
    throw err;
  }

  if (access) {
    const result = access(src);

    if (result !== true) {
      const err = getErr(
        "access_return_error",
        { src },
        result instanceof Error ? result : undefined
      );
      console.warn(err, app);
      throw err;
    }
  }
};

const pageInAnime = async ({ page, key }) => {
  if (!page._rendered) {
    // firefox bug
    await waitPageReaded(page);
  }

  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.css = {
      ...page.css,
      ...targetAnime,
    };

    nextAnimeFrame(() => {
      page.css = {
        ...page.css,
        transition: "all ease .3s",
        ...(pageAnime.current || {}),
      };
    });
  }
};

const pageOutAnime = ({ page, key }) =>
  new Promise((resolve) => {
    const targetAnime = page.pageAnime[key];

    if (targetAnime) {
      nextAnimeFrame(() => {
        let resolved = false;
        const finish = () => {
          if (resolved) {
            return;
          }
          resolved = true;
          clearTimeout(timer);
          resolve();
        };

        const timer = setTimeout(finish, 350);

        page.one("transitionend", finish);

        // Ensure the current style is computed before changing it,
        // so the transition starts reliably on Firefox.
        void page.ele.offsetHeight;

        page.css = {
          ...page.css,
          transition: "all ease .3s",
          ...targetAnime,
        };
      });
    } else {
      resolve();
    }
  });

const nextAnimeFrame = (func) =>
  requestAnimationFrame(() => {
    setTimeout(func, 5);
  });

const resetOldPage = (needRemovePage) => {
  // Measure while the page is still in flow, before applying position:absolute
  const { offsetWidth, offsetHeight } = needRemovePage.ele;
  needRemovePage.css = {
    position: "absolute",
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`,
  };
  needRemovePage.data.willRemoved = 1;

  return needRemovePage;
};

/**
 * $.fn 扩展：app 定位、PATH 组件/页面地址、attr 相对资源解析。
 */

const oldAttr = $.fn.attr;

function attr(...args) {
  let [name, value, options] = args;

  if (isFunction(value)) {
    value = value();
  }

  const { host } = this;

  // 组件/页面内的相对 href/src 基于 PATH 解析为绝对地址
  if (host && ["href", "src"].includes(name) && /^\./.test(value)) {
    const { PATH } = host;

    if (PATH) {
      const { href } = new URL(value, PATH);

      return oldAttr.call(this, name, href);
    }
  }

  return oldAttr.call(this, ...args);
}

attr.always = oldAttr.always;

$.fn.extend({
  get app() {
    // 沿事件路径向上查找 o-app 元素
    const composed = this.composedPath();

    const app = composed.find((el) => el.tagName === "O-APP");

    if (app) {
      return $(app);
    }
  },
  get PATH() {
    // 组件或页面文件地址
    return this[COMPONENT_PATH] || this.src || null;
  },
  attr,
});

/**
 * 上下文通信：o-provider / o-consumer / o-root-provider。
 *
 * provider 把自身数据按 name 广播给下级 consumer（跨 shadow 边界，
 * 基于 composedPath 查找）；o-root-provider 提供应用级单例 provider；
 * provider.dispatch 可向 consumer 派发自定义事件。
 */

const InvalidKeys = [
  "tag",
  "name",
  "class",
  "style",
  "id",
  "x-bind-data",
  "is-root",
];

const consumers = {}; // 存储所有的consumer元素

// 根provider
const rootProviders = {};

const temp = `<style>:host{display:contents}</style><slot></slot>`;

Object.defineProperty($, "getRootProvider", {
  value(name) {
    return rootProviders[name];
  },
});

const publicWatch = {
  name(name) {
    const oldName = this.__oldName;
    this.__oldName = name;

    // 是否已经设置过
    if (!this.__named) {
      this.__named = 1;
      return;
    }

    if (oldName !== name) {
      if (this.tag === "o-consumer") {
        // consumer 导致的更新
        if (consumers[oldName]) {
          consumers[oldName].delete(this);
        }
        if (!consumers[name]) {
          consumers[name] = new Set();
        }
        consumers[name].add(this);
        this._refresh();
      } else {
        // provider 导致的更新
        if (oldName && consumers[oldName]) {
          consumers[oldName].forEach((item) => item._refresh());
        }
        if (name && consumers[name]) {
          consumers[name].forEach((item) => item._refresh());
        }
      }
    }
  },
};

const updateProvider = (provider) => {
  if (!provider.name) {
    return;
  }

  // 更新底层的所有consumer
  const pool = consumers[provider.name];
  if (pool) {
    // 通知对应name所有的consumer更新数据
    pool.forEach((item) => item._refresh());
  }
};

// 初始化 provider
const initProvider = async (provider) => {
  const needRemoves = [];

  const ele = provider.ele;

  // 将 attributes 上的属性设置到 provider 上
  for (const key of ele.attributes) {
    if (InvalidKeys.includes(key.name)) {
      continue;
    }

    provider[hyphenToUpperCase(key.name)] = key.value;
    needRemoves.push(key.name);
  }

  needRemoves.forEach((key) => ele.removeAttribute(key));

  // 监听数据变化升级consumer
  provider._init_tid = provider.watchTick(() => updateProvider(provider));

  updateProvider(provider); // 尝试初次更新 consumer
};

const providerProto = {
  dispatch(eventName, options) {
    const pool = consumers[this.name];

    // 筛选可用的元素
    if (pool) {
      const event = new Event(eventName, { bubbles: false, cancelable: true });
      event.data = options?.data;

      for (let $ele of pool) {
        if (event.defaultPrevented) {
          break;
        }
        // 确认是当前provider的consumer
        if ($ele.providers.includes(this)) {
          event.provider = this.ele;

          $ele.ele.dispatchEvent(event);
        }
      }
    }
  },
};

$.register({
  tag: "o-root-provider",
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...providerProto,
  },
  attached() {
    initProvider(this);
    rootProviders[this.name] = this;
  },
  detached() {
    this.unwatch(this._init_tid);
    delete rootProviders[this.name];
    updateProvider(this);
  },
});

// 获取对应 name 的上一级 provider 元素
$.fn.getProvider = function (name) {
  const ancestors = this.composedPath();

  // 获取最近的 provider 元素
  let provider = ancestors.find((element) => {
    return (
      element !== this.ele &&
      element.tagName &&
      element.tagName.toLowerCase() === "o-provider" &&
      element.getAttribute("name") === name
    );
  });

  if (!provider && this !== rootProviders[name]) {
    provider = rootProviders[name];
  }

  if (!provider) {
    return null;
  }

  return $(provider);
};
/**
 * 向消费者元素池中添加元素
 * @param {$ele} $ele - 要添加的元素
 */
const addConsumer = ($ele) => {
  if (!consumers[$ele.name]) {
    consumers[$ele.name] = new Set();
  }
  consumers[$ele.name].add($ele);
};

/**
 * 从消费者元素池中移除元素
 * @param {$ele} $ele - 要移除的元素
 */
const removeConsumer = ($ele) => {
  const pool = consumers[$ele.name];
  if (pool) {
    pool.delete($ele);
  }
};

$.register({
  tag: "o-provider",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...providerProto,
  },
  attached() {
    initProvider(this);
  },
  detached() {
    this.unwatch(this._init_tid);
    updateProvider(this);
  },
});

$.register({
  tag: "o-consumer",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    get provider() {
      return this.getProvider(this.name);
    },

    get providers() {
      const providers = [];

      let provider = this.provider;
      while (provider) {
        providers.push(provider);
        provider = provider.getProvider(this.name);
      }

      return providers;
    },

    // 更新自身的数据
    _refresh() {
      if (!this.getProvider(this.name)) {
        // 应该清空自身的数据
        for (let name of Object.keys(this)) {
          if (InvalidKeys.includes(name) || !/\D/.test(name)) {
            // 跳过默认key和数字
            continue;
          }
          this[name] = undefined;
        }
        return;
      }

      const finnalData = {};

      for (let provider of this.providers) {
        for (let name of Object.keys(provider)) {
          if (InvalidKeys.includes(name) || !/\D/.test(name)) {
            // 跳过默认key和数字
            continue;
          }

          if (!finnalData[name]) {
            finnalData[name] = provider[name];
          }
        }
      }

      // 更新自身的数据
      for (let name of Object.keys(finnalData)) {
        const value = finnalData[name];

        if (this[name] !== value) {
          this[name] = value;
        }
      }

      // 删除 consumer 上 provider没有的数据
      for (let name of Object.keys(this)) {
        if (InvalidKeys.includes(name) || !/\D/.test(name)) {
          // 跳过默认key和数字
          continue;
        }

        if (finnalData[name] === undefined) {
          this[name] = undefined;
        }
      }
    },
  },
  attached() {
    // 记录自身的 attributes
    const existKeys = Object.values(this.ele.attributes)
      .map((e) => e.name)
      .filter((e) => !InvalidKeys.includes(e));

    // 更新 attributes
    this.watch((e) => {
      if (e.target === this && e.type === "set") {
        const attrName = toDashCase(e.name);

        if (existKeys.includes(attrName)) {
          if (e.value === null || e.value === undefined) {
            this.ele.removeAttribute(attrName);
          } else {
            this.ele.setAttribute(attrName, e.value);
          }
        }
      }
    });

    addConsumer(this);
    this._refresh();
  },
  detached() {
    removeConsumer(this);
  },
});

/**
 * match-var：CSS 属性选择器驱动的样式切换组件。
 * 优先使用 @container style 查询，不兼容的环境降级为轮询匹配。
 */

// 是否支持  @container style 查询
const supportStyleQueries = supportsContainerStyleQueries();
// const supportStyleQueries = false; // debug code

$.register({
  tag: "match-var",
  temp: `<style>:host{display:none !important; }</style>`,
  data: {},
  proto: {
    initContainerStyle() {
      // 支持 container style query 的时候，可以直接使用
      if (!this.__style) {
        this.__style = $("<style></style>");
        this.before(this.__style);
      }

      const styleContent = this._styleOriginText;

      // 获取属性值
      const attrs = Array.from(this.ele.attributes);

      this.__style.html = `@container ${attrs
        .map((attr) => `style(--${attr.name}: ${attr.value})`)
        .join(" and ")} {${styleContent}}`;

      // 清空内容
      this.html = "";
    },
    __addStyle() {
      if (this.__added || supportStyleQueries) {
        return;
      }

      // 在不兼容 container style query 的时候，运行这个方法代表塞入原样式
      this.html = `<style>
      ${this._styleOriginText}
      </style>`;

      this.__added = true;
    },
    __removeStyle() {
      if (!this.__added || supportStyleQueries) {
        return;
      }

      this.html = "";

      this.__added = false;
    },
  },
  async attached() {
    // 获取style内容后，清除内容
    if (!this._styleOriginText) {
      const styleEl = this.$("style");
      if (styleEl) {
        this._styleOriginText = styleEl.text;
      }
      const linkEl = this.$("link");
      if (linkEl) {
        const href = linkEl.attr("href");
        this.html = ""; // 必须提前清空，不然会提前载入样式
        const content = await fetch(href).then((res) => res.text());
        this._styleOriginText = content;
      }
      this.html = "";
    }

    const isConnected = this.ele.isConnected;

    if (!isConnected) {
      return;
    }

    if (supportStyleQueries) {
      this.initContainerStyle();
    } else {
      matchEles.add(this);
    }
  },
  detached() {
    if (supportStyleQueries) {
      if (this.__style) {
        this.__style.remove();
        this.__style = null;
      }
    } else {
      matchEles.delete(this);
    }
  },
});

const matchEles = new Set();
{
  let timer = null;
  const checkMatchEles = async () => {
    clearTimeout(timer);
    for (const $e of matchEles) {
      const result = Array.from($e.ele.attributes).every((e) => {
        const value = getComputedStyle($e.ele).getPropertyValue(`--${e.name}`);

        return value === e.value;
      });

      if ($.checkMatch.delay) {
        // 添加延迟，防止频繁执行无法渲染
        await new Promise((resolve) => setTimeout(resolve, $.checkMatch.delay));
      }

      if (result) {
        $e.__addStyle();
      } else {
        $e.__removeStyle();
      }
    }

    timer = setTimeout(checkMatchEles, $.checkMatch.time || 100);
  };

  if (!supportStyleQueries) {
    // 每秒轮询检测一次
    setTimeout(() => {
      checkMatchEles();
    }, 100);
  }

  Object.defineProperties($, {
    // 添加主动刷新 match var 方法
    checkMatch: {
      value() {
        if (supportStyleQueries) {
          // 如果支持，不需要执行此方法
          return false;
        }

        requestAnimationFrame(() => {
          checkMatchEles();
        });

        return true;
      },
    },
  });

  if (!supportStyleQueries) {
    // 延迟时间，单位毫秒
    $.checkMatch.delay = 2;
  }
}

/**
 * 检测浏览器是否原生支持 @container style 查询
 * @returns {boolean} 返回是否支持
 */
function supportsContainerStyleQueries() {
  try {
    // 创建测试用的DOM元素
    const container = document.createElement("div");
    const child = document.createElement("div");

    // 设置容器和子元素的样式
    container.style.cssText = `
          container-type: style;
          position: absolute;
          left: -9px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          --test-prop: true;
        `;

    child.style.cssText = `
          position: absolute;
        `;

    // 添加测试样式
    const style = document.createElement("style");
    style.textContent = `
          @container style(--test-prop: true) {
            #match-var-test-child {
              font-family: "match-var-test";
            }
          }
        `;

    // 组装DOM结构
    container.id = "match-var-test-container";
    child.id = "match-var-test-child";
    container.appendChild(child);
    document.documentElement.appendChild(style);
    document.documentElement.appendChild(container);

    // 检测是否应用了样式
    const isSupported = window
      .getComputedStyle(child)
      .fontFamily.includes("match-var-test");

    // 清理测试元素
    document.documentElement.removeChild(style);
    document.documentElement.removeChild(container);

    return isSupported;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * ofa.js 入口：在 xhear 之上补齐应用层能力。
 *
 * - 组件/页面模块系统（组件即 HTML 文件，浏览器直接运行，无构建）
 * - o-page / o-app 页面路由（嵌套路由、前进后退、页面动画）
 * - o-if / o-fill 模板语法（实现已下沉 xhear）
 * - o-provider / o-consumer 上下文通信
 * - o-link 路由链接、inject-host 样式收编、match-var 属性样式
 */

const version = "ofa.js@5.0.0";
$.version = version.replace("ofa.js@", "");

// URL 带 #debug 时开启调试模式（转译模块生成 sourcemap）
let isDebug = false;

try {
  const fileUrl = import.meta.url;
  isDebug = fileUrl.includes("#debug");
} catch (err) {
  isDebug = false;
}

Object.defineProperty($, "debugMode", {
  get: () => isDebug,
});

// 页面脚本与全局访问的约定入口
if (typeof window !== "undefined") {
  window.$ = $;
}

Object.defineProperty(globalThis, "ofa", {
  value: $,
});

export { Stanz, $ as default };
