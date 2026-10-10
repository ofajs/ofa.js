// const error_origin = "http://127.0.0.1:5793/errors";
const error_origin = "https://ofajs.github.io/ofa-errors/errors";

// 存放错误信息的数据对象
const errors = {
  load_fail: "Load {url} failed",
  load_fail_status: "Load {url} failed, status code: {status}",
  load_module: "Load module failed, module address: {url}",
  no_alias: "No alias found: {name}, so '{url}' request is invalid",
  config_alias_name_error: "Error in setting alias, must start with '@'",
  alias_already: "Alias ​​'{name}' already exists",
  alias_relate_name:
    "Alias ​​cannot be configured with relative address, '{name}': '{path}'",
  failed_to_set_data: "Error in setting attribute value {key}",
  failed_to_get_data: "Error in getting {key}",
  nexttick_thread_limit:
    "nextTick exceeds thread limit, may have an infinite loop, please try to repair or optimize the function",
  not_func: "The callback parameter of the {name} method must be a Function",
  not_found_func:
    "The '{name}' method was not found on the target {tag}. Please define the '{name}' method on the 'proto' of the component {tag}",
  invalid_key:
    "The parameters for registering the '{compName}' component are incorrect. The '{name}' on '{targetName}' is already occupied. Please change '{name}' to another name.",
  xhear_wrap_no_parent:
    "The target element has no parent element, the warp method cannot be used",
  xhear_unwrap_has_siblings:
    "The target element contains adjacent nodes, the unwrap method cannot be used",
  xhear_reander_err: "Failed to render the tag '{tag}'",
  xhear_register_exists:
    "The component '{name}' already exists, and this component cannot be registered repeatedly",
  xhear_register_err: "Error in registering the '{tag}' component",
  xhear_validate_tag:
    "The registered component name '{str}' is incorrect. For the Web Components naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_tag_noline:
    "The registered component name '{str}' is incorrect and contains at least one '-' character; Web Components For naming rules, please refer to: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names ",
  xhear_regster_data_noset:
    "Error in registering component {tag}, custom data cannot have data of type 'Set' or 'Map'",
  xhear_regster_data_nofunc:
    "Registration component {tag} error, functions cannot appear in custom data, please put the function in 'proto'; or change '{key}' to '_{key}'",
  xhear_fakenode_unclose:
    "This is an unclosed FakeNode; use the wrong attribute name: {name}",
  xhear_fill_tempname: "Fill component template '{name}' not found",
  xhear_eval:
    "Template syntax '{name}' error, expression {name}:{arg0}=\"{arg1}\"",
  xhear_listen_already:
    "An old listener already exists, and this element is rendering incorrectly. ",
  xhear_dbfill_noname:
    "Only fill components with the 'name' attribute can be rendered in the fill component",
  xhear_temp_exist: "Template '{name}' already exists",
  xhear_sync_no_options:
    "Direct use of the 'sync' method is not allowed, it is only used for template rendering",
  xhear_sync_object_value:
    "Cannot use 'sync' to synchronize values ​​of Object type, target {targetName}",
  loading_nothing: "Loading function has no return content",
  app_src_change:
    "The app element that has been initialized cannot modify the src attribute",
  no_cross_access_func:
    "To jump to a page across domains, you must set the access function",
  access_return_error: "Jumping to {src} is not allowed",
  load_comp_module:
    "Error loading component module, wrong module address: {url}",
  comp_registered:
    "Component '{tag}' has been registered, and the component cannot be registered again",
  "inject-link-rel":
    "The rel attribute value of the link element in the inject-host component can only be 'stylesheet'",
  "use-data-inject":
    "Please do not use data() on the style element in the inject-host, because it will cause serious performance crisis",
  load_page_module: "Loading page module {url} failed",
  page_no_defaults:
    "The current page ({src}) has been rendered and cannot be rendered again",
  not_page_module:
    "{src} is not a page module and cannot be set as the src of the page component",
  page_failed: "Loading page failed: {src}",
  fetch_temp_err: "Page module {url} failed to load template {tempSrc}",
  page_wrap_fetch: "Page {before} failed to get the parent page ({current})",
  context_change_name:
    "Changing the 'name' of {compName} may cause performance issues, please avoid changing this property",
  no_provider:
    "The consumer named '{name}' was not captured by the corresponding provider",
  page_invalid_key:
    "The registration parameters of page {src} are incorrect. '{name}' on '{targetName}' is already taken. Please change '{name}' to another name.",
  root_provider_exist:
    "An exception occurred in the root provider named '{name}'. The root provider component can only appear once",
  root_provider_name_change:
    "An exception occurred in the root provider named '{name}'. The root provider component cannot change the 'name' attribute",
  change_lm_src:
    "{tag} element changes 'src' attribute invalid, this attribute can only be set once.",
  error_no_owner:
    "This data is incorrect, the owner has not registered this object",
  circular_data: "An object with a circular reference",
  fill_type:
    "'value' of 'x-fill' must be of type Array, the current value is of type {type}",
  fill_key_duplicates: "The key in the fill component is repeated",
  render_el_error: "Rendering element failed, rendering error is {expr}",
  temp_multi_child:
    "The template element can only contain one child element. If multiple child elements appear, the child elements will be repackaged in a <div> element",
  temp_wrap_child:
    "The template '{tempName}' contains {len} child elements, which have been wrapped in a div element with the attribute '{wrapName}'.",
  app_noback:
    "This is already the first page, and the 'back' operation cannot be performed again",
  invalidated_inject_host: "This element will be invalidated in 'inject-host'",
  olink_out_app: "The element of [olink] is only allowed in o-app",
  app_noforward:
    "This is the last page, you can no longer perform the 'forward' operation",
  need_forwards:
    "The target o-app does not allow forward operations, please add the '_forwards' attribute to the target; or in the app config file, add 'export const allowForward = true' ",
  watchuntil_timeout: "watchUntil timed out, target value not monitored",
};

