/**
 * 条件渲染：x-if / x-else-if / x-else。
 *
 * x-if 先把相邻的条件组件整体替换为 FakeNode 区间并触发一次渲染；
 * 之后每次 value 变化重走渲染流程：
 * 1. 以首个 x-if 为头，收集其后相邻的 x-else-if / x-else（_others）；
 *    x-else-if 反向持有头节点（_xif），值变化时委托头节点统一重判；
 * 2. 重判异步执行（setTimeout 0 合并同拍的多次变更）：
 *    从头到尾找到第一个满足条件（value 为真或 x-else）的组件渲染其内容，
 *    其余组件清空内容，保证同链同时只有一个分支存活。
 *
 * 组件初始化依赖 render 的就绪握手：等 _bindingRendered（或
 * binding-rendered 事件）后才 init —— 此时自身 :value 绑定已生效。
 */
import { dataRevoked } from "../../../stanz/src/public.mjs";
import { register } from "../register.mjs";
import { eleX, revokeAll } from "../util.mjs";
import { FakeNode } from "./fake-node.mjs";
import { render } from "./render.mjs";
import { xtRegistry } from "./compile.mjs";

const regOptions = {
  data: {
    value: null,
    __rendered: false,
  },
  watch: {
    value() {
      if (!this._bindend) {
        return;
      }

      this.refreshValue();
    },
  },
  proto: {
    /** 重新裁决条件链：合并短时间内的连续变更，只做一次判断 */
    refreshValue() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        const conditions = [this, ...this._others];

        let isOK = false;

        conditions.forEach((conditionEl) => {
          if (isOK) {
            // 前面已有命中的分支，后续分支一律清空
            conditionEl._clearContent();
            return;
          }

          if (conditionEl.value || conditionEl.tag === "x-else") {
            isOK = true;
            conditionEl._renderContent();
          } else {
            conditionEl._clearContent();
          }
        });
        if (this._fake.parentNode) {
          eleX(this._fake.parentNode).refresh();
        }
      }, 0);
    },
    _renderContent() {
      if (this.__rendered) {
        return;
      }
      this.__rendered = true;

      const result = getRenderData(this._fake);

      if (!result) {
        return;
      }

      const { target, data, temps } = result;

      if (dataRevoked(data)) {
        return;
      }

      // 编译原件走克隆 + 描述符绑定（渲染期零解析零编译）
      const conditionTemp = this.__conditionCompiled;
      let binders;

      if (conditionTemp) {
        // FakeNode.appendChild 把片段 children 插入区间（append 方法不存在）
        this._fake.appendChild(conditionTemp.content.cloneNode(true));
        binders = conditionTemp.__xt;
      } else {
        this._fake.innerHTML = this.__originHTML;
      }

      render({
        target,
        data,
        temps,
        binders,
        bindRoot: binders ? this._fake : undefined,
      });

      this.emit("rendered", {
        bubbles: false,
      });
    },
    _clearContent() {
      if (!this.__rendered) {
        return;
      }

      this.__rendered = false;

      // 释放区间内全部副作用后清空
      this._fake?.childNodes?.forEach((el) => revokeAll(el));
      this._fake.innerHTML = "";

      this.emit("clear", {
        bubbles: false,
      });
    },
    init() {
      if (this._bindend) {
        return;
      }

      this._bindend = true;
      const fake = (this._fake = new FakeNode(this.tag));

      // 组件本体的撤销登记移交给 FakeNode，内容释放走区间
      fake.__revokes = this.ele.__revokes;
      this.before(fake);
      fake.init();
      this.remove();

      // x-if 负责向后收集 else-if / else，组成条件链
      if (this.tag === "x-if") {
        const others = (this._others = []);

        let next = fake;
        while (true) {
          next = next.nextElementSibling;

          if (!next || next.tagName == "X-IF") {
            // 又遇到 x-if 说明本链结束（后一个 if 是新链的头）
            break;
          }

          switch (next.tagName) {
            case "X-ELSE": {
              const $el = eleX(next);
              if ($el.init) {
                $el.init();
              } else {
                $el._if_ready = 1;
              }

              others.push($el);
              return;
            }
            case "X-ELSE-IF": {
              const $el = eleX(next);

              // else-if 的值变化委托给链头统一裁决
              $el._xif = this;

              others.push($el);
              break;
            }
            default:
              break;
          }
        }
      }
    },
  },
  created() {
    // 元素可能先于子内容构造（如 createElement 或第三方库 cloneNode），
    // 此时 template[condition] 不存在，需要回退到自身内容
    const conditionTemp = this.$("template[condition]");
    this.__conditionTemp = conditionTemp ? conditionTemp.ele : null;
    // 编译原件按 xt-src 标记取回（克隆携带属性但不携带 __xt 这类 JS 属性）
    this.__conditionCompiled =
      this.__conditionTemp
        ? xtRegistry.get(this.__conditionTemp.getAttribute("xt-src"))
        : null;
    this.__originHTML = conditionTemp ? conditionTemp.html : this.html;
    this.html = "";
  },
  ready() {
    // 等待自身 :value 绑定生效后再初始化
    if (this.ele._bindingRendered) {
      this.init();
    } else {
      this.one("binding-rendered", () => this.init());
    }
  },
};

register({
  tag: "x-if",
  ...regOptions,
});

register({
  tag: "x-else-if",
  ...regOptions,
  watch: {
    value() {
      if (!this._bindend) {
        return;
      }

      // else-if 自身不裁决，委托链头
      if (this._xif) {
        this._xif.refreshValue();
      }
    },
  },
});

register({
  tag: "x-else",
  ...regOptions,
  watch: {},
  ready() {
    // 被链头收集时（_if_ready）才自行初始化
    if (this._if_ready) {
      this.init();
    }
  },
});

/**
 * 从目标节点向上找最近的渲染宿主（带 __render_data 的节点），
 * 返回 { target, data, temps }；x-if/x-fill 的内容渲染数据来源于此。
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
