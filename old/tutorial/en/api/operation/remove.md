# remove

The `remove` method is used to delete the target node.

**Note: Do not operate within template components such as o-fill or o-if.**

<o-playground name="remove - delete node" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

