import { getErr, getErrDesc } from "../ofa-error/main.js";

export const getRandomId = () => Math.random().toString(32).slice(2);

const objectToString = Object.prototype.toString;
export const getType = (value) =>
  objectToString
    .call(value)
    .toLowerCase()
    .replace(/(\[object )|(])/g, "");

export const isObject = (obj) => {
  const type = getType(obj);
  return type === "array" || type === "object";
};

// export const isDebug = {
//   value: null,
// };

// try {
//   const fileUrl = import.meta.url;
//   isDebug.value = fileUrl.includes("#debug");
// } catch (err) {
//   isDebug.value = false;
// }

// const TICKERR = "nexttick_thread_limit";

let asyncsCounter = 0;
let afterTimer;
const tickSets = new Set();
export function nextTick(callback) {
  clearTimeout(afterTimer);
  afterTimer = setTimeout(() => {
    asyncsCounter = 0;
  });

  // if (isDebug.value) {
  Promise.resolve().then(() => {
    asyncsCounter++;
    if (asyncsCounter > 100000) {
      const err = getErr("nexttick_thread_limit");
      console.warn(err, "lastCall => ", callback);
      throw err;
    }

    callback();
  });
  return;
  // }

  // const tickId = `t-${getRandomId()}`;
  // tickSets.add(tickId);
  // Promise.resolve().then(() => {
  //   asyncsCounter++;
  //   // console.log("asyncsCounter => ", asyncsCounter);
  //   if (asyncsCounter > 50000) {
  //     tickSets.clear();

  //     const err = getErr(TICKERR);
  //     console.warn(err, "lastCall => ", callback);
  //     throw err;
  //   }
  //   if (tickSets.has(tickId)) {
  //     callback();
  //     tickSets.delete(tickId);
  //   }
  // });
  // return tickId;
}

// export const clearTick = (id) => tickSets.delete(id);

export function debounce(func, wait = 0) {
  let timeout = null;
  let hisArgs = [];

  return function (...args) {
    hisArgs.push(...args);

    if (wait > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.call(this, hisArgs);
        hisArgs = [];
        timeout = null;
      }, wait);
    } else {
      if (timeout === null) {
        timeout = 1;
        nextTick(() => {
          timeout = null;
          const args = hisArgs.slice();
          hisArgs = [];
          func.call(this, args);
        });
      }
    }
  };
}

// Enhanced methods for extending objects
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

// 检测 Proxy 是否被撤销的函数
export function dataRevoked(proxyToCheck) {
  try {
    // 尝试对 Proxy 做一个无害的操作，例如获取原型
    Object.getPrototypeOf(proxyToCheck);
    return false; // 如果没有抛出错误，则 Proxy 没有被撤销
  } catch (error) {
    if (error instanceof TypeError) {
      return true; // 如果抛出了 TypeError，则 Proxy 已经被撤销
    }
    // throw error; // 抛出其他类型的错误
    return false;
  }
}
