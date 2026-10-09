import { extend, getRandomId } from "./public.mjs";
import { handler as stanzHandler } from "./accessor.mjs";
import arrayFn from "./array.mjs";
import watchFn from "./watch.mjs";
const { defineProperties, getOwnPropertyDescriptor, entries } = Object;

export const SELF = Symbol("self");
export const PROXY = Symbol("proxy");
export const WATCHS = Symbol("watchs");
export const ISXDATA = Symbol("isxdata");

/** 判断数据是否为 stanz 实例（经代理或原始 self 均可命中） */
export const isxdata = (val) => val && !!val[ISXDATA];

/**
 * 实例构造核心：在 this 上套一层可撤销代理并初始化内部字段。
 * 独立导出是为了让衍生库（如 xhear 的 XData）能传入自定义 handler 复用
 * 整套构造逻辑，这是本库对外的关键扩展缝。
 */
export function constructor(data, handler = stanzHandler) {
  const { proxy: proxySelf, revoke } = Proxy.revocable(this, handler);

  // 更新事件是否向祖先冒泡；_ 前缀属性可直接写，不走代理观察逻辑
  proxySelf._update = 1;

  let watchs;

  defineProperties(this, {
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
      defineProperties(this, {
        [key]: desc,
      });
    } else {
      // 普通值走代理赋值，嵌套对象会在 set 陷阱中完成包裹
      proxySelf[key] = desc.value;
    }
  });

  return proxySelf;
}

export default class Stanz extends Array {
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
}

Stanz.prototype.extend(
  { ...watchFn, ...arrayFn },
  {
    enumerable: false,
  }
);
