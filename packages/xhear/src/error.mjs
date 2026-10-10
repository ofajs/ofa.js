/**
 * xhear 的统一错误机制：本地错误码描述表 + 轻量 Error 类。
 *
 * 旧版依赖 ofa-error：会把错误码表放在远端，运行时在线 fetch 本地化文案——
 * 引入网络依赖与失败路径，属于被废弃的设计。本表只收录 xhear 自己用到的
 * 错误码，文案随源码走，离线可用。
 */

/** xhear 的统一错误类型：携带稳定的机器可读错误码（code） */
export class XhearError extends Error {
  /**
   * @param {string} code 稳定的错误码（如 xhear_register_err）
   * @param {string} message 人类可读的描述
   * @param {{cause?: unknown}} [options] 底层错误，经 super 传入形成错误链
   */
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
  }
}

/** 错误码 → 描述模板；{name} 等占位符由 getErr 用 options 填充 */
const errorDescs = {
  failed_to_get_data: "Error in getting {key}",
  invalid_key:
    "The parameters for registering the '{compName}' component are incorrect. The '{name}' on '{targetName}' is already occupied. Please change '{name}' to another name.",
  xhear_wrap_no_parent:
    "The target element has no parent element, the wrap method cannot be used",
  xhear_unwrap_has_siblings:
    "The target element contains adjacent nodes, the unwrap method cannot be used",
  xhear_eval: "Template syntax '{name}' error, expression {name}:{arg0}=\"{arg1}\"",
  xhear_listen_already:
    "An old listener already exists, and this element is rendering incorrectly.",
  xhear_reander_err: "Failed to render the tag '{tag}'",
  xhear_register_exists:
    "The component '{name}' already exists, and this component cannot be registered repeatedly",
  xhear_register_err: "Error in registering the '{tag}' component",
  xhear_validate_tag:
    "The registered component name '{str}' is incorrect. For the Web Components naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_tag_noline:
    "The registered component name '{str}' is incorrect and must contain at least one '-' character; Web Components naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_regster_data_noset:
    "Error in registering component {tag}, custom data cannot have data of type 'Set' or 'Map'",
  xhear_regster_data_nofunc:
    "Registration component {tag} error, functions cannot appear in custom data, please put the function in 'proto'; or change '{key}' to '_{key}'",
  xhear_fakenode_unclose:
    "This is an unclosed FakeNode; use the wrong attribute name: {name}",
  xhear_fill_tempname: "Fill component template '{name}' not found",
  xhear_dbfill_noname:
    "Only fill components with the 'name' attribute can be rendered in the fill component",
  xhear_temp_exist: "Template '{name}' already exists",
  temp_multi_child:
    "The template element can only contain one child element. If multiple child elements appear, the child elements will be repackaged in a <div> element",
  temp_wrap_child:
    "The template '{tempName}' contains {len} child elements, which have been wrapped in a div element with the attribute '{wrapName}'.",
  fill_type:
    "'value' of 'x-fill' must be of type Array, the current value is of type {type}",
  fill_key_duplicates: "The key in the fill component is repeated",
  xhear_sync_no_options:
    "Direct use of the 'sync' method is not allowed, it is only used for template rendering",
  xhear_sync_object_value:
    "Cannot use 'sync' to synchronize values of Object type, target {targetName}",
};

/** 按错误码 + 占位符生成描述文本（未知码原样提示去查表） */
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
