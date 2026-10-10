/**
 * 渲染编排器：把编译期产出的绑定描述符绑定到具体实例的数据上。
 *
 * 设计核心：**实例期零解析、零编译、零扫描**。
 * - 内容就位用 content.cloneNode(true)（旧版 innerHTML 重解析是实例化
 *   的主要开销之一）；
 * - 描述符按 childNodes 路径直取节点；{{}} 标记是注释节点，绑定时
 *   替换为文本节点（一次性结构变更），其余路径不受影响；
 * - 表达式函数是编译期生成的共享函数，实例期通过 call 注入
 *   { data, errCall }（旧版每个实例每个绑定都 new Function 一次，
 *   always 动作更是每次刷新都重新编译）；
 * - always 动作登记为任务，数据更新（watchTick 防抖）时批量重跑；
 * - 每个副作用登记撤销函数（__revokes 约定），节点树销毁时由
 *   revokeAll 统一执行；
 * - 绑定完成后派发 binding-rendered，x-if/x-fill 等组件据此初始化。
 *
 * 对外保留 renderExtends 四钩子（上层框架捕获重赋介入编译与渲染）与
 * 兼容回退路径（处理未经本版编译器处理的模板/DOM）。
 */
import { getRandomId, dataRevoked } from "../../../stanz/src/public.mjs";
import { isxdata } from "../../../stanz/src/main.mjs";
import stanzProto from "../../../stanz/src/watch.mjs";
import { getErr } from "../error.mjs";
import {
  hyphenToUpperCase,
  isFunction,
  isEmptyObject,
  searchEle,
  removeArrayValue as remove,
  getRenderErrorSupplementary,
} from "../public.mjs";
import { eleX } from "../util.mjs";
import { getPath, setPath } from "../path.mjs";
import { compileExpr } from "./expr.mjs";

/** 模板渲染的扩展钩子：上层框架（ofa.js）捕获重赋以介入编译与渲染 */
export const renderExtends = {
  beforeConvert() {},
  afterConvert() {},
  beforeRender() {},
  render() {},
};

/** 取目标节点上的撤销函数登记表（惰性创建） */
export const getRevokes = (target) => target.__revokes || (target.__revokes = []);

/**
 * 按描述符路径解析节点：path 以编译产物 content.childNodes 的索引为基准。
 * baseIndex > 0 表示渲染根是内容中的某个子节点（如 fill 列表项），
 * 首段必须指向它，其余段相对渲染根解析。
 */
const resolvePath = (root, path, baseIndex) => {
  let node = root;
  let start = 0;

  if (baseIndex) {
    // 渲染根是内容中的某个子节点（如 fill 列表项）：首段必须指向它，
    // 其余段相对渲染根解析
    if (path[0] !== baseIndex) {
      return null;
    }
    node = root.childNodes[baseIndex];
    start = 1;
  }

  for (let i = start; i < path.length; i++) {
    node = node.childNodes[path[i]];
  }
  return node;
};

/** 登记一个撤销函数到指定节点 */
export const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

// convert 与 render 同属渲染底层，re-export 保持
// `import { render, convert } from ".../render/render.mjs"` 的用法可用
export { convert } from "./compile.mjs";

/**
 * 渲染入口。
 *
 * @param {object} opts
 * @param {object} opts.data 渲染数据（stanz 实例）
 * @param {Element|DocumentFragment} opts.target 绑定宿主与数据挂载点
 * @param {HTMLTemplateElement} [opts.template] 编译过的模板：克隆内容到 target
 * @param {Array} [opts.binders] 绑定描述符（缺省回退到全量扫描）
 * @param {Node} [opts.bindRoot] 描述符路径的解析基准（默认克隆片段）
 * @param {number} [opts.baseIndex=0] 渲染根在描述符路径首段的索引
 * @param {object} [opts.temps] 命名模板集合
 * @param {boolean} [opts.isRenderSelf] 回退路径：target 自身含指令时一并处理
 */
