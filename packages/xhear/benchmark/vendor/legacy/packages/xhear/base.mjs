import { eleX } from "./util.mjs";
import { render, convert } from "./render/render.mjs";
import Xhear from "./main.mjs";
import stanz from "../stanz/base.mjs";
import Stanz from "../stanz/main.mjs";
import { register } from "./register.mjs";
import { searchEle } from "./public.mjs";
import $ from "./dollar.mjs";
import { nextTick } from "../stanz/public.mjs";

Object.assign($, {
  stanz,
  Stanz,
  render,
  convert,
  register,
  nextTick,
  fn: Xhear.prototype,
  all: (expr) => searchEle(document, expr).map(eleX),
  frag: () => $(document.createDocumentFragment()),
});

export default $;
