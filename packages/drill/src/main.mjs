import lm from "./lm.mjs";
import { path } from "./path.mjs";
import { use } from "./processors.mjs";
import "./load-module.mjs";

// 把处理器注册与路径解析挂到加载器上，形成完整对外 API
lm.use = use;
lm.path = path;

// 冻结后消费方（如 ofa）只能扩展处理器，不能篡改核心方法
Object.freeze(lm);

// 供 CDN 直引 ESM 源码的场景使用全局 lm（与 UMD 构建行为一致）
if (typeof window !== "undefined") {
  window.lm = lm;
}

export default lm;
export { path, use };
