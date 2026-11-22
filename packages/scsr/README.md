# Symphony Client-Server Rendering

服务端（或静态主机）投递真实 HTML 文件，scsr 在浏览器端把当前 URL
收编为 o-app 的应用内页面，并复用 o-router 的同步内核把应用路由同步到
浏览器历史（真实路径，非 hash）。效果：多 HTML 文件的站点 behaves
like SPA——首屏是服务端渲染的静态 HTML，站内跳转走 o-app 路由，
每个 URL 都可直接访问、分享与抓取。

用法、设计要点与踩坑见 [CONTEXT.md](./CONTEXT.md)。
