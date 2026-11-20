/**
 * 官网统一的启动器：先加载 ofa.js，再加载 scsr（真实路径路由）。
 *
 * 优先 jsDelivr CDN，失败时回退到仓库内构建产物（离线开发）。
 * 所有语言目录共用本文件；页面 HTML 由 scsr 收编为 o-page。
 */
// CDN 是主要加载方式；仓库内 dist 只作为离线兜底。
// 这样本地预览、静态托管、子目录部署都不会先产生一串本地 404。
const ofaLocal = "../../dist/ofa.min.mjs";
const ofaCdn =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/dist/ofa.min.mjs";
const scsrLocal = "../../packages/scsr/dist/scsr.min.mjs";
const scsrCdn =
  "https://cdn.jsdelivr.net/gh/ofajs/ofa.js@refs/heads/v5/packages/scsr/dist/scsr.min.mjs";

const ofaSources = [ofaCdn, ofaLocal];
const scsrSources = [scsrCdn, scsrLocal];

const loadFirst = async (sources, name) => {
  for (const src of sources) {
    try {
      await import(src);
      return true;
    } catch (error) {
      console.warn(`[ofa] failed to load ${name} from ${src}`, error);
    }
  }
  return false;
};

const hideLoading = () => {
  const loading = document.getElementById("site-loading");
  if (!loading) return;
  loading.classList.add("is-hidden");
  setTimeout(() => loading.remove(), 260);
};

const ofaLoaded = await loadFirst(ofaSources, "ofa.js");
const scsrLoaded = ofaLoaded ? await loadFirst(scsrSources, "scsr") : false;

if (!ofaLoaded || !scsrLoaded) {
  hideLoading();
  const zh = document.documentElement.lang.startsWith("zh");
  const panel = document.createElement("div");
  panel.setAttribute("role", "alert");
  panel.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:9999",
    "display:grid",
    "place-items:center",
    "padding:24px",
    "background:#06070d",
    "color:#eef2fb",
    'font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif',
  ].join(";");

  panel.innerHTML = `
    <div style="max-width:520px;padding:32px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:rgba(255,255,255,.04);line-height:1.8">
      <h1 style="margin:0 0 12px;font-size:22px">${zh ? "站点加载失败" : "Failed to load the site"}</h1>
      <p style="margin:0 0 8px;color:#9aa6bd;font-size:14px">
        ${
          zh
            ? "无法从本地 dist/ 或 jsDelivr CDN 加载 ofa.js / scsr。"
            : "Could not load ofa.js / scsr from the local dist/ folders or jsDelivr CDN."
        }
      </p>
      <p style="margin:0;color:#9aa6bd;font-size:14px">
        ${
          zh
            ? "请检查网络，或在仓库根目录执行 <code style=\"padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.08)\">npm run build</code> 生成本地产物。"
            : "Check your network, or run <code style=\"padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.08)\">npm run build</code> in the repository root."
        }
      </p>
    </div>
  `;

  document.body.appendChild(panel);
}

// 首个页面渲染完成后再移除首屏 loading，避免慢网络下看到空白骨架
const waitForAppReady = () => {
  const appEle = document.querySelector("o-app");
  if (!appEle || !window.$) {
    hideLoading();
    return;
  }

  const app = window.$(appEle);
  if (app.appIsReady) {
    hideLoading();
    return;
  }

  const timer = setTimeout(finishLoading, 30000);
  const check = () => {
    if (app.appIsReady) {
      clearTimeout(timer);
      finishLoading();
    } else {
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
};

const collectStyleLinks = (root, out = []) => {
  for (const link of root.querySelectorAll('link[rel="stylesheet"], link[rel~="stylesheet"]')) {
    try {
      // 只看同源样式表；CDN 字体/组件样式失败不应阻塞首屏
      if (new URL(link.href).origin === location.origin) out.push(link);
    } catch {}
  }
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) collectStyleLinks(el.shadowRoot, out);
  }
  return out;
};

const findInTree = (root, selector) => {
  const direct = root.querySelector(selector);
  if (direct) return direct;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const found = findInTree(el.shadowRoot, selector);
      if (found) return found;
    }
  }
  return null;
};

const pageStylesReady = () => {
  const shell = findInTree(document, "site-shell");
  if (!shell?.shadowRoot) return false;
  return collectStyleLinks(document).every((link) => !!link.sheet);
};

// appIsReady 只代表页面结构渲染完成，CSS 链接可能仍在加载；
// 等 site-shell 与页面 shadow 内的样式表就绪后再撤掉遮罩，
// 避免先露出未样式化的巨大 logo / 导航图标。
const finishLoading = () => {
  const started = performance.now();
  const check = () => {
    const elapsed = performance.now() - started;
    if ((pageStylesReady() && elapsed >= 100) || elapsed >= 5000) {
      requestAnimationFrame(() => requestAnimationFrame(hideLoading));
      return;
    }
    setTimeout(check, 50);
  };
  check();
};

if (ofaLoaded && scsrLoaded) waitForAppReady();
