# 路由与导航

应用内的页面导航是单页面应用的核心功能。本章介绍如何使用编程式导航、管理路由历史，以及监听路由变化。

## allowForward - 前进功能

默认情况下，应用只支持后退导航。设置 `allowForward` 为 `true` 后，可以启用浏览器前进功能。

```javascript
export const allowForward = true;
```

启用后：
- 用户可以使用浏览器的前进/后退按钮进行导航
- 应用的 `forward()` 方法可以正常工作

## 编程式导航

除了使用 `olink` 属性的链接，还可以在 JavaScript 中调用导航方法。

### goto - 跳转页面

跳转到指定页面，并添加到历史记录：

```javascript
// 跳转到指定页面
this.goto("./about.html");

// 带参数跳转
this.goto("./detail.html?id=123");
```

### replace - 替换页面

替换当前页面，不添加到历史记录：

```javascript
// 替换当前页面
this.replace("./login.html");
```

常用于登录后跳转，避免用户点击后退按钮回到登录页。

### back - 后退

返回到上一页：

```javascript
this.back();
```

### forward - 前进

前进到下一页（需要设置 `allowForward: true`）：

```javascript
this.forward();
```

### 导航方法对比

| 方法 | 历史记录 | 使用场景 |
|------|----------|----------|
| `goto` | 添加新记录 | 正常页面跳转 |
| `replace` | 替换当前记录 | 登录后跳转、重定向 |
| `back` | 回退到上一条 | 返回操作 |
| `forward` | 前进到下一条 | 前进操作（需启用） |

## 路由历史

### 获取路由历史

通过 `routers` 属性获取所有路由历史：

```javascript
const history = app.routers;
// 返回格式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### 获取当前页面

通过 `current` 属性获取当前页面实例：

```javascript
const currentPage = app.current;
console.log("当前页面:", currentPage.src);
```

### 路由历史示例

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },
  
  get canGoForward() {
    // 需要配合 allowForward 使用
    return this.routers && this.currentIndex < this.routers.length - 1;
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
};
```

## 监听路由变化

通过监听 `router-change` 事件来响应路由变化。

### 基本用法

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("路由变化:", data.name);
  console.log("页面地址:", data.src);
});
```

### 事件数据

`router-change` 事件的数据对象包含：

| 属性 | 说明 | 可能的值 |
|------|------|----------|
| `name` | 导航类型 | `goto`, `replace`, `forward`, `back` |
| `src` | 目标页面地址 | 页面路径 |

### 使用示例

```javascript
export const ready = function() {
  // 监听路由变化
  this.on("router-change", (e) => {
    const { name, src } = e.data;
    
    // 记录页面访问
    console.log(`[${name}] 导航到: ${src}`);
    
    // 更新页面标题
    this.updateTitle(src);
    
    // 发送统计数据
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "首页",
      "about.html": "关于我们",
      "contact.html": "联系我们",
    };
    
    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "应用";
  },
  
  trackPageView(src) {
    // 发送页面访问统计
    console.log("统计页面访问:", src);
  },
};
```

## 页面导航守卫

结合路由监听，可以实现导航守卫功能：

```javascript
export const ready = function() {
  this.on("router-change", (e) => {
    const { src } = e.data;
    
    // 检查是否需要登录
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some(page => src.includes(page));
  },
  
  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## 完整示例

<o-playground name="路由与导航示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("应用已初始化");
      this.on("router-change", (e) => {
        console.log("路由变化:", e.data);
      });
    };
    export const proto = {
      get routerCount() {
        return this.routers?.length || 0;
      },
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
      <p>路由历史数量: {{app.routerCount}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="gotoAbout">编程式跳转</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto: {
              gotoAbout() {
                this.goto("./about.html");
              },
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
      <div style="padding: 8px;">
        <button on:click="back()">后退</button>
        <button on:click="forward()">前进</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>路由历史数量: {{app.routerCount}}</p>
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
