/**
 * 点路径取值 / 赋值："a.b.c" 形式的键寻址。
 *
 * 旧版由 stanz 原生的 get/set 方法承担；stanz 9 重构时把它从公共 API
 * 中裁剪（数据层保持最小面），路径寻址是应用层便利，归属 xhear。
 * 模板语法的 sync:prop="a.b.c"、watch:prop="a.b.c" 及组件 API
 * $ele.get / $ele.set 都依赖这里。
 */
import { getErr } from "./error.mjs";

/** 沿点路径逐层取值；途中访问失败时抛出带定位信息的错误 */
export const getPath = (target, key) => {
  if (!/\./.test(key)) {
    return target[key];
  }

  const keys = key.split(".");
  let current = target;

  for (let i = 0, len = keys.length; i < len; i++) {
    try {
      current = current[keys[i]];
    } catch (error) {
      const err = getErr(
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
export const setPath = (target, key, value) => {
  if (!/\./.test(key)) {
    return (target[key] = value);
  }

  const keys = key.split(".");
  const lastKey = keys.pop();

  return (getPath(target, keys.join("."))[lastKey] = value);
};
