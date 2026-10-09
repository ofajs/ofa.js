# siblings

Using the `siblings` property, you can easily obtain all sibling element instances of the current element, which will be returned as an array.

<o-playground name="siblings - adjacent elements" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

