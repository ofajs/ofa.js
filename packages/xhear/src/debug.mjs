/**
 * 框架内部调试日志开关：[xt-register] / [xt-data] / [xt-comp] 等前缀的
 * console.debug 诊断统一走这里。
 *
 * 门禁由 ofa.js 入口计算并推送：**#debug 调试模式 且 显式日志开关
 * （globalThis.OFA_SHOWLOG / $.showlog）两者都开才显示**——#debug 只给
 * sourcemap，不夹带日志。开关本体放在 xhear：register 等核心模块无法
 * 反向依赖 ofa.js。
 */
let isEnabled = false;

export const setDebugLog = (val) => {
  isEnabled = !!val;
};

export const debugLog = (tag, ...args) => {
  if (isEnabled) {
    console.debug(tag, ...args);
  }
};
