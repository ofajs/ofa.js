import stanz from "../stanz/base.mjs";
import { emitUpdate } from "../stanz/watch.mjs";
import { mergeObjects, searchEle } from "./public.mjs";

const { defineProperty, assign } = Object;

const hasValueEleNames = ["input", "textarea", "select"];

const setKeys = (keys, $ele) => {
  const { ele } = $ele;

  keys.forEach((k) => {
    if (k in ele) {
      let isNum = false;
      defineProperty($ele, k, {
        enumerable: true,
        get: () => {
          let val = ele[k];
          if (isNum) {
            if (/\D/.test(val)) {
              isNum = false;
            } else {
              val = Number(val);
            }
          }
          return val;
        },
        set: (val) => {
          isNum = typeof val === "number";
          ele[k] = val;
        },
      });
    }
  });
};

const formEleNames = new Set([
  ...hasValueEleNames,
  "option",
  "button",
  "label",
  "fieldset",
  "legend",
  "form",
]);

const bindProp = ($ele, opts = {}) => {
  const { name: keyName, type } = opts;

  const { ele } = $ele;
  let old = ele[keyName];

  $ele.on(type, () => {
    emitUpdate({
      type: "set",
      target: $ele,
      currentTarget: $ele,
      name: keyName,
      value: ele[keyName],
      oldValue: old,
    });

    old = ele[keyName];
  });
};

export const initFormEle = ($ele) => {
  const { tag } = $ele;

  if (!formEleNames.has(tag)) {
    return;
  }

  setKeys(["type", "name", "disabled"], $ele);

  switch (tag) {
    case "input":
      initInput($ele);
      break;
    case "textarea":
      setKeys(["value"], $ele);
      bindProp($ele, { name: "value", type: "input" });
      break;
    case "option":
      setKeys(["selected", "value"], $ele);
      break;
    case "select":
      {
        const { ele } = $ele;
        $ele.__unupdate = 1;
        $ele.value = ele.value;
        delete $ele.__unupdate;

        $ele.watch(() => {
          ele.value = $ele.value;
        });
        $ele.on("change", () => {
          $ele.value = ele.value;
        });
      }
      break;
  }
};

const initInput = ($ele) => {
  const type = $ele.attr("type");

  switch (type) {
    case "file":
      setKeys(["multiple", "files"], $ele);
      bindProp($ele, { name: "files", type: "change" });
      break;
    case "checkbox":
      setKeys(["checked", "multiple", "value"], $ele);
      bindProp($ele, { name: "checked", type: "change" });
      break;
    case "radio":
      setKeys(["checked", "value"], $ele);
      bindProp($ele, { name: "checked", type: "change" });
      break;
    case "text":
    default:
      setKeys(["placeholder", "value"], $ele);
      bindProp($ele, { name: "value", type: "input" });
      break;
  }
};

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
      // custom element
      data[name] = $el.value;
    }
  });

  return data;
};

export default {
  // This method is still being tested
  formData(expr, opts = { wait: 200 }) {
    const data = stanz({});

    assign(data, getFormData(this, expr || "input,select,textarea"));

    const wid1 = this.watchTick((e) => {
      const newData = getFormData(this, expr || "input,select,textarea");
      mergeObjects(data, newData);
    }, opts.wait);

    const wid2 = data.watchTick((e) => {
      resetValue(this, expr || "input,select,textarea", data);
    });

    const _this = this;

    const oldRevoke = data.revoke;
    data.extend({
      revoke() {
        _this.unwatch(wid1);
        data.unwatch(wid2);
        oldRevoke.call(this);
      },
    });

    return data;
  },
};

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

    // checkbox or radio
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
