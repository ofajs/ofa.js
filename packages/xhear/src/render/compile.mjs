/**
 * 模板编译器：把模板 HTML 一次性编译成"绑定描述符"。
 *
 * 设计核心：**编译一次、实例化万次**。注册期对模板做一次纯 DOM 遍历，
 * 产出路径化的绑定描述符（binder，含预编译的共享表达式函数）挂在模板
 * 上（template.__xt）；实例渲染期只需 content.cloneNode(true) + 按路径
 * 取节点。旧管线每个实例要重新解析 innerHTML、重新 new Function、重新
 * JSON.parse 指令表，fill 类场景（千项列表）的实例化开销主要是这三样。
 *
 * 全程纯 DOM 操作、零 innerHTML 序列化往返：旧版靠序列化 + 正则做
 * {{}} 拆分，序列化会把 & 转义成 &amp;（&& 表达式必炸），且每种包装
 * 都要重新解析字符串——这里全部改为节点移动，问题从根上不存在。
 *
 * convert(template) 的管线（顺序敏感，不可调换）：
 *  0. replace-temp 解包 —— 编译期就是 DOM 操作，table/select 的解析器
 *     位置限制已不存在，把内容移回原位即可，运行时机制随之退役；
 *  1. code 标签保护 —— 摘走 code 内容（元素引用直接留表，不需要按
 *     属性回查），其中的示例语法不被编译；
 *  2. {{expr}} 文本预分裂 —— 文本节点拆成 [文本, 空标记节点, 文本…]，
 *     标记节点就是渲染目标本身（路径即定位），不再需要占位元素换入换出；
 *  3. 自身带 name 属性 → 登记为命名模板并从树中摘除（供 x-fill 按名
 *     引用）；多子元素时包一层 display:contents 的 div；
 *  4. 匿名 x-fill（无 name 且有内容）→ 生成随机名，把内容移进
 *     <template name=tid>，fill 元素自命名，运行时按名取模板；
 *  5. x-if / x-else-if / x-else → 内容移进 <template condition>；
 *  6. 递归编译：content 内所有 template 子孙逐个 convert()；命名模板
 *     在这一步收集进 temps 并从树中摘除，重名抛错；
 *  7. 绑定描述符 —— 遍历 content 子树（childNodes 索引定位），登记
 *     文本标记 / 属性指令 / 样式 data() 三类 binder，表达式在此编译
 *     一次（旧版是每个实例每个绑定各编译一次）。
 *
 * binder 结构（render 消费的稳定契约）：
 *   { t:"text",  path, expr, fn }                          文本插值
 *   { t:"style", path, origin, items:[{dataExpr, fn}] }    样式 data()
 *   { t:"bind",  path, actions:[{name, items:[{key, expr, fn}]}] } 指令
 * path 以 content.childNodes 的索引为基准；实例克隆后结构不变，
 * 写入只发生在节点内容上，路径永远有效。
 */
import { getRandomId } from "../../../stanz/src/public.mjs";
import { getErr } from "../error.mjs";
import { renderExtends } from "./render.mjs";
import { compileExpr } from "./expr.mjs";

// XML 保留命名空间前缀：xmlns:xlink、xlink:href、xml:space 这类属性
// 是命名空间声明，不是模板指令（SVG 场景的修复）
const nsAttrPrefixes = new Set(["xmlns", "xml", "xlink"]);

/**
 * 条件模板注册表：xt-src 标记 → 编译原件。
 * 实例克隆携带属性但不携带 JS 属性（__xt），运行时按标记取回原件，
 * 不依赖渲染循环的处理顺序（x-if 的 init 级联可能早于绑定阶段）。
 */
export const xtRegistry = new Map();

const DIRECTIVE_RE = /(.*):(.+)/;
const STYLE_DATA_RE = /data\(.+?\)/g;

/** 在 template.content 内查询元素（可选逐个执行回调） */
const searchTemp = (template, expr, func) => {
  const rearr = Array.from(template.content.querySelectorAll(expr));

  if (func) {
    rearr.forEach(func);
  }

  return rearr;
};

/** 把一个元素的内容整体搬进另一个元素/片段（保持顺序，纯 DOM 移动） */
const moveChildren = (from, to) => {
  // 两端都要归一化：template 元素的内容在 content 片段里，
  // 光子层（firstChild/childNodes）不承载内容，append 也不写入 content
  const src = from.tagName === "TEMPLATE" ? from.content : from;
  const dst = to.tagName === "TEMPLATE" ? to.content : to;

  while (src.firstChild) {
    dst.append(src.firstChild);
  }
};

