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
// 回首页的链接用配置模块地址算绝对 URL：失败页的位置不可靠，
// 相对路径会基于失败页地址叠加（pages/pages/...）
const homeUrl = new URL("./pages/home.html", import.meta.url).href;

export const fail = ({ src }) =>
  `<div style="padding:24px;">
    <h2>404 · 页面加载失败</h2>
    <p>地址：${src}</p>
    <a href="${homeUrl}" olink>回首页</a>
  </div>`;
