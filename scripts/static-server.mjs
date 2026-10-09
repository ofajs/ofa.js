import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

// 服务根目录与端口：node scripts/static-server.mjs [root]
const root = resolve(process.argv[2] || ".");
const port = Number(process.env.PORT || 3348);

// 关键 MIME 映射：.mjs 必须是 text/javascript，否则浏览器拒绝按模块导入
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    let path = decodeURIComponent(pathname);
    // 目录路径补 index.html
    if (path.endsWith("/")) {
      path += "index.html";
    }

    const filePath = normalize(join(root, path));

    // 防目录穿越：解析结果必须仍位于根目录内
    if (!filePath.startsWith(root + sep)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const data = await readFile(filePath);

    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
      // 允许跨域，便于跨端口/域名的加载类测试
      "Access-Control-Allow-Origin": "*",
      // 测试资源不做浏览器缓存，保证用例可重复
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end("Not Found");
  }
}).listen(port, () => {
  console.log(`static server => http://localhost:${port}/ (root: ${root})`);
});
