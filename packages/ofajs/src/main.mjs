/**
 * ofa.js 入口：在 xhear 之上补齐应用层能力。
 *
 * - 组件/页面模块系统（组件即 HTML 文件，浏览器直接运行，无构建）
 * - o-page / o-app 页面路由（嵌套路由、前进后退、页面动画）
 * - o-if / o-fill 模板语法（实现已下沉 xhear）
 * - o-provider / o-consumer 上下文通信
 * - o-link 路由链接、match-var 属性样式
 * （inject-host 已拆分为 packages/plugins/inject-host 独立插件）
 */
import $ from "../../xhear/src/base.mjs";
import { setDebugLog } from "../../xhear/src/debug.mjs";
import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import "./extend.mjs";
import "./link.mjs";
import "./context.mjs";
import "./match-var.mjs";
import Stanz from "../../stanz/src/main.mjs";

const version = "ofa.js@5.0.2";
$.version = version.replace("ofa.js@", "");

// URL 带 #debug 时开启调试（转译模块生成 sourcemap，报错行号映射回源
// HTML）——只管 sourcemap；内部诊断日志由 $.showlog / OFA_SHOWLOG 独立控制
let isDebug = false;

try {
  const fileUrl = import.meta.url;
  isDebug = fileUrl.includes("#debug");
} catch (err) {
  isDebug = false;
}

// 框架内部诊断日志开关：默认关，显示需**同时**满足——① #debug 已开启
// （isDebug）；② 显式设置日志开关：加载前设 globalThis.OFA_SHOWLOG = true
// （可捕获启动期日志），加载后随时 $.showlog = true/false 开关
let showLog = globalThis.OFA_SHOWLOG === true;

const updateLogGate = () => setDebugLog(isDebug && showLog);

updateLogGate();

Object.defineProperty($, "showlog", {
  get: () => showLog,
  set: (val) => {
    showLog = !!val;
    updateLogGate();
  },
});

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
