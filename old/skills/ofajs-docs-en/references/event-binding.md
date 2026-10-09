# Event Binding

In ofa.js, event binding is an important mechanism for implementing user interaction. You can bind event handlers to elements in various ways to respond to user operations.

## Binding Events from proto

This is the recommended way to bind events, suitable for complex event handling logic. Defining event handler functions in the `proto` object allows for better code organization and easier maintenance and reuse.

```html
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
```

## Directly Running Functions

For simple operations (like counter increments, state toggles, etc.), you can write short expressions directly in the event attribute. This approach is concise and clear, suitable for handling simple logic.

```html
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
```

## Supported Event Types

ofa.js supports all standard DOM events, including but not limited to:

- Mouse events: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, etc.
- Keyboard events: `keydown`, `keyup`, `keypress`, etc.
- Form events: `submit`, `change`, `input`, `focus`, `blur`, etc.
- Touch events: `touchstart`, `touchmove`, `touchend`, etc.

Event types supported by ofa.js are completely consistent with native DOM events. For more details, refer to [MDN Event Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Event).

## Passing Parameters to Event Handlers

You can also pass parameters to event handlers:

```html
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
```

## Accessing Event Object

In event handlers, you can access the native event object through the `event` parameter:

```html
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
  <div class="container" on:click="handleClick">Click anywhere to see coordinates</div>
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
```

You can also use the `$event` parameter to access the native event object in expressions, for example to get mouse click coordinates:

```html
<div class="container" on:click="handleClick($event)">Click anywhere to see coordinates</div>
```

## Listening to Custom Events

Besides listening to native DOM events, you can also easily listen to custom events emitted by components:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

## Key Points

- **Event Binding Syntax**: Use `on:eventName="handler"` to bind events
- **proto Method**: Recommended to define event handler functions in the `proto` object
- **Direct Expression**: Simple operations can write expressions directly in event attributes
- **Parameter Passing**: Supports passing parameters to event handlers
- **Event Object**: Access native event object through `event` parameter or `$event` variable
- **Custom Events**: Supports listening to custom events emitted by components
