const _server3 = require("./router-server");
const crossDomain = require("./allow-cross-domain");
const Koa = require("koa");
const app = new Koa();
const serve = require("koa-static");
const path = require("path");

const home = serve(path.normalize(__dirname + "/../"));

app.use(crossDomain);

app.use(home);

const _server = app.listen(3348);
console.log(`server start => http://localhost:3348/`);

// 测试跨域用的另一个端口服务
const app2 = new Koa();
const home2 = serve(path.normalize(__dirname + "/../test/"));
app2.use(crossDomain);

app2.use(home2);

const _server2 = app2.listen(33482);

module.exports = {
  server: _server,
  _server2,
  _server3,
  home: path.normalize(__dirname + "/../"),
};
