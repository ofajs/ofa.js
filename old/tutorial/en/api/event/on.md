# on

Using the `on` method, you can register event handlers for target elements. This allows you to easily capture and respond to user interactions.

Below is an example demonstrating how to use the `on` method to register a click event handler for a button element:

<o-playground name="on - click event" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In this example, we use the `on` method to add a click event handler to the button element. When the user clicks the button, the event handler is triggered, the counter increments, and the result is displayed on the page.

## Using Template Syntax

You can also use template syntax to bind methods to target elements.

<o-playground name="on - Template Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In this example, we use `on:click` on a button element to bind a method named `addCount`. When the user clicks the button, this method will be called, the counter value will increment and be displayed on the page. This approach allows you to associate event handlers with component methods, enabling more complex interactions.

## event

After registering an event, the triggered function will be passed an event parameter, consistent with the native behavior:

<o-playground name="on - event parameter" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