/** replace-temp 解包：内容原位展开，元素移除；反复执行直到清干净 */
const unwrapReplaceTemps = (template) => {
  while (true) {
    const temps = searchTemp(template, 'template[is="replace-temp"]');

    if (!temps.length) {
      return;
    }

    for (const el of temps) {
      const parent = el.parentNode;

      if (!parent) {
        continue;
      }

      const frag = document.createDocumentFragment();
      moveChildren(el, frag);
      parent.insertBefore(frag, el);
      el.remove();
    }
  }
};

/**
 * {{expr}} 文本预分裂：文本节点拆成 [文本, 空标记, 文本…]
 * （不进入 TEMPLATE 子树，命名模板由递归处理）。
 * 返回 标记节点 → 表达式 的映射，供最终遍历登记 text binder。
 */
const splitInsertionTexts = (parent, markers) => {
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === 3 /* text */) {
      if (!node.data.includes("{{")) {
        continue;
      }

      const parts = node.data.split(/{{([\s\S]+?)}}/g);
      const frag = document.createDocumentFragment();

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // 偶数位是普通文本段（空段丢弃）
          if (parts[i]) {
            frag.append(document.createTextNode(parts[i]));
          }
        } else {
          // 标记用注释节点：表达式原文编码后存入，序列化/重解析可存活
          //（内容保护层的 innerHTML 包裹依赖这一点），渲染不产生输出
          const marker = document.createComment(
            "xt:" + encodeURIComponent(parts[i]),
          );
          markers.set(marker, parts[i]);
          frag.append(marker);
        }
      }

      node.replaceWith(frag);
    } else if (node.nodeType === 1 && node.tagName !== "TEMPLATE") {
      splitInsertionTexts(node, markers);
    }
  }
};

/** 提取元素上的属性指令，返回有序动作数组（不影响 DOM 结构） */
const extractDirectives = (el) => {
  const obj = {};

  Array.from(el.attributes).forEach((attr) => {
    const matchData = DIRECTIVE_RE.exec(attr.name);

    if (!matchData) {
      return;
    }

    let [, actionName, param0] = matchData;

    if (nsAttrPrefixes.has(actionName)) {
      return;
    }

    if (!actionName) {
      actionName = "prop";
    }

    const targetActions = obj[actionName] || (obj[actionName] = []);

    targetActions.push([param0, attr.value]);

    el.removeAttribute(attr.name);
  });

  // JSON 键序即动作序，展开为有序数组
  return Object.keys(obj).map((name) => ({ name, items: obj[name] }));
};

/** 预编译样式里的 data(expr)（旧版在渲染期对每个实例重新正则 + 编译） */
const compileStyleItems = (origin) => {
  const items = [];
  for (const dataExpr of new Set(origin.match(STYLE_DATA_RE) || [])) {
    const expr = dataExpr.replace(/data\((.+)\)/, "$1");
    items.push({ dataExpr, expr, fn: compileExpr(expr) });
  }
  return items;
};

/**
 * 最终遍历：登记绑定描述符。
 * path 以 content.childNodes 的索引为基准；标记节点按编译期留存的
 * 引用识别（节点引用跨 DOM 移动有效）。
 */
const buildBinders = (parent, path, binders, markers) => {
  const nodes = parent.childNodes;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const childPath = path.concat(i);

    if (node.nodeType === 8 /* comment */) {
      // xt: 前缀的注释节点是文本插值标记
      if (node.data.startsWith("xt:")) {
        const expr = decodeURIComponent(node.data.slice(3));
        binders.push({ t: "text", path: childPath, expr, fn: compileExpr(expr) });
      }
      continue;
    }

    if (node.nodeType !== 1) {
      continue;
    }

    if (node.tagName === "TEMPLATE") {
      // 嵌套模板由递归 convert 负责（否则会二次处理）
      continue;
    }

    if (node.tagName === "STYLE") {
      const origin = node.innerHTML;
      const items = compileStyleItems(origin);

      if (items.length) {
        binders.push({ t: "style", path: childPath, origin, items });
      }
      continue;
    }

    const actions = extractDirectives(node);

    if (actions.length) {
      binders.push({
        t: "bind",
        path: childPath,
        actions: actions.map((action) => ({
          name: action.name,
          items: action.items.map(([key, expr]) => ({
            key,
            expr,
            fn: compileExpr(expr),
          })),
        })),
      });
    }

    buildBinders(node, childPath, binders, markers);
  }
};

