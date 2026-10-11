/**
 * o-if / o-fill 的内容保护层。
 *
 * 条件与列表组件的内容必须被宿主编译"隔离"——它们应在分支/列表项渲染
 * 时才绑定各自的渲染数据（$data/$index/…），而不是被宿主编译提前消费。
 * wrapTemp 把这类组件的内容搬进 template[inner-code]（纯 DOM 搬运，禁止
 * innerHTML 往返：innerHTML 解析受上下文元素影响，表格/表单位置的
 * tr/option 会被解析器丢弃）；宿主编译的最终遍历跳过 TEMPLATE 子树，
 * inner-code 内的文本标记与指令得以幸存，分支渲染时按需编译并全局缓存
 * （同一份内容跨实例只编译一次）。
 */
import { renderExtends } from "./render.mjs";
import { compileTemplate, moveChildren } from "./compile.mjs";

/** 需要 inner-code 内容保护的组件 */
export const needWrapTags = ["o-fill", "o-if", "o-else-if", "o-else"];

/** 内容编译缓存：内容原文 → 编译模板（o-if 与 o-fill 共享一张表） */
const compiledContents = new Map();

/** 按内容原文取编译模板（跨实例共享，编译一次） */
export const getCompiledContent = (html) => {
  let compiled = compiledContents.get(html);

  if (!compiled) {
    compiled = document.createElement("template");
    compiled.innerHTML = html;
    compileTemplate(compiled);
    compiledContents.set(html, compiled);
  }

  return compiled;
};

/**
 * 把 template 内所有 o-fill/条件组件的内容包进 template[inner-code]，
 * 并解开既有 inner-code 的嵌套（避免重复包裹导致渲染失败）。
 */
export const wrapTemp = (template) => {
  const eles = Array.from(
    template.content.querySelectorAll(needWrapTags.join(",")),
  );

  eles.forEach((e) => {
    while (true) {
      const innerCodeTempEl = e.querySelector("template[inner-code]");

      if (!innerCodeTempEl) {
        break;
      }

      // 解开已有的 inner-code 包裹
      const childs = innerCodeTempEl.content.childNodes;

      childs.forEach((child) => {
        innerCodeTempEl.parentNode.insertBefore(
          child.cloneNode(true),
          innerCodeTempEl,
        );
      });

      innerCodeTempEl.remove();
    }

    // 包裹必须走纯 DOM 搬运，禁止 innerHTML 往返：innerHTML 的解析受
    // 上下文元素影响（o-if/o-fill 属 body 上下文），表格/表单位置的
    // 内容会被解析器丢弃
    const innerCode = document.createElement("template");
    innerCode.setAttribute("inner-code", "");
    moveChildren(e, innerCode);
    e.append(innerCode);
    wrapTemp(innerCode);
  });
};

// afterConvert 钩子：结构变换必须先于宿主的描述符构建（路径依赖结构）
const oldAfterConvert = renderExtends.afterConvert;
renderExtends.afterConvert = (e) => {
  oldAfterConvert(e);
  const { template, temps } = e;
  wrapTemp(template);
  Object.values(temps).forEach((temp) => wrapTemp(temp));
};
