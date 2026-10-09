# version

通过 `ofa.version` 属性，你可以获取当前引入的 ofa.js 的版本号。

> **要求 ofa.js 版本 ≥ 4.3.40**

<o-playground name="version - 获取版本">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

这样，你就可以在页面上显示当前使用的 ofa.js 版本。
