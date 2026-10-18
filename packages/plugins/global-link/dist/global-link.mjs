//! ofa-global-link - v5.0.1 git+https://github.com/ofajs/ofa.js.git (c) 2018-2026 YAO
/**
 * global-link 插件（可选，引用才生效，不进 ofa.js 默认构建）：
 * `<o-global-link href="...">` 把一份样式表注入**所有组件**的 shadow 内，
 * 实现"全局组件样式"（适合存量项目迁移、主题变量统一下发）。
 *
 * ⚠️ 与全局变量一样会污染样式作用域，新项目优先用组件内 link 引入。
 *
 * 桥接形态：挂接页面已加载的 ofa.js 运行时（全局 $），须在 ofa.js
 * 之后加载（缺失时直接抛错）。
 *
 * 用法：
 *   import ".../plugins/global-link/global-link.mjs"; // 或 dist 形态
 *   <o-global-link href="./global.css"></o-global-link>
 */
const globalLinks = []; // 需要添加的 global style link

const OLDHREF = Symbol("oldHref");

const $ = window.$;

if (!$) {
  throw new Error(
    "[ofa-global-link] ofa.js must be loaded before the global-link plugin (window.$ is missing)",
  );
}

$.register({
  tag: "o-global-link",
  attrs: {
    href: "",
  },
  watch: {
    href() {
      this._adjustLink();
    },
  },
  proto: {
    _removeOld() {
      if (this[OLDHREF]) {
        // 去掉旧的份额
        const oldIndex = globalLinks.indexOf(this[OLDHREF]);

        if (oldIndex > -1) {
          globalLinks.splice(oldIndex, 1);
        }
      }
    },
    _adjustLink() {
      const fixedHref = new URL(this.href, location).href;

      if (this[OLDHREF] === fixedHref) {
        return;
      }

      this._removeOld();

      this[OLDHREF] = fixedHref;

      globalLinks.push(fixedHref); // 添加到份额内
    },
  },
  attached() {
    this._adjustLink();
  },
  detached() {
    this._removeOld();
  },
});

// afterAttached 是共享单槽：链式接住已有钩子，不独占（插件道德）
const prevAfterAttached = $.extensions.afterAttached;

$.extensions.afterAttached = (el) => {
  prevAfterAttached && prevAfterAttached(el);

  if (el.tag !== "o-global-link") {
    // 添加 globalLink
    globalLinks.forEach(
      (href) =>
        el.shadow && el.shadow.push(`<link rel="stylesheet" href="${href}">`)
    );
  }
};