export function render({
  data,
  target,
  template,
  temps,
  isRenderSelf,
  binders: bindersOpt,
  bindRoot: bindRootOpt,
  baseIndex = 0,
  ...otherOpts
}) {
  try {
    data.watchTick;
  } catch (e) {
    // data 已经被回收，不需要继续操作
    return;
  }

  // 内容就位：原生克隆编译产物
  let binders = bindersOpt;
  let bindRoot = bindRootOpt;
  // 插入前按路径预解析的节点表（append 会搬空片段，但节点引用持续有效）
  let resolvedNodes = null;

  if (template) {
    const frag = template.content.cloneNode(true);
    binders = binders || template.__xt;

    if (binders) {
      bindRoot = frag;
      resolvedNodes = binders.map((b) => resolvePath(frag, b.path, 0));
    }

    target.append(frag);
  }

  renderExtends.beforeRender({
    target,
  });

  const tasks = [];
  const revokes = getRevokes(target);

  if (binders && bindRoot) {
    // ---- 快路径：描述符直取节点，克隆后结构不变、写入不改结构 ----
    const nodeFor = (b, index) =>
      resolvedNodes ? resolvedNodes[index] : resolvePath(bindRoot, b.path, baseIndex);

    let binderIndex = -1;

    for (const b of binders) {
      binderIndex++;

      if (b.t === "text") {
        // 标记是注释节点：渲染时替换为文本节点，后续刷新只写内容
        const marker = nodeFor(b, binderIndex);

        if (!marker) {
          continue;
        }

        const textEl = document.createTextNode("");
        marker.replaceWith(textEl);

        // 上下文一次性构建：刷新期间零分配
        const ctx = {
          data,
          errCall: (error) => {
            const supplementary = getRenderErrorSupplementary(data);

            const err = new Error(
              `Error evaluating text expression: '${b.expr}', ${supplementary}`,
              {
                cause: error,
              },
            );

            console.error(err, {
              element: textEl,
              parent: textEl.parentNode,
            });

            return false;
          },
        };

        const renderFunc = () => {
          const content = b.fn.call(ctx);
          if (textEl.textContent !== String(content)) {
            textEl.textContent = content;
          }
        };
        tasks.push(renderFunc);

        const textRevoke = () => {
          remove(revokes, textRevoke);
          remove(tasks, renderFunc);
        };
        revokes.push(textRevoke);
        addRevoke(textEl, textRevoke);
        continue;
      }

      if (b.t === "style") {
        const el = nodeFor(b, binderIndex);

        if (!el) {
          continue;
        }

        const ctxs = b.items.map((item) => ({
          fn: item.fn,
          dataExpr: item.dataExpr,
          ctx: {
            data,
            errCall: (error) => {
              const supplementary = getRenderErrorSupplementary(data);

              const err = new Error(
                `Error evaluating data() expression in style: "${item.expr}", ${supplementary}`,
                {
                  cause: error,
                },
              );

              console.error(err, {
                style: b.origin,
                target,
              });
            },
          },
        }));

        const renderStyle = () => {
          let afterStyle = b.origin;

          ctxs.forEach(({ fn, dataExpr, ctx }) => {
            // 同名 data() 可在样式中出现多次（如 min-width 与 width 同式），逐处替换
            afterStyle = afterStyle.replaceAll(dataExpr, fn.call(ctx));
          });

          if (el.innerHTML !== afterStyle) {
            el.innerHTML = afterStyle;
          }
        };
        tasks.push(renderStyle);

        const styleRevoke = () => {
          remove(revokes, styleRevoke);
          remove(tasks, renderStyle);
        };
        revokes.push(styleRevoke);
        addRevoke(el, styleRevoke);
        continue;
      }

      // t === "bind"：属性指令
      const el = nodeFor(b, binderIndex);

      if (!el) {
        continue;
      }

      const $el = eleX(el);

      for (const action of b.actions) {
        for (const item of action.items) {
          try {
            // 动作元数据（always/revoke）直接挂在方法函数上，
            // 这是上层框架包装动作时的扩展缝，不可改为注册表
            const { always } = $el[action.name];

            const key = item.key;
            // 动作层的契约是"求值函数无 this 可直调"（getVal 裸调），
            // 用闭包把共享编译函数与实例上下文绑在一起——
            // 每实例每绑定只创建一次，刷新重跑零重编译
            const ctx = {
              data,
              errCall: (error) => {
                const errorExpr = `${action.name === "prop" ? "" : action.name}:${key}="${item.expr}"`;
                const supplementary = getRenderErrorSupplementary(data);

                const err = new Error(
                  `Error evaluating element expression: '${errorExpr}', ${supplementary}`,
                  {
                    cause: error,
                  },
                );

                console.error(err, {
                  element: $el.ele,
                });

                return false;
              },
            };
            // 透传参数：内联事件表达式依赖 $event（监听器入参）
            const fn = (...callArgs) => item.fn.call(ctx, ...callArgs);
            const afterArgs = [key, fn];
            const options = {
              actionName: action.name,
              target: $el,
              data,
              beforeArgs: [key, item.expr],
              args: afterArgs,
            };

            let workResult;

            const work = () => {
              const reval = $el[action.name](key, fn, options);

              renderExtends.render({
                step: "refresh",
                args: [key, item.expr],
                name: action.name,
                target: $el,
              });

              return reval;
            };

            let clearRevs = () => {
              const { revoke: methodRevoke } = $el[action.name];

              if (methodRevoke) {
                methodRevoke({
                  actionName: action.name,
                  target: $el,
                  data,
                  beforeArgs: [key, item.expr],
                  args: afterArgs,
                  result: workResult,
                });
              }

              remove(revokes, clearRevs);
              remove(tasks, work);
              clearRevs = null;
            };

            if (always) {
              // 展示型绑定（prop/attr/class）：每次数据更新重跑
              tasks.push(work);
            } else {
              // 自管理型绑定（on/sync/watch）：初始化一次，撤销凭据存 result
              workResult = work();
            }

            revokes.push(clearRevs);
            addRevoke(el, clearRevs);
          } catch (error) {
            const err = getErr(
              "xhear_eval",
              {
                name: action.name,
                arg0: key,
                arg1: item.expr,
              },
              error,
            );
            console.warn(err, el);
            throw err;
          }
        }
      }

      // 就绪握手：通知条件/列表组件可以开始初始化
      el._bindingRendered = true;
      el.dispatchEvent(new Event("binding-rendered"));
    }
  } else {
    // ---- 兼容回退：处理未经本版编译器处理的模板/DOM ----

    // 样式里的 data(expr) 语法
    searchEle(target, "style").forEach((el) => {
      const originStyle = el.innerHTML;

      if (/data\(.+\)/.test(originStyle)) {
        const matchs = Array.from(new Set(originStyle.match(/data\(.+?\)/g))).map(
          (dataExpr) => {
            const expr = dataExpr.replace(/data\((.+)\)/, "$1");
            const fn = compileExpr(expr);
            const ctx = {
              data,
              errCall: (error) => {
                const supplementary = getRenderErrorSupplementary(data);

                const err = new Error(
                  `Error evaluating data() expression in style: "${expr}", ${supplementary}`,
                  {
                    cause: error,
                  },
                );

                console.error(err, {
                  style: originStyle,
                  target,
                });
              },
            };

            return { dataExpr, fn, ctx };
          },
        );

        const renderStyle = () => {
          let afterStyle = originStyle;

          matchs.forEach(({ dataExpr, fn, ctx }) => {
            // 同名 data() 可在样式中出现多次（如 min-width 与 width 同式），逐处替换
            afterStyle = afterStyle.replaceAll(dataExpr, fn.call(ctx));
          });

          if (el.innerHTML !== afterStyle) {
            el.innerHTML = afterStyle;
          }
        };
        tasks.push(renderStyle);

        const styleRevoke = () => {
          remove(tasks, renderStyle);
          remove(getRevokes(el), styleRevoke);
          remove(revokes, styleRevoke);
        };

        addRevoke(el, styleRevoke);
        revokes.push(styleRevoke);
      }
    });

    // 文本节点：xtext 占位（旧编译产物的兼容形态）
    searchEle(target, "xtext").forEach((el) => {
      const textEl = document.createTextNode("");
      const { parentNode } = el;
      parentNode.insertBefore(textEl, el);
      parentNode.removeChild(el);

      let expr = el.getAttribute("expr");
      try {
        expr = decodeURIComponent(expr);
      } catch (e) {
        // 非编码表达式原样使用
      }

      const fn = compileExpr(expr);
      const ctx = {
        data,
        errCall: (error) => {
          const supplementary = getRenderErrorSupplementary(data);

          const err = new Error(
            `Error evaluating text expression: '${expr}', ${supplementary}`,
            {
              cause: error,
            },
          );

          console.error(err, {
            element: textEl,
            parent: parentNode,
          });

          return false;
        },
      };

      const renderFunc = () => {
        const content = fn.call(ctx);
        if (textEl.textContent !== String(content)) {
          textEl.textContent = content;
        }
      };
      tasks.push(renderFunc);

      const textRevoke = () => {
        remove(revokes, textRevoke);
        remove(tasks, renderFunc);
        remove(getRevokes(textEl), textRevoke);
      };
      revokes.push(textRevoke);
      addRevoke(textEl, textRevoke);
    });

    const eles = searchEle(target, `[x-bind-data]`);

    if (isRenderSelf && target.matches(`[x-bind-data]`)) {
      eles.unshift(target);
    }

    // 属性绑定：解析 x-bind-data，逐条调用元素上同名动作方法
    eles.forEach((el) => {
      const bindData = JSON.parse(el.getAttribute("x-bind-data"));

      const $el = eleX(el);

      for (let [actionName, arr] of Object.entries(bindData)) {
        arr.forEach((args) => {
          try {
            const { always } = $el[actionName];
            let afterArgs = [];

            let workResult;

            const work = () => {
              const [key, expr] = args;

              const fn = compileExpr(expr);
              const ctx = {
                data,
                errCall: (error) => {
                  const errorExpr = `${actionName === "prop" ? "" : actionName}:${key}="${expr}"`;
                  const supplementary = getRenderErrorSupplementary(data);

                  const err = new Error(
                    `Error evaluating element expression: '${errorExpr}', ${supplementary}`,
                    {
                      cause: error,
                    },
                  );

                  console.error(err, {
                    element: $el.ele,
                  });

                  return false;
                },
              };

              afterArgs = [key, fn];

              const reval = $el[actionName](...afterArgs, {
                actionName,
                target: $el,
                data,
                beforeArgs: args,
                args: afterArgs,
              });

              renderExtends.render({
                step: "refresh",
                args,
                name: actionName,
                target: $el,
              });

              return reval;
            };

            let clearRevs = () => {
              const { revoke: methodRevoke } = $el[actionName];

              if (methodRevoke) {
                methodRevoke({
                  actionName,
                  target: $el,
                  data,
                  beforeArgs: args,
                  args: afterArgs,
                  result: workResult,
                });
              }

              remove(revokes, clearRevs);
              remove(getRevokes(el), clearRevs);
              remove(tasks, work);
              clearRevs = null;
            };

            if (always) {
              tasks.push(work);
            } else {
              workResult = work();
            }

            revokes.push(clearRevs);
            if (el !== target) {
              addRevoke(el, clearRevs);
            }
          } catch (error) {
            const err = getErr(
              "xhear_eval",
              {
                name: actionName,
                arg0: args[0],
                arg1: args[1],
              },
              error,
            );
            console.warn(err, el);
            throw err;
          }
        });
      }

      el.removeAttribute("x-bind-data");

      el._bindingRendered = true;
      el.dispatchEvent(new Event("binding-rendered"));
    });
  }

  if (!target.__render_temps && !isEmptyObject(temps)) {
    target.__render_temps = temps;
  }

  if (target.__render_data && target.__render_data !== data) {
    const err = getErr("xhear_listen_already");

    console.warn(err, {
      element: target,
      old: target.__render_data,
      new: data,
    });

    throw err;
  }

  target.__render_data = data;

  if (tasks.length) {
    tasks.forEach((f) => f());

    // 数据更新后重跑全部渲染任务；任务清空（绑定全部释放）则退订
    const wid = data.watchTick((e) => {
      if (tasks.length) {
        tasks.forEach((f) => f());
      } else {
        data.unwatch(wid);
      }
    });
  }

  renderExtends.render({ step: "init", target });
}

