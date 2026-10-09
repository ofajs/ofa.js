# parents

Using the `parents` property, you can easily get all parent element instances of the current element, and these elements will be returned as an array.

<o-playground name="parents - parent elements" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>I am 1</li>
          <li id="target">I am target</li>
          <li>I am 3</li>
        </ul>
      </div>
      <div>
        logger: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>

