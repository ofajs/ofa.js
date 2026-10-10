/**
 * ofa.js 入口：在 xhear 之上补齐应用层能力。
 *
 * - 组件/页面模块系统（组件即 HTML 文件，浏览器直接运行，无构建）
 * - o-page / o-app 页面路由（嵌套路由、前进后退、页面动画）
 * - o-if / o-fill 模板语法（light DOM 条件与列表渲染）
 * - o-provider / o-consumer 上下文通信
 * - o-link 路由链接、inject-host 样式收编、match-var 属性样式
 */
import $ from "../../xhear/src/base.mjs";
import "./inject-host.mjs";
import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import "./extend.mjs";
import "./link.mjs";
import "./context.mjs";
import "./match-var.mjs";
import "./if.mjs";
import "./fill.mjs";
import Stanz from "../../stanz/src/main.mjs";

const version = "ofa.js@5.0.0";
$.version = version.replace("ofa.js@", "");

// URL 带 #debug 时开启调试模式（转译模块生成 sourcemap）
let isDebug = false;

try {
  const fileUrl = import.meta.url;
  isDebug = fileUrl.includes("#debug");
} catch (err) {
  isDebug = false;
}

Object.defineProperty($, "debugMode", {
  get: () => isDebug,
});

// 页面脚本与全局访问的约定入口
if (typeof window !== "undefined") {
  window.$ = $;
}

Object.defineProperty(globalThis, "ofa", {
  value: $,
});

export default $;

export { Stanz };
