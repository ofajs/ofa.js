/**
 * 列表渲染：o-fill（light DOM 版，唯一实现，列表项直接作为子元素渲染）。
 *
 * 支持两种模板来源：`name` 属性引用宿主的命名模板；未声明 name 时使用
 * 元素自身内容（编译期被 wrapTemp 包进 template[inner-code] 保护，首次
 * 渲染时按需编译并全局缓存）。列表项数据上下文为 $data/$index/$host/
 * $parent，与命名模板引用一致。
 *
 * 更新采用基于 key 的对账（fill-key 或 xid 或引用）+ LIS 最小移动：
 * 复用项只换绑 $data/$index，缺失则删除，新增则插入，乱序部分按最长
 * 递增子序列保证每个元素至多移动一次。触发面上只有 value 的结构变更
 * （整体替换、数组增删/重排/换元素）才整表对账；item 内部变更由行内
 * 绑定任务直接订阅数据本体粒度消化，且按编译期依赖分析（analyzeDeps）
 * 过滤：item 直写属性只重跑依赖命中的绑定，深层/结构/未知事件通配。
 *
 * 行上下文是轻量对象（$data/$index/$host/$parent/$ele），不再是每行一个
 * Stanz：变更订阅经 __watchTargets/__watchRoles 挂到数据本体与
 * $host/$parent 上（见 render 的对接面 __rerun/__untick/__retick），
 * $index 仅在模板真正引用它时才回写（usesIndex 扫描）。
 */
import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { getRenderData } from "./condition.mjs";
import { getCompiledContent } from "./inner-code.mjs";
import { createXEle, eleX, revokeAll } from "../util.mjs";
import { getErr } from "../error.mjs";
import { getType } from "../../../stanz/src/public.mjs";

/**
 * LIS（最长递增子序列）：入参为新序列到旧元素的映射（null = 新建项），
 * 返回无需移动的新序列下标数组。patience 算法 + 前驱回溯，O(n log n)。
 */
const getSequence = (reused) => {
  const p = [];
  const seq = [];

  for (let i = 0; i < reused.length; i++) {
    const found = reused[i];

    if (!found) {
      continue;
    }

    const val = found.index;
    const last = seq[seq.length - 1];

    if (last === undefined || reused[last].index < val) {
      p[i] = last === undefined ? -1 : last;
      seq.push(i);
    } else {
      // 二分找 seq 中最后一个 index < val 的槽位替换
      let lo = 0;
      let hi = seq.length - 1;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (reused[seq[mid]].index < val) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      if (reused[seq[lo]].index > val) {
        p[i] = lo > 0 ? seq[lo - 1] : -1;
        seq[lo] = i;
      }
    }
  }

  // 回溯还原下标链
  const res = new Array(seq.length);
  let cursor = seq.length - 1;
  let idx = seq[cursor];

  while (cursor >= 0) {
    res[cursor] = idx;
    cursor--;
    idx = p[idx];
  }

  return res;
};

/**
 * 模板是否引用 $index（含文本标记里的编码形态 %24index）。
 * 逐位对账后 $index 普遍变化，绝大多数行模板并不消费它——不消费就
 * 跳过写入，避免触发行任务的无效重跑。命名模板也扫：行内嵌套模板
 * 可能经命名模板引用外层 $index。
 */
