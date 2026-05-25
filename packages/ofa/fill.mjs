import $ from "../xhear/base.mjs";
import { getRenderData } from "../xhear/render/condition.mjs";
import { eleX, revokeAll } from "../xhear/util.mjs";
import { createItem } from "../xhear/render/fill.mjs";
import { getErr } from "../ofa-error/main.js";
import { renderExtends } from "../xhear/render/render.mjs";

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

      if (
        !arr ||
        !arr.length ||
        (this.__oldTempName && this.__oldTempName !== tempName)
      ) {
        // 没有值，清空内容
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
        // 没有找到模板，查看是否有默认的模板
        if (this.__originHTML) {
          targetTemp = $(`<template>${this.__originHTML}</template>`).ele;
        } else {
          throw new Error("o-fill - Template not found: " + tempName);
        }
      }

      this.__oldTempName = tempName;

      if (!this.length) {
        // 没有子元素，优化性能的添加方式
        const frag = document.createDocumentFragment();

        // 渲染模板
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

      // 有子元素，优化性能的方式更新方式
      const keyValsArr = arr.map(getKeyVal);

      const tempChildren = Array.from(this.ele.children);

      // 先删除不存在的元素
      for (let i = 0; i < tempChildren.length; i++) {
        const e = tempChildren[i];
        const renderedItem = e.__render_data;

        const currentKeyVal = getKeyVal(renderedItem.$data, i);

        // 不存在的id，需要删除
        if (!keyValsArr.includes(currentKeyVal)) {
          e.remove();
          revokeAll(e);
        }
      }

      const { children } = this.ele;

      // 获取当前所有的key值
      let keyVals = [];
      const refreshKeyVals = () => {
        keyVals = Array.from(children).map((e, i) =>
          getKeyVal(e.__render_data.$data, i),
        );
      };
      refreshKeyVals();

      const selfEl = this.ele;

      // 遍历一遍进行更新数据
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        // const keyVal = item[keyName];
        const keyVal = getKeyVal(item, i);

        // 查找是否存在
        const index = keyVals.indexOf(keyVal);

        if (index > -1) {
          // 存在，更新数据
          const $ele = eleX(children[index]);

          // 如果不是目标元素，则进行位置调整
          if (children[i] !== $ele.ele) {
            selfEl.insertBefore($ele.ele, children[i]);
            refreshKeyVals();
          }

          // 按需更新绑定的数据
          if ($ele.__item.$data !== item) {
            $ele.__item.$data = item;
          }
          if ($ele.__item.$index !== i) {
            $ele.__item.$index = i;
          }
        } else {
          // 不存在，添加新的元素
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
    },
  },
  ready() {
    this.watchTick((e) => {
      if (e.hasModified("value")) {
        // value发生变动，重新渲染
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

    if (this[0].is("template[inner-code]")) {
      originHTML = this[0].html.trim();
    } else {
      originHTML = this.html.trim();
    }

    // 判断是否有多个子元素
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

// 修正转换前的内容
const oldAfterConvert = renderExtends.afterConvert;
renderExtends.afterConvert = (e) => {
  oldAfterConvert(e);
  const { template, temps } = e;
  wrapTemp(template);
  Object.values(temps).forEach((temp) => wrapTemp(temp));
};

// 给需要预处理的元素的外部添加一个template包裹标签，防止被提前污染代码
const needWrapTags = ["o-fill", "o-if", "o-else-if", "o-else"];

export const wrapTemp = (template) => {
  const eles = Array.from(
    template.content.querySelectorAll(needWrapTags.join(",")),
  );

  // 倒转之后性能好像好点
  // eles.reverse();

  // 对已有的 inner-code 先进行解套，不然导致渲染失败
  eles.forEach((e) => {
    while (true) {
      const innerCodeTempEl = e.querySelector("template[inner-code]");

      if (!innerCodeTempEl) {
        break;
      }

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
    // 对已有的 inner-code 先进行解套
    e.innerHTML = `<template inner-code>${originCode}</template>`;
    wrapTemp(e.children[0]);
  });
};
