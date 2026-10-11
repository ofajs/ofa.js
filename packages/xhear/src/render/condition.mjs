/**
 * 条件渲染：o-if / o-else-if / o-else（light DOM 版，唯一实现）。
 *
 * 内容以 light children 渲染在 o-if 元素内部（shadow 为
 * display:contents + slot，视觉上无额外层级）；内容在编译期被
 * wrapTemp 包进 template[inner-code] 保护（不参与宿主编译），首次
 * 渲染时才按需编译并对当前渲染数据绑定，编译结果全局缓存。
 *
 * 条件链：以首个 o-if 为头，收集其后相邻的 o-else-if / o-else；
 * value 变化重判异步执行（setTimeout 0 合并同拍变更），从头到尾取
 * 第一个满足条件（value 为真或 o-else）的分支渲染，其余清空，保证
 * 同链同时只有一个分支存活。
 *
 * 组件初始化依赖 render 的就绪握手：等 _bindingRendered（或
 * binding-rendered 事件）后才刷新——此时自身 :value 绑定已生效。
 */
import { register } from "../register.mjs";
import { eleX, revokeAll } from "../util.mjs";
import { render } from "./render.mjs";
import { getCompiledContent } from "./inner-code.mjs";

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

      // 内容变更后唤醒父级监听（shadow 级订阅如 formData 依赖此约定）
      const { parentNode } = firstEl.ele;
      if (parentNode) {
        eleX(parentNode).refresh();
      }
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

  try {
    render({
      target: conditionEl.ele,
      data,
      temps,
      template: getCompiledContent(conditionEl.__originHTML),
    });
    console.debug("[rc]", conditionEl.tag, "render OK");
  } catch (err) {
    console.debug("[rc]", conditionEl.tag, "render THREW:", String(err).slice(0, 160));
    throw err;
  }

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

  conditionEl.emit("clear", {
    bubbles: false,
  });
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
    // 分支渲染标记必须是注册数据：代理内部状态（__ 前缀直设）在
    // 条件元素上不保证持久，用它记 __rendered 会丢、clear 事件全灭
    __rendered: false,
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

register({
  tag: "o-if",
  ...conditionOptions,
});

register({
  tag: "o-else-if",
  ...conditionOptions,
});

register({
  tag: "o-else",
  temp,
  data: {
    value: null,
    __rendered: false,
  },
  created() {
    createdFunc.call(this);
  },
});

/**
 * 从目标节点向上找最近的渲染宿主（带 __render_data 的节点），
 * 返回 { target, data, temps }；o-if/o-fill 的内容渲染数据来源于此。
 */
export const getRenderData = (target) => {
  while (target && !target.__render_data) {
    target = target.parentNode;
  }

  if (target) {
    return {
      target,
      data: target.__render_data,
      temps: target.__render_temps,
    };
  }

  return null;
};
