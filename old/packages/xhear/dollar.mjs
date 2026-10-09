import { eleX, createXEle } from "./util.mjs";
import { getType } from "../stanz/public.mjs";

export default function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

Object.defineProperties($, {
  // Convenient objects for use as extensions
  extensions: {
    value: {},
  },
});
