/**
 * HTML 页面/组件文件 → 可执行 JS 模块 的转换器。
 *
 * ofa.js 的开发形态是"组件即 HTML 文件"：文件内 `<template component|page>`
 * 声明组件/页面，`<script>` 承载逻辑，其余内容为模板。drawUrl 把这样的
 * 文件转译成一个 data URI 的 ES 模块（导出 type/temp/title 与原逻辑），
 * 由 drill 加载执行——无构建步骤，浏览器即所见即所得。
 *
 * 转译保持行号对齐（生成代码的前半部分与原文件逐行对应），并可选生成
 * sourcemap（debugMode）把行号映射回原文件，方便断点与报错定位。
 */
import { resolvePath } from "./public.mjs";
import $ from "../../xhear/src/base.mjs";

const strToBase64DataURI = async (str, mime, isb64 = true) => {
  const file = new File([str], "genfile", { type: mime });

  if (!isb64) {
    return URL.createObjectURL(file);
  }

  return await new Promise((resolve) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      resolve(e.target.result);
    };

    fr.readAsDataURL(file);
  });
};

/**
 * 生成把生成代码映射回源文件行号的 sourcemap data URI。
 * 生成代码与源码逻辑完全一致、只差行号，因此只需把生成行映射回源行。
 */
const getSourcemapUrl = async (
  filePath,
  originStarRowIndex,
  originEndRowIndex,
  originContent,
  startLine,
) => {
  const originLineArr = originContent.split("\n");

  let mappings = "";

  for (let i = 0; i <= startLine; i++) {
    mappings += ";";
  }

  let beforeRowIndex = 0;
  let beforeColIndex = 0;

  for (let rowId = originStarRowIndex + 1; rowId < originEndRowIndex; rowId++) {
    const target = originLineArr[rowId] || "";

    let rowStr = "";

    Array.from(target).forEach((e, colId) => {
      const currentStr = `AA${vlcEncode(rowId - beforeRowIndex)}${vlcEncode(
        colId - beforeColIndex,
      )}`;

      if (!rowStr) {
        rowStr = currentStr;
      } else {
        rowStr += `,${currentStr}`;
      }

      beforeRowIndex = rowId;
      beforeColIndex = colId;
    });

    mappings += `${rowStr};`;
  }

  const sourcesContent = JSON.stringify([originContent])
    .replace(/^\[/, "")
    .replace(/\]$/, "");

  const str = `{"version": 3,
    "sources": ["${filePath.replace(/\?.+/, "")}"],
    "sourcesContent":[${sourcesContent}],
    "mappings": "${mappings}"}`;

  return await strToBase64DataURI(str, "application/json");
};

// 将 style 映射为 sourcemap 的 base64 link 标签，方便调试
const addStyleSourcemap = async (temp, originContent, filePath) => {
  let reTemp = temp;

  // 备份一份可修改的原始内容（已处理过的部分替换为等量换行，保持行号）
  let backupOriginContent = originContent;

  const tempEl = document.createElement("template");
  tempEl.innerHTML = temp;

  const styleEls = tempEl.content.querySelectorAll("style");

  for (let e of Array.from(styleEls)) {
    const styleContent = e.innerHTML;
    const { outerHTML } = e;

    // 编译后开始的行数
    let startLine = 0;

    // 拆分原内容
    const matchArr = backupOriginContent.split(outerHTML);

    // 编译前开始的行数
    const originStarRowIndex = matchArr[0].split("\n").length - 1;

    // 编译前结束的行数
    const originEndRowIndex =
      originStarRowIndex + styleContent.split("\n").length - 1;

    // 已处理部分替换为换行，保证后续 style 的行号计算仍正确
    let middleStr = "";
    for (let i = 0, len = outerHTML.split("\n").length - 1; i < len; i++) {
      middleStr += "\n";
    }
    backupOriginContent = [matchArr[0], middleStr, matchArr[1]].join("");

    const sourceMapJSONURL = await getSourcemapUrl(
      filePath,
      originStarRowIndex,
      originEndRowIndex,
      originContent,
      startLine,
    );

    const sourcemapStr = `/*# sourceMappingURL=${sourceMapJSONURL}*/`;

    reTemp = reTemp.replace(
      outerHTML,
      `${outerHTML.replace("</style>", "")}\n${sourcemapStr}</style>`,
    );
  }

  return reTemp;
};

