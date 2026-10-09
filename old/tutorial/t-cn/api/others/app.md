# o-app 組件



`o-app` 是 ofa.js 中的覈心組件之一，用於配置和管理整個應用程序。以下是 app 的一些關鍵屬性和方法：

## src



`src` 屬性用於指定應用參數配置模塊的具體地址。

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



`current` 屬性用於獲取正在展示中的頁面實例。這可以幫助您訪問和操作當前正在顯示的頁面，例如更新其內容或執行特定的操作。

```javascript
const currentPage = app.current;
```

## goto



`goto` 方法用於跳轉到指定的頁面。您可以傳遞目標頁面的地址，應用將加載並顯示該頁面。這是應用導航的重要方法。

```javascript
app.goto("/page2.html");
```

## replace



`replace` 方法與 `goto` 類似，但牠是用來替換當前頁面而不是在堆棧中添加新頁面。這可以用於實現頁面替換而不是堆棧導航。

```javascript
app.replace("/new-page.html");
```

## back



`back` 方法用於返迴上一頁，實現頁面導航的後退操作。這會將用戶導航迴上一個頁面。

```javascript
app.back();
```

## routers



`routers` 屬性包含應用程序的路由配置信息。這是一個重要的屬性，定義瞭應用程序中各個頁面的路由規則和映射。路由配置決定瞭頁面之間的導航和如何處理 URL。

```javascript
const routeConfig = app.routers;
```
