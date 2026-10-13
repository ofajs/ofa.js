// .mjs 页面模块内的相对 import：模块地址基于页面文件地址解析
import { data1 } from "./relate-data.mjs";

export const type = $.PAGE;

export const temp = `<div class="page-root" id="relate-import-out">d1:{{d1}}</div>`;

export const data = {
  d1: data1,
};
