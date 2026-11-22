/**
 * drill 的统一错误类型：携带稳定的机器可读错误码（code），
 * 并通过 ES2022 cause 保留底层错误的完整链路。
 */
export class DrillError extends Error {
  /**
   * @param {string} code 稳定的错误码（如 load_fail_status）
   * @param {string} message 人类可读的描述
   * @param {{cause?: unknown}} [options] 底层错误，经 super 传入形成错误链
   */
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
  }
}

/** 快捷工厂：new DrillError(code, message, { cause }) */
export const err = (code, message, cause) =>
  new DrillError(code, message, { cause });
