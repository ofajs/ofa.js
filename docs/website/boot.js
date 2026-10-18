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

const ofaLoaded = await loadFirst(ofaSources, "ofa.js");
const scsrLoaded = ofaLoaded ? await loadFirst(scsrSources, "scsr") : false;

if (!ofaLoaded || !scsrLoaded) {
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
