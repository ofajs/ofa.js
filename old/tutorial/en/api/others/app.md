# o-app component

`o-app` is one of the core components in ofa.js, used to configure and manage the entire application. Below are some key properties and methods of the app:

## src

The `src` attribute is used to specify the exact address of the application parameter configuration module.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current

`current` property is used to obtain the currently displayed page instance. This can help you access and manipulate the page that is currently being displayed, for example, to update its content or perform specific operations.

```javascript
const currentPage = app.current;
```

## goto

`goto` method is used to navigate to a specified page. You can pass the address of the target page, and the app will load and display that page. This is an important method for app navigation.

```javascript
app.goto("/page2.html");
```

## replace

`replace` is similar to the `goto` method, but it is used to replace the current page instead of adding a new page to the stack. This can be used to implement page replacement instead of stack navigation.

```javascript
app.replace("/new-page.html");
```

## back

`back` method is used to return to the previous page, implementing the backward operation of page navigation. This will navigate the user back to the previous page.

```javascript
app.back();
```

## routers

`routers` attribute contains the routing configuration information of the application. This is an important attribute that defines the routing rules and mappings for each page in the application. The routing configuration determines the navigation between pages and how URLs are handled.

```javascript
const routeConfig = app.routers;
```