# before

The `before` method is used to add an element before the target element. Before executing the `before` operation, the initialization of the [$ method](../instance/dollar.md) is automatically performed, so you can directly fill in the specific element string or object.

**Note: Do not operate within template components such as o-fill or o-if.**

<o-playground name="before - prepend" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

