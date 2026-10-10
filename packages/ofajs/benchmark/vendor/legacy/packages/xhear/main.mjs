import { createXEle, eleX } from "./util.mjs";
import { searchEle } from "./public.mjs";
import { handler } from "./accessor.mjs";
import renderFn from "./render/render.mjs";
import syncFn from "./render/sync.mjs";
import eventFn from "./event.mjs";
import LikeArray from "./array.mjs";
import formFn, { initFormEle } from "./form.mjs";
import cssFn from "./css.mjs";
import { extend } from "../stanz/public.mjs";
import Stanz, { constructor } from "../stanz/main.mjs";
import watchFn from "../stanz/watch.mjs";
import "./render/condition.mjs";
import "./render/fill.mjs";
import { getErr } from "../ofa-error/main.js";
const { defineProperties } = Object;

const GET_COMPOSE_PATH = `get-${Math.random()}`;

const init = ({ _this, ele, proxySelf }) => {
  const descs = {
    owner: {
      get() {
        const { parentNode } = ele;
        const { _owner } = _this;
        const arr = parentNode ? [eleX(parentNode), ..._owner] : [..._owner];
        return new Set(arr);
      },
    },
    ele: {
      get: () => ele,
    },
  };

  const tag = ele.tagName && ele.tagName.toLowerCase();

  if (tag) {
    descs.tag = {
      enumerable: true,
      value: tag,
    };
  }

  defineProperties(_this, descs);

  initFormEle(proxySelf);
};

export default class Xhear extends LikeArray {
  constructor({ ele }) {
    super();

    const proxySelf = constructor.call(this, {}, handler);

    init({
      _this: this,
      ele,
      proxySelf,
    });

    ele.__xhear__ = proxySelf;

    return proxySelf;
  }

  get length() {
    return this.ele && this.ele.children.length;
  }

  $(expr) {
    let { ele } = this;
    if (ele instanceof HTMLTemplateElement) {
      ele = ele.content;
    }

    const target = ele.querySelector(expr);
    return target ? eleX(target) : null;
  }

  all(expr) {
    return searchEle(this.ele, expr).map(eleX);
  }

  extend(obj, desc) {
    return extend(this, obj, desc);
  }

  get text() {
    return this.ele.textContent;
  }

  set text(val) {
    this.ele.textContent = val;
  }

  get html() {
    return this.ele.innerHTML;
  }

  set html(val) {
    this.ele.innerHTML = val;
  }

  get classList() {
    return this.ele.classList;
  }

  get data() {
    return this.ele.dataset;
  }

  get shadow() {
    return eleX(this.ele.shadowRoot);
  }

  get root() {
    const rootNode = this.ele.getRootNode();
    return rootNode ? eleX(rootNode) : null;
  }
  get host() {
    let root = this.ele.getRootNode();
    let { host } = root;
    return host instanceof Node ? eleX(host) : null;
  }

  get parent() {
    let { parentNode } = this.ele;
    return !parentNode || parentNode === document ? null : eleX(parentNode);
  }

  get parents() {
    const parents = [];
    let target = this;
    while (target.parent) {
      target = target.parent;
      parents.push(target);
    }
    return parents;
  }

  parentsUntil(expr) {
    const allParents = this.parents;
    const parents = [];

    const exprIsObj = typeof expr === "object";

    while (allParents.length) {
      const target = allParents.shift();

      if (exprIsObj) {
        if (target === expr || target.ele === expr) {
          break;
        }
      } else if (target.ele.matches(expr)) {
        break;
      }

      parents.push(target);
    }

    return parents;
  }

  get hosts() {
    const hosts = [];
    let target = this;
    while (target.host) {
      target = target.host;
      hosts.push(target);
    }
    return hosts;
  }

  composedPath() {
    let paths = [];
    this.one(GET_COMPOSE_PATH, (e) => {
      paths = e.composedPath();
      e.stopPropagation();
    });
    this.emit(GET_COMPOSE_PATH, {
      composed: true,
    });
    return paths;
  }

