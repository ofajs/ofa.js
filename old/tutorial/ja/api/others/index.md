# index



`index` 属性は、要素がその親要素内で何番目にあるかを取得するために使用します。この位置は0から数えられます。つまり、最初の要素の位置は0、2番目は1、といった具合です。

以下の例では、`index` プロパティを使用して要素が親要素の中で何番目に位置するかを取得する方法を示します：

<o-playground name="index - 位置を取得" style="--editor-height: 300px">
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

この例では、最初に `id` が "target" の `<li>` 要素を選択します。次に、`index` プロパティを使用して、その要素が親要素 `<ul>` の中で何番目の位置にあるかを取得します。つまり、2番目の要素なので `index` の値は 1 となります。そして、この値を `id` が "logger" の `<div>` 要素に表示します。