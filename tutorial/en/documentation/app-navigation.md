# Routing and Navigation

In-app page navigation is a core feature of single-page applications. This chapter introduces how to use programmatic navigation, manage routing history, and listen for route changes.

## allowForward - Forward Function

By default, the application only supports backward navigation. After setting `allowForward` to `true` in `app-config.js`, the forward function of the application can be enabled.

```javascript
// app-config.js
export const allowForward = true;
```

When enabled:

- The user can navigate using the browser's forward/back buttons
- The application's `forward()` method works correctly

## Programmatic Navigation

In addition to links that use the `olink` attribute, navigation methods can also be called in JavaScript.

> **Important Notes**:
> - The `goto`, `replace`, and `back` methods are available on both **page instance** and **app instance**
> - The `forward` method is only available on the **app instance**
> - In pages: use `this.goto()` or `this.app.goto()`
> - In components: use `this.app.goto()` (must be called via the app instance)
> 
> **Path Relativity Notes**:
> - When using `goto` or `replace` on a **page module**, the path is relative to the address of the **current page module**
> - When using `goto` or `replace` on the **app instance**, the path is relative to the address of the **current application navigation**

### goto - Page Navigation

Navigate to specified page and add to history:

```javascript
// Navigate to specified page
this.goto("./about.html");

// Navigate with parameters
this.goto("./detail.html?id=123");
```

### replace - Replace Page

Replace the current page without adding to the history:

```javascript
// Replace current page
this.replace("./login.html");
```

Often used for redirection after login to prevent users from clicking the back button and returning to the login page.

### back - back

Back to previous page:

```javascript
this.back();
```

### forward - forward

Go to the next page（requires setting `allowForward: true`）：

```javascript
// Called in the page or component
this.app.forward();
```

> **Note**：`forward` method must be called on the application instance（`app`），not on the page instance。For example use `this.app.forward()` instead of `this.forward()`。

### Comparison of Navigation Methods

| Method      | History Record     | Use Case           |
| --------- | ------------ | ------------------ |
| `goto`    | Add new record   | Normal page navigation       |
| `replace` | Replace current record | Post-login navigation, redirect |
| `back`    | Go back to previous   | Back operation           |
| `forward` | Go forward to next    | Forward operation (needs to be enabled) |## Route History

### Get Routing History

Get all routing history through the `routers` attribute:

```javascript
const history = app.routers;
// Return format: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]
```

### Get Current Page

Use the `current` property to obtain the current page instance:

```javascript
const currentPage = app.current;
console.log("Current page:", currentPage.src);
```

### Routing History Example

```javascript
export const proto = {
  get canGoBack() {
    return this.routers && this.routers.length > 1;
  },

  get canGoForward() {
    // Needs to be used in conjunction with allowForward
    return this.routers && this.currentIndex < this.routers.length - 1;
  },

  get currentPath() {
    return this.current?.src || "";
  },
};
```

## Listening to Route Changes

Respond to route changes by listening to the `router-change` event.

### Basic Usage

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("Route change:", data.name);
  console.log("Page address:", data.src);
});
```

### Event Data

The data object of the `router-change` event contains:

| Property | Description           | Possible Values                      |
| -------- | --------------------- | ------------------------------------ |
| `name`   | Navigation type       | `goto`, `replace`, `forward`, `back` |
| `src`    | Target page address   | Page path                            |### Usage Example

```javascript
export const ready = function () {
  // Listen to route changes
  this.on("router-change", (e) => {
    const { name, src } = e.data;

    // Log page visit
    console.log(`[${name}] Navigate to: ${src}`);

    // Update page title
    this.updateTitle(src);

    // Send statistics data
    this.trackPageView(src);
  });
};

export const proto = {
  updateTitle(src) {
    const titles = {
      "home.html": "Home",
      "about.html": "About Us",
      "contact.html": "Contact Us",
    };

    const pageName = src.split("/").pop();
    document.title = titles[pageName] || "App";
  },

  trackPageView(src) {
    // Send page view statistics
    console.log("Statistics page view:", src);
  },
};
```

## Page Navigation Guards

By combining route monitoring, navigation guard functionality can be implemented:

```javascript
export const ready = function () {
  this.on("router-change", (e) => {
    const { src } = e.data;

    // Check if login is required
    if (this.requiresAuth(src) && !this.isLoggedIn()) {
      e.preventDefault();
      this.goto("./login.html");
    }
  });
};

export const proto = {
  requiresAuth(src) {
    const authPages = ["profile.html", "settings.html"];
    return authPages.some((page) => src.includes(page));
  },

  isLoggedIn() {
    return !!this.globalData?.user;
  },
};
```

## Complete Example

<o-playground name="Routing and Navigation Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Application home page address
    export const home = "./home.html";
    export const allowForward = true;
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
    export const ready = function() {
      console.log("Application has initialized");
      this.on("router-change", (e) => {
        console.log("Route changed:", e.data);
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
      <p>Route history count: {{app.routerCount}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="gotoAbout">Programmatic Navigation</button>
      <br><br>
      <button on:click="goForward()">Forward</button>
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
              goForward() {
                this.app.forward();
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
        <button on:click="back()">Back</button>
      </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <p>Route history count: {{app.routerCount}}</p>
      <p style="color: #666; font-size: 14px;">Tip: After clicking "Back", you can click "Forward" on the home page to return here.</p>
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

