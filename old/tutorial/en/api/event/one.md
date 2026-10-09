# one

Using the `one` method, you can register a one-time event handler for the target element, which means the event handler will automatically unbind after the first trigger and will not be triggered again.

Below is an example showing how to use the `one` method to register a click event handler for a button element:

<o-playground name="one-click one-time event" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In this example, we use the `one` method to add a click event handler to the button element. When the user clicks the button, the event handler is triggered, but it will not be triggered again because it has been unbound.

## Using Template Syntax

You can also use template syntax to bind a one-time event handler to the target element.

<o-playground name="one - Template Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
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

In this example, we use `one:click` on a button element to bind a method named `addCount`. When the user clicks the button, this method will be called, but it will not be triggered again because it is a one-time event handler.