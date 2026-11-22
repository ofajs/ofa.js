import { renderExtends, render } from "./render.mjs";
import { isSafariBrowser } from "../public.mjs";
import { getErr } from "../../ofa-error/main.js";
import { getRenderData } from "./condition.mjs";
export class FakeNode extends Comment {
  constructor(markname) {
    const tagText = `Fake Node${markname ? ": " + markname : ""}`;

    super(` ${tagText} --end `);

    this._mark = markname;
    this._inited = false;

    const startCom = new Comment(` ${tagText} --start `);
    startCom.__fake_end = this;

    Object.defineProperty(this, "_start", {
      value: startCom,
    });
  }

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
        throw getErr("xhear_fakenode_unclose", { name: "children" });
      } else {
        break;
      }
    }

    return childs;
  }

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

// 将temp元素替换到原来的位置上
const replaceTempInit = (_this) => {
  const parent = _this.parentNode;
  if (parent) {
    const parent = _this.parentNode;
    const children = Array.from(_this.content.children);
    children.forEach((e) => {
      parent.insertBefore(e, _this);
    });

    _this.remove();

    if (parent.querySelector("[x-bind-data]")) {
      const regData = getRenderData(parent);

      if (regData) {
        // 重新渲染未绑定元素
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
  renderExtends.beforeRender = ({ target }) => {
    let replaces = [];

    while (true) {
      replaces = Array.from(
        target.querySelectorAll('template[is="replace-temp"]')
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
}