// ==== 模板绑定动作集（prop/attr/class/watch）====
// 以 "$el[actionName](key, exprFunc, options)" 的形式被 render 调用，
// 同时也是元素实例的公开方法。always/revoke 元数据挂在函数上，
// 上层框架包装这些方法时需原样保留元数据（ofa.js 的 extend 即如此）。

/** 取值：函数类型的值现场调用求值 */
const getVal = (val) => (isFunction(val) ? val() : val);

const defaultData = {
  /** :prop="expr" —— 组件数据属性绑定（等价 $ele.prop(key, value)） */
  prop(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = getVal(value);
    name = hyphenToUpperCase(name);

    setPath(this, name, value);
  },
  /** attr:name="expr" —— HTML 属性绑定；true→""、false/null/undefined→移除 */
  attr(...args) {
    let [name, value] = args;

    const { ele } = this;

    if (args.length === 1) {
      return ele.getAttribute(name);
    }

    value = getVal(value);

    if (value === false) {
      value = null;
    } else if (value === true) {
      value = "";
    }

    if (value === null || value === undefined) {
      ele.removeAttribute(name);
    } else if (ele.getAttribute(name) != value) {
      ele.setAttribute(name, value);
    }
  },
  /** class:name="expr" —— 类名开关绑定 */
  class(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this.ele.classList.contains(name);
    }

    value = getVal(value);

    if (value) {
      this.ele.classList.add(name);
    } else {
      this.ele.classList.remove(name);
    }
  },
  /**
   * watch:prop="data.path" —— 数据到数据的单向拷贝。
   * 模板形式（3 参）：把自身 prop 值同步到渲染数据的指定路径；
   * 直接调用形式（<3 参）透传给 stanz 原生 watch。
   */
  watch(...args) {
    if (args.length < 3) {
      return stanzProto.watch.apply(this, args);
    }

    const options = args[2];
    const { beforeArgs, data: target } = options;
    const [selfPropName, targetPropName] = beforeArgs;
    const propName = hyphenToUpperCase(selfPropName);

    const setData = () => {
      let val = getPath(this, propName);
      setPath(target, targetPropName, val);
    };

    const wid = this.watch((e) => {
      if (e.hasModified(propName)) {
        setData();
      }
    });

    // 初始化先同步一次
    setData();

    return () => {
      this.unwatch(wid);
    };
  },
};

// prop/attr/class 是展示型绑定，需要随数据更新重跑
defaultData.prop.always = true;
defaultData.attr.always = true;
defaultData.class.always = true;

// 释放元数据：prop 绑定的值若是 stanz 对象，置空以断开 owner 引用链
defaultData.prop.revoke = ({ target, args }) => {
  const propName = args[0];

  const oldVal = getPath(target, propName);
  if (isxdata(oldVal)) {
    setPath(target, propName, {});
  }
};

defaultData.watch.revoke = (e) => {
  e.result();
  const propName = e.beforeArgs[1];

  const oldVal = getPath(e.data, propName);
  if (isxdata(oldVal)) {
    setPath(e.data, propName, {});
  }
};

export default defaultData;
