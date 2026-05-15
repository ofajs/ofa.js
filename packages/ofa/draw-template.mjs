import { resolvePath } from "./public.mjs";
import $ from "../xhear/base.mjs";

const strToBase64DataURI = async (str, mime, isb64 = true) => {
  const file = new File([str], "genfile", { type: mime });

  if (!isb64) {
    return URL.createObjectURL(file);
  }

  const result = await new Promise((resolve) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      resolve(e.target.result);
    };

    fr.readAsDataURL(file);
  });

  return result;
};

/**
 * In the actual logical code, the generated code and the source code actually use the exact same logic, with only a change in line numbers. Therefore, it is only necessary to map the generated valid code back to the corresponding line numbers in the source file.
 *  */
const getSourcemapUrl = async (
  filePath,
  originStarRowIndex,
  originEndRowIndex,
  originContent,
  startLine
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
        colId - beforeColIndex
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

  // 备份一份可修改的的原始内容
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

    // 替换 backupOriginContent 中已经sourcemap过的代码为换行符
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
      startLine
    );

    const sourcemapStr = `/*# sourceMappingURL=${sourceMapJSONURL}*/`;

    reTemp = reTemp.replace(
      outerHTML,
      `${outerHTML.replace("</style>", "")}\n${sourcemapStr}</style>`
    );
  }

  return reTemp;
};

const cacheLink = new Map();

export async function drawUrl(content, url, isPage = true) {
  let targetUrl = cacheLink.get(url);
  if (targetUrl) {
    return targetUrl;
  }

  let isDebug = $.debugMode;

  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  // If there is no content other than the <script>, then the shadow root is not set.
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

    temp = "<style>*:not(:defined){display:none;}</style>" + temp;
  }

  // 原来html文件中，转译后，属于前半部分的内容（后半部分就是script标签内的内容）
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
    scriptContent = scriptEl.html
      .split(/;/g)
      .map((content) => {
        const t_content = content.trim();
        // Confirm it is an import reference and correct the address
        if (/^import[ \{'"]/.test(t_content)) {
          // Update address string directly
          return content.replace(/['"]([\s\S]+)['"]/, (arg0, pathStr) => {
            return `"${resolvePath(pathStr, url)}"`;
          });
        }
        return content;
      })
      .join(";");
  }

  const fileContent = `${beforeContent};
${scriptContent}`;

  let sourcemapStr = "";

  if (isDebug) {
    const originLineArr = content.split("\n");

    // Determine the starting line number of the source file.
    const originStarRowIndex = originLineArr.findIndex(
      (lineContent) => {
        const trimmed = lineContent.trim();
        return trimmed === "<script>" || trimmed.startsWith("<script ");
      }
    );

    // Determine the ending line number of the source file.
    const originEndRowIndex = originLineArr.findIndex(
      (lineContent) => lineContent.trim() === "</script>"
    );

    sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
      url,
      originStarRowIndex,
      originEndRowIndex,
      content,
      beforeContent.split("\n").length
    )}`;
  }

  const finalContent = `${fileContent}\n${sourcemapStr}`;

  const isFirefox = navigator.userAgent.includes("Firefox");

  targetUrl = strToBase64DataURI(
    finalContent,
    "text/javascript",
    isFirefox ? false : true
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
