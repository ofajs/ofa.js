# Property Reactivity

In the previous property binding section, we introduced simple property response mechanisms, i.e., how to render component property values to text display.

ofa.js not only supports reactivity for basic property values, but also supports reactive rendering for nested object internal property values.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p style="color: blue;">count: {{count}}</p>
  <p style="color: green;">count2: {{obj.count2}}</p>
  <button on:click="handleAddCount">Increase</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 20,
          obj: {
            count2: 100,
          },
        },
        proto:{
          handleAddCount(){
            this.count++;
            this.obj.count2++;
          }
        },
      };
    };
  </script>
</template>
```

## Reactive Data

All data bound to ofa.js instance objects will be automatically converted to reactive data. Reactive data only supports basic data types like strings, numbers, booleans, arrays, objects, etc. For complex data types like functions, class instances, etc., they need to be stored as **non-reactive properties**, and changes to these properties won't trigger component re-rendering.

## Non-Reactive Data

Sometimes we need to store data that doesn't need reactive updates, such as Promise instances, RegExp objects, or other complex objects, and this is when we need to use non-reactive properties. Changes to these properties won't trigger component re-rendering, suitable for storing data that doesn't need view linkage.

Non-reactive properties are typically named with an underscore `_` prefix added to the property name to distinguish them from reactive properties.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p style="color: blue;">count: {{count}}</p>
  <p style="color: green;">count2: {{_count2}}</p>
  <button on:click="count++">Blue increases</button>
  <button on:click="_count2++">Green increments</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 20,
          _count2: 100,
        },
      };
    };
  </script>
</template>
```

When clicking the `Green increments` button, although the `_count2` value has actually increased, since it's a non-reactive property, it won't trigger view updates, so the display on the interface hasn't changed. When clicking the `Blue increases` button, since `count` is a reactive property, it will trigger the entire component to re-render, and only then will the Green display content be synchronously updated.

Non-reactive object data performs better than reactive object data because non-reactive data doesn't trigger component re-rendering.

## Key Points

- **Reactive Data**: Automatically converted, supports basic data types (strings, numbers, booleans, arrays, objects)
- **Nested Objects**: Supports reactive rendering for multi-level nested objects
- **Non-Reactive Properties**: Use `_` prefix naming, suitable for complex data types
- **Performance Optimization**: Non-reactive data performs better, won't trigger re-rendering
- **View Linkage**: Only reactive property changes trigger view updates
