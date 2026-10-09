export const type = $.PAGE;

export function routerChange(e) {
  this.refreshActive();
}

export function ready() {
  this.refreshActive();
}

export const data = {
  items: [
    {
      name: "Page01",
      href: "./subs/sub-page01.html",
    },
    {
      name: "Page02",
      href: "./subs/sub-page02.html",
    },
    {
      name: "Page03",
      href: "/test/pages/subs/sub-page03.html",
    },
    {
      name: "Page04",
      href: "./subs/sub-page04.html",
    },
  ],
};

const getPathName = (path) => path.replace(/.+\/(.+)/, "$1");

export const proto = {
  async refreshActive() {
    const { current } = this.app;

    const path = new URL(current.src).pathname;

    const activeName = getPathName(path);

    this.items.forEach((e) => {
      if (e.active) {
        e.active = false;
      }

      const targetName = getPathName(e.href);

      if (targetName === activeName) {
        e.active = true;
      }
    });
  },
  resettop() {
    this.items = [
      {
        name: "Page04a",
        href: "./subs/sub-page04.html",
      },
      {
        name: "Page03a",
        href: "./subs/sub-page03.html",
      },
      {
        name: "Page02a",
        href: "./subs/sub-page02.html",
      },
      {
        name: "Page01a",
        href: "./subs/sub-page01.html",
      },
    ];
  },
};
