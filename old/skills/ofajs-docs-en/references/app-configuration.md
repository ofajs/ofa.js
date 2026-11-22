# Application Configuration

In addition to the home page address and page transition animations, the `app-config.js` configuration file supports more configuration options for controlling the application's loading state, error handling, initialization logic, and navigation features.

```javascript
// app-config.js
// Content displayed during loading
export const loading = () => "<div>Loading...</div>";

// Component displayed when page loading fails
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Callback after application initialization is complete
export const ready() {
  console.log("App is ready!");
}

// Methods and properties added to the application prototype
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

## loading - Loading State

The component displayed during page loading, can be a string template or a function that returns a template.

```javascript
// Simple string template
export const loading = "<div class='loading'>Loading...</div>";

// Dynamic generation using a function
export const loading = () => {
  return `<div class='loading'>
    <span>Loading...</span>
  </div>`;
};
```

## fail - Error Handling

The component displayed when page loading fails, the function receives an object parameter containing `src` (the failed page address) and `error` (error message).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Page loading failed</p>
    <p>Address: ${src}</p>
    <button on:click="back()">Go Back</button>
  </div>`;
};
```

## proto - Prototype Extension

Add custom methods and computed properties to the application instance, these methods can be accessed through `this.app` in page components.

```javascript
export const proto = {
  // Custom method
  navigateToHome() {
    this.goto("home.html");
  },
  // Computed property
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Call in page:

```html
<template page>
  <button on:click="app.navigateToHome()">Back to Home</button>
  <p>Is at home: {{app.isAtHome}}</p>
</template>
```

## ready - Initialization Callback

The callback function executed after the application configuration is loaded, initialization operations can be performed here. You can access the application instance's methods and properties through `this`.

```javascript
export const ready() {
  console.log("Application initialized");
  // Can access this (o-app element instance)
  console.log(this.current); // Get current page o-page element instance
}
```

## allowForward - Forward Feature

Control whether to enable the browser forward feature. When set to `true`, you can use the browser's back and forward buttons for navigation.

```javascript
export const allowForward = true;
```

## Programmatic Navigation

In addition to using `olink` links, you can also call navigation methods in JavaScript:

```javascript
// Jump to specified page (add to history)
this.goto("./about.html");

// Replace current page (do not add to history)
this.replace("./about.html");

// Go back to previous page
this.back();

// Go forward to next page (requires setting allowForward: true)
this.forward();
```

## Route History

You can get browsing history through the `routers` property:

```javascript
// Get all route history
const history = app.routers;
// Return format: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Get current page
const currentPage = app.current;
```

## Listening to Route Changes

You can respond to route changes by listening to the `router-change` event:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Route changed:", data.name); // goto, replace, forward, back
  console.log("Page address:", data.src);
});
```

## Key Points

- **loading**: Component displayed during page loading
- **fail**: Component displayed when page loading fails
- **proto**: Add custom methods and computed properties to the application instance
- **ready**: Callback after application initialization is complete
- **allowForward**: Enable browser forward feature
- **Programmatic Navigation**: goto, replace, back, forward methods
- **Route History**: Get history through the `routers` property
