import initRouter from "../router/init-router.mjs";

(() => {
  async function ready() {
    const app = $("o-app");
    $("o-app template[page]")?.remove();

    let maybeHash = false;
    window.addEventListener("hashchange", (e) => {
      if (maybeHash) {
        const urlObj = new URL(location.href);

        const { routers } = app;

        history.replaceState(
          {
            routerMode: 1,
            ignore: 1,
            routers: routers.map((e) => {
              return {
                src: e.src,
              };
            }),
          },
          "",
          urlObj.hash
        );
      }
    });

    app.on("page-loaded", (e) => {
      const { _defaults } = $(e.target);

      if (typeof _defaults.title === "string") {
        const titleEl = $("head title");
        titleEl && (titleEl.text = _defaults.title);
      }
    });

    if (!history?.state?.routerMode) {
      app.push(
        `<o-page src="${location.pathname}${location.search}"></o-page>`
      );
    }

    initRouter({
      app,
      getStateUrl(pathname, search) {
        return `${pathname}${search}`;
      },
      fixStateUrl(e) {
        const urlObj = new URL(location.href);

        if (urlObj.hash) {
          // 可能是hash锚地
          maybeHash = true;
          setTimeout(() => (maybeHash = false));
          return false;
        }
      },
    });
  }

  if (document.readyState === "complete") {
    ready();
  } else {
    $(window).one("load", () => {
      ready();
    });
  }
})();
