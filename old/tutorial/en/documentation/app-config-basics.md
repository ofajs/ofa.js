# Application Configuration Basics

`app-config.js` configuration file is used to define various behaviors of the application. This chapter introduces the basic structure of the configuration file and all available configuration items.

## Configuration file structure

Create the `app-config.js` file, using ES6 module syntax to export the configuration items：

```javascript
// app-config.js

// Application home page address (required)
export const home = "./home.html";

// Page transition animation configuration (optional)
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

// Loading state (optional)
export const loading = () => {
  return "<div>Loading...</div>";
};

// Error handling (optional)
export const fail = ({ src, error }) => {
  return `<div>Failed to load: ${src}</div>`;
};

// Application initialization (optional)
export const ready = function() {
  console.log("App is ready");
};

// Prototype extension (optional)
export const proto = {
  customMethod() {
    console.log("Custom method");
  },
};

// Enable forward navigation (optional)
export const allowForward = true;
```

## Configuration Overview

`app-config.js` supports the following configuration items:

| Configuration Item | Required | Description | Detailed Documentation |
|---------------------|----------|-------------|-------------------------|
| `home` | ✅ Required | App home page address | This chapter |
| `pageAnime` | Optional | Page transition animation configuration | [Page Transition Animation](./page-transition-animation.md) |
| `loading` | Optional | Content displayed during page loading | [Loading and Error Handling](./app-loading-error.md) |
| `fail` | Optional | Content displayed when page loading fails | [Loading and Error Handling](./app-loading-error.md) |
| `ready` | Optional | Callback after app initialization is complete | [App Initialization](./app-initialization.md) |
| `proto` | Optional | Methods and properties added to the app prototype | [App Initialization](./app-initialization.md) |
| `allowForward` | Optional | Whether to enable browser forward functionality | [Routing and Navigation](./app-navigation.md) |## home - Homepage URL

`home` is a required configuration item, specifying the home page module path to load when the application starts.

```javascript
export const home = "./pages/home.html";
```

**Path Rules:**- Supports relative paths (relative to the `app-config.js` file)
- Supports absolute paths
- Points to a page module file (`.html` file)

## pageAnime - Page Switch Animation

`pageAnime` is an optional configuration item, used to control the transition animation effect during page switching.

### Basic Usage

```javascript
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
```

### Animation Status Description

The page switching animation includes three states:

| State | Description | Trigger Timing |
|------|------|----------|
| `current` | The style after the current page's animation ends | When the page switch is complete |
| `next` | The starting style when the new page enters | When the new page starts to enter |
| `previous` | The target style when the old page leaves | When the old page starts to leave |### More Animation Effects

Page transition animations support multiple effects, including:- Slide left/right（default）
- Fade in/out
- Slide up/down
- Zoom effect
- Flip effect
- Custom animation

For detailed animation configuration and effect examples, please refer to the [page transition animation](./page-transition-animation.md) chapter.

## Using configuration files in HTML

In HTML files, import the configuration file via the `o-app` tag:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="./app-config.js"></o-app>
</body>
</html>
```

<o-playground name="Application Configuration Basic Example" style="--editor-height: 500px">
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

