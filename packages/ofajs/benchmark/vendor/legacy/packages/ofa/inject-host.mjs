import { getErr } from "../ofa-error/main.js";
import $ from "../xhear/base.mjs";
import { eleX } from "../xhear/util.mjs";

$.register({
  tag: "inject-host",
  temp: `<slot></slot>`,
  data: {},
  proto: {
    init() {
      if (!this.ele.isConnected) {
        return;
      }

      this.forEach((e) => this._init(e));
    },

    _init(e) {
      if (e.ele.__inited) {
        return;
      }

      switch (e.tag) {
        case "link":
          this._initLink(e);
          break;
        case "style":
          this._initStyle(e);
          break;
        case "x-if":
        case "x-else-if":
        case "x-else":
        case "x-fill":
          // Components of a rendered nature do not need to be alerted
          break;
        default:
          const err = getErr("invalidated_inject_host");
          console.warn(err, e);
      }
    },

    _initLink(e) {
      const href = e.attr("href");

      const rel = e.attr("rel");

      if (rel !== "stylesheet" && rel !== "host") {
        throw getErr("inject-link-rel");
      }

      let { ele } = e;

      if (rel !== "host") {
        e.attr("rel", "host");
        // It needs to be reset or it will contaminate itself
        e.attr("href", href);
      }

      ele.__inited = true;

      ele._revoke = () => {
        revokeLink(ele);
        ele._revoke = null;
      };

      initInjectEle(
        this,
        href,
        () => {
          const newEl = e.clone();
          newEl.attr("rel", "stylesheet");
          return newEl;
        },
        ele
      );
    },
    async _initStyle(e) {
      if (/data\(.+?\)/.test(e.html)) {
        const err = getErr("use-data-inject");
        console.warn(err, e.ele);
        throw err;
      }

      // Use only the text inside the style to prevent contaminating yourself
      const com = new Comment(e.html);
      com.__inited = true;

      com._revoke = () => {
        revokeLink(e.ele);
        delete com.__inited;
        delete e.ele.__inited;
        com._revoke = null;
        e.ele._revoke = null;
      };

      e.html = "";
      e.push(com);
      e.ele.__inited = true;
      e.ele._revoke = com._revoke;

      // const hash = await getHash(com.data);
      const hash = getStringHash(com.data);

      initInjectEle(this, hash, () => $(`<style>${com.data}</style>`), e.ele);
    },
  },
  attached() {
    const observer = (this._obs = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "x-bind-data") {
            // x component render
            continue;
          }

          // Logic for handling attribute changes
          const { target } = mutation;

          if (target.__inited) {
            target._revoke();
            this._init(eleX(target));
          }
        } else if (mutation.type === "childList") {
          mutation.removedNodes.forEach((e) => {
            if (e.__inited) {
              e._revoke();
            }
          });

          mutation.addedNodes.forEach((e) => {
            if (!e.__inited) {
              if (e instanceof Text) {
                if (e.parentElement.tagName === "STYLE") {
                  // change style text
                  this.init(e.parentNode);
                }
              }

              if (e.__inited) {
                // Don't get involved if you've been initialized.
                return;
              }

              if (e instanceof Text || e instanceof Comment) {
                // Invalid content
                return;
              }

              this._init(eleX(e));
            }
          });
        }
      }
    }));

    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(this.ele, config);

    this.init();
  },
  detached() {
    this.forEach((e) => revokeLink(e.ele));

    this._obs.disconnect();
  },
});

function getStringHash(str) {
  let hash = 0;
  let len = str.length;
  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i);
    hash = ((hash << 5) - hash) ^ charCode;
    hash = (hash << 13) | (hash >>> 19);
    hash = hash * 7 - hash * 3;
  }
  return hash.toString(36) + "--" + len;
}

function initInjectEle(injectEl, mark, cloneFunc, item) {
  const hostRoot = injectEl.host.root;

  let clink = hostRoot.$(`[inject-host="${mark}"]`);

  if (clink) {
    clink.ele.__items.add(item);
    item.__host_link = clink;
    return;
  }

  clink = cloneFunc();

  clink.attr("inject-host", mark);

  clink.ele.__items = new Set([item]);
  item.__host_link = clink;

  const { root } = injectEl.host;
  if (root.ele === document) {
    document.head.appendChild(clink.ele);
  } else {
    root.root.push(clink);
  }
}

function revokeLink(item) {
  if (item.__inited && item.__host_link) {
    const items = item.__host_link.ele.__items;
    items.delete(item);

    if (!items.size) {
      item.__host_link.remove();
    }

    delete item.__inited;
  }
}
