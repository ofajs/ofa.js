export const getRandomId = () => Math.random().toString(32).slice(2);

const objectToString = Object.prototype.toString;

/** 取数据的内部类型标签（如 "object"、"array"），供 xhear 等高频调用 */
export const getType = (value) => objectToString.call(value).slice(8, -1).toLowerCase();

/**
 * 是否为可包裹的数据（plain object 或数组）。
 * 直接比对 toString 标签，语义与旧版正则清洗一致但开销小得多。
 */
export const isObject = (obj) => {
  const tag = objectToString.call(obj);
  return tag === "[object Object]" || tag === "[object Array]";
};

/** 微任务时机的下一帧回调，是 watchTick 批量合并的基础 */
export const nextTick = (callback) => {
  Promise.resolve().then(callback);
};

/**
 * 防抖：wait > 0 用定时器合并；否则按微任务时钟合并，
 * 触发时以参数数组的形式一次性回调。
 */
export function debounce(func, wait = 0) {
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
export const extend = (_this, proto, descriptor = {}) => {
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
export function dataRevoked(proxyToCheck) {
  try {
    Object.getPrototypeOf(proxyToCheck);
    return false;
  } catch (error) {
    return error instanceof TypeError;
  }
}
