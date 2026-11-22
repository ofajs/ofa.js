# App Configuration

`app-config.js` configuration file, in addition to the homepage address and page transition animation, also supports more configuration options for controlling the application's loading state, error handling, initialization logic, and navigation functions.

```javascript
// app-config.js
// Content displayed while loading
export const loading = () => "<div>Loading...</div>";

// Component displayed when page loading fails
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// Callback after app initialization is complete
export const ready() {
  console.log("App is ready!");
}

// Methods and properties added to app prototype
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="Application Configuration Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Application home page address
    export const home = "./home.html";
    // Page transition animation configuration
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
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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

## loading - Loading State

The component displayed during page loading can be a string template or a function that returns a template.

```javascript
// Simple string template
export const loading = "<div class='loading'>Loading...</div>";

// Use function to generate dynamically
export const loading = () => {
  return `<div class='loading'>
    <span>Loading...</span>
  </div>`;
};
```

Below is a beautiful loading implementation that can be directly copied and used in a project:

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

## fail - Error Handling

Component displayed when page loading fails, the function receives an object parameter containing `src` (the address of the failed page) and `error` (error message).

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>Page loading failed</p>
    <p>URL: ${src}</p>
    <button on:click="back()">Back</button>
  </div>`;
};
```

## proto - prototype extension

Add custom methods and computed properties to the application instance, which can be accessed in page components via `this.app`.

```javascript
export const proto = {
  // Custom methods
  navigateToHome() {
    this.goto("home.html");
  },
  // Computed properties
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

Call in the page:

```html
<template page>
  <button on:click="app.navigateToHome()">Back to Home</button>
  <p>Are you on the home page?: {{app.isAtHome}}</p>
</template>
```

## ready - Initialization Callback

Callback function executed after the application configuration is loaded; initialization operations can be performed here. The application instance’s methods and properties can be accessed via `this`.

```javascript
export const ready() {
  console.log("Application initialized");
  // Can access this (o-app element instance)
  console.log(this.current); // Get current page o-page element instance
  // this.someMethod();
}
```

## allowForward - Forward Function

Controls whether to enable browser forward functionality. When set to `true`, you can use the browser's back and forward buttons for navigation.

```javascript
export const allowForward = true;
```

When enabled, users can navigate using the browser's forward/backward buttons, and the application's navigation method `forward()` will also take effect.

## Programmatic Navigation

In addition to using `olink` links, you can also call navigation methods in JavaScript:

```javascript
// Jump to a specified page (add to history)
this.goto("./about.html");

// Replace the current page (not added to history)
this.replace("./about.html");

// Go back to the previous page
this.back();

// Go forward to the next page (requires allowForward: true)
this.forward();
```

## Route History

The browsing history can be obtained through the `routers` attribute:

```javascript
// Get all routing history
const history = app.routers;
// Return format: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// Get the current page
const currentPage = app.current;
```

## Listening to Route Changes

You can respond to route changes by listening to the `router-change` event:

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Route changed:", data.name); // goto, replace, forward, back
  console.log("Page URL:", data.src);
});
```