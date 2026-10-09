# prevs

Using the `prevs` property, you can easily obtain all preceding adjacent element instances of the current element, which will be returned as an array.

<o-playground name="prevs - previous elements" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

