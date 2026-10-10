/**
 * 列表渲染：x-fill。
 *
 * 首次渲染按模板整建列表项；之后 value 变化走基于 key 的对账：
 * 1. 计算新数组的 key 集合（fill-key 指定键名，默认 xid；基础类型项以
 *    自身为 key），预先删除已不存在的项；
 * 2. 从 FakeNode 区间头（_start 注释）向后走，逐位比对新旧序列：
 *    key 已存在 → 移位复用已有 DOM 并更新 $data/$index；
 *    key 不存在 → 现场创建插入；
 * 3. 收尾清理多余项，刷新宿主并派发 rendered 事件。
 *
 * 数据项内部变化（如 item.name 改了）不触发对账 —— 变更路径深度 > 1
 * 时由项内绑定自行修正（watchers 短路）；只有数组本身的增删或整体
 * 替换（路径深度 ≤ 1）才走对账。
 */
import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { FakeNode } from "./fake-node.mjs";
import Stanz from "../../../stanz/src/main.mjs";
import { createXEle, eleX, revokeAll } from "../util.mjs";
import { removeArrayValue } from "../public.mjs";
import { getRenderData } from "./condition.mjs";
import { getErr } from "../error.mjs";
import { getType } from "../../../stanz/src/public.mjs";

register({
  tag: "x-fill",
  data: {
    value: null,
  },
  watch: {
    value(value, t) {
      this.refreshValue(t?.watchers);
    },
  },
  proto: {
    refreshValue(watchers) {
      const arrayData = this.value;

      if (!this._bindend) {
        return;
      }

      const childs = this._fake.children;

      if (!arrayData) {
        childs.forEach((e) => revokeAll(e));
        this._fake.innerHTML = "";
        return;
      }

      if (!(arrayData instanceof Array)) {
        console.warn(
          getErr("fill_type", {
            type: getType(arrayData),
          }),
        );

        childs &&
          childs.forEach((el) => {
            revokeAll(el);
            el.remove();
          });
        return;
      }

      const regData = getRenderData(this._fake);

      if (!regData) {
        return;
      }

      const { data, temps } = regData;

      const targetTemp = temps[this._name];


      const keyName = this.attr("fill-key") || "xid";

      if (!childs.length) {
        // 首建：按模板逐项创建后一次性挂载
        const frag = document.createDocumentFragment();

        arrayData.forEach((e, i) => {
          const $ele = createItem(
            e,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName,
          );
          frag.appendChild($ele.ele);
        });

        this._fake.appendChild(frag);
      } else {
        if (watchers) {
          const isReplaced = watchers.some((e) => e.path.length <= 1);

          if (!isReplaced) {
            // 数据项内部的变化，由项内绑定自行修正，不走对账
            return;
          }
        }

        const vals = arrayData.slice();
        const valsKeys = new Set(
          vals.map((e) => {
            if (!e) {
              return;
            }

            const val = e[keyName];
            return val === undefined ? e : val;
          }),
        );

        const { parentNode } = this._fake;

        if (keyName !== "xid" && vals.length !== valsKeys.size) {
          // 默认 xid 模式不校验（对象可能没有 xid，以对象自身为 key）
          const err = getErr("fill_key_duplicates");
          console.error(err);
          console.warn(err, {
            parentNode,
            host: eleX(parentNode)?.host?.ele,
          });
        }

        // 预删除已不存在的项（先删能让后续移位计算更简单）
        const positionKeys = [];
        for (let i = 0, len = childs.length; i < len; i++) {
          const e = childs[i];
          const key = e._data_xid || e;

          if (!valsKeys.has(key)) {
            revokeAll(e);
            e.remove();
            childs.splice(i, 1);
            len--;
            i--;
          } else {
            positionKeys.push(key);
          }
        }

        // 从区间头开始逐位对账
        let target = this._fake._start;

        const needRemoves = [];

        let count = 0;

        while (target) {
          if (target === this._fake) {
            if (vals.length) {
              // 已走到区间尾，剩余项全部追加到末尾
              vals.forEach((item) => {
                const $ele = createItem(
                  item,
                  temps,
                  targetTemp,
                  data.$host || data,
                  count,
                  keyName,
                );

                count++;

                parentNode.insertBefore($ele.ele, target);
              });
            }
            break;
          }
          if (!(target instanceof Element)) {
            target = target.nextSibling;
            continue;
          }
          const currentVal = vals.shift();
          const isObj = currentVal instanceof Object;
          const $tar = eleX(target);
          const item = $tar.__item;

          if (currentVal === undefined && !vals.length) {
            // 新数组已耗尽，剩余旧项记录待删
            needRemoves.push(target);
            target = target.nextSibling;
            continue;
          }

          const oldId = positionKeys.indexOf(
            isObj ? currentVal[keyName] : currentVal,
          );
          if (oldId > -1) {
            // key 已存在：把对应旧项移位过来并更新绑定数据
            const oldItem = childs[oldId];
            if (
              isObj
                ? currentVal[keyName] !== item.$data[keyName]
                : currentVal !== item.$data
            ) {
              oldItem.__internal = 1;
              parentNode.insertBefore(oldItem, target);
              delete oldItem.__internal;
              target = oldItem;
            }

            // 复用 DOM，仅换绑数据与索引
            const $old = eleX(oldItem);
            if ($old.__item.$data !== currentVal) {
              $old.__item.$data = currentVal;
            }
            $old.__item.$index = count;
          } else {
            // 新项：现场创建插入
            const $ele = createItem(
              currentVal,
              temps,
              targetTemp,
              data.$host || data,
              count,
              keyName,
            );

            parentNode.insertBefore($ele.ele, target);
            target = $ele.ele;
          }

          count++;
          target = target.nextSibling;
        }

        if (needRemoves.length) {
          needRemoves.forEach((e) => {
            revokeAll(e);
            e.remove();
          });
        }
      }

      if (this._fake.parentNode) {
        eleX(this._fake.parentNode).refresh();
      }

      this.emit("rendered", {
        bubbles: false,
      });
    },
    init() {
      if (this._bindend) {
        return;
      }

      this._bindend = true;
      const fake = (this._fake = new FakeNode("x-fill"));

      // 组件本体的撤销登记移交给 FakeNode，内容释放走区间
      fake.__revokes = this.ele.__revokes;

      this.before(fake);
      fake.init();
      this.remove();

      this.refreshValue();
    },
  },
  ready() {
    this._name = this.attr("name");

    if (!this._name) {
      const err = getErr("xhear_fill_tempname", { name: this._name });
      console.warn(err, this.ele);
      throw err;
    }

    // 等待自身 :value 绑定生效后再初始化
    if (this.ele._bindingRendered) {
      this.init();
    } else {
      this.one("binding-rendered", () => this.init());
    }
  },
});

/**
 * 为 x-fill 渲染创建列表项元素。
 *
 * @param {Object} $data - 列表项的数据对象
 * @param {Object} temps - 宿主可用的全部命名模板
 * @param {HTMLTemplateElement} targetTemp - 本列表项使用的模板
 * @param {Object} $host - 宿主数据（x-fill 所在组件实例），$host 供模板引用
 * @param {number} $index - 列表项索引
 * @param {string} keyName - 对账键名
 * @param {Object} $parent - 父级数据（上层 o-fill 嵌套时由 ofa 传入）
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
  // 编译过的模板走克隆 + 描述符绑定（旧版每项 innerHTML 解析已废）
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
  // 导致 x-fill 内元素不停重渲染的死循环；故 $ele 只读且不入观察
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
