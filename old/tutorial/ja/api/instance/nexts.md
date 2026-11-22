# nexts



使用 `nexts` プロパティを使用すると、現在の要素の後ろにあるすべての隣接要素のインスタンスを簡単に取得でき、これらの要素は配列として返されます。

<o-playground name="nexts - 後置要素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

