# emit

Using the `emit` method, you can actively trigger events, and the triggered events have a bubbling mechanism. The bubbling mechanism means that the event bubbles from the inner element to the outer element, triggering events from the inside out.

Here is an example that demonstrates how to use the `emit` method to trigger a custom event and utilize the bubbling mechanism to pass the event to external elements：

<o-playground name="emit - Trigger Event" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we register the same custom event `custom-event` handler for the `<ul>` element and the `<li>` element respectively. When we use the `emit` method to trigger the event, the event bubbles from the `<li>` element to the `<ul>` element, triggering two event handlers.

## Custom Data

By passing the `data` parameter, you can pass custom data to the event handler.

<o-playground name="emit - custom data" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we pass custom data to the event handler through the `data` parameter. The event handler can access the passed data via `event.data`.

## Non-Bubbling Event Triggering

If you do not want the event to bubble, you can pass the `bubbles: false` parameter when triggering the event:

<o-playground name="emit - no bubbling" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we triggered a custom event using the `bubbles: false` parameter. This event does not bubble up to parent elements, so only the event handler of the `<li>` element is triggered.

## Penetrating the Root Node

By default, events do not pierce the shadow DOM of a custom component. However, you can allow custom events to pierce the root node and trigger elements outside the root node by setting `composed: true`.

<o-playground name="emit - penetrate root node" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In this example, we create a custom component `composed-test`, which contains an element inside the Shadow DOM and a button that triggers an event. By default, the event does not penetrate the Shadow DOM to the root node. However, by using the `composed: true` parameter when the event is fired, we make the event penetrate to the root node, triggering an element outside the root node.