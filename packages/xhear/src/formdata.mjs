/**
 * formData 插件（可选，不随 xhear 默认加载）：
 * 容器表单值 ↔ stanz 对象的双向绑定。
 *
 * 用法：
 *   import { formData } from "xhear/src/formdata.mjs";
 *   const data = formData(this.shadow);
 *   // 之后 data 上的值与表单双向同步；不再需要时 data.revoke() 释放
 */
import stanz from "../../stanz/src/base.mjs";

const { assign } = Object;
import { mergeObjects, searchEle } from "./public.mjs";

/** 收集容器内全部表单项的当前值（checkbox 聚合成数组、select 支持多选） */
const getFormData = (target, expr) => {
  const data = {};

  target.all(expr).forEach(($el) => {
    const { name, tag, ele } = $el;

    if (tag === "input") {
      switch ($el.type) {
        case "checkbox":
          if (!(name in data)) {
            data[name] = [];
          }

          if (ele.checked) {
            data[name].push(ele.value);
          }
          break;
        case "radio":
          if (ele.checked) {
            data[name] = ele.value;
          }
          break;
        case "file":
          data[name] = ele.files;
          break;
        default:
          data[name] = ele.value;
      }
    } else if (tag === "textarea") {
      data[name] = ele.value;
    } else if (tag === "select") {
      const selectedsOpt = searchEle(ele, `option:checked`);

      if (ele.multiple) {
        data[name] = selectedsOpt.map((e) => e.value || e.textContent);
      } else {
        const [e] = selectedsOpt;
        data[name] = e.value || e.textContent;
      }
    } else {
      // 自定义组件：约定暴露 value 即可参与收集
      data[name] = $el.value;
    }
  });

  return data;
};

/** 把 data 的值回填到表单项（radio/checkbox 按 value 匹配勾选） */
function resetValue(el, expr, data) {
  const eles = el.all(expr);

  Object.keys(data).forEach((name) => {
    const targets = eles.filter((e) => e.attr("name") === name);

    if (targets.length === 0) {
      return;
    }

    const val = data[name];
    const target = targets[0];
    const type = target.attr("type");
    if (targets.length === 1) {
      let isUseValue = true;

      if (target.tag === "input" && (type === "radio" || type === "checkbox")) {
        isUseValue = false;
      }

      if (isUseValue) {
        if (target.value !== val) {
          target.value = val;
        }
        return;
      }
    }

    // checkbox 或 radio：同名多项按 value 匹配
    targets.forEach((e) => {
      switch (e.attr("type")) {
        case "radio":
          if (e.value === val) {
            e.checked = true;
          } else {
            e.checked = false;
          }
          break;
        case "checkbox":
          e.checked = val.includes(e.value);
          break;
      }
    });
  });
}

/**
 * 双向表单数据绑定。
 *
 * @param {Object} el 容器元素实例（组件或 shadow 根的 Xhear 实例）
 * @param {string} [expr] 表单项选择器，默认 "input,select,textarea"
 * @param {{wait?: number}} [opts] 收集防抖间隔，默认 200ms
 * @returns {Object} 与表单双向同步的 stanz 对象，revoke 时解除两侧监听
 */
export const formData = (el, expr, opts = {}) => {
  const data = stanz({});

  const selector = expr || "input,select,textarea";

  assign(data, getFormData(el, selector));

  const wid1 = el.watchTick((e) => {
    const newData = getFormData(el, selector);
    mergeObjects(data, newData);
  }, opts.wait || 200);

  const wid2 = data.watchTick((e) => {
    resetValue(el, selector, data);
  });

  const oldRevoke = data.revoke;
  data.extend({
    revoke() {
      el.unwatch(wid1);
      data.unwatch(wid2);
      oldRevoke.call(this);
    },
  });

  return data;
};
