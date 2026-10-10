/**
 * ofa.js 的统一错误机制：本地错误码描述表 + XhearError。
 * 旧版依赖 ofa-error 在线加载文案（被认定的失败设计），现随源码走。
 */
import { XhearError } from "../../xhear/src/error.mjs";

/** 错误码 → 描述模板；{name} 等占位符由 getErr 用 options 填充 */
const errorDescs = {
  loading_nothing: "Loading function has no return content",
  not_page_module:
    "{src} is not a page module and cannot be set as the src of the page component",
  page_no_defaults:
    "The current page ({src}) has been rendered and cannot be rendered again",
  page_invalid_key:
    "The registration parameters of page {src} are incorrect. '{name}' on '{targetName}' is already taken. Please change '{name}' to another name.",
  load_page_module: "Loading page module {url} failed",
  page_failed: "Loading page failed: {src}",
  fetch_temp_err: "Page module {url} failed to load template {tempSrc}",
  page_wrap_fetch: "Page {before} failed to get the parent page ({current})",
  app_src_change:
    "The app element that has been initialized cannot modify the src attribute",
  app_noback:
    "This is already the first page, and the 'back' operation cannot be performed again",
  app_noforward:
    "This is the last page, you can no longer perform the 'forward' operation",
  need_forwards:
    "The target o-app does not allow forward operations, please add the '_forwards' attribute to the target; or in the app config file, add 'export const allowForward = true'",
  no_cross_access_func:
    "To jump to a page across domains, you must set the access function",
  access_return_error: "Jumping to {src} is not allowed",
  comp_registered:
    "Component '{tag}' has been registered, and the component cannot be registered again",
  load_comp_module: "Error loading component module, wrong module address: {url}",
  "inject-link-rel":
    "The rel attribute value of the link element in the inject-host component can only be 'stylesheet'",
  "use-data-inject":
    "Please do not use data() on the style element in the inject-host, because it will cause serious performance crisis",
  invalidated_inject_host: "This element will be invalidated in 'inject-host'",
  olink_out_app: "The element of [olink] is only allowed in o-app",
  no_provider:
    "The consumer named '{name}' was not captured by the corresponding provider",
  root_provider_exist:
    "An exception occurred in the root provider named '{name}'. The root provider component can only appear once",
  root_provider_name_change:
    "An exception occurred in the root provider named '{name}'. The root provider component cannot change the 'name' attribute",
};

/** 按错误码 + 占位符生成描述文本 */
export const getErrDesc = (key, options) => {
  let desc = errorDescs[key];

  if (!desc) {
    return `Unknown error code: "${key}"`;
  }

  if (options) {
    for (let k in options) {
      desc = desc.replace(new RegExp(`\\{${k}\\}`, "g"), options[k]);
    }
  }

  return desc;
};

/** 快捷工厂：生成带 code 的 XhearError，cause 可选 */
export const getErr = (key, options, cause) =>
  new XhearError(key, getErrDesc(key, options), { cause });
