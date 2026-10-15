// 应用配置模块（o-app 的 src 指向它）
export const home = "./pages/home.html";

// 允许 forward()（forward 需要显式开启）
export const allowForward = true;

// 页面进出动画：淡入淡出 + 少量位移（同方向漂移的 shared-axis 风格）
// - 前进（goto / olink）：新页从右侧 30px 处淡入，旧页向左 30px 淡出；
// - 后退（back）：方向镜像，新页从左淡入、旧页向右淡出。
// next / previous 在框架里身兼两职——既是新页入场的起始态，也是旧页
// 离场的目标态，同一组值天然保证进出两页同向漂移、方向语义一致。
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// 页面加载失败时的自定义内容（如 goto 到不存在的页面）。
// 失败页无法得知 parent 链（模块加载失败），作为根级页面整页渲染。
// 回首页的链接用配置模块地址算绝对 URL：失败页的位置不可靠，
// 相对路径会基于失败页地址叠加（pages/pages/...）
const homeUrl = new URL("./pages/home.html", import.meta.url).href;

export const fail = ({ src }) =>
  `<style>
    .stage { min-height: 72vh; display: grid; place-items: center; padding: 24px; }
    .box {
      text-align: center; max-width: 520px;
      background: var(--card); border: 1px solid var(--border); border-radius: 22px;
      padding: 42px 46px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 20px 44px -20px rgba(15, 23, 42, 0.16);
    }
    .num {
      font-size: 60px; font-weight: 800; line-height: 1; letter-spacing: -2px;
      background: linear-gradient(120deg, var(--accent), var(--accent-2));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .box h2 { margin: 12px 0 6px; font-size: 19px; }
    .box p { margin: 0 0 10px; color: var(--muted); font-size: 13.5px; }
    .src {
      display: block; margin: 0 0 22px; padding: 10px 14px;
      background: #0f172a; color: #a5f3fc; border-radius: 10px;
      font-size: 12px; word-break: break-all; text-align: left;
    }
    .btn {
      display: inline-block; padding: 9px 20px; border-radius: 11px; text-decoration: none;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #fff; font-size: 14px; font-weight: 600;
      box-shadow: 0 6px 16px -6px rgba(79, 70, 229, 0.55);
    }
  </style>
  <div class="stage">
    <div class="box">
      <div class="num">404</div>
      <h2>页面加载失败</h2>
      <p>fail({ src }) 自定义渲染 · 目标地址：</p>
      <code class="src">${src}</code>
      <a class="btn" olink href="${homeUrl}">回首页</a>
    </div>
  </div>`;
