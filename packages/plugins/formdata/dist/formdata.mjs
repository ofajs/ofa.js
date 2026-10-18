//! ofa-formdata - v5.0.0 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
/**
 * formData 插件（可选，引用才生效，不进 ofa.js 默认构建）：
 * 容器表单值 ↔ stanz 对象的双向绑定。
 *
 * 桥接形态：挂接页面已加载的 ofa.js 运行时（全局 $，即 window.$ /
 * globalThis.ofa），加载后把 `formData` 注册到 `$.fn`——除 `$` 外不新增
 * 任何全局变量。须在 ofa.js 之后加载（缺失时直接抛错）。
 *
 * 用法：
 *   import ".../plugins/formdata/formdata.mjs"; // 或 dist 形态
 *   const data = this.shadow.formData();        // 容器的 $ 实例直接调用
 *   // 之后 data 上的值与表单双向同步；不再需要时 data.revoke() 释放
 *
 * 自定义表单组件接入：暴露 value 属性 + 设置 name attribute 即可参与收集。
 */
const $ = window.$;

if (!$) {
  throw new Error(
    "[ofa-formdata] ofa.js must be loaded before the formdata plugin (window.$ is missing)",
  );
}

const { assign } = Object;

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
      const selectedOptions = Array.from(ele.querySelectorAll("option:checked"));

      if (ele.multiple) {
        data[name] = selectedOptions.map((e) => e.value || e.textContent);
      } else {
        const [e] = selectedOptions;
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

/** 以 obj2 为准同步 obj1：删掉 obj1 多出的键，再覆盖 obj2 的全部键 */
function mergeObjects(obj1, obj2) {
  for (const key of Object.keys(obj1)) {
    if (!obj2.hasOwnProperty(key)) {
      delete obj1[key];
    }
  }

  for (const [key, value] of Object.entries(obj2)) {
    obj1[key] = value;
  }
}

/**
 * 双向表单数据绑定的实现体。
 *
 * @param {Object} el 容器元素实例（组件或 shadow 根的 Xhear 实例）
 * @param {string} [expr] 表单项选择器，默认 "input,select,textarea"
 * @param {{wait?: number}} [opts] 收集防抖间隔，默认 200ms
 * @returns {Object} 与表单双向同步的 stanz 对象，revoke 时解除两侧监听
 */
function createFormData(el, expr, opts = {}) {
  const data = $.stanz({});

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
}

// 插件的全部效果：把 formData 挂到 $ 原型上（$('容器').formData(...)）
$.fn.extend({
  formData(expr, opts) {
    return createFormData(this, expr, opts);
  },
});
