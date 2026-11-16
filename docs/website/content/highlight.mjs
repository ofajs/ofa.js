/**
 * 官网文档的轻量代码高亮。
 *
 * 不引入第三方高亮库：把 <pre><code> 的纯文本按 HTML / JS / CSS / shell
 * 的常见记号切成 span，再用站点现有的 M3 颜色 token 上色。
 */

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "of",
  "return",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "yield",
]);

const TOKEN_RE =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|<\/?[A-Za-z](?:[^<>"']|"[^"]*"|'[^']*')*>|\{\{[\s\S]*?\}\}|\b\d+(?:\.\d+)?\b|\b(?:as|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|get|if|import|in|instanceof|let|new|null|of|return|set|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|yield)\b)/g;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const classify = (token) => {
  if (token.startsWith("<!--") || token.startsWith("/*") || token.startsWith("//")) {
    return "comment";
  }
  if (token.startsWith("{{")) return "expr";
  if (token.startsWith("<")) return "tag";
  if (/^['"`]/.test(token)) return "str";
  if (/^\d/.test(token)) return "num";
  if (KEYWORDS.has(token)) return "kw";
  return "";
};

export const highlightCode = (source) => {
  let html = "";
  let last = 0;

  for (const match of source.matchAll(TOKEN_RE)) {
    const token = match[0];
    html += escapeHtml(source.slice(last, match.index));
    const type = classify(token);
    html += type
      ? `<span class="tok-${type}">${escapeHtml(token)}</span>`
      : escapeHtml(token);
    last = match.index + token.length;
  }

  html += escapeHtml(source.slice(last));
  return html;
};

export const highlightCodeBlocks = (root) => {
  for (const code of root.querySelectorAll("pre code")) {
    if (code.dataset.highlighted === "true") continue;
    code.innerHTML = highlightCode(code.textContent);
    code.dataset.highlighted = "true";
  }
};
