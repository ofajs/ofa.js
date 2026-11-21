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
// 延迟 200ms 显现，快网络下不闪烁；横向进度条与首屏 loading 保持一致。
const loadingLogo = new URL("./assets/logo.svg", import.meta.url).href;

export const loading = () => `
  <div
    class="site-route-loading"
    role="status"
    aria-live="polite"
    style="position:fixed;inset:0;z-index:9998;display:grid;place-items:center;background:var(--md-sys-color-surface, #111318);color:var(--md-sys-color-on-surface-variant, #8f9bb3);font-family:'PingFang SC','Microsoft YaHei',system-ui,sans-serif;opacity:0;animation:site-route-loading-in .15s ease .2s forwards"
  >
    <style>
      .site-route-loading-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        width: min(260px, 70vw);
      }
      .site-route-loading-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--md-sys-color-on-surface, #e2e2e9);
        line-height: 1;
      }
      .site-route-loading-logo {
        display: block;
        width: auto;
        height: 30px;
        flex: none;
      }
      .site-route-loading-wordmark {
        color: var(--md-sys-color-on-surface, #f3f5fa);
        font-family: "Space Grotesk", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .site-route-loading-wordmark span {
        color: var(--md-sys-color-on-surface-variant, #8f9bb3);
        font-weight: 450;
      }
      .site-route-loading-bar {
        width: 100%;
        height: 4px;
        border-radius: 99px;
        background: linear-gradient(90deg, var(--md-sys-color-surface-container-high, #252d3d) 0%, var(--md-sys-color-surface-container-high, #252d3d) 34%, var(--md-sys-color-primary, #7c9cff) 50%, color-mix(in srgb, var(--md-sys-color-primary) 45%, white) 56%, var(--md-sys-color-surface-container-high, #252d3d) 72%, var(--md-sys-color-surface-container-high, #252d3d) 100%);
        background-size: 220% 100%;
        box-shadow: 0 0 14px color-mix(in srgb, var(--md-sys-color-primary) 25%, transparent);
        animation: site-route-loading-bar 1.1s linear infinite;
      }
      .site-route-loading-label {
        color: var(--md-sys-color-on-surface-variant, #8f9bb3);
        font-family: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12.5px;
        font-weight: 400;
        letter-spacing: 0.03em;
      }
      @keyframes site-route-loading-in { to { opacity: 1; } }
      @keyframes site-route-loading-bar {
        from { background-position: 200% 0; }
        to { background-position: -100% 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .site-route-loading-bar { animation-duration: 2s; }
      }
    </style>
    <div class="site-route-loading-inner">
      <div class="site-route-loading-brand" aria-hidden="true">
        <img class="site-route-loading-logo" src="${loadingLogo}" width="28" height="30" alt="" />
        <span class="site-route-loading-wordmark">ofa<span>.js</span></span>
      </div>
      <div class="site-route-loading-bar" aria-hidden="true"></div>
      <div class="site-route-loading-label">正在加载页面…</div>
    </div>
  </div>
`;
