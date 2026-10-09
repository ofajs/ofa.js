# Module returns object properties

In ofa.js, whether it's a page module or a component module, you need to return an object via `export default async () => {}` to define the module's configuration and behavior. This document summarizes all properties that can be included in the returned object.

## async function parameters

`export default async () => {}` The async function in `export default async () => {}` receives a parameter object with the following properties:

### Parameter List

| Parameter | Type | Page Module | Component Module | Description |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | Function to load other modules or resources |
| `url` | `string` | ✅ | ✅ | File address of the current page or component module |
| `query` | `object` | ✅ | ❌ | URL query parameter object |### load parameters

`load` is a function used to load other modules, components, or resources. It can be used in both component modules and page modules. The loading effect of the `load` function is consistent with the `<l-m>` component, and it is mainly used to load HTML files of ofa.js pages or components.

**Synchronous loading**：uses the `await` keyword，which blocks execution until the module has finished loading.

```javascript
export default async ({ load }) => {
  const { someModule } = await load("./some-module.js");
  const component = await load("./my-component.html");
  
  return {
    data: {
      moduleData: someModule
    }
  };
};
```

**Async Loading**: Does not use the `await` keyword, returns a Promise object, and does not block execution. Suitable for on-demand loading scenarios.

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('Module loading completed:', someModule);
  });
  
  return {
    data: {}
  };
};
```

Usage Scenarios:- Synchronously load components to ensure they are registered before use
- Load shared data modules
- Load configuration files
- Asynchronously load for on-demand scenarios

> Note:
> - Using `await` synchronous loading will block execution; it is recommended to choose synchronous or asynchronous methods based on actual needs
> - If there is no on-demand loading requirement, it is recommended to directly use the `<l-m>` tag to load components

### URL Parameters

The `url` parameter is available in both page modules and component modules, representing the file address of the current module.

```javascript
export default async ({ url }) => {
  console.log('Current module address:', url);
  
  return {
    data: {
      moduleUrl: url
    }
  };
};
```

### query parameters

The `query` parameter is only available in page modules and contains the query parameters from the URL. You can directly access the query string parameters in the URL through the `query` object.

```javascript
export default async ({ query }) => {
  console.log('Query parameters:', query);
  
  return {
    data: {
      userId: query.id,
      page: query.page || 1
    }
  };
};
```

Usage example:

```html
<template page>
  <style>
    :host { display: block; padding: 20px; }
  </style>
  <div>
    <h1>User Details</h1>
    <p>User ID: {{userId}}</p>
    <p>Page: {{page}}</p>
  </div>
  <script>
    export default async ({ query }) => {
      return {
        data: {
          userId: query.id || 'unknown',
          page: query.page || '1'
        }
      };
    };
  </script>
</template>
```

Access Method:```html
<o-page src="./user.html?id=123&page=2"></o-page>
```

> Important: Do not use the Vue-like `this.$route.query` method to obtain query parameters; ofa.js only supports obtaining them through function parameters.

### Complete Parameter Example

```javascript
export default async ({ load, url, query }) => {
  const { config } = await load("./config.js");
  
  return {
    data: {
      configData: config,
      moduleUrl: url,
      queryParams: query
    },
    ready() {
      console.log('Module URL:', url);
      console.log('Query Parameters:', query);
    }
  };
};
```

## Return Attribute Overview

| Property | Type | Page Module | Component Module | Description | Related Documentation |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ Required | Component tag name | [Create Component](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | Reactive data object | [Property Response](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | Component attribute definitions | [Inherit Attributes](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | Methods and computed properties | [Computed Properties](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | Watchers | [Watchers](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | Called when DOM is created | [Lifecycle](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | Called when attached to DOM | [Lifecycle](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | Called when removed from DOM | [Lifecycle](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | Called when fully loaded | [Lifecycle](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ Parent Page | ❌ | Called on route change | [Nested Pages/Routes](../../documentation/nested-routes.md) |> **Special Export**：`export const parent = "./layout.html"` - Used for nested routes, specifies the parent page path (not in the returned object). See [Nested Pages/Routing](../../documentation/nested-routes.md) for details.

## Core Attributes

### tag

`tag` is the tag name of the component, and **this attribute must be defined for component modules**. Page modules do not need to define `tag`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> Note: The value of `tag` must match the tag name used when using the component.

### data

`data` is a reactive data object used to store the state data of a component or page. The view automatically updates when the data changes.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "Zhang San",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> Note: `data` is an object, not a function, unlike in the Vue framework.

### attrs

`attrs` is used to define component properties and receive externally passed data. Only component modules need to define `attrs`.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // no default value
      disabled: "",     // has default value
      size: "medium"    // has default value
    }
  };
};
```

