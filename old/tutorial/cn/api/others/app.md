# o-app 组件

`o-app` 是 ofa.js 中的核心组件之一，用于配置和管理整个应用程序。以下是 app 的一些关键属性和方法：

## src

`src` 属性用于指定应用参数配置模块的具体地址。

```javascript
const app = $("o-app");
console.log(app.src);
```

## current

`current` 属性用于获取正在展示中的页面实例。这可以帮助您访问和操作当前正在显示的页面，例如更新其内容或执行特定的操作。

```javascript
const currentPage = app.current;
```

## goto

`goto` 方法用于跳转到指定的页面。您可以传递目标页面的地址，应用将加载并显示该页面。这是应用导航的重要方法。

```javascript
app.goto("/page2.html");
```

## replace

`replace` 方法与 `goto` 类似，但它是用来替换当前页面而不是在堆栈中添加新页面。这可以用于实现页面替换而不是堆栈导航。

```javascript
app.replace("/new-page.html");
```

## back

`back` 方法用于返回上一页，实现页面导航的后退操作。这会将用户导航回上一个页面。

```javascript
app.back();
```

## routers

`routers` 属性包含应用程序的路由配置信息。这是一个重要的属性，定义了应用程序中各个页面的路由规则和映射。路由配置决定了页面之间的导航和如何处理 URL。

```javascript
const routeConfig = app.routers;
```
