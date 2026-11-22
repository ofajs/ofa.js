/**
 * x-if / x-else-if / x-else / x-fill 弃用提示。
 *
 * v5 起条件与列表渲染统一为 o-if / o-else-if / o-else / o-fill，x- 系
 * 元素不再注册。两条检测路径：
 * 1. 编译期扫描：compileTemplate 发现模板里有 x- 系标签时调用 warnXTag；
 * 2. stub 元素：未经编译的裸用（静态 HTML、第三方 cloneNode）在元素
 *    升级接入文档时也会报错。
 * 同名标签只报一次，避免刷屏。
 */
const warned = new Set();

export const warnXTag = (tag) => {
  if (warned.has(tag)) {
    return;
  }
  warned.add(tag);

  console.error(
    `[ofa.js] "${tag}" 已在新版弃用 / deprecated in v5+：` +
      `条件与列表渲染请改用 o-if / o-else-if / o-else / o-fill` +
      ` (use the "o-" tags instead)`,
  );
};

// stub 元素保持惰性（无渲染逻辑），只负责在接入文档时报弃用提示
if (typeof customElements !== "undefined") {
  ["x-if", "x-else-if", "x-else", "x-fill"].forEach((tag) => {
    customElements.define(
      tag,
      class extends HTMLElement {
        connectedCallback() {
          warnXTag(tag);
        }
      },
    );
  });
}
