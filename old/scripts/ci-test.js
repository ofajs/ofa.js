const { server, _server2, _server3, home } = require("./static-server");
const shell = require("shelljs");

shell.exec(`npm run playwright`, function (code, stdout, stderr) {
  console.log("Exit code:", code);
  console.log("Program output:", stdout);
  console.log("Program stderr:", stderr);
  server.close();
  _server2.close();
  _server3.close();
  if (code !== 0) {
    throw "run error";
  }
});
