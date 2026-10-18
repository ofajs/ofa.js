// 各语言站点共用的 o-app 配置。
// SCSR 约定：不声明 home，当前 URL 的 HTML 就是首页。
// 站点目前只有首页；若后续增加文档页，每个真实路径各放一份 HTML，
// 由 scsr 接管站内跳转。

export const allowForward = true;

export const pageAnime = {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
};
