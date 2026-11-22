import { err } from "./error.mjs";
import lm, { LOADED } from "./lm.mjs";

class LoadModule extends HTMLElement {
  static observedAttributes = ["src", "pause"];

  // 首次加载使用的 src，同时作为"已初始化"标记
  #initSrc;

  get loaded() {
    return !!this[LOADED];
  }

  #init() {
    // 已初始化或处于 pause 状态时跳过
    if (this.#initSrc || this.hasAttribute("pause")) {
      return;
    }

    const src = this.getAttribute("src");

    if (!src) {
      return;
    }

    this.#initSrc = src;

    // element 选项把元素关联进加载流程：完成后置位 LOADED 并派发 load 事件
    lm(undefined, { element: this })(src);

    // 初始化后锁定 src：实例属性遮蔽原型反射属性，后续赋值在严格模式下抛错
    Object.defineProperty(this, "src", {
      configurable: true,
      value: src,
    });
  }

  connectedCallback() {
    // root 供消费方定位所属文档或 shadow 根
    const event = new CustomEvent("connected");
    event.root = this._root = this.getRootNode();
    this.dispatchEvent(event);
  }

  disconnectedCallback() {
    // css 处理器依赖 disconnected 事件清理注入的 <link>
    const event = new CustomEvent("disconnected");
    event.root = this._root;
    delete this._root;
    this.dispatchEvent(event);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      // 升级已有元素时会以 (name, null, value) 重放回调，
      // 这正是解析器创建的 <l-m src="..."> 的初始化入口
      if (newValue && oldValue === null) {
        this.#init();
      } else if (this.#initSrc && oldValue && newValue !== this.#initSrc) {
        // 初始化后不允许换 src：回写原值并抛错，保证已加载内容与地址一致
        this.setAttribute("src", this.#initSrc);

        throw err(
          "change_lm_src",
          `The "src" of <${this.tagName.toLowerCase()}> cannot be changed after initialization`
        );
      }
    } else if (name === "pause" && newValue === null) {
      // pause 被移除时，补做被延迟的初始化
      this.#init();
    }
  }
}

// 同一自定义元素构造器只能注册一次，<l-m> 通过空子类复用全部行为
class LM extends LoadModule {}

const register = () => {
  customElements.define("load-module", LoadModule);
  customElements.define("l-m", LM);
};

// 文档尚未加载完成时等待 load，避免与解析中的 DOM 竞争
if (document.readyState === "complete") {
  register();
} else {
  window.addEventListener("load", register);
}
