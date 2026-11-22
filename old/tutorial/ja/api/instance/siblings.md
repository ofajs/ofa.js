# siblings



`siblings` プロパティを使用すると、現在の要素のすべての隣接要素インスタンスを簡単に取得でき、これらの要素は配列として返されます。

<o-playground name="siblings - 隣接要素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').siblings.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

