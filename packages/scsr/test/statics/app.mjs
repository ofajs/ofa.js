// scsr 测试用应用配置：只声明进出动画（scsr 约定配置不声明 home，
// 首页由当前 URL 的 o-page 充当）
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