const cacheLink = new Map();

const isIdChar = (char) => /[A-Za-z0-9_$]/.test(char);

/** 跳过带引号字符串（含转义），返回结束引号后的下标 */
const skipString = (code, start) => {
  const quote = code[start];
  let i = start + 1;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (code[i] === quote) {
      return i + 1;
    }
    i++;
  }
  return i;
};

/** 跳过模板字符串（含 ${} 插值嵌套），返回结束反引号后的下标 */
const skipTemplate = (code, start) => {
  let i = start + 1;
  let depth = 0;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (depth === 0) {
      if (code[i] === "`") {
        return i + 1;
      }
      if (code[i] === "$" && code[i + 1] === "{") {
        depth = 1;
        i += 2;
        continue;
      }
    } else {
      if (code[i] === "{") {
        depth++;
      } else if (code[i] === "}") {
        depth--;
      }
    }
    i++;
  }
  return i;
};

/** 跳过正则字面量，返回结束斜杠后的下标 */
const skipRegExp = (code, start) => {
  let i = start + 1;
  let inClass = false;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (code[i] === "\n") {
      break;
    }
    if (inClass) {
      if (code[i] === "]") {
        inClass = false;
      }
    } else if (code[i] === "[") {
      inClass = true;
    } else if (code[i] === "/") {
      return i + 1;
    }
    i++;
  }
  return i;
};

/**
 * 扫描脚本代码，把每个顶层 import 声明的模块说明符用 resolvePath 重写
 * 为基于文件地址的绝对路径。注释、字符串、模板字符串与正则字面量原样
 * 透过，因此被注释包裹或后随注释的 import 也能正确重写；import() 与
 * import.meta 不属于静态声明，保持原样。
 */
