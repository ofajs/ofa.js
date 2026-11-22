# o-page Component

`o-page` is one of the core components in ofa.js, representing an independent page or page module. The following are some key properties and methods of `o-page`:

## src attribute

The `src` attribute is used to specify the concrete address of the page module. It is the key attribute that designates the content and behavior of the page, telling the application where to load the content for that specific page.

```javascript
const page = this;
```

## goto method

The `goto` method is used to navigate from the current page to another page. Compared to the `app`'s `goto` method, the `page`'s `goto` method can use **relative addresses** to navigate to other pages.

```javascript
page.goto("./page2.html");
```

## replace method

`replace` method is used to replace the current page with another page. This is similar to the `replace` method of `app`, but performs the replacement operation within the page.

```javascript
page.replace("./new-page.html");
```

## back method

`back` method is used to return to the previous page. This navigates the user back to the previous page, similar to the browser's back button.

```javascript
page.back();
```