/**
 * 编译一个模板元素：产出 temps（命名模板集合）并在模板上挂
 * __xt 绑定描述符。convert 是它的对外别名（$ API 兼容）。
 */
export const compileTemplate = (template, markers = new Map()) => {
  let temps = {};
  const codeEls = [];
  // 多子元素警告每次编译只提示一次，避免反复刷屏
  let isWarned = false;

  // markers 映射必须整棵编译树共享：{{}} 预分裂发生在根级（fill/条件
  // 内容当时还不是 template），标记节点随后随 DOM 移动进入子模板，
  // 子模板的最终遍历要靠同一张映射才能识别它们

  renderExtends.beforeConvert({
    template,
  });

  // 0. replace-temp 解包
  unwrapReplaceTemps(template);

  // 1. code 标签保护：内容摘走（引用留表，恢复时无需回查），
  //    跳过已被外层保护过的 code，防止嵌套模板递归编译时置空丢失
  searchTemp(template, "code:not([code-id])", (code) => {
    code.setAttribute("code-id", "");
    codeEls.push({ el: code, html: code.innerHTML });
    code.innerHTML = "";
  });

  // 2. {{expr}} 文本预分裂（纯 DOM，不进入 TEMPLATE 子树）
  splitInsertionTexts(template.content, markers);

  // 3. 命名模板：登记并从树中摘除；多子元素时包一层 display:contents 的 div
  const tempName = template.getAttribute("name");

  if (tempName) {
    const tempChilds = template.content.children;
    if (tempChilds.length > 1) {
      if (!isWarned) {
        const err = getErr("temp_multi_child");
        console.warn(err, {
          content: template.content,
        });
        isWarned = true;
      }

      const wrapName = `wrapper-${tempName}`;
      const wrapDiv = document.createElement("div");
      wrapDiv.setAttribute(wrapName, "");
      wrapDiv.style.display = "contents";
      moveChildren(template.content, wrapDiv);
      template.content.append(wrapDiv);
      console.warn(
        getErr("temp_wrap_child", {
          tempName,
          len: tempChilds.length,
          wrapName,
        }),
      );
    }
    temps[tempName] = template;
    template.remove();
  }

  // 4. 匿名 x-fill：生成随机名自命名，内容移进同名模板
  searchTemp(template, "x-fill:not([name])", (fillEl) => {
    if (fillEl.querySelector("x-fill:not([name])")) {
      throw getErr("xhear_dbfill_noname");
    }

    if (fillEl.textContent.trim() || fillEl.children.length) {
      const tid = `t${getRandomId()}`;
      fillEl.setAttribute("name", tid);

      const temp = document.createElement("template");
      temp.setAttribute("name", tid);
      moveChildren(fillEl, temp);
      fillEl.append(temp);
    }
  });

  // 5. 条件组件：内容移进 template[condition]，并注册编译原件
  searchTemp(template, "x-if,x-else-if,x-else", (condiEl) => {
    const firstChild = condiEl.children[0];
    if (!firstChild || firstChild.tagName !== "TEMPLATE") {
      const condTemp = document.createElement("template");
      condTemp.setAttribute("condition", "");
      moveChildren(condiEl, condTemp);
      condiEl.append(condTemp);
    }

    const condTemp = condiEl.children[0];
    const srcId = getRandomId();
    condTemp.setAttribute("xt-src", srcId);
    xtRegistry.set(srcId, condTemp);
  });

  // 6. 递归编译全部后代模板（命名模板在此收集合并）
  searchTemp(template, "template", (e) => {
    const newTemps = compileTemplate(e, markers);

    Object.keys(newTemps).forEach((name) => {
      if (temps[name]) {
        throw getErr("xhear_temp_exist", {
          name,
        });
      }
    });

    temps = { ...temps, ...newTemps };
  });

  // 6.5 afterConvert 钩子：结构变换必须先于描述符构建（路径依赖结构）
  renderExtends.afterConvert({
    template,
    temps,
  });

  // 7. 绑定描述符
  const binders = [];
  buildBinders(template.content, [], binders, markers);
  template.__xt = binders;


  // 恢复 code 内容（元素引用跨移动有效，直接回填）
  for (const { el, html } of codeEls) {
    el.removeAttribute("code-id");
    el.innerHTML = html;
  }

  return temps;
};

/** $ API 兼容出口：编译模板，返回命名模板集合 */
export const convert = compileTemplate;
