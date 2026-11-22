# tag



`tag`属性は要素のタグを取得するために使用され、小文字の文字列を返します。

以下の例では、要素のタグを取得するために `tag` メソッドをどのように使用するかを示します：

<o-playground name="tag - タグを取得">
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

