// 应用配置模块（o-app 的 src 指向它）
export const home = "./pages/home.html";

// 允许 forward()（forward 需要显式开启）
export const allowForward = true;

// 页面进出动画（淡入淡出）
export const pageAnime = {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
};

// 页面加载失败时的自定义内容（如 goto 到不存在的页面）
export const fail = ({ src }) =>
  `<div style="padding:24px;">
    <h2>404 · 页面加载失败</h2>
    <p>地址：${src}</p>
    <a href="./pages/home.html" olink>回首页</a>
  </div>`;
