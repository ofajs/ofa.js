# version



通過 `ofa.version` 屬性，妳可以獲取當前引入的 ofa.js 的版本號。

> **要求 ofa.js 版本 ≥ 4.3.40**

<o-playground name="version - 獲取版本">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

這樣，妳就可以在頁面上顯示當前使用的 ofa.js 版本。
