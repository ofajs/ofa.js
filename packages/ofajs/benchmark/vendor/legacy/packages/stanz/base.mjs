import Stanz, { isxdata } from "./main.mjs";

const stanz = (data) => {
  return new Stanz(data);
};

Object.assign(stanz, { is: isxdata });

export default stanz;

export { stanz, Stanz };