const rewriteImportPaths = (code, url) => {
  let output = "";
  let i = 0;
  let prev = ""; // 上一个有效代码字符，用于区分正则与除法

  while (i < code.length) {
    const char = code[i];

    // 行注释
    if (char === "/" && code[i + 1] === "/") {
      let end = code.indexOf("\n", i);
      if (end === -1) {
        end = code.length;
      }
      output += code.slice(i, end);
      i = end;
      continue;
    }

    // 块注释
    if (char === "/" && code[i + 1] === "*") {
      let end = code.indexOf("*/", i + 2);
      end = end === -1 ? code.length : end + 2;
      output += code.slice(i, end);
      i = end;
      continue;
    }

    // 字符串
    if (char === '"' || char === "'") {
      const end = skipString(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 模板字符串
    if (char === "`") {
      const end = skipTemplate(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 正则字面量（无法成为除法的斜杠）
    if (
      char === "/" &&
      !isIdChar(prev) &&
      !")]}".includes(prev) &&
      prev !== '"' &&
      prev !== "'" &&
      prev !== "`"
    ) {
      const end = skipRegExp(code, i);
      output += code.slice(i, end);
      i = end;
      prev = char;
      continue;
    }

    // 顶层 import 关键字
    if (
      char === "i" &&
      !isIdChar(prev) &&
      code.startsWith("import", i) &&
      !isIdChar(code[i + 6])
    ) {
      // 定位关键字后的第一个字符串 token；import( 与 import.meta 不是
      // 静态声明，保持原样
      let j = i + 6;
      let specifierStart = -1;
      let specifierEnd = -1;
      let quote = "";
      while (j < code.length) {
        const cj = code[j];
        if (/\s/.test(cj)) {
          j++;
          continue;
        }
        if (cj === "/" && code[j + 1] === "/") {
          const end = code.indexOf("\n", j);
          j = end === -1 ? code.length : end;
          continue;
        }
        if (cj === "/" && code[j + 1] === "*") {
          const end = code.indexOf("*/", j + 2);
          j = end === -1 ? code.length : end + 2;
          continue;
        }
        if (cj === "(" || cj === ".") {
          break;
        }
        if (cj === '"' || cj === "'") {
          specifierStart = j + 1;
          specifierEnd = skipString(code, j) - 1;
          quote = cj;
          break;
        }
        j++;
      }

      if (specifierStart !== -1) {
        const pathStr = code.slice(specifierStart, specifierEnd);
        output += code.slice(i, specifierStart - 1);
        output += `${quote}${resolvePath(pathStr, url)}${quote}`;
        i = specifierEnd + 1;
        continue;
      }
    }

    if (!/\s/.test(char)) {
      prev = char;
    }
    output += char;
    i++;
  }

  return output;
};

/**
 * 把页面/组件 HTML 文件转译为 data URI 模块地址（带缓存）。
 *
 * @param {string} content HTML 文件内容
 * @param {string} url 文件地址
 * @param {boolean} isPage true 为页面（template[page]），false 为组件
 */
export async function drawUrl(content, url, isPage = true) {
  let targetUrl = cacheLink.get(url);
  if (targetUrl) {
    return targetUrl;
  }

  const isDebug = $.debugMode;

  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  // 除 script 外没有其他内容时，不设置 shadow root
  const hasTemp = !!targetTemp.html
    .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, "")
    .trim();
  let temp = "";

  if (hasTemp) {
    temp = targetTemp.html
      .replace(/\s+$/, "")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");

    if (isDebug) {
      temp = await addStyleSourcemap(temp, content, url);
    }

    // 未定义前隐藏，防止自定义元素升级前的闪烁
    temp = "<style>*:not(:defined){display:none;}</style>" + temp;
  }

  // 生成代码的前半部分（后半部分是原 script 内容）
  const beforeContent = `
  export const type = ${isPage ? "ofa.PAGE" : "ofa.COMP"};
  ${
    isPage && titleEl
      ? `export const title = '${titleEl.text.replace(/\'/g, "\\'")}';`
      : ""
  }
  export const temp = \`${temp}\`;`;

  let scriptContent = "";
  if (scriptEl) {
    scriptContent = rewriteImportPaths(scriptEl.html, url);
  }

  const fileContent = `${beforeContent};
${scriptContent}`;

  let sourcemapStr = "";

  if (isDebug) {
    const originLineArr = content.split("\n");

    // 定位源文件中 script 的起止行
    const originStarRowIndex = originLineArr.findIndex((lineContent) => {
      const trimmed = lineContent.trim();
      return trimmed === "<script>" || trimmed.startsWith("<script ");
    });

    const originEndRowIndex = originLineArr.findIndex(
      (lineContent) => lineContent.trim() === "</script>",
    );

    sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
      url,
      originStarRowIndex,
      originEndRowIndex,
      content,
      beforeContent.split("\n").length,
    )}`;
  }

  const finalContent = `${fileContent}\n${sourcemapStr}`;


  // Firefox 对 data URI 模块的模块图有限制，改走 blob URL
  const isFirefox = navigator.userAgent.includes("Firefox");

  targetUrl = await strToBase64DataURI(
    finalContent,
    "text/javascript",
    isFirefox ? false : true,
  );

  cacheLink.set(url, targetUrl);

  return targetUrl;
}

const base64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toVLQSigned(value) {
  return value < 0 ? (-value << 1) + 1 : (value << 1) + 0;
}

function vlcEncode(value) {
  let encoded = "";
  let vlq = toVLQSigned(value);

  do {
    let digit = vlq & 0b11111;
    vlq >>>= 5;
    if (vlq > 0) {
      digit |= 0b100000;
    }
    encoded += base64[digit];
  } while (vlq > 0);

  return encoded;
}
