# Lifecycle

ofa.js components have complete lifecycle hook functions, allowing you to execute specific logic at different stages of the component. These hook functions enable you to intervene and perform corresponding operations at critical moments such as component creation, mounting, updating, and destruction.

## Lifecycle Hook Functions

ofa.js provides the following main lifecycle hook functions, listed in order of common usage:

### attached

`attached` hook is called when the component is inserted into the document, indicating that the component has been mounted to the page. This is the most commonly used lifecycle hook, typically used to perform initialization operations that need to happen after the component is actually displayed on the page, avoiding unnecessary computations when the component is invisible. This hook is also well-suited for operations that depend on the component being rendered to the page, such as element size measurement, animation startup, etc.

- **Timing**: When the component is added to the DOM tree
- **Primary Uses**: Start timers, add event listeners, perform operations that require visibility

### detached

`detached` hook is called when the component is removed from the document, indicating that the component is about to be unmounted. This hook is suitable for cleaning up resources, such as clearing timers, removing event listeners, etc.

- **Call Timing**: The component is removed from the DOM tree  
- **Main Purpose**: Clean up resources, cancel subscriptions, remove event listeners

### ready

The `ready` hook is called when the component is ready; at this point, the component’s template has been rendered and the DOM elements have been created, but they may not yet have been inserted into the document. This hook is suitable for DOM manipulation or initializing third-party libraries.

- **Timing**: Component template rendering is complete, DOM has been created
- **Main Purpose**: Execute initialization operations that depend on the DOM

### loaded

The `loaded` hook is triggered after the component and all its child components and asynchronous resources have finished loading. At this point, it’s safe to remove the loading state or perform subsequent operations that depend on the complete component tree. If there are no dependencies, it will be invoked after the `ready` hook.

- **Call timing**: After the component and its child components have fully loaded
- **Primary use**: Perform operations that depend on the complete component tree

## Lifecycle Execution Order

The component lifecycle hooks are executed in the following order:

2. `ready` - Component is ready (DOM created)
3. `attached` - Component attached to DOM
4. `loaded` - Component fully loaded

When the component is removed from the DOM, the `detached` hook is called.

## Usage Example

The following example shows how to use lifecycle hook functions in a component:

<o-playground name="Lifecycle Example" style="--editor-height: 700px">
  <code>
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
      <button on:click="count += 10">Increase 10</button>
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
                this.remove(); // Remove itself from DOM to trigger detached hook
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Component is ready, DOM created");
              console.log("Component is ready");
            },
            attached() {
              this.addLog("attached: Component attached to DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Component attached");
            },
            detached() {
              this.addLog("detached: Component removed from DOM");
              // Clear timer to prevent memory leak
              clearInterval(this._timer); 
              console.log("Component detached");
            },
            loaded() {
              this.addLog("loaded: Component fully loaded");
              console.log("Component fully loaded");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In this example, you can observe the execution order and timing of different lifecycle hooks. When you click the "Remove Component" button, you can see the `detached` hook being triggered.

## Actual Application Scenarios

### Initialization Operation

Perform data initialization in the `ready` hook:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM manipulation
      this.initDomElements();
    }
  };
};
```

### Resource Management

Start the timer in the `attached` hook and clean up resources in the `detached` hook:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Start the timer
      this.timer = setInterval(() => {
        console.log('Timer task executed');
      }, 1000);
    },
    detached() {
      // Clean up the timer
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Lifecycle hook functions are a key concept in ofa.js component development. Using them correctly helps you manage component state and resources more effectively, improving application performance.

