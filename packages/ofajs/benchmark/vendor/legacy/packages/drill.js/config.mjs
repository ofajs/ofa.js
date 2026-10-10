import { getErr } from "../ofa-error/main.js";

export const aliasMap = {};

export default async function config(opts) {
  const { alias } = opts;

  if (alias) {
    Object.entries(alias).forEach(([name, path]) => {
      if (!/^@.+/.test(name)) {
        throw getErr("config_alias_name_error", {
          name,
        });
      }

      if (!aliasMap[name]) {
        if (!/^\./.test(path)) {
          aliasMap[name] = path;
        } else {
          throw getErr("alias_relate_name", {
            name,
            path,
          });
        }
      } else {
        throw getErr("alias_already", {
          name,
        });
      }
    });
  }
  return true;
}

export const path = (moduleName, baseURI) => {
  if (moduleName.startsWith("http://") || moduleName.startsWith("https://")) {
    return moduleName;
  }

  const [url, ...params] = moduleName.split(" ");

  let lastUrl = url;

  if (/^@/.test(url)) {
    const [first, ...args] = url.split("/");

    if (aliasMap[first]) {
      lastUrl = [aliasMap[first].replace(/\/$/, ""), ...args].join("/");
    } else {
      throw getErr("no_alias", {
        name: first,
        url: moduleName,
      });
    }
  }

  if (typeof location !== "undefined") {
    const base = baseURI ? new URL(baseURI, location.href) : location.href;

    const moduleURL = new URL(lastUrl, base);

    lastUrl = moduleURL.href;
  }

  if (params.length) {
    return `${lastUrl} ${params.join(" ")}`;
  }

  return lastUrl;
};
