import Stanz, { isxdata } from "./main.mjs";

/** 工厂入口：stanz(data) 创建响应式数据 */
const stanz = (data) => {
  return new Stanz(data);
};

Object.assign(stanz, { is: isxdata });

export default stanz;

export { stanz, Stanz };
