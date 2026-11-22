# Lifecycle

ofa.js components have complete lifecycle hook functions, allowing you to execute specific logic at different stages of the component. These hook functions let you intervene and perform corresponding operations at critical moments like component creation, mounting, updating, and destruction.

## Lifecycle Hook Functions

ofa.js provides the following main lifecycle hook functions, arranged in commonly used order:

### attached

The `attached` hook is called when a component is inserted into the document, indicating the component has been mounted to the page. This is the most commonly used lifecycle hook, typically used to perform initialization operations that can only be done after the component is actually displayed on the page, avoiding unnecessary computations when the component is not visible. This hook is also very suitable for element size measurement, animation startup, and other operations that depend on the component being rendered to the page.

- **Timing**: Component is added to the DOM tree
- **Main Uses**: Start timers, add event listeners, perform operations that require visibility

### detached

The `detached` hook is called when a component is removed from the document, indicating the component is about to be unmounted. This hook is suitable for cleaning up resources, such as clearing timers, removing event listeners, etc.

- **Timing**: Component is removed from the DOM tree
- **Main Uses**: Clean up resources, cancel subscriptions, remove event listeners

### ready

The `ready` hook is called when the component is ready. At this point, the component's template has finished rendering, DOM elements have been created, but may not yet be inserted into the document. This hook is suitable for DOM operations or initializing third-party libraries.

- **Timing**: Component template rendering complete, DOM created
- **Main Uses**: Perform initialization operations that depend on DOM

### loaded

The `loaded` hook is triggered when the component and all its child components and asynchronous resources are fully loaded. At this point, it's safe to remove loading states or perform subsequent operations that depend on the complete component tree. If there are no dependencies, it will be called after the `ready` hook.

- **Timing**: Component and its child components are fully loaded
- **Main Uses**: Perform operations that depend on the complete component tree

## Lifecycle Execution Order

Component lifecycle hooks execute in the following order:

1. `ready` - Component is ready (DOM created)
2. `attached` - Component is mounted to DOM
3. `loaded` - Component is fully loaded

When a component is removed from the DOM, the `detached` hook is called.

## Usage Example

The following example shows how to use lifecycle hook functions in a component:

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    .counter {
      margin: 10px 0;
    }
    button {
      margin-right: 10px;
      padding: 5px 10px;
    }
  </style>
  <h3>Lifecycle Demo</h3>
  <div class="counter">Counter: {{count}}</div>
  <button on:click="count += 10">Add 10</button>
  <button on:click="removeSelf">Remove Component</button>
  <div class="log">
    <h4>Lifecycle Logs:</h4>
    <ul>
      <o-fill :value="logs">
        <li>{{$data}}</li>
      </o-fill>
    </ul>
  </div>
  <script>
    export default async () => {
      return {
        data: {
          count: 0,
          logs: [],
        },
        proto: {
          removeSelf() {
            this.remove(); // Remove self from DOM to trigger detached hook
          },
          addLog(message) {
            this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
          }
        },
        ready() {
          this.addLog("ready: Component ready, DOM created");
          console.log("Component ready");
        },
        attached() {
          this.addLog("attached: Component mounted to DOM");
          this._timer = setInterval(() => {
            this.count++;
          }, 1000);
          console.log("Component mounted");
        },
        detached() {
          this.addLog("detached: Component removed from DOM");
          // Clear timer to prevent memory leak
          clearInterval(this._timer); 
          console.log("Component unmounted");
        },
        loaded() {
          this.addLog("loaded: Component fully loaded");
          console.log("Component fully loaded");
        }
      };
    };
  </script>
</template>
```

In this example, you can observe the execution order and timing of different lifecycle hooks. When you click the "Remove Component" button, you can see the `detached` hook being triggered.

## Practical Application Scenarios

### Initialization Operations

Perform data initialization in the `ready` hook:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM operations
      this.initDomElements();
    }
  };
};
```

### Resource Management

Start timers in the `attached` hook and clean up resources in the `detached` hook:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Start timer
      this.timer = setInterval(() => {
        console.log('Timer task executing');
      }, 1000);
    },
    detached() {
      // Clean up timer
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

## Key Points

- **ready**: Component ready, DOM created, suitable for DOM operations
- **attached**: Component mounted to DOM, suitable for starting timers, adding event listeners
- **detached**: Component removed from DOM, suitable for cleaning up resources
- **loaded**: Component fully loaded, suitable for operations depending on complete component tree
- **Execution Order**: ready → attached → loaded (detached called on removal)
