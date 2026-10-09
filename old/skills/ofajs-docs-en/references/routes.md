# Single Page Application

A single page application binds the `o-app` component with the browser address bar, keeping the webpage URL synchronized with the page path within the application. After enabling single page application:

- Refreshing the webpage can maintain the current routing state
- Copying the URL from the address bar and opening it in other browsers or tabs can also restore the application state
- The browser's forward/back buttons work normally

## Basic Usage

Use the official `o-router` component to wrap the `o-app` component to implement a single page application.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body Attribute

After adding the `fix-body` attribute, `o-router` will automatically reset the styles of `html` and `body`, eliminating default margin and padding.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

This is particularly useful in the following scenarios:
- Need `o-app` to completely fill the viewport
- When the application is the only content on the page

## Working Principle

Single page applications are implemented based on the browser's Hash mode:

1. When a page switch occurs within the application, `o-router` will automatically update the hash value in the address bar (e.g., `#/about.html`)
2. When the user refreshes the page or accesses via URL, `o-router` will read the hash value and load the corresponding page
3. The browser's forward/back buttons will trigger hash changes, which in turn control the application's page navigation

## URL Change Example

Assuming the application has two pages `home.html` and `about.html`:

| User Action | Address Bar Change |
|---------|-----------|
| Open application | `index.html` → `index.html#/home.html` |
| Navigate to about page | `index.html#/home.html` → `index.html#/about.html` |
| Click back | `index.html#/about.html` → `index.html#/home.html` |
| Refresh page | Keep current hash unchanged |

## Usage Limitations

- Single page applications can only be used with **one** `o-app` component

## Key Points

- **o-router Component**: Wraps `o-app` to implement single page application
- **fix-body Attribute**: Automatically resets `html` and `body` styles
- **Hash Mode**: Route synchronization based on browser Hash
- **Route State Persistence**: Refreshing the page maintains current route state
- **Browser Navigation**: Supports forward/back buttons
