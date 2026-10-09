/**
 * 将模块标识符（可携带空格分隔的加载参数，如 "./data.json .txt"）
 * 解析为绝对 URL，并原样保留尾部参数。
 *
 * @param {string} moduleName 模块标识符
 * @param {string} [baseURI] 解析基准；缺省时用当前文档地址
 */
export const path = (moduleName, baseURI) => {
  // 拆出 URL 与加载参数，解析后需原样拼回
  const [url, ...params] = moduleName.split(" ");

  let lastUrl = url;

  // http(s) 绝对地址不参与拼接；无 location 的环境（如 node）跳过解析
  if (!/^https?:/.test(url) && typeof location !== "undefined") {
    const base = baseURI ? new URL(baseURI, location.href) : location.href;
    lastUrl = new URL(url, base).href;
  }

  if (params.length) {
    return `${lastUrl} ${params.join(" ")}`;
  }

  return lastUrl;
};
