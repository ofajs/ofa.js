import { getErr, getErrDesc } from "../../ofa-error/main.js";
import { getRandomId, dataRevoked } from "../../stanz/public.mjs";
import stanzProto from "../../stanz/watch.mjs";
import { isxdata } from "../../stanz/main.mjs";

import {
  isFunction,
  hyphenToUpperCase,
  isEmptyObject,
  searchEle,
  removeArrayValue as remove,
} from "../public.mjs";
import { eleX } from "../util.mjs";

export const renderExtends = {
  beforeConvert() {},
  afterConvert() {},
  beforeRender() {},
  render() {},
};

const getRevokes = (target) => target.__revokes || (target.__revokes = []);
const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

const getRenderErrorSupplementary = (data) => {
  let supplementary = "";
  if (data.$host || data.$data) {
    supplementary = "Please check the usage of $host or $data, ";
  }

  const fromSrc = data.$host?.PATH || data.PATH;

  if (fromSrc) {
    supplementary += `from file: ${fromSrc}, `;
  } else {
    debugger;
  }

  return supplementary;
};

const convertToFunc = (expr, data, opts) => {
  const funcStr = `
const dataRevoked = ${dataRevoked.toString()};
const [$event] = $args;
const {data, errCall} = this;
if(dataRevoked(data)){
  return;
}
try{
  with(data){
    return ${expr};
  }
}catch(error){
  if(data.ele && !data.ele.isConnected){
    return;
  }
  if(errCall){
    const result = errCall(error);
    if(result !== false){
      console.error(error);
    }
  }else{
    console.error(error);
  }
}
`;
  return new Function("...$args", funcStr).bind({ data, ...opts });
};

