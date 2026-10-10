import $ from "../xhear/base.mjs";

// 是否支持  @container style 查询
const supportStyleQueries = supportsContainerStyleQueries();
// const supportStyleQueries = false; // debug code

$.register({
  tag: "match-var",
  temp: `<style>:host{display:none !important; }</style>`,
  data: {},
  proto: {
    initContainerStyle() {
      // 支持 container style query 的时候，可以直接使用
      if (!this.__style) {
        this.__style = $("<style></style>");
        this.before(this.__style);
      }

      const styleContent = this._styleOriginText;

      // 获取属性值
      const attrs = Array.from(this.ele.attributes);

      this.__style.html = `@container ${attrs
        .map((attr) => `style(--${attr.name}: ${attr.value})`)
        .join(" and ")} {${styleContent}}`;

      // 清空内容
      this.html = "";
    },
    __addStyle() {
      if (this.__added || supportStyleQueries) {
        return;
      }

      // 在不兼容 container style query 的时候，运行这个方法代表塞入原样式
      this.html = `<style>
      ${this._styleOriginText}
      </style>`;

      this.__added = true;
    },
    __removeStyle() {
      if (!this.__added || supportStyleQueries) {
        return;
      }

      this.html = "";

      this.__added = false;
    },
  },
  async attached() {
    // 获取style内容后，清除内容
    if (!this._styleOriginText) {
      const styleEl = this.$("style");
      if (styleEl) {
        this._styleOriginText = styleEl.text;
      }
      const linkEl = this.$("link");
      if (linkEl) {
        const href = linkEl.attr("href");
        this.html = ""; // 必须提前清空，不然会提前载入样式
        const content = await fetch(href).then((res) => res.text());
        this._styleOriginText = content;
      }
      this.html = "";
    }

    const isConnected = this.ele.isConnected;

    if (!isConnected) {
      return;
    }

    if (supportStyleQueries) {
      this.initContainerStyle();
    } else {
      matchEles.add(this);
    }
  },
  detached() {
    if (supportStyleQueries) {
      if (this.__style) {
        this.__style.remove();
        this.__style = null;
      }
    } else {
      matchEles.delete(this);
    }
  },
});

const matchEles = new Set();
{
  let timer = null;
  const checkMatchEles = async () => {
    clearTimeout(timer);
    for (const $e of matchEles) {
      const result = Array.from($e.ele.attributes).every((e) => {
        const value = getComputedStyle($e.ele).getPropertyValue(`--${e.name}`);

        return value === e.value;
      });

      if ($.checkMatch.delay) {
        // 添加延迟，防止频繁执行无法渲染
        await new Promise((resolve) => setTimeout(resolve, $.checkMatch.delay));
      }

      if (result) {
        $e.__addStyle();
      } else {
        $e.__removeStyle();
      }
    }

    timer = setTimeout(checkMatchEles, $.checkMatch.time || 100);
  };

  if (!supportStyleQueries) {
    // 每秒轮询检测一次
    setTimeout(() => {
      checkMatchEles();
    }, 100);
  }

  Object.defineProperties($, {
    // 添加主动刷新 match var 方法
    checkMatch: {
      value() {
        if (supportStyleQueries) {
          // 如果支持，不需要执行此方法
          return false;
        }

        requestAnimationFrame(() => {
          checkMatchEles();
        });

        return true;
      },
    },
  });

  if (!supportStyleQueries) {
    // 延迟时间，单位毫秒
    $.checkMatch.delay = 2;
  }
}

/**
 * 检测浏览器是否原生支持 @container style 查询
 * @returns {boolean} 返回是否支持
 */
function supportsContainerStyleQueries() {
  try {
    // 创建测试用的DOM元素
    const container = document.createElement("div");
    const child = document.createElement("div");

    // 设置容器和子元素的样式
    container.style.cssText = `
          container-type: style;
          position: absolute;
          left: -9px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          --test-prop: true;
        `;

    child.style.cssText = `
          position: absolute;
        `;

    // 添加测试样式
    const style = document.createElement("style");
    style.textContent = `
          @container style(--test-prop: true) {
            #match-var-test-child {
              font-family: "match-var-test";
            }
          }
        `;

    // 组装DOM结构
    container.id = "match-var-test-container";
    child.id = "match-var-test-child";
    container.appendChild(child);
    document.documentElement.appendChild(style);
    document.documentElement.appendChild(container);

    // 检测是否应用了样式
    const isSupported = window
      .getComputedStyle(child)
      .fontFamily.includes("match-var-test");

    // 清理测试元素
    document.documentElement.removeChild(style);
    document.documentElement.removeChild(container);

    return isSupported;
  } catch (err) {
    console.error(err);
    return false;
  }
}
