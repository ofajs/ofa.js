# SSR and Isomorphic Rendering

> If you are not clear about what SSR is, it means you don't need it yet. You can skip this chapter and come back to learn when you need it in the future.

## Isomorphic Rendering

To simultaneously retain the smooth CSR experience, better machine crawler recognition (SEO), and greater freedom in backend language choice, ofa.js offers a unique isomorphic rendering mode—Symphony Client-Server Rendering.

> To learn about the specific definitions and differences of CSR / SSR / SSG, please directly read the chapter at the end of this article.

The core concept of isomorphic rendering is:- Render initial page content on the server side to ensure SEO and fast first-screen loading
- Handle routing on the client side to maintain the smooth user experience of CSR
- Applicable to any server-side environment, enabling true isomorphic rendering

### Principles of Isomorphic Rendering Implementation

The isomorphic rendering mode of ofa.js is based on the following mechanism:

1. The server generates a complete HTML page with a universal runtime structure
2. The client loads the CSR runtime engine
3. Automatically identifies the current runtime environment and determines the rendering strategy

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

**Complete page after isomorphic rendering encapsulation:**

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
    html,
    body {
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
    <!-- Page module content insertion position ⬇️ -->
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

So, you can use any development language (Go, Java, PHP, Nodejs, Python, etc.), any backend template rendering engine (such as Go's `html/template`, PHP's Smarty/Twig/Blade, etc.), and embed the isomorphic rendering code structure of ofa.js into the template to achieve SSR.

* [Nodejs SSR Examples](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR Examples](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR Examples](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### Isomorphic Rendering Template Structure

To implement the isomorphic rendering mode, simply use the following universal template structure on the server side:

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
    html,
    body {
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
    <!-- Dynamically insert the corresponding page module content -->
  </o-app>
</body>

</html>
```

**Note:** The HTML returned by the server must have the correct HTTP header: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` is an isomorphic rendering engine provided by ofa.js. It automatically determines the rendering strategy based on the current page's running state, ensuring the best user experience in any environment.

Similarly, SSG can also apply this structure to implement static site generation.

## Differences between ofa.js and SSR and Other Frontend Frameworks

ofa.js's Symphony Client-Server Rendering (hereinafter referred to as SCSR) is essentially also an SSR mode.

Compared with SSR solutions of existing front-end frameworks such as Vue, React, and Angular, the biggest advantage of ofa.js is that it **does not require binding to Node.js**. This means that any backend template rendering engine (such as PHP's Smarty, Python's Jinja2, Java's Thymeleaf, etc.) can easily integrate ofa.js to implement SSR.

## Overview of Web Page Rendering Methods

Modern web applications mainly have four rendering methods: traditional server-side template engine rendering, CSR (Client Side Rendering), SSR (Server Side Rendering), and SSG (Static Site Generation). Each method has its own advantages and applicable scenarios.

### Traditional Server-Side Template Engine Rendering

In many web products, server-side template engines remain the most mainstream method for page rendering. Backend languages such as Go and PHP use built-in or third-party template engines (e.g., Go’s `html/template`, PHP’s Smarty/Twig/Blade, etc.) to inject dynamic data into HTML templates, generating a complete HTML page in one go and returning it to the client.

**Advantages：**- SEO-friendly, fast first-screen loading
- Server-side control, higher security
- Lower technical stack requirements for the team; backend developers can complete development independently

**Disadvantages:**- Poor user experience, each interaction requires a page refresh
- High server load
- High front-end and back-end coupling, which is not conducive to division of labor and collaboration

### CSR (Client-Side Rendering)

In CSR mode, page content is completely rendered by client-side JavaScript. ofa.js's [single-page application](./routes.md) is a typical CSR implementation. This approach provides a smooth user experience, allowing all interactions to be completed without page navigation. Single-page applications (SPA) developed using React or Vue with their corresponding routing libraries (such as React Router or Vue Router) are all typical CSR implementations.

**Advantages：**- Smooth user experience, page switching without refresh
- Strong client-side processing capability, fast response

**Disadvantages:**- detrimental to SEO, search engines have difficulty indexing the content

### SSR (Server-Side Rendering)

While preserving the fluid CSR experience, the page is instead rendered in real time by the server: when a user initiates a request, the server instantly generates the complete HTML and returns it, achieving true server-side rendering.

**Advantages：**- SEO-friendly, fast first-screen loading
- Supports dynamic content

**Disadvantages:**- Server pressure is high
- Typically requires Node.js environment as runtime, or at least a Node.js middleware layer
- Still requires subsequent client activation for full interaction

### SSG (Static Site Generation)

During the build phase, pre-render all pages into static HTML files, which can be directly served to users by the server after deployment.

**Advantages：**- Fast initial load speed, SEO-friendly
- Low server load, stable performance
- High security

**Disadvantages:**- Dynamic content updates are difficult
- Build time increases with the number of pages