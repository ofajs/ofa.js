# Event Binding

In ofa.js, event binding is an important mechanism for implementing user interaction. You can bind event handlers to elements in multiple ways to respond to user actions.

## Binding Events from proto

This is the recommended way to bind events, suitable for complex event-handling logic. Defining the event handler function in the `proto` object allows for better organization of code logic and makes maintenance and reuse easier.

<o-playground name="Bind events from proto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Run the function directly

For simple operations (such as counter increment, state toggle, etc.), you can write short expressions directly in event properties. This approach is concise and clear, suitable for handling simple logic.

<o-playground name="Run Function Directly" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Supported Event Types

ofa.js supports all standard DOM events, including but not limited to:

- Mouse events: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout` etc.
- Keyboard events: `keydown`, `keyup`, `keypress` etc.
- Form events: `submit`, `change`, `input`, `focus`, `blur` etc.
- Touch events: `touchstart`, `touchmove`, `touchend` etc.

The event types supported by ofa.js are exactly the same as native DOM events,more details can be referred to [MDN event documentation](https://developer.mozilla.org/zh-CN/docs/Web/API/Event).

## Passing Parameters to Event Handlers

You can also pass arguments to event handlers:

<o-playground name="Pass Parameters to Event Handlers" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
      <button on:click="addNumber(10)">Add 10 - Current: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Access the Event Object

In the event handler, you can access the native event object through the `event` parameter:

<o-playground name="Accessing the Event Object" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Click anywhere to view coordinates</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

You can also use the `$event` parameter in expressions to access the native event object, for example, to get the mouse click coordinates:

```html
<div class="container" on:click="handleClick($event)">Click anywhere to view coordinates</div>
```

## Listening to Custom Events

In addition to listening to native DOM events, you can also easily listen to custom events emitted by components:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

For a deeper understanding of custom events, please refer to the [Custom Events](custom-events.md) chapter. It is recommended to follow the tutorial step by step; the subsequent content will unfold naturally. Of course, you are also welcome to consult it at any time to grasp it in advance.