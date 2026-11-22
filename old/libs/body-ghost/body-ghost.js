const MAPPGING_ELE = Symbol("mapping-element");
const ORIGIN_ELE = Symbol("origin-element");

$.register({
  tag: "body-ghost-mapping",
  attrs: {
    ghostId: null,
  },
  proto: {
    get origin() {
      return $(this[ORIGIN_ELE]);
    },
  },
  temp: `<style>:host{display:contents}</style>`,
});

$.register({
  tag: "body-ghost",
  attrs: {
    ghostId: Math.random().toString(32).slice(2),
  },
  temp: `<style>:host{display:none}</style>`,
  proto: {
    get mapping() {
      return $(this[MAPPGING_ELE]);
    },
  },
  ready() {
    this[MAPPGING_ELE] = null;
  },
  attached() {
    const mappingEl = (this[MAPPGING_ELE] =
      document.createElement("body-ghost-mapping"));

    mappingEl.setAttribute("ghost-id", this.ghostId);

    $(mappingEl)[ORIGIN_ELE] = this.ele;

    Object.defineProperties(mappingEl.shadowRoot, {
      // 伪装parentNode，让所有事情向上冒泡
      parentNode: {
        get: () => {
          return this.ele.parentNode;
        },
      },
    });

    const originChildNodes = this.ele.childNodes;

    Object.defineProperties(this.ele, {
      // 伪装子元素
      childNodes: {
        get: () => {
          return mappingEl.shadowRoot.childNodes;
        },
      },
    });

    $.nextTick(() => {
      Array.from(originChildNodes).forEach((el) => {
        el.__internal = 1;
        mappingEl.shadowRoot.appendChild(el);
        delete el.__internal;
      });
    });

    document.body.appendChild(mappingEl);
  },
  detached() {
    if (this[MAPPGING_ELE]) {
      this[MAPPGING_ELE].remove();
      this[MAPPGING_ELE] = null;
    }
  },
});
