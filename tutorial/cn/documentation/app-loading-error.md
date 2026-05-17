# 加载与错误处理

在应用运行过程中，页面加载需要时间，也可能出现加载失败的情况。`app-config.js` 提供了 `loading` 和 `fail` 配置项来处理这些场景。

## loading - 加载状态

`loading` 配置项用于在页面加载过程中显示的内容，提升用户体验。

### 简单字符串模板

最简单的方式是使用字符串模板：

```javascript
export const loading = "<div class='loading'>Loading...</div>";
```

### 函数动态生成

使用函数可以动态生成更复杂的加载组件：

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>加载中...</span>
  </div>`;
};
```

### 进度条示例

下面是一个美观的进度条加载效果：

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

这个进度条实现：
- 页面加载时，进度条从 0% 慢慢增长到 98%
- 页面加载完成后，进度条快速完成到 100% 并消失
- 使用平滑的过渡动画

### 自定义加载动画

**旋转加载动画：**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**骨架屏加载：**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - 错误处理

`fail` 配置项用于页面加载失败时显示的错误提示组件。

### 基本用法

`fail` 函数接收一个对象参数，包含：
- `src` - 失败页面的地址
- `error` - 错误信息对象

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>页面加载失败</h3>
    <p>地址: ${src}</p>
    <p>错误: ${error.message}</p>
    <button on:click="back()">返回上一页</button>
  </div>`;
};
```

### 完整错误处理示例

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">页面加载失败</h2>
    <p style="color: #666; margin-bottom: 20px;">无法加载页面: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      错误信息: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        返回上一页
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        返回首页
      </button>
    </div>
  </div>`;
};
```

### 错误类型处理

可以根据不同的错误类型显示不同的提示：

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "未知错误";
  
  if (error.message.includes("404")) {
    errorMessage = "页面不存在";
  } else if (error.message.includes("timeout")) {
    errorMessage = "加载超时，请检查网络连接";
  } else if (error.message.includes("network")) {
    errorMessage = "网络错误，请稍后重试";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>出错了</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">返回</button>
  </div>`;
};
```

## 完整示例

<o-playground name="加载与错误处理示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 页面切换动画配置
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
};
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>页面加载失败</h3>
        <p>地址: ${src}</p>
        <p>错误: ${error.message}</p>
        <button on:click="back()">返回上一页</button>
      </div>`;
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
