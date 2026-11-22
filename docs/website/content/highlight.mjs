/**
 * 官网文档的轻量代码高亮。
 *
 * 不引入第三方高亮库：自动识别 HTML / JS / CSS，把代码切成 token 后用
 * 站点现有的 M3 颜色 token 上色。HTML 模式会额外识别标签名、属性名、
 * 属性值，以及 script/style 内部的 JS/CSS。
 */

const KEYWORDS = new Set([
  "as", "async", "await", "break", "case", "catch", "class", "const",
  "continue", "default", "delete", "do", "else", "export", "extends",
  "false", "finally", "for", "from", "function", "get", "if", "import",
  "in", "instanceof", "let", "new", "null", "of", "return", "set",
  "static", "super", "switch", "this", "throw", "true", "try", "typeof",
  "undefined", "var", "void", "while", "yield",
]);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const span = (type, text) =>
  `<span class="tok-${type}">${escapeHtml(text)}</span>`;

const HTML_TEXT_RE = /(\{\{[\s\S]*?\}\})/g;

const highlightHtmlText = (text) =>
  text
    .split(HTML_TEXT_RE)
    .map((part, index) =>
      index % 2 === 1 ? span("expr", part) : escapeHtml(part),
    )
    .join("");

const highlightTag = (tag) => {
  const match = tag.match(/^(<\/?)([A-Za-z][\w-]*)([\s\S]*?)(\/?>)$/);
  if (!match) return escapeHtml(tag);

  const [, open, name, attrs, close] = match;
  const attrRe = /(\s+)([\w:@.-]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+))?/g;
  let body = "";
  let last = 0;

  for (const attr of attrs.matchAll(attrRe)) {
    body += escapeHtml(attrs.slice(last, attr.index));
    if (attr[4] !== undefined) {
      body +=
        span("punct", attr[1]) +
        span("attr", attr[2]) +
        span("punct", attr[3]) +
        span("str", attr[4]);
    } else {
      body += span("punct", attr[1]) + span("attr", attr[2]);
    }
    last = attr.index + attr[0].length;
  }
  body += escapeHtml(attrs.slice(last));

  return (
    span("punct", open) +
    span("tag", name) +
    body +
    span("punct", close)
  );
};

const highlightJs = (source) => {
  const tokenRe =
    /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\{\{[\s\S]*?\}\}|\b\d+(?:\.\d+)?\b|\b(?:as|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|get|if|import|in|instanceof|let|new|null|of|return|set|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|yield)\b)/g;
  let out = "";
  let last = 0;

  for (const match of source.matchAll(tokenRe)) {
    const token = match[0];
    out += escapeHtml(source.slice(last, match.index));
    if (token.startsWith("{{")) out += span("expr", token);
    else if (token.startsWith("<!--") || token.startsWith("/*") || token.startsWith("//")) out += span("comment", token);
    else if (/^['"`]/.test(token)) out += span("str", token);
    else if (/^\d/.test(token)) out += span("num", token);
    else out += span("kw", token);
    last = match.index + token.length;
  }

  out += escapeHtml(source.slice(last));
  return out;
};

const highlightCss = (source) => {
  const tokenRe =
    /(\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|@[\w-]+|\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|vh|vw|fr)?\b|#[\da-fA-F]{3,8}\b|--[\w-]+\b)/g;
  let out = "";
  let last = 0;

  for (const match of source.matchAll(tokenRe)) {
    const token = match[0];
    out += escapeHtml(source.slice(last, match.index));
    if (token.startsWith("/*")) out += span("comment", token);
    else if (/^['"]/.test(token)) out += span("str", token);
    else if (token.startsWith("@")) out += span("kw", token);
    else if (token.startsWith("#")) out += span("num", token);
    else out += span("num", token);
    last = match.index + token.length;
  }

  out += escapeHtml(source.slice(last));
  return out;
};

const highlightHtml = (source) => {
  let out = "";
  let index = 0;

  while (index < source.length) {
    const nextTag = source.indexOf("<", index);
    if (nextTag < 0) {
      out += highlightHtmlText(source.slice(index));
      break;
    }

    if (nextTag > index) {
      out += highlightHtmlText(source.slice(index, nextTag));
    }

    if (source.startsWith("<!--", nextTag)) {
      const end = source.indexOf("-->", nextTag + 4);
      const stop = end < 0 ? source.length : end + 3;
      out += span("comment", source.slice(nextTag, stop));
      index = stop;
      continue;
    }

    if (!/^<\/?[A-Za-z]/.test(source.slice(nextTag))) {
      out += escapeHtml(source[nextTag]);
      index = nextTag + 1;
      continue;
    }

    let cursor = nextTag + 1;
    let quote = "";
    while (cursor < source.length) {
      const char = source[cursor];
      if (quote) {
        if (char === quote) quote = "";
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === ">") {
        break;
      }
      cursor += 1;
    }

    const tag = source.slice(nextTag, cursor + 1);
    out += highlightTag(tag);

    const embedded = tag.match(/^<(script|style)\b/i);
    if (embedded && !tag.startsWith("</")) {
      const language = embedded[1].toLowerCase();
      const closing = source.toLowerCase().indexOf(`</${language}`, cursor + 1);
      if (closing > -1) {
        const inner = source.slice(cursor + 1, closing);
        out += language === "script" ? highlightJs(inner) : highlightCss(inner);
        index = closing;
        continue;
      }
    }

    index = cursor + 1;
  }

  return out;
};

const detectLanguage = (source) => {
  const text = source.trimStart();
  if (/^<!--|^<!doctype|^<[A-Za-z][\w-]*[\s>/]/.test(text)) return "html";
  if (
    /^\s*(\$\(|export|import|const|let|var|function|class|async|\/\/|\/\*)/.test(text) ||
    /=>|\b(proto|watch|attrs|data)\s*:|\bthis\./.test(text)
  ) {
    return "js";
  }
  if (/^\s*([.#][\w-]+|:host|:root|@media|@supports|@keyframes)/.test(text)) return "css";
  return "text";
};

export const highlightCode = (source) => {
  switch (detectLanguage(source)) {
    case "html":
      return highlightHtml(source);
    case "js":
      return highlightJs(source);
    case "css":
      return highlightCss(source);
    default:
      return escapeHtml(source);
  }
};

export const highlightCodeBlocks = (root) => {
  for (const code of root.querySelectorAll("pre code")) {
    if (code.dataset.highlighted === "true") continue;
    code.innerHTML = highlightCode(code.textContent);
    code.dataset.highlighted = "true";
  }
};
