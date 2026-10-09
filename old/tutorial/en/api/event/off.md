# off

Using the `off` method can unregister an already-registered event handler to stop listening for the event.

Below is an example demonstrating how to use the `off` method to remove event listeners:

<o-playground name="off - remove event listener" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

In this example, we register a click event handler `f`. When the button is clicked, the event handler displays the click count in `#logger`. Using the `off` method, we cancel the event listener when the click count reaches 3.