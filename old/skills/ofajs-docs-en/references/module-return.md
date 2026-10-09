# Module Return Object Properties

> This document is linked from: [Module Return Object Properties](../../../tutorial/en/api/others/module-return.md)

In ofa.js, whether it's a page module or a component module, you need to return an object via `export default async () => {}` to define the module's configuration and behavior.

## async Function Parameters

The async function in `export default async () => {}` receives a parameter object with the following properties:

### Parameter List

| Parameter | Type | Page Module | Component Module | Description |
|------|------|:-------:|:-------:|------|
| `load` | `function` | ✅ | ✅ | Function to load other modules or resources |
| `url` | `string` | ✅ | ✅ | File address of the current page or component module |
| `query` | `object` | ✅ | ❌ | URL query parameter object |

### load Parameter

`load` is a function used to load other modules, components, or resources. It can be used in both component modules and page modules. The loading effect of the `load` function is consistent with the `<l-m>` component, mainly used to load ofa.js page or component HTML files.

**Synchronous Loading**: Use the `await` keyword, which blocks execution until the module is loaded.

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

**Asynchronous Loading**: Without using the `await` keyword, returns a Promise object and does not block execution. Suitable for on-demand loading scenarios.

```javascript
export default async ({ load }) => {
  const modulePromise = load("./some-module.js");
  
  modulePromise.then(({ someModule }) => {
    console.log('Module loaded:', someModule);
  });
  
  return {
    data: {}
  };
};
```

### url Parameter

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

### query Parameter

The `query` parameter is only available in page modules and contains URL query parameters.

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

## Return Properties Overview

| Property | Type | Page Module | Component Module | Description |
|------|------|:-------:|:-------:|------|
| `tag` | `string` | ❌ | ✅ Required | Component tag name |
| `data` | `object` | ✅ | ✅ | Reactive data object |
| `attrs` | `object` | ❌ | ✅ | Component attribute definitions |
| `proto` | `object` | ✅ | ✅ | Methods and computed properties |
| `watch` | `object` | ✅ | ✅ | Watchers |
| `ready` | `function` | ✅ | ✅ | Called when DOM is created |
| `attached` | `function` | ✅ | ✅ | Called when attached to DOM |
| `detached` | `function` | ✅ | ✅ | Called when removed from DOM |
| `loaded` | `function` | ✅ | ✅ | Called when fully loaded |
| `routerChange` | `function` | ✅ Parent page | ❌ | Called when route changes |

> **For complete documentation, please see**: [Module Return Object Properties](../../../tutorial/en/api/others/module-return.md)
