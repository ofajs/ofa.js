let seed = 0;

/**
 * 极简洋葱模型中间件链：处理器按注册顺序执行，
 * 每个处理器自行决定何时（是否）调用 next() 放行到下一层。
 */
export default class Onion {
  constructor() {
    // 有序 Map：插入顺序即执行顺序，id 用于卸载
    this._middlewares = new Map();
  }

  /** 注册处理器，@returns {number} 处理器 id，可用于 unuse 卸载 */
  use(middleware) {
    const id = ++seed;
    this._middlewares.set(id, middleware);
    return id;
  }

  /** 按 id 卸载处理器，@returns 是否卸载成功 */
  unuse(id) {
    return this._middlewares.delete(id);
  }

  /** 顺序执行整条链；next() 走到链尾后自然结束 */
  async run(context) {
    // 复制一份快照：运行期间新注册的处理器不影响本次执行
    const middlewares = [...this._middlewares.values()];
    let index = -1;

    const next = async () => {
      const middleware = middlewares[++index];
      if (middleware) {
        await middleware(context, next);
      }
    };

    await next();
  }
}
