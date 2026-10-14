// .mjs 页面模块：PAGE 类型 + temp（也可用 render 函数自行渲染）
// 本页面演示：query 读取 + routerChange 生命周期 + 相对资源
export const type = $.PAGE;

export const temp = `
  <style>
    .wrap { padding: 24px; }
    .card { border: #ddd solid 1px; border-radius: 8px; padding: 16px; }
  </style>
  <div class="wrap">
    <h2>个人中心（.mjs 页面模块）</h2>
    <div class="card">
      <p>用户：<b id="profile-name">{{name}}</b></p>
      <p>路由切换次数：<b id="profile-rc">{{routeCount}}</b>（从列表页进出本页会累加，父页 routerChange）</p>
      <p>进入时携带的 query：<span id="profile-query">{{queryText}}</span></p>
    </div>
    <p><a olink href="./list.html">← 去商品列表</a> / <a olink href="./home.html">回首页</a></p>
  </div>
`;

export default ({ query }) => {
  return {
    data: {
      name: "Yao",
      queryText: JSON.stringify(query),
      routeCount: 0,
    },
    // 页面作为路由链一员时的路由变化钩子（嵌套路由的父页会收到）
    routerChange({ type }) {
      this.routeCount++;
    },
  };
};
