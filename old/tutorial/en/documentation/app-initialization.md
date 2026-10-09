# Application Initialization

During the application initialization phase, some global settings can be performed, such as adding custom methods, monitoring events, etc. `app-config.js` provides `ready` and `proto` two configuration items to handle initialization logic.

## ready - Initialization Callback

`ready` is the callback function executed after the application configuration is loaded, where initialization operations can be performed.

### Basic Usage

```javascript
export const ready = function() {
  console.log("Application initialized");
  // this points to the o-app element instance
  console.log("Current page:", this.current);
};
```

> **Note**: `ready` must use a function declaration or function expression, not an arrow function (because correct `this` binding is required).

### Accessing Application Instance

In the `ready` function, `this` refers to the `o-app` element instance, which can access all methods and properties of the app:

```javascript
export const ready = function() {
  // Get the current page
  console.log("Current page:", this.current);
  
  // Get the routing history
  console.log("Routing history:", this.routers);
  
  // Listen for route changes
  this.on("router-change", (e) => {
    console.log("Route changed:", e.data);
  });
};
```

### Initialization Example

```javascript
export const ready = function() {
  // Initialize global state
  this.globalData = {
    user: null,
    theme: "light",
  };
  
  // Restore user info from local storage
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    this.globalData.user = JSON.parse(savedUser);
  }
  
  // Listen for route changes
  this.on("router-change", (e) => {
    // Log page visit
    console.log("Visited page:", e.data.src);
  });
};
```

## proto - prototype extension

`proto` is used to add custom methods and computed properties to the application instance, which can be accessed across all pages via `this.app`.

### Adding Custom Methods

```javascript
export const proto = {
  // Custom methods
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    this.goto("./profile.html");
  },
  
  // Method with parameters
  navigateToDetail(id) {
    this.goto(`./detail.html?id=${id}`);
  },
};
```

### Add computed properties

```javascript
export const proto = {
  // Computed properties
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get currentPath() {
    return this.current?.src || "";
  },
  
  get routerCount() {
    return this.routers?.length || 0;
  },
};
```

### Complete Example

```javascript
export const proto = {
  // Navigation methods
  navigateToHome() {
    this.goto("./home.html");
  },
  
  navigateToProfile() {
    if (this.globalData.user) {
      this.goto("./profile.html");
    } else {
      this.goto("./login.html");
    }
  },
  
  // Computed properties
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  // Utility methods
  showMessage(message) {
    alert(message);
  },
};
```

## Using in Pages

In the page component, you can access the custom methods and properties of the application instance via `this.app`:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 10px;
    }
  </style>
  
  <button on:click="app.navigateToHome()">Back to Home</button>
  <button on:click="app.navigateToProfile()">Personal Center</button>
  
  <p>Is at home: {{app.isAtHome}}</p>
  <p>Is logged in: {{app.isLoggedIn}}</p>
  
  <script>
    export default async () => {
      return {
        data: {},
        proto: {
          goToDetail() {
            // Call the method of the application instance
            this.app.navigateToDetail(123);
          },
        },
      };
    };
  </script>
</template>
```

## Global State Management

Combining `ready` and `proto`, you can achieve simple global state management:

```javascript
// app-config.js

export const ready = function() {
  // Initialize global state
  this.globalData = {
    user: null,
    cart: [],
    theme: localStorage.getItem("theme") || "light",
  };
  
  // Restore data from local storage
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    this.globalData.cart = JSON.parse(savedCart);
  }
};

export const proto = {
  // User related
  get isLoggedIn() {
    return !!this.globalData.user;
  },
  
  login(userData) {
    this.globalData.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  },
  
  logout() {
    this.globalData.user = null;
    localStorage.removeItem("user");
    this.goto("./login.html");
  },
  
  // Shopping cart related
  get cartCount() {
    return this.globalData.cart.length;
  },
  
  addToCart(item) {
    this.globalData.cart.push(item);
    localStorage.setItem("cart", JSON.stringify(this.globalData.cart));
  },
  
  // Theme related
  get currentTheme() {
    return this.globalData.theme;
  },
  
  toggleTheme() {
    this.globalData.theme = this.globalData.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.globalData.theme);
  },
};
```

## Complete Example

<o-playground name="App Initialization Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Home page URL of the app
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
    export const ready = function() {
      console.log("App has been initialized");
      this.visitCount = (this.visitCount || 0) + 1;
      console.log("Visit count:", this.visitCount);
    };
    export const proto = {
      navigateToHome() {
        this.goto("./home.html");
      },
      get isAtHome() {
        return this.current?.src.includes("home.html");
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
      <p>Is at Home: {{app.isAtHome}}</p>
      <a href="./about.html" olink>Go to About</a>
      <br><br>
      <button on:click="app.navigateToHome()">Back to Home</button>
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
      <p>Is at Home: {{app.isAtHome}}</p>
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

