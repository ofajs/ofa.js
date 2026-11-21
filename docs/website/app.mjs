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

// 站内路由切换时的居中 loading，页面数据加载完成后由 o-app 移除。
// 装饰样式复用 styles/loading.css，这里只保留遮罩定位、延迟出现和关键帧。
const loadingLogo = new URL("./assets/logo.svg", import.meta.url).href;
const loadingCss = new URL("./styles/loading.css", import.meta.url).href;

export const loading = () => `
  <div
    class="site-route-loading"
    role="status"
    aria-live="polite"
    style="position:fixed;inset:0;z-index:9998;display:grid;place-items:center;background:var(--md-sys-color-surface, #111318);opacity:0;animation:site-route-loading-in .15s ease .2s forwards"
  >
    <style>
      @keyframes site-route-loading-in {
        to { opacity: 1; }
      }
    </style>
    <link
      rel="stylesheet"
      href="${loadingCss}"
      media="print"
      onload="this.media='all'"
    />
    <div class="site-loading-inner">
      <div class="site-loading-brand" aria-hidden="true">
        <img class="site-loading-logo" src="${loadingLogo}" width="28" height="30" alt="" />
        <span class="site-loading-wordmark">ofa<span>.js</span></span>
      </div>
      <div class="site-loading-bar" aria-hidden="true"></div>
      <div class="site-loading-label">正在加载页面…</div>
    </div>
  </div>
`;