  get next() {
    const nextEle = this.ele.nextElementSibling;
    return nextEle ? eleX(nextEle) : null;
  }

  after(val) {
    const { next: nextEl } = this;

    if (nextEl) {
      nextEl.before(val);
    } else {
      this.parent.push(val);
    }
  }

  get nexts() {
    const { parent } = this;
    const selfIndex = this.index;
    return parent.filter((e, i) => i > selfIndex);
  }

  get prev() {
    const prevEle = this.ele.previousElementSibling;
    return prevEle ? eleX(prevEle) : null;
  }

  before(val) {
    const $el = createXEle(val);
    this.parent.ele.insertBefore($el.ele, this.ele);
  }

  get prevs() {
    const { parent } = this;
    const selfIndex = this.index;
    return parent.filter((e, i) => i < selfIndex);
  }

  get siblings() {
    return this.parent.filter((e) => e !== this);
  }

  get index() {
    let { parentNode } = this.ele;

    if (!parentNode) {
      return null;
    }

    return Array.prototype.indexOf.call(parentNode.children, this.ele);
  }

  get style() {
    return this.ele.style;
  }

  // get width() {
  //   return parseInt(getComputedStyle(this.ele).width) || 0;
  // }

  // get height() {
  //   return parseInt(getComputedStyle(this.ele).height) || 0;
  // }

  // get clientWidth() {
  //   return this.ele.clientWidth;
  // }

  // get clientHeight() {
  //   return this.ele.clientHeight;
  // }

  // get offsetWidth() {
  //   return this.ele.offsetWidth;
  // }

  // get offsetHeight() {
  //   return this.ele.offsetHeight;
  // }

  // get outerWidth() {
  //   let computedStyle = getComputedStyle(this.ele);
  //   return (
  //     this.ele.offsetWidth +
  //     parseInt(computedStyle["margin-left"]) +
  //     parseInt(computedStyle["margin-right"])
  //   );
  // }

  // get outerHeight() {
  //   let computedStyle = getComputedStyle(this.ele);
  //   return (
  //     this.ele.offsetHeight +
  //     parseInt(computedStyle["margin-top"]) +
  //     parseInt(computedStyle["margin-bottom"])
  //   );
  // }

  is(expr) {
    if (typeof expr === "string") {
      return this.ele.matches(expr);
    }

    if (expr instanceof Xhear) {
      return this.ele === expr.ele;
    }

    if (expr instanceof Node) {
      return this.ele === expr;
    }
  }

  contains(expr) {
    if (typeof expr === "string") {
      return this.ele.querySelector(expr) !== null;
    }

    if (expr instanceof Xhear) {
      return this.ele.contains(expr.ele);
    }

    if (expr instanceof Node) {
      return this.ele.contains(expr);
    }
  }

  remove() {
    const { parent } = this;
    if (parent) {
      parent.splice(parent.indexOf(this), 1);
    }
    // this.ele.remove();
  }

  clone(bool = true) {
    return eleX(this.ele.cloneNode(bool));
  }

  wrap(content) {
    const $el = createXEle(content);

    const { ele } = this;

    if (!ele.parentNode) {
      throw getErr("xhear_wrap_no_parent");
    }

    ele.parentNode.insertBefore($el.ele, ele);

    ele.__internal = 1;

    $el.ele.appendChild(ele);

    delete ele.__internal;

    return this;
  }

  unwrap() {
    const { ele } = this;

    const target = ele.parentNode;

    if (target.children.length > 1) {
      throw getErr("xhear_unwrap_has_siblings");
    }

    ele.__internal = 1;

    target.parentNode.insertBefore(ele, target);

    target.remove();

    delete ele.__internal;

    return this;
  }
}

const sfn = Stanz.prototype;
const fn = Xhear.prototype;

fn.extend(
  {
    get: sfn.get,
    set: sfn.set,
    toJSON: sfn.toJSON,
    toString: sfn.toString,
    ...watchFn,
    ...eventFn,
    ...renderFn,
    ...syncFn,
    ...formFn,
  },
  {
    enumerable: false,
  }
);

fn.extend(cssFn);
