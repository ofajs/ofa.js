# o-page 组件

`o-page` 是 ofa.js 中的核心组件之一，代表着一个独立的页面或页面模块。以下是 `o-page` 的一些关键属性和方法：

## src 属性

`src` 属性用于指定页面模块的具体地址。这是指定页面内容和行为的关键属性，告诉应用程序从哪里加载特定页面的内容。

```javascript
const page = this;
```

## goto 方法

`goto` 方法用于从当前页面跳转到另一个页面。相比较于 `app` 的 `goto` 方法，`page` 的 `goto` 方法可以使用**相对地址**来导航到其他页面。

```javascript
page.goto("./page2.html");
```

## replace 方法

`replace` 方法用于替换当前页面为另一个页面。这与 `app` 的 `replace` 方法类似，但是在页面内进行替换操作。

```javascript
page.replace("./new-page.html");
```

## back 方法

`back` 方法用于返回到前一个页面。这会导航用户回到上一个页面，类似于浏览器的后退操作。

```javascript
page.back();
```
