const express = require("express");
const ejs = require("ejs");
const path = require("path");

const app = express();
const PORT = 3000;

// 设置模板引擎为 ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages"));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "static")));

// 路由处理 - 根据ofa.js的同构渲染概念
app.get("*", (req, res) => {
  // 获取请求路径以确定要渲染的页面
  const pagePath = req.path === "/" ? "/home" : req.path;

  // 页面映射
  const pageMap = {
    "/": "home",
    "/home": "home",
    "/about": "about",
    "/contact": "contact",
  };

  const normalizedPath = pageMap[pagePath] || "404";

  // 服务端数据 - 生成随机标识字符串
  const serverData = {
    randomId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    timestamp: Date.now(),
  };

  // 生成完整的HTML页面 - 符合ofa.js同构渲染结构
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ofa.js SSR Demo</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    <%- body %>
  </o-app>
</body>
</html>`;

  // 渲染页面模板并嵌入到主 HTML 中
  ejs.renderFile(path.join(__dirname, "pages", `${normalizedPath}.ejs`), serverData, (err, pageContent) => {
    if (err) {
      console.error(`Error rendering template: ${normalizedPath}.ejs`, err);
      return res.status(500).send("Internal Server Error");
    }

    const finalHtml = html.replace("<%- body %>", pageContent);
    
    // 设置正确的Content-Type头部
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("SSR demo with ofa.js is ready!");
});

module.exports = app;
