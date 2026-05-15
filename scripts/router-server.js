// 测试路由服务器
const Koa = require("koa");
const app = new Koa();
const crossDomain = require("./allow-cross-domain");

app.use(crossDomain);
app.use(async (ctx, next) => {
  const { originalUrl } = ctx;

  if (originalUrl.includes("app.mjs")) {
    // Under normal circumstances, this js file should be returned as a static resource and will not be included in the template logic.
    ctx.set("Content-Type", "application/javascript; charset=utf-8");
    ctx.body = `
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
    export const access = ()=> true;      
    `;
    return;
  }

  ctx.set("Content-Type", "text/html; charset=utf-8");
  // Simulating a server-side rendering engine
  const lastNum = parseInt(originalUrl.split("/").slice(-1)[0]);

  ctx.body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Server Render ${originalUrl}</title>
    <!-- <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/dist/ofa.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js@4.6.22/libs/scsr/dist/scsr.min.js"></script> -->
    <script src="http://localhost:3348/dist/ofa.min.js"></script>
    <script src="http://localhost:3348/libs/scsr/dist/scsr.min.js"></script>
  </head>
  <body>
    <o-app src="./app.mjs">
      <template page>
        <style>
          h1 {
            margin: 0;
          }
        </style>
        <h1 id="main-title">current page: ${originalUrl}</h1>
        <button data-testid="gotoNextBtn" on:click="goto('./${
          lastNum + 1
        }')">nextPages ${lastNum + 1}</button>

        <script>
          export default function () {
            return {
              data: {
              },
              proto: {
              },
            };
          }
        </script>
      </template>
    </o-app>
  </body>
</html>
`;
});

const server = app.listen(33483);

module.exports = server;
