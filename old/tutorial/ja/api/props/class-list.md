# classList



`classList` プロパティはネイティブと同じです。[classList](https://developer.mozilla.org/ja/docs/Web/API/Element/classList) を使ってクラス名の追加、削除、切り替えができます。

以下は、`classList`の使い方を示す例です：

<o-playground name="classList - 使用例" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">origin text</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

`classList` プロパティを使用すると、クラス名を簡単に追加、削除、切り替えて、要素のスタイルを動的に変更できます。