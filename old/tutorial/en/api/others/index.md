# index

`index` attribute is used to get the position of an element within its parent element. This position is counted from 0, meaning the first element's position is 0, the second is 1, and so on.

In the example below, we demonstrate how to use the `index` property to obtain an element's position within its parent:

<o-playground name="index - Get Position" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first select an `<li>` element with the `id` of "target". Then, we use the `index` attribute to get the position of this element under its parent `<ul>`, which is the second element, so the value of `index` is 1. This value is then displayed in the `<div>` element with the `id` of "logger".