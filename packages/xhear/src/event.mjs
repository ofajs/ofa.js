/**
 * 事件能力：on / one / off / emit，直接挂在原生 EventTarget 语义上。
 *
 * 模板事件绑定（on:click="handler"）的约定：render 层调用 $el.on 时会
 * 末尾追加 options 参数；on 据此把"表达式"解析为 data 上的方法引用，
 * 并返回撤销函数（render 释放时经 .revoke 元数据回调 e.result() 执行）。
 */
import { getRenderErrorSupplementary } from "./public.mjs";
import { getPath } from "./path.mjs";

/**
 * 解析模板事件绑定的处理函数。
 * 表达式为纯标识符（如 "submit"）时，从渲染数据上查同名方法并绑定 this；
 * 复杂表达式（如 "count++"）则由 render 层编译好的函数直接充当处理体。
 */
function getBindOptions(name, func, options) {
  let revoker;

  if (options) {
    const beforeValue = options.beforeArgs[1];

    if (!/[^\d\w_\$\.]/.test(beforeValue)) {
      func = getPath(options.data, beforeValue);
      if (!func) {
        const supplementary = getRenderErrorSupplementary(options.data);

        const err = new Error(
          `Event binding error: function "${beforeValue}" not found in expression on:${name}="${beforeValue}", ${supplementary}`,
        );

        console.error(err, {
          target: options.data,
        });
        // 找不到方法不中断渲染，仅报错（与旧版行为一致）
      } else {
        func = func.bind(options.data);
      }
    }

    revoker = () => this.ele.removeEventListener(name, func);
  }

  return { revoker, name, func };
}

const eventFn = {
  /** 绑定事件；模板绑定场景返回撤销函数，普通调用返回 this 便于链式 */
  on(...args) {
    const { revoker, name, func } = getBindOptions.call(this, ...args);

    this.ele.addEventListener(name, func);

    if (revoker) {
      return revoker;
    }

    return this;
  },

  /** 单次绑定：触发一次后自动解绑 */
  one(...args) {
    const { revoker, name, func } = getBindOptions.call(this, ...args);

    let callback = (e) => {
      this.off(name, callback);
      func(e);
    };

    this.ele.addEventListener(name, callback);

    if (revoker) {
      return revoker;
    }

    return this;
  },

  off(name, func) {
    this.ele.removeEventListener(name, func);
    return this;
  },

  /**
   * 派发事件；opts.data 会挂到 event.data 上传递给监听方，
   * 其余字段（bubbles 等）作为 Event 初始化参数。
   */
  emit(name, opts) {
    const options = { ...opts };

    let data;
    if (options.hasOwnProperty("data")) {
      data = options.data;
      delete options.data;
    }

    let event;

    if (name instanceof Event) {
      event = name;
    } else if (name) {
      event = new Event(name, { bubbles: true, ...options });
    }

    event.data = data;

    this.ele.dispatchEvent(event);

    return this;
  },
};

// 模板绑定的撤销元数据：result 即 on/one 在模板场景返回的撤销函数
eventFn.on.revoke = (e) => {
  e.result();
};

eventFn.one.revoke = (e) => {
  e.result();
};

export default eventFn;
