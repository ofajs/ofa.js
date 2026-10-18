//! ofa-body-ghost - v5.0.1 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
/**
 * body-ghost 插件（可选，引用才生效，不进 ofa.js 默认构建）：
 * 把模板内容"传送"到 body 末尾渲染——真实 DOM 挂在 body 下的
 * body-ghost-mapping 影子载体里，原位置只留一个不占布局的壳
 * （display:none），并通过 parentNode 伪装让事件仍沿原文档位置向上
 * 冒泡。适合弹窗、全局浮层等需要脱离父级层叠上下文/overflow 裁剪的
 * 内容。
 *
 * 桥接形态：挂接页面已加载的 ofa.js 运行时（全局 $），须在 ofa.js
 * 之后加载（缺失时直接抛错）。
 */
const MAPPGING_ELE = Symbol("mapping-element");
const ORIGIN_ELE = Symbol("origin-element");

const $ = window.$;

if (!$) {
  throw new Error(
    "[ofa-body-ghost] ofa.js must be loaded before the body-ghost plugin (window.$ is missing)",
  );
}

$.register({
  tag: "body-ghost-mapping",
  attrs: {
    ghostId: null,
  },
  proto: {
    get origin() {
      return $(this[ORIGIN_ELE]);
    },
  },
  temp: `<style>:host{display:contents}</style>`,
});

$.register({
  tag: "body-ghost",
  attrs: {
    ghostId: null,
  },
  temp: `<style>:host{display:none}</style>`,
  proto: {
    get mapping() {
      return $(this[MAPPGING_ELE]);
    },
  },
  ready() {
    this[MAPPGING_ELE] = null;
    // ghostId 按实例生成（attrs 默认值在注册时只求值一次，多实例会串号）
    this.ghostId = Math.random().toString(32).slice(2);
  },
  attached() {
    const mappingEl = (this[MAPPGING_ELE] =
      document.createElement("body-ghost-mapping"));

    mappingEl.setAttribute("ghost-id", this.ghostId);

    $(mappingEl)[ORIGIN_ELE] = this.ele;

    Object.defineProperties(mappingEl.shadowRoot, {
      // 伪装parentNode，让所有事情向上冒泡
      parentNode: {
        get: () => {
          return this.ele.parentNode;
        },
      },
    });

    const originChildNodes = this.ele.childNodes;

    Object.defineProperties(this.ele, {
      // 伪装子元素
      childNodes: {
        get: () => {
          return mappingEl.shadowRoot.childNodes;
        },
      },
    });

    $.nextTick(() => {
      Array.from(originChildNodes).forEach((el) => {
        el.__internal = 1;
        mappingEl.shadowRoot.appendChild(el);
        delete el.__internal;
      });
    });

    document.body.appendChild(mappingEl);
  },
  detached() {
    if (this[MAPPGING_ELE]) {
      this[MAPPGING_ELE].remove();
      this[MAPPGING_ELE] = null;
    }
  },
});
