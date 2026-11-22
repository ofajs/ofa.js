import { isObject } from "./public.mjs";
import Stanz, { PROXY, isxdata } from "./main.mjs";
import { emitUpdate } from "./watch.mjs";

const { defineProperties } = Object;

/**
 * 赋值核心：处理 stanz 值的 owner 登记、普通对象的自动包裹、
 * 旧值的 owner 清理，以及变更事件的派发。
 */
export const setData = ({ target, key, value, receiver, type, succeed }) => {
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
export const clearOwner = (targetData, owner) => {
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

export const handler = {
  set(target, key, value, receiver) {
    // symbol 键不参与数据观察
    if (typeof key === "symbol") {
      return Reflect.set(target, key, value, receiver);
    }

    // _ 前缀属性为系统自用：直接落到 target，不触发观察逻辑
    if (key.charCodeAt(0) === 95 /* "_" */) {
      if (!target.hasOwnProperty(key)) {
        defineProperties(target, {
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
