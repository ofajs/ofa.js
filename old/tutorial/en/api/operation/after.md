# after

`after` method is used to add elements after the target element. Before executing the `after` operation, the initialization of the [$ method](../instance/dollar.md) is automatically performed, so you can directly fill in specific element strings or objects.

**Note: Do not operate within template components such as o-fill or o-if.**

<o-playground name="after - add after" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

