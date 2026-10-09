# Micro App

`o-app` is the core container component in ofa.js, used to create independent micro applications. It will load the `app-config.js` configuration file, which defines various behaviors of the application.

## Basic Usage

Use the `o-app` tag in HTML to create a micro-application:

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

## Creating a Configuration File

Create the `app-config.js` file and define the basic configuration of the application:

```javascript
// app-config.js

// Application home page URL (required)
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
```

<o-playground name="Micro App Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Home page address of the app
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Page Navigation

### Using the olink attribute

Inside `o-app`, use `<a>` tags with the `olink` attribute for page switching:

```html
<a href="./about.html" olink>Go to About page</a>
```

`olink` triggers the application's route switching, includes transition animations, and does not refresh the entire page.

### Programmatic Navigation

In page components, you can use navigation methods:

```javascript
// Navigate to the specified page
this.goto("./about.html");

// Replace the current page (not added to history)
this.replace("./about.html");

// Go back to the previous page
this.back();
```

## Page Parameter Passing

Pass parameters via URL Query, and the target page receives them through the `query` parameter of the module function:

**Send Page:**

```html
<a href="./detail.html?id=123" olink>View Details</a>
```

**Receive page:**

```html
<template page>
  <script>
    export default async ({ query }) => {
      console.log(query.id); // "123"
      return {
        data: {
          id: query.id
        }
      };
    };
  </script>
</template>
```

## Configuration File Details

`app-config.js` supports multiple configuration options to control the behavior of the application:

| Configuration | Required | Description |
|--------|----------|------|
| `home` | Required | Application homepage address |
| `pageAnime` | Optional | Page transition animation configuration |
| `loading` | Optional | Content displayed during page loading |
| `fail` | Optional | Content displayed when page loading fails |
| `ready` | Optional | Callback after application initialization completes |
| `proto` | Optional | Methods and properties added to the application prototype |
| `allowForward` | Optional | Whether to enable browser forward functionality |## Micro-application Features

### Independence

Each `o-app` instance is an independent micro-application with its own:- Route History
- Page Stack
- State Management
- Configuration Options

### Nested Usage

`o-app` can be nested to achieve complex application structures:

```html
<template page>
  <o-app src="./sub-app-config.js"></o-app>
</template>
```

### Differences from Components

The main differences between `o-app` and regular components:

| Feature | o-app | Regular Component |
|------|-------|----------|
| Routing management | ✅ Built-in routing system | ❌ None |
| Page stack | ✅ Manages page history | ❌ None |
| Configuration file | ✅ Independent configuration | ❌ None |
| Page transition animation | ✅ Supported | ❌ None |
| Applicable scenario | Application-level container | Functional component |