import { extend, getRandomId } from "./public.mjs";
import { handler as stanzHandler } from "./accessor.mjs";
import arrayFn from "./array.mjs";
import watchFn from "./watch.mjs";
import { getErr } from "../ofa-error/main.js";
const { defineProperties, getOwnPropertyDescriptor, entries } = Object;

export const SELF = Symbol("self");
export const PROXY = Symbol("proxy");
export const WATCHS = Symbol("watchs");
export const ISXDATA = Symbol("isxdata");

export const isxdata = (val) => val && !!val[ISXDATA];

export function constructor(data, handler = stanzHandler) {
  // const proxySelf = new Proxy(this, handler);
  let { proxy: proxySelf, revoke } = Proxy.revocable(this, handler);

  // Determines the properties of the listener bubble
  proxySelf._update = 1;

  let watchs;

  defineProperties(this, {
    xid: { value: data.xid || getRandomId() },
    // Save all parent objects
    _owner: {
      value: [],
    },
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
      get: () => this,
    },
    [PROXY]: {
      configurable: true,
      get: () => proxySelf,
    },
    // Save the object of the listener function
    [WATCHS]: {
      get: () => watchs || (watchs = new Map()),
    },
    _hasWatchs: {
      get: () => !!watchs,
    },
    _revoke: {
      value: revoke,
    },
    __init_is_array: {
      value: Array.isArray(data),
    },
  });

  Object.keys(data).forEach((key) => {
    const descObj = getOwnPropertyDescriptor(data, key);
    let { value, get, set } = descObj;

    if (get || set) {
      defineProperties(this, {
        [key]: descObj,
      });
    } else {
      // Set the function directly
      proxySelf[key] = value;
    }
  });

  return proxySelf;
}

export default class Stanz extends Array {
  constructor(data, options) {
    // options是被继承的类库使用的参数，当前stanz不需要使用
    super();

    return constructor.call(this, data);
  }

  // This method is still in the experimental period
  revoke() {
    const self = this[SELF];

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
        // 初始化不是数组，就是对象
        obj = {};
      }
    }
    const xid = this.xid;
    defineProperties(obj, {
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

  get(key) {
    if (/\./.test(key)) {
      const keys = key.split(".");
      let target = this;
      for (let i = 0, len = keys.length; i < len; i++) {
        try {
          target = target[keys[i]];
        } catch (error) {
          const err = getErr(
            "failed_to_get_data",
            {
              key: keys.slice(0, i).join("."),
            },
            error
          );

          console.warn(err, {
            key,
            self: this,
          });

          throw err;
        }
      }

      return target;
    }

    return this[key];
  }
  set(key, value) {
    if (/\./.test(key)) {
      const keys = key.split(".");
      const lastKey = keys.pop();
      let target = this;
      for (let i = 0, len = keys.length; i < len; i++) {
        try {
          target = target[keys[i]];
        } catch (error) {
          const err = getErr(
            "failed_to_get_data",
            {
              key: keys.slice(0, i).join("."),
            },
            error
          );

          console.warn(err, {
            key,
            self: this,
          });

          throw err;
        }
      }

      return (target[lastKey] = value);
    }

    return (this[key] = value);
  }
}

Stanz.prototype.extend(
  { ...watchFn, ...arrayFn },
  {
    enumerable: false,
  }
);
