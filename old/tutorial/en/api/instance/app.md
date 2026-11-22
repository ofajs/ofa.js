# app

Elements within `o-app`, including those inside the shadow nodes of `o-page` within `o-app`, or further nested child components, all have their `app` property pointing to this `o-app` element instance.

## Get Application Instance

Here is an example demonstrating how to access the `app` property within elements inside `o-app`:


<o-playground name="app - Get App Instance" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Home address of the app
    export const home = "./home.html";
    // Available methods on the app
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
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
  </code>
  <code path="home.html" active>
    <template page>
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Usage Examples

After obtaining the `app` instance, you can:

### 1. Custom Methods for Accessing the Application

Custom methods added via the `proto` configuration item in `app-config.js` can be called from any page or component using `this.app`:

```javascript
// app-config.js
export const proto = {
  navigateToHome() {
    this.goto("./home.html");
  },
  
  get isLoggedIn() {
    return !!this.globalData?.user;
  },
  
  showMessage(message) {
    alert(message);
  },
};
```

```javascript
// Use in page or component
this.app.navigateToHome();
this.app.showMessage("Hello World");

if (this.app.isLoggedIn) {
  console.log("User is logged in");
}
```

### 2. Accessing Application Properties

```javascript
// Get current page
const currentPage = this.app.current;

// Get route history
const routers = this.app.routers;

// Access global data
const user = this.app.globalData?.user;
```

### 3. Invoke Navigation Methods

```javascript
// Navigate to page
this.app.goto("./about.html");

// Go back to previous page
this.app.back();

// Replace current page
this.app.replace("./login.html");
```

### 4. Listening to Application Events

```javascript
// Listen for route changes
this.app.on("router-change", (e) => {
  console.log("Route change:", e.data);
});
```

## Detailed Documentation

For how to configure application initialization logic and add custom methods in `app-config.js`, please refer to:

- **[App Initialization](../../documentation/app-initialization.md)** - Detailed introduction to the usage of `ready` and `proto` configuration options
- **[Routing and Navigation](../../documentation/app-navigation.md)** - Detailed introduction to application navigation methods and route monitoring

## Common Properties and Methods of Application Instances

| Attribute/Method | Description |
|----------|------|
| `current` | Current page instance |
| `routers` | Route history |
| `globalData` | Global data (needs to be initialized in `ready`) |
| `goto(src)` | Navigate to a specified page |
| `back()` | Go back to the previous page |
| `replace(src)` | Replace the current page |
| `forward()` | Go forward to the next page |
| `on(event, callback)` | Listen to application events |
| Custom methods | Methods added through `proto` configuration |