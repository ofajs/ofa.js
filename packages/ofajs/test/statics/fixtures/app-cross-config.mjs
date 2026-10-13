// 跨域测试用应用配置：只放行 33482 源的页面
export const access = (src) => src.includes("127.0.0.1:33482");
