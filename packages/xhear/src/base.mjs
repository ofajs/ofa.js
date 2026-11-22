/**
 * xhear 入口：组装 $ 对象。
 *
 * $ 本体是元素工厂/选择器（dollar.mjs），这里把 stanz 工厂、注册器、
 * 渲染底层、原型引用等挂为 $ 的静态能力，构成完整的对外 API 面。
 */
import { eleX } from "./util.mjs";
import { render } from "./render/render.mjs";
import { convert } from "./render/compile.mjs";
import Xhear from "./main.mjs";
import stanz from "../../stanz/src/base.mjs";
import Stanz from "../../stanz/src/main.mjs";
import { register } from "./register.mjs";
import { searchEle } from "./public.mjs";
import $ from "./dollar.mjs";
import { nextTick } from "../../stanz/src/public.mjs";

Object.assign($, {
  stanz,
  Stanz,
  // render/convert 是模板编译与绑定的底层入口（上层框架直接复用）
  render,
  convert,
  register,
  nextTick,
  fn: Xhear.prototype,
  all: (expr) => searchEle(document, expr).map(eleX),
  frag: () => $(document.createDocumentFragment()),
});

export default $;
