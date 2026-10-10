/**
 * o-fill：列表渲染（light DOM 版，列表项直接作为子元素渲染）。
 *
 * 支持两种模板来源：`name` 属性引用宿主的命名模板；未声明 name 时使用
 * 元素自身内容（编译期被 wrapTemp 包进 template[inner-code] 保护，首次
 * 渲染时按需编译并全局缓存）。列表项数据上下文为 $data/$index/$host/
 * $parent，与 x-fill 一致。
 *
 * 更新采用基于 key 的对账（fill-key 或 xid 或引用）：存在则复用 DOM
 * 并更新 $data/$index，缺失则删除，新增则插入。
 */
import $ from "../../xhear/src/base.mjs";
import { renderExtends } from "../../xhear/src/render/render.mjs";
import { getRenderData } from "../../xhear/src/render/condition.mjs";
import { compileTemplate } from "../../xhear/src/render/compile.mjs";
import { eleX, revokeAll } from "../../xhear/src/util.mjs";
import { createItem } from "../../xhear/src/render/fill.mjs";
import { getErr } from "./error.mjs";

// 内容编译缓存：innerHTML 原文 → 编译模板（与 o-if 共享策略）
const compiledContents = new Map();

/** 按内容原文取编译模板（多子元素时包一层 display:contents 的 div） */
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

$.register({
  tag: "o-fill",
  temp: `<style>:host{display:contents;}</style><slot></slot>`,
  data: {
    value: null,
  },
  proto: {
    refreshView() {
      const arr = this.value;
      const tempName = this.attr("name");
      console.debug("[xt-ofill]", "enter", "len=" + (arr ? arr.length : arr), "childs=" + this.ele.children.length);

      if (
        !arr ||
        !arr.length ||
        (this.__oldTempName && this.__oldTempName !== tempName)
      ) {
        // 没有值或模板来源已切换，清空内容
        Array.from(this.ele.childNodes).forEach((e) => {
          revokeAll(e);
          e.remove();
        });
        return;
      }

      const { data, target, temps = {} } = getRenderData(this.ele);

      const keyName = this.attr("fill-key") || "xid";

      let targetTemp = temps[tempName];

      if (!targetTemp) {
        // 未声明 name 或找不到命名模板时，使用自身内容（编译缓存）
        if (this.__originHTML) {
          targetTemp = getCompiledContent(this.__originHTML);
        } else {
          throw new Error("o-fill - Template not found: " + tempName);
        }
      }

      this.__oldTempName = tempName;

      if (!this.length) {
        // 首建：逐项创建后一次性挂载
        const frag = document.createDocumentFragment();

        for (let i = 0, len = arr.length; i < len; i++) {
          const item = arr[i];

          const $ele = createItem(
            item,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName,
            this._$parent,
          );

          frag.appendChild($ele.ele);
        }

        this.ele.appendChild(frag);
        return;
      }

      // 对账 key：fill-key → xid → "索引-引用" 兜底
      const getKeyVal = (e, i) => {
        const key = e[keyName];

        if (key === undefined || key === null) {
          if (e.xid) {
            return e.xid;
          }

          return `${i}-${e}`;
        }

        return key;
      };

      const keyValsArr = arr.map(getKeyVal);

      const tempChildren = Array.from(this.ele.children);

      // 先删除已不存在的项
      for (let i = 0; i < tempChildren.length; i++) {
        const e = tempChildren[i];
        const renderedItem = e.__render_data;

        const currentKeyVal = getKeyVal(renderedItem.$data, i);

        if (!keyValsArr.includes(currentKeyVal)) {
          e.remove();
          revokeAll(e);
        }
      }

      const { children } = this.ele;

      let keyVals = [];
      const refreshKeyVals = () => {
        keyVals = Array.from(children).map((e, i) =>
          getKeyVal(e.__render_data.$data, i),
        );
      };
      refreshKeyVals();

      const selfEl = this.ele;

      // 逐位对账：复用则移位并更新数据，缺失则新建插入
      try {
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        const keyVal = getKeyVal(item, i);

        const index = keyVals.indexOf(keyVal);

        if (index > -1) {
          const $ele = eleX(children[index]);

          if (children[i] !== $ele.ele) {
            selfEl.insertBefore($ele.ele, children[i]);
            refreshKeyVals();
          }

          if ($ele.__item.$data !== item) {
            $ele.__item.$data = item;
          }
          if ($ele.__item.$index !== i) {
            $ele.__item.$index = i;
          }
        } else {
          const $ele = createItem(
            item,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName,
            this._$parent,
          );

          selfEl.insertBefore($ele.ele, children[i]);
          refreshKeyVals();
        }
      }
      } catch (e) {
        console.error("[xt-ofill-err]", String(e), e.stack.split("\n")[1]);
      }
    },
  },
  ready() {
    this.watchTick((e) => {
      if (e.hasModified("value")) {
        this.refreshView();
      }
    });
  },
  attached() {
    if (this.value) {
      this.refreshView();
    }
  },
  created() {
    let originHTML = "";

    const firstEle = this[0];
    if (firstEle && firstEle.is("template[inner-code]")) {
      originHTML = firstEle.html.trim();
    } else {
      originHTML = this.html.trim();
    }

    // 多子元素时包一层 display:contents 的容器，保证列表项为单根
    const temp = $(`<template><div>${originHTML}</div></template>`);
    const tempContent = temp.ele.content.children[0];

    if (
      tempContent.children.length > 1 ||
      (tempContent.children.length === 0 && tempContent.innerHTML.trim())
    ) {
      const err = getErr("temp_multi_child");
      console.warn(err, this.ele, {
        content: this.html.trim(),
      });

      originHTML = `<div style="display: contents;">${originHTML}</div>`;
    }

    this.__originHTML = originHTML;

    this.html = "";
  },
});

// ---- 编译期内容保护 ----

// 修正转换前的内容：给 o-fill / 条件组件的外部包一层 template[inner-code]
const oldAfterConvert = renderExtends.afterConvert;
renderExtends.afterConvert = (e) => {
  oldAfterConvert(e);
  const { template, temps } = e;
  wrapTemp(template);
  Object.values(temps).forEach((temp) => wrapTemp(temp));
};

const needWrapTags = ["o-fill", "o-if", "o-else-if", "o-else"];

/**
 * 把 o-fill/条件组件的内容包进 template[inner-code]，防止宿主编译时
 * 提前消费其中的指令（它们应在分支渲染时才绑定渲染数据）；同时解开
 * 既有 inner-code 的嵌套，避免重复包裹导致渲染失败。
 */
export const wrapTemp = (template) => {
  const eles = Array.from(
    template.content.querySelectorAll(needWrapTags.join(",")),
  );

  eles.forEach((e) => {
    while (true) {
      const innerCodeTempEl = e.querySelector("template[inner-code]");

      if (!innerCodeTempEl) {
        break;
      }

      // 解开已有的 inner-code 包裹
      const childs = innerCodeTempEl.content.childNodes;

      childs.forEach((child) => {
        innerCodeTempEl.parentNode.insertBefore(
          child.cloneNode(true),
          innerCodeTempEl,
        );
      });

      innerCodeTempEl.remove();
    }

    const originCode = e.innerHTML;
    e.innerHTML = `<template inner-code>${originCode}</template>`;
    wrapTemp(e.children[0]);
  });
};
