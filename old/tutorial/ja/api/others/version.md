# version



`ofa.version` プロパティを使用すると、現在導入されている ofa.js のバージョン番号を取得できます。

> **必要条件 ofa.js バージョン ≥ 4.3.40**

<o-playground name="version - バージョンを取得">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

こうすることで、ページ上に現在使われているofa.jsのバージョンを表示できます。