const usesIndex = (targetTemp, temps) => {
  let html = targetTemp.innerHTML;
  for (const name in temps) {
    html += temps[name].innerHTML;
  }
  return html.includes("$index") || html.includes("%24index");
};

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

      // 无渲染宿主（如已渲染元素的 cloneNode 克隆体：升级了但没有
      // 渲染上下文，却可能因复制到的数据引用收到结构事件）——无法解析
      // 模板与 temps，直接跳过；真正接入渲染流时 attached 会重新触发
      const rd = getRenderData(this.ele);

      if (!rd) {
        return;
      }

      const { data, target, temps = {} } = rd;
      const keyName = this.attr("fill-key") || "xid";

      let targetTemp = temps[tempName];

      if (!targetTemp) {
        // 未声明 name 或找不到命名模板时，使用自身内容（编译缓存）
        if (this.__originHTML) {
          targetTemp = getCompiledContent(this.__originHTML, this.__originEl);
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

      const selfEl = this.ele;

      // 旧子元素按 key 建索引（首现优先；重复 key 只复用一次，
      // 第二个实例走新建，避免两个位置争抢同一元素）。
      // 直接迭代 live children，免去每次对账的数组拷贝
      const oldChildren = selfEl.children;
      const oldByKey = new Map();

      for (let i = 0, len = oldChildren.length; i < len; i++) {
        const el = oldChildren[i];
        const key = getKeyVal(el.__render_data.$data, i);
        if (!oldByKey.has(key)) {
          oldByKey.set(key, { el, index: i });
        }
      }

      // 新序列逐位取复用：取得到旧元素就复用，取不到就新建
      const reused = [];
      for (let i = 0, len = arr.length; i < len; i++) {
        const key = getKeyVal(arr[i], i);
        const found = oldByKey.get(key);

        if (found) {
          oldByKey.delete(key);
          reused.push(found);
        } else {
          reused.push(null);
        }
      }

      // 未被消费的旧元素 = 已删除项
      for (const { el } of oldByKey.values()) {
        el.remove();
        revokeAll(el);
      }

      // 复用项数据对齐：$data 换绑、$index 修正，由行内绑定任务粒度消化
      const indexUsed = usesIndex(targetTemp, temps);

      for (let i = 0, len = arr.length; i < len; i++) {
        const found = reused[i];

        if (!found) {
          continue;
        }

        const $ele = eleX(found.el);
        const item = arr[i];
        const itemCtx = $ele.__item;

        if (itemCtx.$data !== item) {
          itemCtx.$data = item;
          // 换绑订阅到新数据本体并立即重跑（轻量上下文）；新值不可
          // 订阅（原始值）时只重跑一次，后续由结构对账兜底
          if (itemCtx.__retick && item.watchTick) {
            itemCtx.__retick(item);
          } else if (itemCtx.__rerun) {
            itemCtx.__rerun();
          }
        }
        if (indexUsed && itemCtx.$index !== i) {
          itemCtx.$index = i;
          itemCtx.__rerun && itemCtx.__rerun();
        }
      }

      // 免移动快速通道：无新增且旧位置整体递增（如批量删除、原地过滤）
      // 时连 LIS 都不必算
      let needMoves = false;
      let prevIndex = -1;
      for (const found of reused) {
        if (!found || found.index <= prevIndex) {
          needMoves = true;
          break;
        }
        prevIndex = found.index;
      }

      if (needMoves) {
        // LIS 最小移动：旧位置的最长递增子序列原地不动，其余元素各移动
        // 一次；从右往左以锚点落位（与 Vue 3 / inferno 同族算法），
        // 取代逐位对账——后者一次交换会级联约 n/2 次 DOM 移动
        const lis = new Set(getSequence(reused));

        let anchor = null;
        for (let i = arr.length - 1; i >= 0; i--) {
          const found = reused[i];
          let el;

          if (found) {
            if (lis.has(i)) {
              anchor = found.el;
              continue;
            }
            el = found.el;
          } else {
            el = createItem(
              arr[i],
              temps,
              targetTemp,
              data.$host || data,
              i,
              keyName,
              this._$parent,
            ).ele;
          }

          // 免插入检查只对已挂载的复用元素成立；新建元素是 detached 的
          // （nextSibling 恒为 null），必须无条件插入
          if (!found || el.nextSibling !== anchor) {
            selfEl.insertBefore(el, anchor);
          }
          anchor = el;
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
    this.watchTick((watchers) => {
      // 只有 value 的结构变更（整体替换、数组增删/重排/换元素）才整表
      // 对账。结构判定依据 stanz 事件形态：数组方法与索引赋值的 target
      // 就是 value 数组，整体替换的 target 是 o-fill 自身（name="value"）；
      // item 内部变更的 target 是 item，跳过后由行内绑定任务粒度刷新。
      const structural = watchers.some(
        (w) =>
          (w.target === w.currentTarget && w.name === "value") ||
          w.target === w.currentTarget.value,
      );

      if (structural) {
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
      // 保留元素引用：首次编译优先从元素搬运内容（表格位置的内容不可
      // 字符串重解析，见 getCompiledContent）；内容随后被清掉。
      // this[0] 是 xhear 代理，存原生元素避免搬运时语义漂移
      this.__originEl = firstEle.ele;
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
 * @returns {Object} 列表项的 Xhear 实例（__item 上挂轻量行上下文）
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

  // 轻量行上下文：不再每行建 Stanz（省代理与属性定义开销——建表是
  // fill 的最大成本之一）。表达式作用域即普通对象；变更订阅经
  // __watchTargets 直接挂在数据本体上，item 的 _owner 不再出现行
  // 上下文：更新冒泡少一跳，行销毁零残留。$ele 非枚举不混入 with 作用域。
  // 原始值项（字符串/数字）不可订阅：不挂 __watchTargets，行更新由
  // 结构对账兜底。$host/$parent 也在订阅链上（旧 itemData 经所有权
  // 冒泡宿主变更，这里显式订阅保持同一语义）
  const itemData = {
    $data,
    $index,
    $host,
  };

  if ($data && $data.watchTick) {
    itemData.__watchTargets = [$data];
    itemData.__watchRoles = ["item"];
  }
  if ($host && $host.watchTick) {
    (itemData.__watchTargets || (itemData.__watchTargets = [])).push($host);
    (itemData.__watchRoles || (itemData.__watchRoles = [])).push("host");
  }
  if ($parent) {
    itemData.$parent = $parent;
    if ($parent.watchTick) {
      (itemData.__watchTargets || (itemData.__watchTargets = [])).push($parent);
      (itemData.__watchRoles || (itemData.__watchRoles = [])).push("parent");
    }
  }

  Object.defineProperty(itemData, "$ele", {
    value: $ele,
  });

  render({
    target: $ele.ele,
    data: itemData,
    temps,
    binders,
    bindRoot,
    baseIndex,
    isRenderSelf: true,
  });

  // 项销毁时退订数据本体（轻量上下文无所有权边，无需 revoke 级联）
  const revokes = $ele.ele.__revokes;

  const revoke = () => {
    if (revoke.__done) return;
    revoke.__done = true;
    itemData.__untick && itemData.__untick();
  };

  revokes.push(revoke);

  $ele.__item = itemData;
  $ele.ele._data_xid = $data?.[keyName] || $data;

  return $ele;
};
