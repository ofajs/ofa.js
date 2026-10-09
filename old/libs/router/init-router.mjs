import { isSafariBrowser } from "../../packages/xhear/public.mjs";

export default function initRouter({ app, getStateUrl, fixStateUrl }) {
  if (history.state && history.state.routerMode) {
    app.routers = history.state.routers;
  }

  // Application fallback, no window.history operation required
  let _isFixState;
  // When history moves forward
  let _isGoto;
  // When the address is back
  let _isBack;
  // when there is historical data, re-entering the hash address, it is necessary to replace the blank history
  let _isFixNavigate;

  app.on("router-change", (e) => {
    let methodName = "pushState";
    const { name, delta, src } = e.data || {};

    switch (name) {
      case "replace":
        methodName = "replaceState";
      case "goto":
        const { routers } = app;

        const { pathname, search, origin } = new URL(src, location.href);

        if (_isGoto) {
          _isGoto = null;
          return;
        }

        let hUrl = "";

        if (getStateUrl) {
          hUrl = getStateUrl(pathname, search, methodName);
        } else if (location.origin === origin) {
          hUrl = `#${pathname}${search}`;
        } else {
          hUrl = `#${origin}${pathname}${search}`;
        }

        if (_isFixNavigate) {
          methodName = "replaceState";
          _isFixNavigate = null;
        }

        history[methodName](
          {
            routerMode: 1,
            routers: routers.map((e) => {
              return {
                src: e.src,
              };
            }),
          },
          "",
          hUrl
        );
        break;
      case "back":
        if (_isBack) {
          _isBack = null;
          return;
        }

        _isFixState = 1;
        history.go(-delta);
        break;
    }
  });

  let popstateFunc;
  window.addEventListener(
    "popstate",
    (popstateFunc = (e) => {
      const { state } = e;

      if (_isFixState) {
        _isFixState = null;
        return;
      }

      if (!state) {
        if (fixStateUrl) {
          const newPath = fixStateUrl();
          if (newPath) {
            _isFixNavigate = 1;
            cancelAnime(app, () => app.goto(newPath));
            return;
          }

          if (newPath === false) {
            return;
          }
        }

        _isBack = 1;
        cancelAnime(app, () => app.back(app.routers.length - 1));
        return;
      }

      if (!state.routerMode || state.ignore) {
        return;
      }

      const { routers: hisRouters } = state;
      const { routers: appRouters } = app;

      if (hisRouters.length < appRouters.length) {
        // history back
        _isBack = 1;
        cancelAnime(app, () => app.back(appRouters.length - hisRouters.length));
      } else if (hisRouters.length > appRouters.length) {
        // history forward
        const moreRouters = hisRouters.slice();

        const target = moreRouters.pop();

        if (moreRouters.length > appRouters.length) {
          const canPushRouters = moreRouters.slice(app._history.length);
          app._history.push(...canPushRouters);
        }

        _isGoto = 1;

        cancelAnime(app, () => app.goto(target.src));
      } else if (JSON.stringify(hisRouters) !== JSON.stringify(appRouters)) {
        console.error(`o-router error occurred`);
      }
    })
  );

  const isSa = isSafariBrowser();

  const cancelAnime = (app, func) => {
    isSa && (app._noanime = true);
    func();
    isSa && (app._noanime = false);
  };

  return popstateFunc;
}
