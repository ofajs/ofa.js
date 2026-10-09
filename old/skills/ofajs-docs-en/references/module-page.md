# Page Module

Page modules are the basic unit for building applications in ofa.js. Each page is an independent module that can be loaded and rendered through the `<o-page>` tag.

## Basic Structure

Page modules use the `<template page>` tag to define pages. The following is the basic structure of a page module:

```html
<template page>
  <style>
    /* Page styles */
  </style>
  
  <!-- Page template content -->
  
  <script>
    export default async ({ query }) => {
      return {
        data: {},
        proto: {},
        // Other configuration options
      };
    };
  </script>
</template>
```

## Page Definition Options

### data

Defines the page's reactive data.

```javascript
{
  data: {
    message: "Hello World",
    items: []
  }
}
```

### proto

Defines the page's methods and computed properties.

```javascript
{
  proto: {
    handleClick() {
      this.message = "Clicked!";
    },
    get upperMessage() {
      return this.message.toUpperCase();
    }
  }
}
```

### watch

Defines data watchers.

```javascript
{
  watch: {
    message(newValue) {
      console.log(`Message changed to: ${newValue}`);
    }
  }
}
```

### Lifecycle Hooks

Define lifecycle hook functions.

```javascript
{
  ready() {
    // Page ready
  },
  attached() {
    // Page mounted to DOM
  },
  detached() {
    // Page removed from DOM
  }
}
```

## Query Parameters

Page modules can receive URL query parameters through the `query` parameter:

```html
<template page>
  <h1>Welcome, {{query.name}}</h1>
  <p>Page: {{query.page}}</p>
  
  <script>
    export default async ({ query }) => {
      console.log("Query parameters:", query);
      return {
        data: {}
      };
    };
  </script>
</template>
```

Usage example:

```html
<!-- Pass query parameters -->
<o-page src="./user.html?name=John&page=1"></o-page>
```

## Loading Page Modules

### Using o-page Tag

```html
<o-page src="./home.html"></o-page>
```

### Using o-app Application

In an `o-app` application, you can use the `<a olink>` tag for page navigation:

```html
<o-app src="./app-config.js">
  <!-- Page content -->
</o-app>

<!-- Inside page -->
<a href="./about.html" olink>Go to About Page</a>
```

## Complete Example

```html
<template page>
  <style>
    :host {
      display: block;
      padding: 20px;
    }
    .header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .content {
      color: #666;
    }
    button {
      margin-top: 16px;
      padding: 8px 16px;
    }
  </style>
  
  <div class="header">{{title}}</div>
  <div class="content">
    <p>Count: {{count}}</p>
    <p>Double: {{doubleCount}}</p>
  </div>
  <button on:click="increment">Increment</button>
  
  <script>
    export default async ({ query }) => {
      return {
        data: {
          title: query.title || "My Page",
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newValue) {
            console.log(`Count changed to ${newValue}`);
          }
        },
        ready() {
          console.log("Page ready");
        }
      };
    };
  </script>
</template>
```

## Key Points

- **template page**: Page module definition tag
- **Export Function**: Must be async function, receives `query` parameter
- **data**: Page reactive data
- **proto**: Methods and computed properties
- **watch**: Data watchers
- **Lifecycle Hooks**: ready, attached, detached
- **o-page Tag**: Load page module
- **olink Attribute**: Page navigation in application
