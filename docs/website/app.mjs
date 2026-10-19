// 各语言站点共用的 o-app 配置。
// SCSR 约定：不声明 home，当前 URL 的 HTML 就是首页。
// 每个真实路径各放一份 HTML，由 scsr 接管站内跳转。

export const allowForward = true;

const reducedMotion =
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export const pageAnime = reducedMotion
  ? {
      current: { opacity: 1 },
      next: { opacity: 0 },
      previous: { opacity: 0 },
    }
  : {
      current: { opacity: 1, transform: "none" },
      next: { opacity: 0, transform: "translate3d(40px, 0, 0)" },
      previous: { opacity: 0, transform: "translate3d(-20px, 0, 0)" },
    };
