// scsr 案例的应用配置。
// 注意不声明 home：SCSR 约定下首页就是当前 URL 的页面，
// 由 scsr 收编为 o-page，配置 home 反而会与之竞争。

// 页面进出动画：原生 App 式方向推入（页面栈压栈/弹栈的手感）
// - 前进（goto / olink）：新页从右侧推入，旧页向左推出；
// - 后退（back）：旧页向右推出，新页从左侧推入。
// transition 会覆盖框架默认的 all ease .3s（pageAnime 的值最后合入
// 页面样式），三个状态保持同一时长与缓动，进出两页才能严格同步。
// 时长须小于离场动画 350ms 的兜底收尾，这里取 320ms。
const ease = "cubic-bezier(0.32, 0.72, 0, 1)";
const motion = `transform 0.32s ${ease}, box-shadow 0.32s ${ease}`;

export const pageAnime = {
  current: {
    transform: "translateX(0)",
    boxShadow: "none",
    transition: motion,
  },
  // "右侧"：前进时新页的入场起点 / 后退时旧页的离场终点
  next: {
    transform: "translateX(100%)",
    boxShadow: "-16px 0 32px rgba(0, 0, 0, 0.12)",
    transition: motion,
  },
  // "左侧"：后退时新页的入场起点 / 前进时旧页的离场终点
  previous: {
    transform: "translateX(-100%)",
    boxShadow: "16px 0 32px rgba(0, 0, 0, 0.12)",
    transition: motion,
  },
};

// 页面加载失败时的自定义内容（如 goto 到不存在的页面）。
// fail 内容渲染在 o-page 的 shadow 里，样式需自包含
// （:root 变量可穿透 shadow，类样式不能）。
export const fail = ({ src }) =>
  `<style>
    .stage { min-height: 72vh; display: grid; place-items: center; padding: 24px; }
    .box {
      text-align: center; max-width: 520px;
      background: var(--card); border: 1px solid var(--border); border-radius: 22px;
      padding: 42px 46px;
      box-shadow: 0 20px 44px -20px rgba(15, 23, 42, 0.16);
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
    .home {
      display: inline-block; padding: .4em 1em; border-radius: .375em;
      background: var(--accent); color: #fff; text-decoration: none; font-size: 14px;
    }
  </style>
  <div class="stage">
    <div class="box">
      <div class="num">404</div>
      <h2>页面加载失败</h2>
      <p>scsr 仍是应用内切换（地址会变成下面这个真实路径），只是内容换成了 fail 页：</p>
      <code class="src">${src}</code>
      <a class="home" olink href="../index.html">回首页</a>
    </div>
  </div>`;
