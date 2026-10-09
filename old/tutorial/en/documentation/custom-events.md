# Custom Events

In ofa.js, in addition to built-in DOM events, custom events can also be created and used to implement communication between components. Custom events are an important mechanism in component-based development, allowing components to broadcast messages or state changes upward.

## emit method - Trigger custom events

The `emit` method is used to trigger custom events, notifying external listeners of state changes or user operations inside the component.

### Basic Usage

```javascript
// Trigger a simple custom event
this.emit('custom-event');

// Trigger a custom event with data
this.emit('data-changed', {
  data: {
    // Custom data, any structure as needed
    newValue: 100,
    oldValue: 50
  }
});
```

### emit method parameters

The `emit` method accepts two parameters:

1. **Event Name**: String, representing the name of the event to be triggered
2. **Options Object** (optional): Contains event configuration options
   - `data`: Data to be passed
   - `bubbles`: Boolean, controls whether the event bubbles (default is true)
   - `composed`: Boolean, controls whether the event can cross the Shadow DOM boundary
   - `cancelable`: Boolean, controls whether the event can be canceled

Then the parent element can use the `on` method [ (Event Binding) ](./event-binding.md) to listen to this custom event.

### emit usage example

<o-playground name="emit Usage Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Click to trigger event</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'Button was clicked',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Event Bubbling Mechanism

`bubbles` property controls whether the event will bubble up to parent elements. When set to `true`, the event will propagate up the DOM tree. The default value is `true`. If set to `false`, the event will not bubble.

### Detailed Explanation of Bubbling Mechanism

- **Default behavior**: Events emitted with `emit` have bubbling enabled by default (`bubbles: true`)
- **Bubble path**: The event starts from the triggering element and propagates upward level by level
- **Stop propagation**: Calling `event.stopPropagation()` in the event handler prevents bubbling

### Bubble Example

<o-playground name="Custom Event Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Outer container (listening for bubbling events): {{bubbledEventCount}} times</p>
      <p>Inner component (listening for direct events): {{directEventCount}} times</p>
      <p>Received data: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Trigger non-bubbling event</button>
      <button on:click="triggerBubblingEvent">Trigger bubbling event</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Non-bubbling event, only captured by direct listener
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Non-bubbling event triggered', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Bubbling event, propagates up to parent elements
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Bubbling event triggered', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Penetrates Shadow DOM boundaries

The `composed` property controls whether events can cross Shadow DOM boundaries. This is particularly important for Web Components development, and the default value is `false`.

### Detailed Explanation of Penetration Mechanism

- **Shadow DOM Isolation**:By default, events cannot cross Shadow DOM boundaries
- **Enable Penetration**:Setting `composed: true` allows events to cross Shadow DOM boundaries
- **Use Case**:When a component needs to send events to the host environment, `composed: true` must be set

### Penetration Example

<o-playground name="Custom Event with Data Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Events listened: {{bubbledEventCount}} times</p>
      <p>Data received: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Events listened: {{bubbledEventCount}} times</p>
      <p>Data received: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Trigger Non-Composed Event</button>
      <button on:click="triggerComposedEvent">Trigger Composed Event</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Non-composed event, only captured by direct listeners
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Non-composed event triggered', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Composed event, crosses Shadow DOM boundary
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Composed event triggered', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