export function render({
  data,
  target,
  template,
  temps,
  isRenderSelf, // 是否将当前target元素也渲染处理
  ...otherOpts
}) {
  try {
    data.watchTick;
  } catch (e) {
    // data 已经被回收，不需要继续操作
    return;
  }

  const content = template && template.innerHTML;

  if (content) {
    target.innerHTML = content;
  }

  renderExtends.beforeRender({
    target,
  });

  const texts = searchEle(target, "xtext");

  const tasks = [];
  const revokes = getRevokes(target);

  // Styles with data() function to monitor and correct rendering
  searchEle(target, "style").forEach((el) => {
    const originStyle = el.innerHTML;

    if (/data\(.+\)/.test(originStyle)) {
      const matchs = Array.from(new Set(originStyle.match(/data\(.+?\)/g))).map(
        (dataExpr) => {
          const expr = dataExpr.replace(/data\((.+)\)/, "$1");
          const func = convertToFunc(expr, data, {
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
          });

          return {
            dataExpr,
            func,
          };
        },
      );

      const renderStyle = () => {
        let afterStyle = originStyle;

        matchs.forEach(({ dataExpr, func }) => {
          afterStyle = afterStyle.replace(dataExpr, func());
        });

        if (el.innerHTML !== afterStyle) {
          el.innerHTML = afterStyle;
        }
      };
      tasks.push(renderStyle);

      const revokeStyle = () => {
        matchs.length = 0;
        remove(tasks, renderStyle);
        remove(getRevokes(el), revokeStyle);
        remove(revokes, revokeStyle);
      };

      addRevoke(el, revokeStyle);
      revokes.push(revokeStyle);
    }
  });

  // Render text nodes
  texts.forEach((el) => {
    const textEl = document.createTextNode("");
    const { parentNode } = el;
    parentNode.insertBefore(textEl, el);
    parentNode.removeChild(el);

    const func = convertToFunc(el.getAttribute("expr"), data, {
      errCall: (error) => {
        const supplementary = getRenderErrorSupplementary(data);

        const err = new Error(
          `Error evaluating text expression: '${el.getAttribute("expr")}', ${supplementary}`,
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
    });
    const renderFunc = () => {
      const content = func();
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

  // Render properties based on expressions
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

            const func = convertToFunc(expr, data, {
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
            });

            afterArgs = [key, func];

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
            // Run every data update
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

    // After the data changes, traverse the rendering tasks
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

const convertEl = (el) => {
  const { tagName } = el;

  if (tagName === "TEMPLATE") {
    return;
  }

  if (tagName) {
    // Converting elements
    const obj = {};

    Array.from(el.attributes).forEach((attr) => {
      const matchData = /(.*):(.+)/.exec(attr.name);

      if (!matchData) {
        return;
      }

      let [, actionName, param0] = matchData;

      if (!actionName) {
        actionName = "prop";
      }

      const targetActions = obj[actionName] || (obj[actionName] = []);

      targetActions.push([param0, attr.value]);

      el.removeAttribute(attr.name);
    });

    const keys = Object.keys(obj);

    if (keys.length) {
      el.setAttribute("x-bind-data", JSON.stringify(obj));
    }
  }

  Array.from(el.children).forEach(convertEl);
};

const searchTemp = (template, expr, func) => {
  const rearr = Array.from(template.content.querySelectorAll(expr));

  if (func) {
    rearr.forEach(func);
  }

  return rearr;
};

let isWarned;

export const convert = (template) => {
  let temps = {};
  const codeEls = {};

  renderExtends.beforeConvert({
    template,
  });

  searchTemp(template, "code", (code) => {
    const cid = getRandomId();
    code.setAttribute("code-id", cid);

    codeEls[cid] = code.innerHTML;
    code.innerHTML = "";
  });

  template.innerHTML = template.innerHTML.replace(
    /{{(.+?)}}/g,
    (str, match) => {
      return `<xtext expr="${match}"></xtext>`;
    },
  );

  const tempName = template.getAttribute("name");

  if (tempName) {
    const tempChilds = template.content.children;
    if (tempChilds.length > 1) {
      if (!isWarned) {
        const err = getErr("temp_multi_child");
        console.warn(err, {
          content: template.content,
        });
        isWarned = 1;
      }

      const wrapName = `wrapper-${tempName}`;
      template.innerHTML = `<div ${wrapName} style="display:contents">${template.innerHTML}</div>`;
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

  searchTemp(template, "x-fill:not([name])", (fillEl) => {
    if (fillEl.querySelector("x-fill:not([name])")) {
      throw getErr("xhear_dbfill_noname");
    }

    if (fillEl.innerHTML.trim()) {
      const tid = `t${getRandomId()}`;
      fillEl.setAttribute("name", tid);

      const temp = document.createElement("template");
      temp.setAttribute("name", tid);
      temp.innerHTML = fillEl.innerHTML;
      fillEl.innerHTML = "";
      fillEl.appendChild(temp);
    }
  });

  searchTemp(template, "x-if,x-else-if,x-else", (condiEl) => {
    const firstChild = condiEl.children[0];
    if (!firstChild || firstChild.tagName !== "TEMPLATE") {
      condiEl.innerHTML = `<template condition>${condiEl.innerHTML}</template>`;
    }
  });

  searchTemp(template, "template", (e) => {
    const newTemps = convert(e);

    Object.keys(newTemps).forEach((tempName) => {
      if (temps[tempName]) {
        throw getErr("xhear_temp_exist", {
          name: tempName,
        });
      }
    });

    temps = { ...temps, ...newTemps };
  });

  Array.from(template.content.children).forEach((el) => convertEl(el));

  // Restore the contents of the code
  for (let [key, value] of Object.entries(codeEls)) {
    searchTemp(template, `[code-id="${key}"]`, (el) => {
      el.removeAttribute("code-id");
      // el.innerHTML = htmlEncode(value);
      el.innerHTML = value;
    });
  }

  renderExtends.afterConvert({
    template,
    temps,
  });

  return temps;
};

const getVal = (val) => {
  if (isFunction(val)) {
    return val();
  }

  return val;
};

const defaultData = {
  prop(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = getVal(value);
    name = hyphenToUpperCase(name);

    this.set(name, value);
  },
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
  watch(...args) {
    if (args.length < 3) {
      return stanzProto.watch.apply(this, args);
    }

    const options = args[2];
    const { beforeArgs, data: target } = options;
    const [selfPropName, targetPropName] = beforeArgs;
    const propName = hyphenToUpperCase(selfPropName);

    const setData = () => {
      let val = this.get(propName);
      target.set(targetPropName, val);
    };

    const wid = this.watch((e) => {
      if (e.hasModified(propName)) {
        setData();
      }
    });

    // Initialize once
    setData();

    return () => {
      this.unwatch(wid);
    };
  },
};

defaultData.prop.always = true;
defaultData.attr.always = true;
defaultData.class.always = true;

defaultData.prop.revoke = ({ target, args, $ele, data }) => {
  const propName = args[0];

  const oldVal = target.get(propName);
  if (isxdata(oldVal)) {
    target.set(propName, {});
  }
};

defaultData.watch.revoke = (e) => {
  e.result();
  const propName = e.beforeArgs[1];

  const oldVal = e.data.get(propName);
  if (isxdata(oldVal)) {
    e.data.set(propName, {});
  }
};

export default defaultData;
