import { eleX } from "./util.mjs";
import { handler as stanzHandler } from "../stanz/accessor.mjs";

// const tempEl = document.createElement("template");

export const handler = {
  set(target, key, value, receiver) {
    if (!/\D/.test(String(key))) {
      return Reflect.set(target, key, value, receiver);
    }

    if (target[key] === value) {
      // Optimise performance;
      // fix focus remapping caused by 'text' being reset
      return true;
    }

    if (key === "html") {
      // When setting HTML values that contain single quotes, they become double quotes when set, leading to an infinite loop of updates.
      // tempEl.innerHTML = value;
      // value = tempEl.innerHTML;

      // If custom elements are stuffed, the html values may remain inconsistent
      return Reflect.set(target, key, value, receiver);
    }

    return stanzHandler.set(target, key, value, receiver);
  },
  get(target, key, receiver) {
    if (!/\D/.test(String(key))) {
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
    if (typeof key === "string" && !/\D/.test(key)) {
      return {
        enumerable: true,
        configurable: true,
      };
    }
    return Reflect.getOwnPropertyDescriptor(target, key);
  },
};
