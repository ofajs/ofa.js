import lm from "./main.mjs";
import "./component.mjs";
import config, { path } from "./config.mjs";
lm.config = config;
lm.path = path;
Object.freeze(lm);

window.lm = lm;

export default lm;
