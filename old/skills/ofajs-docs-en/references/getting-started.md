# Getting Started Guide

Welcome to ofa.js! This guide will help you quickly get started with ofa.js and start building web applications.

## Prerequisites

Before starting, make sure you have basic knowledge of:

- HTML
- CSS
- JavaScript

## Quick Start

### 1. Create HTML File

Create a new HTML file, for example `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First ofa.js App</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs" type="module"></script>
  <o-page src="./home.html"></o-page>
</body>
</html>
```

### 2. Create Page Module

Create a `home.html` file:

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
  
  <h1>Hello, ofa.js!</h1>
  <p>Count: {{count}}</p>
  <button on:click="count++">Click Me</button>
  
  <script>
    export default async () => {
      return {
        data: {
          count: 0
        }
      };
    };
  </script>
</template>
```

### 3. Run Application

Open the `index.html` file directly in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Core Concepts

### Page Module

Page modules are the basic building blocks of ofa.js applications. Each page is an independent module defined using the `<template page>` tag.

### Component Module

Component modules are reusable UI components defined using the `<template component>` tag.

### Data Binding

ofa.js provides powerful data binding functionality:

- **Text Interpolation**: `{{variable}}`
- **Property Binding**: `:property="expression"`
- **Two-Way Binding**: `sync:property="expression"`
- **Event Binding**: `on:event="handler"`

### Lifecycle Hooks

Each page and component has lifecycle hooks:

- `ready()`: Component ready
- `attached()`: Mounted to DOM
- `detached()`: Removed from DOM

## Next Steps

- Learn [Template Syntax](./template-syntax.md)
- Create [Components](./create-component.md)
- Understand [Lifecycle](./lifecycle.md)
- Explore [Micro Applications](./micro-app.md)

## Key Points

- **No Build Required**: ofa.js runs directly in the browser
- **Module-Based**: Pages and components are independent modules
- **Reactive Data**: Data changes automatically update the view
- **Web Components**: Built on native Web Components standards
