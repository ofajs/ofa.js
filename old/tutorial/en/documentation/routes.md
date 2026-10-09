# Single Page Application

A single-page application binds the `o-app` component to the browser's address bar, keeping the web URL synchronized with the in-app page path. After enabling the single-page application:

- Refreshing the webpage can maintain the current routing state
- Copy the URL from the address bar and open it in another browser or tab, the application state can also be restored
- The browser's forward/back buttons work normally

## Basic Usage

Use the official `o-router` component to wrap the `o-app` component to achieve a single-page application.

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

## fix-body attribute

After adding the `fix-body` attribute, `o-router` will automatically reset the styles of `html` and `body`, eliminating the default margin and padding.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

This is particularly useful in the following scenarios:- Need `o-app` to completely fill the viewport
- When the app is the only content on the page

## Example

<o-playground name="Single Page Application Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // App home page address
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

## How It Works

Single-Page Application Implementation Based on Browser Hash Mode:

1. When a page switch occurs within the application, `o-router` automatically updates the hash value in the address bar (e.g., `#/about.html`)
2. When the user refreshes the page or accesses it via a URL, `o-router` reads the hash value and loads the corresponding page
3. The browser's forward/back buttons trigger hash changes, thereby controlling the application's page navigation

## URL Change Example

Assuming the app has two pages `home.html` and `about.html`:

| User Action | Address Bar Change |
|---------|-----------|
| Open App | `index.html` → `index.html#/home.html` |
| Navigate to About | `index.html#/home.html` → `index.html#/about.html` |
| Click Back | `index.html#/about.html` → `index.html#/home.html` |
| Refresh Page | Keep current hash unchanged |## Usage Limitations

- A single-page application can only be used with **one** `o-app` component