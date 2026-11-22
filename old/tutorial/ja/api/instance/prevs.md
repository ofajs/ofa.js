# prevs



`prevs` プロパティを使用すると、現在の要素の前に隣接するすべての要素のインスタンスを簡単に取得でき、それらの要素は配列として返されます。

<o-playground name="prevs - 前の要素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 0</li>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

