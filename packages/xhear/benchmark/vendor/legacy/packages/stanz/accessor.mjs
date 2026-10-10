import { isObject } from "./public.mjs";
import Stanz, { PROXY, isxdata } from "./main.mjs";
import { emitUpdate } from "./watch.mjs";
import { getErr } from "../ofa-error/main.js";

const { defineProperties } = Object;

export const setData = ({ target, key, value, receiver, type, succeed }) => {
  const oldValue = receiver[key];

  let data = value;
  if (isxdata(data)) {
    if (oldValue === value) {
      return true;
    }
    data._owner.push(receiver);
  } else if (isObject(value)) {
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (!desc || desc.hasOwnProperty("value")) {
      data = new (target.__OriginStanz || Stanz)(value, {
        owner: receiver,
      });

      data._owner.push(receiver);
    }
  }

  const isSame = oldValue === value;

  if (!isSame && isxdata(oldValue)) {
    clearOwner(oldValue, receiver);
  }

  const reval = succeed(data);

  !isSame &&
    // __unupdate: Let the system not trigger an upgrade, system self-use attribute
    !target.__unupdate &&
    emitUpdate({
      type: type || "set",
      target: receiver,
      currentTarget: receiver,
      name: key,
      value,
      oldValue,
    });

  return reval;
};

// 当数据被移除时，清除 owner 数据
export const clearOwner = (targetData, owner) => {
  if (isxdata(targetData)) {
    const index = targetData._owner.indexOf(owner);
    if (index > -1) {
      targetData._owner.splice(index, 1);
    } else {
      const err = getErr("error_no_owner");
      console.warn(err, {
        owner,
        mismatch: targetData,
      });
      console.error(err);
    }
  }
};

export const handler = {
  set(target, key, value, receiver) {
    if (typeof key === "symbol") {
      return Reflect.set(target, key, value, receiver);
    }

    // Set properties with _ prefix directly
    if (/^_/.test(key)) {
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

    try {
      return setData({
        target,
        key,
        value,
        receiver,
        succeed(data) {
          return Reflect.set(target, key, data, receiver);
        },
      });
    } catch (error) {
      const err = getErr(
        "failed_to_set_data",
        {
          key,
        },
        error
      );

      console.warn(err, { target, value });

      throw err;
    }
  },
  deleteProperty(target, key) {
    if (/^_/.test(key) || typeof key === "symbol") {
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
