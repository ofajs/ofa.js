# SSR and Isomorphic Rendering

## Isomorphic Rendering

To simultaneously preserve CSR's smooth experience, better machine crawler recognition (SEO), and freer backend development language choices, ofa.js provides a unique isomorphic rendering (Symphony Client-Server Rendering) mode.

The core concept of isomorphic rendering is:
- Render initial page content on the server side to ensure SEO and first screen load speed
- Take over route handling on the client side to maintain CSR's smooth user experience
- Applicable to any server-side environment, achieving true isomorphic rendering

### Isomorphic Rendering Implementation Principle

ofa.js's isomorphic rendering mode is based on the following mechanism:

1. Server generates complete HTML pages with universal runtime structure
2. Client loads CSR runtime engine
3. Automatically identifies current runtime environment and decides rendering strategy

### Isomorphic Rendering Code Structure

**Original CSR Page Module:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**Complete Page After Isomorphic Rendering Encapsulation:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html, body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    <!-- Page module content insertion position -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>
</html>
```

So, you can use any development language (Go, Java, PHP, Nodejs, Python, etc.), any backend template rendering engine (like Go's `html/template`, PHP's Smarty/Twig/Blade, etc.), embed ofa.js's isomorphic rendering code structure into templates to achieve SSR.

### Isomorphic Rendering Template Structure

To implement isomorphic rendering mode, just use the following universal template structure on the server side:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html, body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    <!-- Dynamically insert corresponding page module content -->
  </o-app>
</body>
</html>
```

**Note:** HTML returned by the server must set the correct HTTP header: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` is the isomorphic rendering runtime engine provided by ofa.js, which automatically determines the rendering strategy based on the current page's running state, ensuring the best user experience in any environment.

Similarly, SSG can also use this structure to implement static site generation.

## Differences Between ofa.js and SSR and Other Frontend Frameworks

ofa.js's Symphony Client-Server Rendering (hereinafter referred to as SCSR) is essentially also an SSR mode.

Compared with SSR solutions of existing frontend frameworks like Vue, React, Angular, ofa.js's biggest advantage is that it **doesn't require mandatory binding with Node.js**. This means any backend template rendering engine (like PHP's Smarty, Python's Jinja2, Java's Thymeleaf, etc.) can easily integrate ofa.js to implement SSR.

## Web Page Rendering Methods Overview

Modern web applications mainly have four rendering methods: traditional server-side template engine rendering, CSR (Client Side Rendering), SSR (Server Side Rendering), and SSG (Static Site Generation). Each method has its advantages and applicable scenarios.

### CSR (Client Side Rendering)

In CSR mode, page content is completely rendered by browser-side JavaScript. ofa.js's single page application is a typical CSR implementation.

**Advantages:**
- Smooth user experience, page switching without refresh
- Strong client processing capability, rapid response

**Disadvantages:**
- Not SEO friendly, difficult for search engines to index content

### SSR (Server Side Rendering)

While preserving CSR's smooth experience, pages are rendered in real-time by the server: when a user makes a request, the server immediately generates complete HTML and returns it, achieving true server-side rendering.

**Advantages:**
- SEO friendly, fast first screen load
- Supports dynamic content

**Disadvantages:**
- High server pressure
- Usually requires Node.js environment as runtime

### SSG (Static Site Generation)

All pages are pre-rendered as static HTML files during the build phase and can be directly returned by the server after deployment.

**Advantages:**
- Fast initial load, SEO friendly
- Low server load, stable performance
- High security

**Disadvantages:**
- Difficult to update dynamic content
- Build time increases with page count

## Key Points

- **Isomorphic Rendering**: Server-side rendering + client takeover, balancing SEO and user experience
- **Not Bound to Node.js**: Supports any backend language and template engine
- **scsr.mjs**: Isomorphic rendering runtime engine
- **Template Structure**: Universal template structure, applicable to SSR and SSG
- **Rendering Method Comparison**: CSR, SSR, SSG each have their pros and cons
