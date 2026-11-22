import $ from "../xhear/base.mjs";
import { hyphenToUpperCase, toDashCase } from "../xhear/public.mjs";

const InvalidKeys = [
  "tag",
  "name",
  "class",
  "style",
  "id",
  "x-bind-data",
  "is-root",
];

const consumers = {}; // 存储所有的consumer元素

// 根provider
const rootProviders = {};

const temp = `<style>:host{display:contents}</style><slot></slot>`;

Object.defineProperty($, "getRootProvider", {
  value(name) {
    return rootProviders[name];
  },
});

const publicWatch = {
  name(name) {
    const oldName = this.__oldName;
    this.__oldName = name;

    // 是否已经设置过
    if (!this.__named) {
      this.__named = 1;
      return;
    }

    if (oldName !== name) {
      if (this.tag === "o-consumer") {
        // consumer 导致的更新
        if (consumers[oldName]) {
          consumers[oldName].delete(this);
        }
        if (!consumers[name]) {
          consumers[name] = new Set();
        }
        consumers[name].add(this);
        this._refresh();
      } else {
        // provider 导致的更新
        if (oldName && consumers[oldName]) {
          consumers[oldName].forEach((item) => item._refresh());
        }
        if (name && consumers[name]) {
          consumers[name].forEach((item) => item._refresh());
        }
      }
    }
  },
};

const updateProvider = (provider) => {
  if (!provider.name) {
    return;
  }

  // 更新底层的所有consumer
  const pool = consumers[provider.name];
  if (pool) {
    // 通知对应name所有的consumer更新数据
    pool.forEach((item) => item._refresh());
  }
};

// 初始化 provider
const initProvider = async (provider) => {
  const needRemoves = [];

  const ele = provider.ele;

  // 将 attributes 上的属性设置到 provider 上
  for (const key of ele.attributes) {
    if (InvalidKeys.includes(key.name)) {
      continue;
    }

    provider[hyphenToUpperCase(key.name)] = key.value;
    needRemoves.push(key.name);
  }

  needRemoves.forEach((key) => ele.removeAttribute(key));

  // 监听数据变化升级consumer
  provider._init_tid = provider.watchTick(() => updateProvider(provider));

  updateProvider(provider); // 尝试初次更新 consumer
};

const providerProto = {
  dispatch(eventName, options) {
    const pool = consumers[this.name];

    // 筛选可用的元素
    if (pool) {
      const event = new Event(eventName, { bubbles: false, cancelable: true });
      event.data = options?.data;

      for (let $ele of pool) {
        if (event.defaultPrevented) {
          break;
        }
        // 确认是当前provider的consumer
        if ($ele.providers.includes(this)) {
          event.provider = this.ele;

          $ele.ele.dispatchEvent(event);
        }
      }
    }
  },
};

$.register({
  tag: "o-root-provider",
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...providerProto,
  },
  attached() {
    initProvider(this);
    rootProviders[this.name] = this;
  },
  detached() {
    this.unwatch(this._init_tid);
    delete rootProviders[this.name];
    updateProvider(this);
  },
});

// 获取对应 name 的上一级 provider 元素
$.fn.getProvider = function (name) {
  const ancestors = this.composedPath();

  // 获取最近的 provider 元素
  let provider = ancestors.find((element) => {
    return (
      element !== this.ele &&
      element.tagName &&
      element.tagName.toLowerCase() === "o-provider" &&
      element.getAttribute("name") === name
    );
  });

  if (!provider && this !== rootProviders[name]) {
    provider = rootProviders[name];
  }

  if (!provider) {
    return null;
  }

  return $(provider);
};
/**
 * 向消费者元素池中添加元素
 * @param {$ele} $ele - 要添加的元素
 */
const addConsumer = ($ele) => {
  if (!consumers[$ele.name]) {
    consumers[$ele.name] = new Set();
  }
  consumers[$ele.name].add($ele);
};

/**
 * 从消费者元素池中移除元素
 * @param {$ele} $ele - 要移除的元素
 */
const removeConsumer = ($ele) => {
  const pool = consumers[$ele.name];
  if (pool) {
    pool.delete($ele);
  }
};

$.register({
  tag: "o-provider",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...providerProto,
  },
  attached() {
    initProvider(this);
  },
  detached() {
    this.unwatch(this._init_tid);
    updateProvider(this);
  },
});

$.register({
  tag: "o-consumer",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    get provider() {
      return this.getProvider(this.name);
    },

    get providers() {
      const providers = [];

      let provider = this.provider;
      while (provider) {
        providers.push(provider);
        provider = provider.getProvider(this.name);
      }

      return providers;
    },

    // 更新自身的数据
    _refresh() {
      if (!this.getProvider(this.name)) {
        // 应该清空自身的数据
        for (let name of Object.keys(this)) {
          if (InvalidKeys.includes(name) || !/\D/.test(name)) {
            // 跳过默认key和数字
            continue;
          }
          this[name] = undefined;
        }
        return;
      }

      const finnalData = {};

      for (let provider of this.providers) {
        for (let name of Object.keys(provider)) {
          if (InvalidKeys.includes(name) || !/\D/.test(name)) {
            // 跳过默认key和数字
            continue;
          }

          if (!finnalData[name]) {
            finnalData[name] = provider[name];
          }
        }
      }

      // 更新自身的数据
      for (let name of Object.keys(finnalData)) {
        const value = finnalData[name];

        if (this[name] !== value) {
          this[name] = value;
        }
      }

      // 删除 consumer 上 provider没有的数据
      for (let name of Object.keys(this)) {
        if (InvalidKeys.includes(name) || !/\D/.test(name)) {
          // 跳过默认key和数字
          continue;
        }

        if (finnalData[name] === undefined) {
          this[name] = undefined;
        }
      }
    },
  },
  attached() {
    // 记录自身的 attributes
    const existKeys = Object.values(this.ele.attributes)
      .map((e) => e.name)
      .filter((e) => !InvalidKeys.includes(e));

    // 更新 attributes
    this.watch((e) => {
      if (e.target === this && e.type === "set") {
        const attrName = toDashCase(e.name);

        if (existKeys.includes(attrName)) {
          if (e.value === null || e.value === undefined) {
            this.ele.removeAttribute(attrName);
          } else {
            this.ele.setAttribute(attrName, e.value);
          }
        }
      }
    });

    addConsumer(this);
    this._refresh();
  },
  detached() {
    removeConsumer(this);
  },
});
