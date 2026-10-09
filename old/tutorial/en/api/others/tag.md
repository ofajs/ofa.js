# tag

The `tag` attribute is used to obtain the element's tag, returning a lowercase string.

In the following example, we demonstrate how to use the `tag` method to get the tag of an element:

<o-playground name="tag - get tag">
  <code path="demo.html">
    <template>
      <div id="logger">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#logger").tag;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

