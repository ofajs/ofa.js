/**
 * o-if / o-else-if / o-else：条件渲染（light DOM 版，内容直接作为子元素
 * 渲染，配合 :host{display:contents} 与 slot 无额外层级）。
 *
 * 与 x-if 的差异：内容在编译期被 wrapTemp 包进 template[inner-code] 保护
 * （不参与宿主模板的编译），首次渲染时才按需编译并对当前渲染数据绑定，
 * 编译结果全局缓存——同一份内容跨实例只编译一次。
 */
import $ from "../../xhear/src/base.mjs";
import { getRenderData } from "../../xhear/src/render/condition.mjs";
import { render } from "../../xhear/src/render/render.mjs";
import { compileTemplate } from "../../xhear/src/render/compile.mjs";
import { revokeAll } from "../../xhear/src/util.mjs";

// 条件内容编译缓存：innerHTML 原文 → 编译模板
const compiledContents = new Map();

/** 按内容原文取编译模板（跨实例共享，编译一次） */
const getCompiledContent = (html) => {
  let compiled = compiledContents.get(html);

  if (!compiled) {
    compiled = document.createElement("template");
    compiled.innerHTML = html;
    compileTemplate(compiled);
    compiledContents.set(html, compiled);
  }

  return compiled;
};

const refreshCondition = (conditionEl) => {
  const conditionEls = [conditionEl];

  // 收集同链的兄弟条件元素
  if (conditionEl.tag === "o-if") {
    conditionEls.push(...getNexts(conditionEl.next));
  } else if (conditionEl.tag === "o-else-if") {
    conditionEls.push(...getNexts(conditionEl.next));
    conditionEls.unshift(...getPrevs(conditionEl.prev));
  }

  // 一条链只在首个 o-if 上做合并刷新
  const firstEl = conditionEls[0];
  if (firstEl.tag === "o-if") {
    clearTimeout(firstEl.__refreshTimer);
    firstEl.__refreshTimer = setTimeout(() => {
      // 按顺序找到第一个成立的条件；o-else 兜底
      let targetCondition = null;
      for (let i = 0; i < conditionEls.length; i++) {
        const el = conditionEls[i];
        if (el.tag === "o-if" || el.tag === "o-else-if") {
          if (el.value) {
            targetCondition = el;
            break;
          }
        } else {
          targetCondition = el;
        }
      }

      if (targetCondition) {
        renderContent(targetCondition);
        targetCondition.attr("actived", "");
      }

      // 其余分支清空内容
      conditionEls.forEach((el) => {
        if (el !== targetCondition) {
          el.attr("actived", null);
          clearContent(el);
        }
      });
    }, 0);
  } else {
    console.error("o-if must be the first element", conditionEls);
  }
};

// 渲染分支内容：按需编译 + 克隆绑定（渲染期零解析零编译）
const renderContent = (conditionEl) => {
  if (conditionEl.__rendered) {
    return;
  }

  const result = getRenderData(conditionEl.ele);

  if (!result) {
    return;
  }

  const { target, data, temps } = result;

  render({
    target: conditionEl.ele,
    data,
    temps,
    template: getCompiledContent(conditionEl.__originHTML),
  });

  conditionEl.__rendered = true;

  conditionEl.emit("rendered", {
    bubbles: false,
  });
};

// 清空分支内容
const clearContent = (conditionEl) => {
  if (!conditionEl.__rendered) {
    return;
  }

  conditionEl.ele.childNodes?.forEach((el) => revokeAll(el));

  conditionEl.html = "";

  conditionEl.__rendered = false;
};

// 获取后方兄弟条件元素（到 o-else 为止）
const getNexts = (next) => {
  const nexts = [];
  while (next && (next.tag === "o-else-if" || next.tag === "o-else")) {
    nexts.push(next);
    if (next.tag === "o-else") {
      break;
    }
    next = next.next;
  }
  return nexts;
};

// 获取前方兄弟条件元素（到 o-if 为止）
const getPrevs = (prev) => {
  const prevs = [];
  while (prev && (prev.tag === "o-if" || prev.tag === "o-else-if")) {
    prevs.unshift(prev);
    if (prev.tag === "o-if") {
      break;
    }
    prev = prev.prev;
  }
  return prevs;
};

const createdFunc = function () {
  // 元素可能先于子内容构造（如 createElement 或第三方库 cloneNode），
  // 此时首个子元素不存在，需要回退到自身内容
  const firstEle = this[0];
  if (firstEle && firstEle.is("template[inner-code]")) {
    this.__originHTML = firstEle.html.trim();
  } else {
    this.__originHTML = this.html.trim();
  }
  this.html = "";
};

const temp = `<style>:host{display:contents;}</style><slot></slot>`;

const conditionOptions = {
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
    createdFunc.call(this);
  },
};

$.register({
  tag: "o-if",
  ...conditionOptions,
});

$.register({
  tag: "o-else-if",
  ...conditionOptions,
});

$.register({
  tag: "o-else",
  temp,
  created() {
    createdFunc.call(this);
  },
});
