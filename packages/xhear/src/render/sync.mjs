/**
 * sync 动作：sync:prop="data.path" —— 元素属性与渲染数据间的双向同步。
 *
 * 仅限模板绑定使用（render 传入 options）：本方 prop 变化写回数据，
 * 数据变化写入本方 prop，两侧 watch 互为驱动。撤销时成对解绑。
 */
import { hyphenToUpperCase } from "../public.mjs";
import { getPath, setPath } from "../path.mjs";
import { dataRevoked } from "../../../stanz/src/public.mjs";
import { getErr } from "../error.mjs";

const syncFn = {
  sync(propName, targetName, options) {
    if (!options) {
      throw getErr("xhear_sync_no_options");
    }

    // 模板属性名可能是 dash-case，统一转驼峰
    [propName, targetName] = options.beforeArgs;

    propName = hyphenToUpperCase(propName);
    targetName = hyphenToUpperCase(targetName);

    const { data } = options;

    const val = getPath(data, targetName);

    if (val instanceof Object) {
      // 对象值双向同步会造成引用混乱，禁止
      const err = getErr("xhear_sync_object_value", { targetName });
      console.warn(err, data);
      throw err;
    }

    this[propName] = val;

    // 本方 → 数据
    const wid1 = this.watch((e) => {
      if (e.hasModified(propName)) {
        try {
          const value = getPath(this, propName);
          setPath(data, targetName, value);
        } catch (err) {
          // 数据已被回收时报错属正常回收过程，忽略
        }
      }
    });

    // 数据 → 本方
    const wid2 = data.watch((e) => {
      if (e.hasModified(targetName)) {
        try {
          const value = getPath(data, targetName);
          setPath(this, propName, value);
        } catch (err) {
          // 同上
        }
      }
    });

    return () => {
      this.unwatch(wid1);
      if (!dataRevoked(data)) {
        data.unwatch(wid2);
      }
    };
  },
};

syncFn.sync.revoke = (e) => {
  e.result();
};

export default syncFn;
