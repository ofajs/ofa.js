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

// 站内路由切换：顶部细进度条，不遮挡当前页面。
// 延迟 120ms 显现，快网络下不闪烁；加载完成后由 o-app 移除。
// 装饰样式复用 styles/loading.css。
const loadingCss = new URL("./styles/loading.css", import.meta.url).href;
const loadingLabel = document.documentElement.lang.startsWith("en")
  ? "Loading page"
  : document.documentElement.lang.startsWith("zh-Hant")
    ? "頁面載入中"
    : document.documentElement.lang.startsWith("ja")
      ? "ページを読み込み中"
      : document.documentElement.lang.startsWith("es")
        ? "Cargando página"
        : "页面加载中";

export const loading = () => `
  <div class="route-progress" role="progressbar" aria-label="${loadingLabel}">
    <link
      rel="stylesheet"
      href="${loadingCss}"
      media="print"
      onload="this.media='all'"
    />
  </div>
`;
