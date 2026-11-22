# Micro Application

Use `o-app` for applicationization. This tag represents a micro application that loads the `app-config.js` configuration file, which defines the application's home page address and page transition animation configuration.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
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
```

## home - Home Page Address

Specifies the home page module path to load when the application starts, supports relative paths and absolute paths.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Page Transition Animation

Controls the transition animation effect during page switching, containing three states:

| State | Description |
|------|------|
| `current` | Style after current page animation ends |
| `next` | Starting style when new page enters |
| `previous` | Target style when old page leaves |

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

## Parameter Passing

In `o-app`, page navigation supports passing parameters through URL Query, and the target page receives them through the `query` parameter of the module function.

## Page Navigation

Inside o-app, each page module can use `<a>` tags with the `olink` attribute for page switching. This tag triggers the application's route switching with transition animation and doesn't refresh the entire page.

```html
<a href="./about.html" olink>Go to About Page</a>
```

In page components, you can use the `back()` method to return to the previous page:

```html
<template page>
  <button on:click="back()">Go Back</button>
</template>
```

## Key Points

- **o-app Tag**: Represents a micro application, loads configuration file
- **app-config.js**: Defines home page address and page transition animation
- **home Configuration**: Specifies the home page to load when application starts
- **pageAnime Configuration**: Controls page transition animation
- **olink Attribute**: Use `<a olink>` for page switching
- **back() Method**: Return to previous page
