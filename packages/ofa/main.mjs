import $ from "../xhear/base.mjs";
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
import Stanz from "../stanz/main.mjs";

const version = "ofa.js@4.6.22";
$.version = version.replace("ofa.js@", "");

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

if (typeof window !== "undefined") {
  window.$ = $;
}

Object.defineProperty(globalThis, "ofa", {
  value: $,
});

export default $;

export { Stanz };
