/**
 * o-router 的 history 同步内核。
 *
 * 职责只有一个：维持「o-app 路由栈 ↔ 浏览器历史」的双向同步——
 * - 应用路由（router-change）→ 写 history：goto/forward 用 pushState、
 *   replace 用 replaceState、back 用 history.go(-delta)；
 * - 浏览器历史（popstate）→ 驱动应用：按条目里保存的路由栈与当前
 *   路由栈的深度差，驱动 app.back(n) / app.goto(target)；带 ignore
 *   标记的条目直接跳过（scsr 等宿主为锚点定位类条目写入的标记）。
 *
 * 回波抑制不再依赖标志位：应用导航完成后 URL 必然与目标 hash 地址
 * 一致，RC 处理器发现 location.href 已是目标地址时直接跳过写入
 * （popstate 驱动的导航正是如此到达的）。app.goto/back 因同 src
 * 等 reason no-op 时也不会有任何副作用——无标志即无卡死。
 * 桥接包不 import 框架源码（避免与 dist ofa.js 并存时出现第二份框架
 * 实例），依赖全走页面运行时。
 */

// 与 xhear 内部同式的 Safari 判定（内联以免 import 框架源码）
const isSafariBrowser = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function initRouter({ app, getStateUrl, fixStateUrl }) {
  // reload 后 history.state 仍在：同步恢复路由栈（setter 置
  // _settedRouters，app 挂载配置 home 时据此跳过，避免双重挂载）
  if (history.state && history.state.routerMode) {
    app.routers = history.state.routers;
  }

  const isSa = isSafariBrowser();

  const cancelAnime = (app, func) => {
    isSa && (app._noanime = true);
    func();
    isSa && (app._noanime = false);
  };

  /** 页面地址 → hash 地址（跨域源记为 #origin/path?query） */
  const toHashUrl = (src) => {
    const { pathname, search, origin } = new URL(src, location.href);
    if (getStateUrl) {
      return getStateUrl(pathname, search);
    }
    return location.origin === origin
      ? `#${pathname}${search}`
      : `#${origin}${pathname}${search}`;
  };

  const stateSnapshot = () => ({
    routerMode: 1,
    routers: app.routers.map((e) => ({ src: e.src })),
  });

  // popstate 驱动 back 的预期回波 delta（app.back 触发 RC back 时消费；
  // 同 src no-op 不触发时由 driveNav 的 finally 复位）
  let _echoBack = 0;

  // ---- 应用路由 → 浏览器历史 ----

  app.on("router-change", ({ data }) => {
    const { name, delta, src } = data || {};
    const hUrl = toHashUrl(src || app.current?.src || "");

    // URL 已与目标一致：popstate 驱动导航的回波，浏览器已移动过，
    // 只需把状态对象对齐到当前路由栈（不新增条目）
    // popstate 驱动的 back/forward 回波：浏览器已移动过，无需重复 go。
    // 回波判定用 delta（URL 对比对 back 不可用：片段 vs 全址恒不等）
    if (name === "back" || name === "forward") {
      if (delta && delta === _echoBack) {
        _echoBack = 0;
        return;
      }
      cancelAnime(app, () => history.go(name === "back" ? -delta : delta));
      return;
    }

    const method = name === "replace" ? "replaceState" : "pushState";
    if (location.href !== hUrl) {
      history[method](stateSnapshot(), "", hUrl);
    } else {
      history.replaceState(stateSnapshot(), "", hUrl);
    }
  });

  // ---- 浏览器历史 → 应用路由 ----

  window.addEventListener(
    "popstate",
    (e) => {
      // 应用未就绪（配置 home 尚在挂载）时忽略 popstate：此时响应
      // 会与 home 挂载竞态造成双重渲染（旧 first-render 竞态案例）
      if (!app.appIsReady) {
        return;
      }

      // scsr 等宿主会给「锚点定位类」条目补写带 ignore 标记的状态：
      // 这类条目只承载 URL 变化，不驱动应用重渲染
      if (e.state?.ignore) {
        return;
      }

      const hisRouters = e.state?.routerMode ? e.state.routers : null;

      if (hisRouters) {
        const diff = hisRouters.length - app.routers.length;

        if (diff < 0) {
          // history back：记录预期回波 delta，RC 处理器据此跳过重复 go
          _echoBack = -diff;
          return cancelAnime(app, () => app.back(-diff));
        }
        if (diff > 0) {
          // history forward
          const moreRouters = hisRouters.slice();
          const target = moreRouters.pop();

          if (moreRouters.length > app.routers.length) {
            app._history.push(...moreRouters.slice(app.routers.length - 1));
          }

          return cancelAnime(app, () => app.goto(target.src));
        }

        // 同深度但栈不同（replaceState 类导航的前后移动）：按条目恢复
        // 路由栈（setter 会渲染恢复后的当前页）
        if (JSON.stringify(hisRouters) !== JSON.stringify(app.routers)) {
          app.routers = hisRouters;
        }
        return;
      }

      // 无状态条目（初始条目/外部条目）：按当前 hash 恢复页面
      if (fixStateUrl) {
        const newPath = fixStateUrl();

        if (newPath === false) {
          return;
        }

        if (newPath) {
          // 目标与当前页一致（含 query）的 popstate 是伪信号
          // （浏览器初始化/bfcache 恢复期常发），重渲染毫无意义
          const targetUrl = new URL(newPath, location.href).href;
          if (app.current && app.current.src === targetUrl) {
            return;
          }
          return cancelAnime(app, () => app.goto(newPath));
        }
      }

      return cancelAnime(app, () => app.back(app.routers.length - 1));
    },
  );
}