When using the component, pass properties:

```html
<my-component title="Title" disabled size="large"></my-component>
```

> Important Rules:
> - The passed attribute value must be a string; if it is not a string, it will be automatically converted to a string
> - Name conversion: `fullName` → `full-name` (kebab-case format)
> - The keys in `attrs` and `data` must not be duplicated

### proto

`proto` is used to define methods and computed properties. Computed properties are defined using JavaScript's `get` and `set` keywords.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // Method definition
      increment() {
        this.count++;
      },
      
      // Computed property (getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // Computed property
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> Note: ofa.js uses the `get`/`set` keywords to define computed properties, not Vue's `computed` option.

### watch

`watch` is used to define watchers, monitor data changes, and execute corresponding logic.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // Listen to a single property
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // Listen to multiple properties
      "count,name"() {
        console.log('count or name changed');
      }
    }
  };
};
```

The listener callback function receives two parameters:- `newValue`: The new value after the change
- `{ watchers }`: All watcher objects of the current component

## Lifecycle Hooks

Lifecycle hooks allow you to execute specific logic at different stages of a component.

### ready

The `ready` hook is called when the component is ready, at which point the component's template has been rendered, DOM elements have been created, but may not yet be inserted into the document.

```javascript
ready() {
  console.log('DOM created');
  this.initDomElements();
}
```

### attached

The `attached` hook is called when the component is inserted into the document, indicating that the component has been mounted to the page.

```javascript
attached() {
  console.log('Mounted to DOM');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached

`detached` hook is called when the component is removed from the document, indicating that the component is about to be unmounted.

```javascript
detached() {
  console.log('Removed from DOM');
  clearInterval(this._timer);
}
```

### loaded

The `loaded` hook is triggered after the component, all its child components, and all asynchronous resources have been fully loaded.

```javascript
loaded() {
  console.log('Fully loaded');
}
```

### routerChange

`routerChange` hook is called when the route changes, and is only used for parent pages to listen to child page switching.

```javascript
routerChange() {
  this.refreshActive();
}
```

## Lifecycle Execution Order

```
ready → attached → loaded
                 ↓
              detached（removed）
```

## Special Export：parent

`parent` is used for nested routes, specifying the parent page path of the current page. It's a standalone export, not part of the returned object.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>Subpage content</div>
  <script>
    // Specify parent page
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## Complete Example

### Component Module

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>Count: {{count}}</p>
    <p>Double: {{doubleCount}}</p>
    <button on:click="increment">Increase</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "Default Title"
        },
        data: {
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
          count(newVal) {
            console.log('count changed to:', newVal);
          }
        },
        ready() {
          console.log('Component is ready');
        },
        attached() {
          console.log('Component attached');
        },
        detached() {
          console.log('Component detached');
        }
      };
    };
  </script>
</template>
```

### Page Module

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('Page is ready');
        },
        
        attached() {
          console.log('Page is attached');
          console.log('Query params:', query);
        },
        
        detached() {
          console.log('Page is detached');
        }
      };
    };
  </script>
</template>
```

## Common Errors

### 1. Duplicate keys in attrs and data

```javascript
// ❌ Incorrect
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // Duplicate with attrs
};

// ✅ Correct
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // Use a different key
};
```

### 2. Defining Computed Properties in Vue Style

```javascript
// ❌ Incorrect
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ Correct
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data defined as a function

```javascript
// ❌ Wrong
return {
  data() {
    return { count: 0 };
  }
};

// ✅ Correct
return {
  data: {
    count: 0
  }
};
```

### 4. Method Defined in Wrong Location

```javascript
// ❌ Wrong
return {
  methods: {
    handleClick() {}
  }
};

// ✅ Correct
return {
  proto: {
    handleClick() {}
  }
};
```