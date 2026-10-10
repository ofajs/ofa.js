import $ from "../xhear/base.mjs";
import { getRenderData } from "../xhear/render/condition.mjs";
import { render } from "../xhear/render/render.mjs";
import { revokeAll } from "../xhear/util.mjs";

const refreshCondition = (conditionEl) => {
  const conditionEls = [conditionEl];

  // 获取所有兄弟元素
  if (conditionEl.tag == "o-if") {
    let nexts = getNexts(conditionEl.next);
    conditionEls.push(...nexts);
  } else if (conditionEl.tag == "o-else-if") {
    let nexts = getNexts(conditionEl.next);
    conditionEls.push(...nexts);
    let prevs = getPrevs(conditionEl.prev);
    conditionEls.unshift(...prevs);
  }

  // 在第一个元素上做缓刷新
  const firstEl = conditionEls[0];
  if (firstEl.tag == "o-if") {
    clearTimeout(firstEl.__refreshTimer);
    firstEl.__refreshTimer = setTimeout(() => {
      // 按顺序获取条件元素的value值，找到第一个为true的元素
      let targetCondition = null;
      for (let i = 0; i < conditionEls.length; i++) {
        const el = conditionEls[i];
        if (el.tag == "o-if" || el.tag == "o-else-if") {
          if (el.value) {
            targetCondition = el;
            break;
          }
        } else {
          // 最后一个 o-else 元素
          targetCondition = el;
        }
      }

      // 如果找到目标，就渲染目标元素
      if (targetCondition) {
        renderContent(targetCondition);
        targetCondition.attr("actived", "");
      }

      // 清空其他元素内容
      conditionEls.forEach((el) => {
        if (el !== targetCondition) {
          el.attr("actived", null);
          clearContent(el);
        }
      });
    }, 0);
  } else {
    // 报错
    console.error("o-if must be the first element", conditionEls);
  }
};

// 渲染内容
const renderContent = (conditionEl) => {
  if (conditionEl.__rendered) {
    // 已经渲染过，直接返回
    return;
  }

  const result = getRenderData(conditionEl.ele);

  if (!result) {
    return;
  }

  const { target, data, temps } = result;

  conditionEl.html = conditionEl.__originHTML;

  render({ target, data, temps });

  conditionEl.__rendered = true;

  // 触发渲染事件
  conditionEl.emit("rendered", {
    bubbles: false,
  });
};

// 清空内容
const clearContent = (conditionEl) => {
  if (!conditionEl.__rendered) {
    // 没有渲染过，直接返回
    return;
  }

  conditionEl.ele.childNodes?.forEach((el) => revokeAll(el));

  // 清空元素内容
  conditionEl.html = "";

  conditionEl.__rendered = false;
};

// 获取后方兄弟元素
const getNexts = (next) => {
  const nexts = [];
  while (next && (next.tag === "o-else-if" || next.tag === "o-else")) {
    nexts.push(next);
    if (next.tag == "o-else") {
      break;
    }
    next = next.next;
  }
  return nexts;
};

// 获取前方兄弟元素
const getPrevs = (prev) => {
  const prevs = [];
  while (prev && (prev.tag == "o-if" || prev.tag == "o-else-if")) {
    prevs.unshift(prev);
    if (prev.tag == "o-if") {
      break;
    }
    prev = prev.prev;
  }
  return prevs;
};

const createdFunc = function (_this) {
  // 元素可能先于子内容构造（如 createElement 或第三方库 cloneNode），
  // 此时首个子元素不存在，需要回退到自身内容
  const firstEle = _this[0];
  if (firstEle && firstEle.is("template[inner-code]")) {
    _this.__originHTML = firstEle.html.trim();
  } else {
    _this.__originHTML = _this.html.trim();
  }
  _this.html = "";
};

const temp = `<style>:host{display:contents;}</style><slot></slot>`;

$.register({
  tag: "o-if",
  temp,
  data: {
    value: null,
  },
  watch: {
    value() {
      refreshCondition(this);
    },
  },
  created() {
    createdFunc(this);
  },
});

$.register({
  tag: "o-else-if",
  temp,
  data: {
    value: null,
  },
  watch: {
    value() {
      refreshCondition(this);
    },
  },
  created() {
    createdFunc(this);
  },
});

$.register({
  tag: "o-else",
  temp,
  created() {
    createdFunc(this);
  },
});
