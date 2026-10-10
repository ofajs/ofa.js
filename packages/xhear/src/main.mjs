/**
 * Xhear 类：把任意 Node 包装成"数据即元素"的代理实例。
 *
 * 结构上三合一：
 * - LikeArray —— 子元素当数组操作（push/splice 会真实搬动 DOM）；
 * - stanz —— 数据观察（构造时经 stanz 的 constructor 缝注入 xhear
 *   自己的 handler，数字键映射子元素）；
 * - 本类 —— 元素导航（parent/next/shadow…）与读写助手（text/html/attr…）。
 *
 * constructor 返回 proxySelf（代理），因此 eleX(el) 每次拿到同一实例。
 */
import { createXEle, eleX } from "./util.mjs";
import { searchEle } from "./public.mjs";
import { handler } from "./accessor.mjs";
import renderFn from "./render/render.mjs";
import syncFn from "./render/sync.mjs";
import eventFn from "./event.mjs";
import LikeArray from "./array.mjs";
import { initFormEle } from "./form.mjs";
import cssFn from "./css.mjs";
import { extend } from "../../stanz/src/public.mjs";
import Stanz, { constructor } from "../../stanz/src/main.mjs";
import watchFn from "../../stanz/src/watch.mjs";
import { getPath, setPath } from "./path.mjs";
import { getErr } from "./error.mjs";
import "./render/condition.mjs";
import "./render/fill.mjs";

const { defineProperties } = Object;

const GET_COMPOSE_PATH = `get-${Math.random()}`;

/** 实例初始化：注入 ele/owner/tag 等元素侧字段，并接通表单支持 */
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

    // 复用 stanz 的构造缝：同一套代理/观察/撤销机制，换用 xhear handler
    const proxySelf = constructor.call(this, {}, handler);

    init({
      _this: this,
      ele,
      proxySelf,
    });

    // 元素与实例双向锚定，eleX 据此保证单例
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

  /** 点路径取值（"a.b.c"），单键退化为直接访问 */
  get(key) {
    return getPath(this, key);
  }

  /** 点路径赋值（"a.b.c"），单键退化为直接赋值 */
  set(key, value) {
    return setPath(this, key, value);
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

  /** 收集祖先直到匹配 expr 的节点为止（不含该节点） */
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

  /** shadow host 祖先链（嵌套组件时逐层向上） */
  get hosts() {
    const hosts = [];
    let target = this;
    while (target.host) {
      target = target.host;
      hosts.push(target);
    }
    return hosts;
  }

  /** 借一次内部事件拿到事件系统的 composedPath */
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

  /** 插到目标元素之后；没有下一个兄弟时等价 push 到父级末尾 */
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

  /** 从父级数组中移除自身（走 splice 保证事件语义） */
  remove() {
    const { parent } = this;
    if (parent) {
      parent.splice(parent.indexOf(this), 1);
    }
  }

  clone(bool = true) {
    return eleX(this.ele.cloneNode(bool));
  }

  /** 用 content 包裹自身（wrap 元素插到原位置，自身移入其中） */
  wrap(content) {
    const $el = createXEle(content);

    const { ele } = this;

    if (!ele.parentNode) {
      throw getErr("xhear_wrap_no_parent");
    }

    ele.parentNode.insertBefore($el.ele, ele);

    // __internal 抑制搬动过程中的 attached/detached 误触发
    ele.__internal = 1;

    $el.ele.appendChild(ele);

    delete ele.__internal;

    return this;
  }

  /** 解包：把唯一子元素提升到父级后删掉包装层 */
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

// ==== 能力组装 ====
// stanz 的 get/set（点路径）已由本类的 get/set 承担；
// 其余 stanz 原型能力（toJSON/toString）+ watch + 事件 + 渲染动作 +
// sync + 表单，全部以非枚举方式挂上原型，避免污染 spread/JSON。
const sfn = Stanz.prototype;
const fn = Xhear.prototype;

fn.extend(
  {
    toJSON: sfn.toJSON,
    toString: sfn.toString,
    ...watchFn,
    ...eventFn,
    ...renderFn,
    ...syncFn,
    // stanz 冒泡钩子：数据事件沿 DOM 宿主链上浮（shadow 级订阅依赖）
    _bubbleOwners() {
      return this.owner;
    },
  },
  {
    enumerable: false,
  }
);

fn.extend(cssFn);
