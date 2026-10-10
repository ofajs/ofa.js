/**
 * FakeNode：用一对注释节点（--start / --end）在 DOM 中圈出一段"虚拟容器"。
 *
 * x-if / x-fill 渲染的内容都装在 FakeNode 区间里：组件本体从 DOM 摘除后，
 * 区间内容仍留在文档流中，且支持 children/childNodes/innerHTML 等容器
 * 操作。遍历从 end 注释向前走到 _start 注释为止。
 *
 * 本模块同时注册 replace-temp 内置元素：<template is="replace-temp"> 用于
 * table/select 等解析受限的位置——HTML 解析器不允许这些位置出现任意元素，
 * 模板先落位为 template，连接时再把内容替换回原位。
 */
import { renderExtends, render } from "./render.mjs";
import { isSafariBrowser } from "../public.mjs";
import { getErr } from "../error.mjs";
import { getRenderData } from "./condition.mjs";

export class FakeNode extends Comment {
  constructor(markname) {
    const tagText = `Fake Node${markname ? ": " + markname : ""}`;

    super(` ${tagText} --end `);

    this._mark = markname;
    this._inited = false;

    // start 注释通过 __fake_end 反指 end，便于 nextElementSibling 跳转
    const startCom = new Comment(` ${tagText} --start `);
    startCom.__fake_end = this;

    Object.defineProperty(this, "_start", {
      value: startCom,
    });
  }

  /** 把 start 注释插入到自己前面，形成完整区间 */
  init() {
    if (this._inited) {
      return;
    }

    this.parentNode.insertBefore(this._start, this);
    this._inited = true;
  }

  querySelector(expr) {
    return this.__searchEl(expr, "find");
  }

  querySelectorAll(expr) {
    return this.__searchEl(expr);
  }

  /** 在全文档查询结果中过滤出落在自身区间内的元素 */
  __searchEl(expr, funcName = "filter") {
    const startParent = this.parentNode;
    if (!startParent) return [];

    const childs = this.children;

    return Array.from(startParent.querySelectorAll(expr))[funcName]((e) => {
      let par = e;
      while (true) {
        if (childs.includes(par)) {
          return true;
        }

        par = par.parentNode;

        if (!par) {
          break;
        }
      }
    });
  }

  insertBefore(newEle, target) {
    const { parentNode } = this;

    if (Array.from(parentNode.children).includes(target)) {
      parentNode.insertBefore(newEle, target);
    } else {
      parentNode.insertBefore(newEle, this);
    }
  }

  appendChild(newEle) {
    this.parentNode.insertBefore(newEle, this);
  }

  /** 区间内的元素子节点（从 end 注释向前遍历到 start 注释为止） */
  get children() {
    const childs = [];

    let prev = this;
    while (true) {
      prev = prev.previousSibling;

      if (prev) {
        if (prev instanceof HTMLElement) {
          childs.unshift(prev);
        } else if (prev === this._start) {
          break;
        }
      } else if (this.isConnected) {
        // 走到文档顶仍未遇到 start，说明区间不完整
        throw getErr("xhear_fakenode_unclose", { name: "children" });
      } else {
        break;
      }
    }

    return childs;
  }

  /** 区间内的全部子节点（含文本、注释） */
  get childNodes() {
    const childs = [];

    let prev = this;
    while (true) {
      prev = prev.previousSibling;

      if (prev) {
        if (prev === this._start) {
          break;
        }
        childs.unshift(prev);
      } else {
        if (!this.isConnected) {
          break;
        }
        throw getErr("xhear_fakenode_unclose", { name: "childNodes" });
      }
    }

    return childs;
  }

  /** 清空并重设区间内容 */
  set innerHTML(val) {
    this.childNodes.forEach((e) => {
      e.remove();
    });

    const temp = document.createElement("template");
    temp.innerHTML = val;

    Array.from(temp.content.childNodes).forEach((e) => {
      this.appendChild(e);
    });
  }

  get innerHTML() {
    const { children } = this;
    let content = "";

    children.forEach((e) => {
      content += e.outerHTML + "\n";
    });

    return content;
  }

  get nextElementSibling() {
    let next = this.nextSibling;

    if (!next) {
      return null;
    }

    // 遇到嵌套 FakeNode 的 start 注释，跳到对应的 end 注释之后
    if (next.__fake_end) {
      return next.__fake_end;
    }

    if (next && !(next instanceof Element)) {
      next = next.nextElementSibling;
    }

    return next;
  }

  get previousElementSibling() {
    const { _start } = this;
    let prev = _start.previousSibling;

    if (!prev) {
      return null;
    }

    if (prev instanceof FakeNode) {
      return prev;
    }

    return _start.previousElementSibling;
  }
}

/** 把 replace-temp 模板的内容替换回文档原位，并补渲染未绑定元素 */
const replaceTempInit = (_this) => {
  const parent = _this.parentNode;
  if (parent) {
    const children = Array.from(_this.content.children);
    children.forEach((e) => {
      parent.insertBefore(e, _this);
    });

    _this.remove();

    if (parent.querySelector("[x-bind-data]")) {
      const regData = getRenderData(parent);

      if (regData) {
        // 替换出的元素还没绑定，重跑一次渲染流程
        render({
          data: regData.data,
          target: regData.target,
          temps: regData.temps,
        });
      }
    }
  }
};

if (isSafariBrowser()) {
  // Safari 不支持自定义内置元素，改由每次渲染前的钩子驱动替换
  renderExtends.beforeRender = ({ target }) => {
    let replaces = [];

    while (true) {
      replaces = Array.from(
        target.querySelectorAll('template[is="replace-temp"]'),
      );

      if (!replaces.length) {
        break;
      }

      replaces.forEach((temp) => {
        replaceTempInit(temp);
      });
    }
  };
} else {
  class ReplaceTemp extends HTMLTemplateElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      replaceTempInit(this);
    }

    connectedCallback() {
      this.init();
    }
  }

  customElements.define("replace-temp", ReplaceTemp, {
    extends: "template",
  });
};
