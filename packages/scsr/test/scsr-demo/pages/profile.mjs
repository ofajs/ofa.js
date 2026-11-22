// .mjs 页面模块：PAGE 类型 + temp + default 函数（读 query）。
// SCSR 提示：.mjs 页面只能通过应用内导航到达——URL 刷新/直达得到的
// 是模块源码而非文档，"每个 URL 都是文档"的承诺只覆盖 HTML 页面。
export const type = $.PAGE;
export const parent = "./layout.html";

export const temp = `
  <style>
    .card {
      background: var(--card); border: 1px solid var(--border); border-radius: 20px;
      padding: 30px 34px;
      box-shadow: 0 16px 36px -18px rgba(15, 23, 42, 0.12);
    }
    .head { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
    .avatar {
      width: 56px; height: 56px; border-radius: 50%; color: #fff;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display: grid; place-items: center; font-size: 22px; font-weight: 800;
    }
    h2 { margin: 0; font-size: 22px; }
    .uid { margin: 2px 0 0; color: var(--muted); font-size: 13px; }
    .row { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .row b { color: var(--accent); }
    .code {
      margin: 14px 0 18px; padding: 12px 16px; background: #0f172a; color: #a5f3fc;
      border-radius: 12px; font-size: 13px; overflow: auto;
    }
    .links { display: flex; gap: 10px; }
    .links a {
      padding: .3em .9em; font-size: 13px; border-radius: .25em;
      color: var(--accent); border: 1px solid var(--accent); text-decoration: none;
      transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out;
    }
    .links a:hover { background: var(--accent); color: #fff; }
  </style>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <span class="avatar">{{avatarText}}</span>
        <div>
          <h2>个人中心</h2>
          <p class="uid">.mjs 页面模块 · type = PAGE · 仅应用内可达</p>
        </div>
      </div>
      <div class="row">
        <span>用户：<b>{{name}}</b></span>
        <span>进入时携带的 query：</span>
      </div>
      <pre class="code">{{queryText}}</pre>
      <div class="links">
        <a olink href="./list.html">← 去商品列表</a>
        <a olink href="../index.html">回首页</a>
      </div>
    </div>
  </div>
`;

export default ({ query }) => {
  const name = "Yao";
  return {
    data: {
      name,
      avatarText: name[0],
      queryText: JSON.stringify(query),
    },
  };
};