if (globalThis.navigator && navigator.language) {
  let langFirst = navigator.language.toLowerCase().split("-")[0];

  if (langFirst === "zh" && navigator.language.toLowerCase() !== "zh-cn") {
    langFirst = "zhft";
  }

  // 根据用户的语言首字母加载对应的错误匹配库，匹配开发人员报错信息
  (async () => {
    if (!globalThis.localStorage) {
      // 不支持 localStorage，不加载错误库
      return;
    }

    if (globalThis.navigator && !navigator.onLine) {
      // 网络不可用，不加载错误库
      return;
    }

    if (localStorage["ofa-errors"]) {
      const targetLangErrors = JSON.parse(localStorage["ofa-errors"]);
      Object.assign(errors, targetLangErrors);
    }

    const errCacheTime = localStorage["ofa-errors-time"];

    if (!errCacheTime || Date.now() > Number(errCacheTime) + 5 * 60 * 1000) {
      const targetLangErrors = await fetch(`${error_origin}/${langFirst}.json`)
        .then((e) => e.json())
        .catch(() => null);

      if (targetLangErrors) {
        localStorage["ofa-errors"] = JSON.stringify(targetLangErrors);
        localStorage["ofa-errors-time"] = Date.now();
      } else {
        targetLangErrors = await fetch(`${error_origin}/en.json`)
          .then((e) => e.json())
          .catch((error) => {
            return null;
          });
      }

      Object.assign(errors, targetLangErrors);
    }
  })();
}

let isSafari = false;
if (globalThis.navigator) {
  isSafari =
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");
}

/**
 * 根据键、选项和错误对象生成错误对象。
 *
 * @param {string} key - 错误描述的键。
 * @param {Object} [options] - 映射相关值的选项对象。
 * @param {Error} [error] - 原始错误对象。
 * @returns {Error} 生成的错误对象。
 */
export const getErr = (key, options, error) => {
  let desc = getErrDesc(key, options);

  let errObj;
  if (error) {
    if (isSafari) {
      desc += `\nCaused by: ${error.toString()}\n`;

      if (error.stack) {
        desc += `  ${error.stack.replace(/\n/g, "\n    ")}`;
      }
    }
    errObj = new Error(desc, { cause: error });
  } else {
    errObj = new Error(desc);
  }
  errObj.code = key;
  return errObj;
};

/**
 * 根据键、选项生成错误描述
 *
 * @param {string} key - 错误描述的键。
 * @param {Object} [options] - 映射相关值的选项对象。
 * @returns {string} 生成的错误描述。
 */
export const getErrDesc = (key, options) => {
  if (!errors[key]) {
    return `Error code: "${key}", please go to https://github.com/ofajs/ofa-errors to view the corresponding error information`;
  }

  let desc = errors[key];

  // 映射相关值
  if (options) {
    for (let k in options) {
      desc = desc.replace(new RegExp(`{${k}}`, "g"), options[k]);
    }
  }

  return desc;
};
