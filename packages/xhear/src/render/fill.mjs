/**
 * 列表渲染：o-fill（light DOM 版，唯一实现，列表项直接作为子元素渲染）。
 *
 * 支持两种模板来源：`name` 属性引用宿主的命名模板；未声明 name 时使用
 * 元素自身内容（编译期被 wrapTemp 包进 template[inner-code] 保护，首次
 * 渲染时按需编译并全局缓存）。列表项数据上下文为 $data/$index/$host/
 * $parent，与命名模板引用一致。
 *
 * 更新采用基于 key 的对账（fill-key 或 xid 或引用）：存在则复用 DOM
 * 并更新 $data/$index，缺失则删除，新增则插入。
 */
import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { getRenderData } from "./condition.mjs";
import { getCompiledContent } from "./inner-code.mjs";
import { createXEle, eleX, revokeAll } from "../util.mjs";
import Stanz from "../../../stanz/src/main.mjs";
import { removeArrayValue } from "../public.mjs";
import { getErr } from "../error.mjs";
import { getType } from "../../../stanz/src/public.mjs";

register({
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
        // 没有值或模板来源已切换，清空内容
        Array.from(this.ele.childNodes).forEach((e) => {
          revokeAll(e);
          e.remove();
        });
        return;
      }

      if (!(arr instanceof Array)) {
        // 非数组值：告警并清空（如字符串恰好带 length，不能当列表用）
        console.warn(getErr("fill_type", { type: getType(arr) }));

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

        // 不存在的 id，需要删除
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

      // 列表变更后唤醒父级监听（shadow 级订阅如 formData 依赖此约定）
      const { parentNode } = selfEl;
      if (parentNode) {
        eleX(parentNode).refresh();
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

    // 多根检测：直接数 template.content 的根节点——template 内容不受解析器
    // 位置限制，tr/option 等受限位置的内容原样保留。不能套 div 探测：解析器
    // 会把 div 里的 tr 整体丢弃、只留下浮的注释标记，造成"多根"误判
    const probeTemp = document.createElement("template");
    probeTemp.innerHTML = originHTML;
    const probeContent = probeTemp.content;

    const rootCount = probeContent.children.length;
    const hasStrayText = Array.from(probeContent.childNodes).some(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );

    if (rootCount > 1 || (rootCount === 0 && hasStrayText)) {
      // 多根时包一层 display:contents 的容器，保证列表项为单根
      // （注意：多根的表格行内容无法用 div 包裹，需在模板里自行包一层）
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

/**
 * 为 o-fill 渲染创建列表项元素。
 *
 * @param {Object} $data - 列表项的数据对象
 * @param {Object} temps - 宿主可用的全部命名模板
 * @param {HTMLTemplateElement} targetTemp - 本列表项使用的模板
 * @param {Object} $host - 宿主数据（o-fill 所在组件实例），$host 供模板引用
 * @param {number} $index - 列表项索引
 * @param {string} keyName - 对账键名
 * @param {Object} $parent - 父级数据（上层 o-fill 嵌套时由外部传入）
 * @returns {Object} 列表项的 Xhear 实例（__item 上挂绑定数据）
 */
export const createItem = (
  $data,
  temps,
  targetTemp,
  $host,
  $index,
  keyName,
  $parent,
) => {
  // 编译过的模板走克隆 + 描述符绑定（每项 innerHTML 解析已废）
  const binders = targetTemp && targetTemp.__xt;
  let $ele;
  let bindRoot;
  let baseIndex = 0;

  if (binders) {
    const frag = targetTemp.content.cloneNode(true);
    const rootEle = frag.children[0] || frag.firstChild;
    $ele = eleX(rootEle);
    bindRoot = frag;
    // 索引必须相对 frag 自身的 childNodes 求（rootEle 是克隆节点，
    // 在原 content 里查不到，会得到 -1 使全部绑定被跳过）
    baseIndex = Array.prototype.indexOf.call(frag.childNodes, rootEle);
  } else {
    $ele = createXEle(targetTemp.innerHTML);
  }

  const itemData = new Stanz({
    $data,
    $host,
    $index,
  });

  // $ele 若成为 item 的子属性，其内自定义组件的改动会反向冒泡，
  // 导致列表内元素不停重渲染的死循环；故 $ele 只读且不入观察
  Object.defineProperties(itemData, {
    $ele: {
      get() {
        return $ele;
      },
    },
  });

  if ($parent) {
    itemData.$parent = $parent;
  }

  render({
    target: $ele.ele,
    data: itemData,
    temps,
    binders,
    bindRoot,
    baseIndex,
    isRenderSelf: true,
  });

  // 项销毁时连带撤销 itemData，断开对源数据的引用
  const revokes = $ele.ele.__revokes;

  const revoke = () => {
    removeArrayValue(revokes, revoke);
    itemData.revoke();
  };

  revokes.push(revoke);

  $ele.__item = itemData;
  $ele.ele._data_xid = $data?.[keyName] || $data;

  return $ele;
};
