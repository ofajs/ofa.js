# version

Through the `ofa.version` property, you can get the version number of the currently introduced ofa.js.

> **ofa.js version requirement ≥ 4.3.40**

<o-playground name="version - Get Version">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

In this way, you can display the currently used ofa.js version on the page。