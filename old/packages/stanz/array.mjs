import { clearOwner } from "./accessor.mjs";
import { SELF, PROXY, isxdata } from "./main.mjs";
import { isObject } from "./public.mjs";
import { emitUpdate } from "./watch.mjs";

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

const holder = Symbol("placeholder");

function compareArrays(oldArray, newArray) {
  const backupNewArray = Array.from(newArray);
  const backupOldArray = Array.from(oldArray);
  const deletedItems = [];
  const addedItems = new Map();

  const oldLen = oldArray.length;
  for (let i = 0; i < oldLen; i++) {
    const oldItem = oldArray[i];
    const newIndex = backupNewArray.indexOf(oldItem);
    if (newIndex > -1) {
      backupNewArray[newIndex] = holder;
    } else {
      deletedItems.push(oldItem);
    }
  }

  const newLen = newArray.length;
  for (let i = 0; i < newLen; i++) {
    const newItem = newArray[i];
    const oldIndex = backupOldArray.indexOf(newItem);
    if (oldIndex > -1) {
      backupOldArray[oldIndex] = holder;
    } else {
      addedItems.set(i, newItem);
    }
  }

  return { deletedItems, addedItems };
}

const fn = {};

const arrayFn = Array.prototype;

mutatingMethods.forEach((methodName) => {
  if (arrayFn[methodName]) {
    fn[methodName] = function (...args) {
      const backupArr = Array.from(this);

      const reval = arrayFn[methodName].apply(this[SELF], args);

      const { deletedItems, addedItems } = compareArrays(backupArr, this);

      // Refactoring objects as proxy instances
      for (let [key, value] of addedItems) {
        if (isxdata(value)) {
          value._owner.push(this);
        } else if (isObject(value)) {
          this.__unupdate = 1;
          this[key] = value;
          delete this.__unupdate;
        }
      }

      for (let item of deletedItems) {
        clearOwner(item, this);
      }

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: methodName,
        oldValue: backupArr,
      });

      if (reval === this[SELF]) {
        return this[PROXY];
      }

      return reval;
    };
  }
});

// Object.getOwnPropertyNames(Array.prototype).forEach((methodName) => {
["concat", "filter", "slice", "flatMap", "map"].forEach((methodName) => {
  if (methodName === "constructor" || mutatingMethods.includes(methodName)) {
    return;
  }

  const oldFunc = Array.prototype[methodName];
  if (oldFunc instanceof Function) {
    fn[methodName] = function (...args) {
      return oldFunc.call(Array.from(this), ...args);
    };
  }
});

export default fn;
