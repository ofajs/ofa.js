# Attribute Response

In the previous [attribute binding](./property-binding.md), we introduced a simple attribute response mechanism, that is, how to render the attribute values of a component into text display.

ofa.js not only supports reactivity for basic property values, but also supports reactive rendering of nested object internal property values.

<o-playground name="Non-reactive Data Example" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

All data bound to the ofa.js instance object will be automatically converted into reactive data. Reactive data only supports basic data types such as strings, numbers, booleans, arrays, and objects. For complex data types like functions and class instances, they need to be stored as **non-reactive properties**, and changes to these properties will not trigger component re-rendering.

## Non-reactive Data

Sometimes we need to store data that does not require reactive updates, such as Promise instances, regular expression objects, or other complex objects. In this case, we need to use non-reactive properties. Changes to these properties will not trigger component re-rendering and are suitable for storing data that does not need to be synchronized with the view.

Non-reactive properties are usually named with an underscore `_` as a prefix before the property name to distinguish them from reactive properties.

<o-playground name="Non-reactive data example" style="--editor-height: 500px">
  <code>
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
  </code>
</o-playground>

When the `Green increments` button is clicked, although the value of `_count2` has actually increased, because it is a non-reactive property, it will not trigger a view update, so the display on the interface remains unchanged. When the `Blue increases` button is clicked, since `count` is a reactive property, it triggers a full component re-render, at which point the Green display is synchronized and updated.

Non-reactive object data has better performance than reactive object data because non-reactive data does not trigger component re-rendering.


