# Loading and Error Handling

During application operation, page loading takes time, and loading failures may occur. `app-config.js` provides `loading` and `fail` configuration items to handle these scenarios.

## loading - Loading State

The `loading` configuration item is used to display content during page loading, enhancing user experience.

### Simple String Template

The simplest way is to use string templates:

```javascript
export const loading = "<div class='loading'>Loading...</div>";
```

### Dynamic Function Generation

Using functions can dynamically generate more complex loading components:

```javascript
export const loading = () => {
  return `<div class='loading'>
    <span>Loading...</span>
  </div>`;
};
```

### Progress Bar Example

Below is a beautiful progress bar loading effect:

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

This progress bar implementation:- When the page loads, the progress bar slowly increases from 0% to 98%
- After the page finishes loading, the progress bar quickly completes to 100% and disappears
- Use smooth transition animations

### Custom Loading Animation

**Rotating loading animation:**

```javascript
export const loading = () => {
  return `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>`;
};
```

**Skeleton Screen Loading:**

```javascript
export const loading = () => {
  return `<div style="padding: 20px;">
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px;"></div>
    <div style="height: 20px; background: #f0f0f0; margin-bottom: 10px; border-radius: 4px; width: 80%;"></div>
    <div style="height: 20px; background: #f0f0f0; border-radius: 4px; width: 60%;"></div>
  </div>`;
};
```

## fail - Error Handling

`fail` configuration item is used for the error prompt component displayed when the page fails to load.

### Basic Usage

The `fail` function accepts an object argument, containing:- `src` - Address of the failure page
- `error` - Error information object

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 20px; color: #c00;">
    <h3>Page Load Failed</h3>
    <p>Address: ${src}</p>
    <p>Error: ${error.message}</p>
    <button on:click="back()">Go Back</button>
  </div>`;
};
```

### Complete Error Handling Example

```javascript
export const fail = ({ src, error }) => {
  return `<div style="padding: 40px; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <h2 style="color: #e74c3c; margin-bottom: 10px;">Page Load Failed</h2>
    <p style="color: #666; margin-bottom: 20px;">Unable to load page: ${src}</p>
    <p style="color: #999; font-size: 14px; margin-bottom: 30px;">
      Error: ${error.message}
    </p>
    <div>
      <button on:click="back()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer;">
        Go Back
      </button>
      <button on:click="goto('./home.html')" style="padding: 10px 20px; cursor: pointer;">
        Go to Homepage
      </button>
    </div>
  </div>`;
};
```

### Error Type Handling

Different prompts can be displayed based on different error types:

```javascript
export const fail = ({ src, error }) => {
  let errorMessage = "Unknown error";
  
  if (error.message.includes("404")) {
    errorMessage = "Page not found";
  } else if (error.message.includes("timeout")) {
    errorMessage = "Loading timeout, please check your network connection";
  } else if (error.message.includes("network")) {
    errorMessage = "Network error, please try again later";
  }
  
  return `<div style="padding: 40px; text-align: center;">
    <h2>Something went wrong</h2>
    <p>${errorMessage}</p>
    <button on:click="back()">Back</button>
  </div>`;
};
```

## Complete Example

<o-playground name="Loading and Error Handling Example" style="--editor-height: 500px">
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
    export const fail = ({ src, error }) => {
      return `<div style="padding: 20px; color: #c00;">
        <h3>Page loading failed</h3>
        <p>Address: ${src}</p>
        <p>Error: ${error.message}</p>
        <button on:click="back()">Go back to previous page</button>
      </div>`;
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
      <br><br>
      <a href="./not-exist.html" olink>Go to Not Exist Page</a>
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

