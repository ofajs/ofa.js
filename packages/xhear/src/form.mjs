/**
 * 表单元素支持（核心部分）：initFormEle 把 input/textarea/select 等
 * 原生表单属性接入数据观察（如 $input.value = x 会触发更新事件，
 * watchers 与模板能感知）。
 *
 * 容器级双向绑定 formData 使用频率低，拆分到独立的可选插件模块
 * formdata.mjs（不随默认构建加载，按需引入）。
 */
import { emitUpdate } from "../../stanz/src/watch.mjs";

const { defineProperty } = Object;

const hasValueEleNames = ["input", "textarea", "select"];

/** 把原生属性映射为带观察的实例属性；纯数字字符串自动转 number */
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

/** 用户输入 → 数据：在对应事件里派发一次 set 更新事件 */
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
        // 初始化时同步一次原生值，__unupdate 抑制这次回填产生的事件
        $ele.__unupdate = 1;
        $ele.value = ele.value;
        delete $ele.__unupdate;

        // 数据 → 原生选中项；用户操作 → 数据
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

